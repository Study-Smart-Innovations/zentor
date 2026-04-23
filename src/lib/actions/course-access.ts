"use server"

import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCourseWithAccess(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Fetch Course Metadata
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError) throw courseError;

    // 2. Fetch Teacher separately to avoid join issues in the schema cache
    const { data: teacher } = await supabaseAdmin
      .from("teacher_profiles")
      .select("name, rating, rating_count")
      .eq("id", course.teacher_id)
      .maybeSingle();

    // 3. Fetch Course Contents separately
    const { data: contents } = await supabaseAdmin
      .from("lessons")
      .select("id, title, description, content, duration, content_type, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    // 4. Check Durational Access Status
    const now = new Date().toISOString();
    const { data: access } = await supabaseAdmin
      .from("course_access")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("course_id", courseId)
      .eq("is_active", true)
      .gt("access_end", now)
      .maybeSingle();

    // 5. Check if the user PAID for the course (for rating permissions)
    const { data: enrollment } = await supabaseAdmin
      .from("enrollments")
      .select("price_paid")
      .eq("student_id", session.user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    const isEnrolled = !!access;
    const canAccess = course.is_free || isEnrolled;
    const hasPaid = enrollment ? parseFloat(enrollment.price_paid || "0") > 0 : false;

    return {
      course: {
        ...course,
        teacherName: teacher?.name || "Verified Mentor",
        teacherRating: teacher?.rating || 0,
        teacherRatingCount: teacher?.rating_count || 0,
        contents: contents || []
      },
      isEnrolled,
      canAccess,
      hasPaid,
      accessInfo: access || null,
      user: session.user
    };
  } catch (err) {
    console.error("Course Access Error:", err);
    return { error: "Failed to load course details." };
  }
}

export async function enrollInCourse(courseId: string, planId?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Fetch Plan Details (If planId provided, otherwise default to a trial or legacy)
    let durationDays = 90; // Authoritative 3-Month Default Fallback
    if (planId) {
       const { data: plan } = await supabaseAdmin
         .from("course_plans")
         .select("duration_days")
         .eq("id", planId)
         .single();
       if (plan) durationDays = plan.duration_days;
    }

    const accessEnd = new Date();
    accessEnd.setDate(accessEnd.getDate() + durationDays);

    // 2. Anchor Durational Access
    const { error } = await supabaseAdmin
      .from("course_access")
      .upsert({
        user_id: session.user.id,
        course_id: courseId,
        access_start: new Date().toISOString(),
        access_end: accessEnd.toISOString(),
        is_active: true
      }, { onConflict: 'user_id,course_id' });

    if (error) throw error;

    // 3. Log enrollment for teacher analytics (even for free courses)
    const { error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .insert({
        student_id: session.user.id,
        course_id: courseId,
        price_paid: 0,
        purchased_at: new Date().toISOString()
      });
    if (enrollError) console.error("[enrollInCourse] Enrollment log error:", enrollError);

    console.log(`[enrollInCourse] Student ${session.user.id} enrolled with ${durationDays} days of access.`);
    
    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Enrollment Error:", err);
    return { error: "Failed to complete enrollment." };
  }
}
