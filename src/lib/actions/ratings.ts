"use server"

import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitRating(courseId: string, courseRating: number, teacherRating: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Verify User has Paid for this course
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from("enrollments")
      .select("price_paid, course_id, courses(teacher_id)")
      .eq("student_id", session.user.id)
      .eq("course_id", courseId)
      .single();

    if (enrollmentError || !enrollment) {
      return { error: "You must be enrolled to rate this course." };
    }

    if (parseFloat(enrollment.price_paid || "0") <= 0) {
      return { error: "Only paid students can rate courses and teachers." };
    }

    const teacherId = (enrollment.courses as any)?.teacher_id;
    if (!teacherId) return { error: "Course has no assigned teacher." };

    // 2. Upsert the Rating
    const { error: upsertError } = await supabaseAdmin
      .from("ratings")
      .upsert({
        student_id: session.user.id,
        course_id: courseId,
        teacher_id: teacherId,
        course_rating: courseRating,
        teacher_rating: teacherRating,
        created_at: new Date().toISOString()
      }, { onConflict: "student_id, course_id" });

    if (upsertError) throw upsertError;

    // 3. Recalculate Course Averages
    const { data: courseRatings } = await supabaseAdmin
      .from("ratings")
      .select("course_rating")
      .eq("course_id", courseId);

    if (courseRatings && courseRatings.length > 0) {
      const avgCourse = courseRatings.reduce((acc, curr) => acc + Number(curr.course_rating), 0) / courseRatings.length;
      
      await supabaseAdmin
        .from("courses")
        .update({
          rating: avgCourse.toFixed(1),
          rating_count: courseRatings.length
        })
        .eq("id", courseId);
    }

    // 4. Recalculate Teacher Averages
    const { data: teacherRatings } = await supabaseAdmin
      .from("ratings")
      .select("teacher_rating")
      .eq("teacher_id", teacherId);

    if (teacherRatings && teacherRatings.length > 0) {
      const avgTeacher = teacherRatings.reduce((acc, curr) => acc + Number(curr.teacher_rating), 0) / teacherRatings.length;

      await supabaseAdmin
        .from("teachers")
        .update({
          rating: avgTeacher.toFixed(1),
          rating_count: teacherRatings.length
        })
        .eq("id", teacherId);
    }

    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Submit Rating Error:", err);
    return { error: "Failed to submit rating." };
  }
}

export async function getUserRating(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) return { rating: null };
  
  const { data } = await supabaseAdmin
    .from("ratings")
    .select("course_rating, teacher_rating")
    .eq("student_id", session.user.id)
    .eq("course_id", courseId)
    .single();

  return { rating: data || null };
}
