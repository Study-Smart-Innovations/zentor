"use server"

import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { uploadOptimizedImage, deleteCloudinaryImage, extractPublicId } from "@/lib/cloudinary";

export async function createCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "teacher") {
    return { error: "Only teachers can create courses." };
  }

  const title = formData.get("title") as string;
  const headline = formData.get("headline") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string || "0");
  const offeredPrice = formData.get("offeredPrice") ? parseFloat(formData.get("offeredPrice") as string) : null;
  const discountPercentage = formData.get("discountPercentage") ? parseFloat(formData.get("discountPercentage") as string) : 0;
  const isFree = formData.get("isFree") === "true";
  const durationMonths = parseInt(formData.get("durationMonths") as string || "1");
  const bannerFile = formData.get("banner") as File;
  let bannerUrl = null;

  if (!title) return { error: "Course title is required." };

  try {
    // 1. Handle Banner Upload to Cloudinary if provided
    if (bannerFile && bannerFile.size > 0) {
      const arrayBuffer = await bannerFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadOptimizedImage(buffer, 'course-banners') as any;
      bannerUrl = uploadResult.secure_url;
    }
    const { data, error } = await supabaseAdmin
      .from("courses")
      .insert({
        teacher_id: session.user.id,
        title,
        headline,
        description,
        price: isFree ? 0 : price,
        offered_price: isFree ? 0 : (offeredPrice || price),
        discount_percentage: isFree ? 0 : discountPercentage,
        is_free: isFree,
        duration_months: durationMonths,
        banner_url: bannerUrl
      })
      .select()
      .single();

    if (error) {
       console.error("[createCourse] Insert Error:", error);
       throw error;
    }

    // --- Save Payment Plans ---
    const plansJson = formData.get("plans") as string;
    let plans = [];
    try {
       plans = plansJson ? JSON.parse(plansJson) : [];
    } catch (e) {
       console.error("[createCourse] Plan JSON parse error:", e);
    }
    
    // Always ensure at least a 3-month default if no plans exist
    if (plans.length === 0) {
       plans = [{ name: "Standard 3-Month Access", durationDays: 90, price: isFree ? 0 : (offeredPrice || price) }];
    }

    const { error: planError } = await supabaseAdmin.from("course_plans").insert(
       plans.map((p: any) => ({
          course_id: data.id,
          name: p.name,
          duration_days: p.durationDays || p.duration_days,
          price: p.price
       }))
    );
    if (planError) console.error("[createCourse] Plan Error:", planError);

    console.log("[createCourse] Created successfully with ID:", data.id);

    revalidatePath("/teacher/dashboard");
    return { success: true, courseId: data.id };
  } catch (err: any) {
    console.error("Create Course Error:", err);
    return { error: err.message || "Failed to create course." };
  }
}

export async function addCourseContent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "teacher") {
    return { error: "Unauthorized" };
  }

  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const duration = formData.get("duration") as string;
  const contentType = formData.get("contentType") as string;
  const driveFileId = formData.get("driveFileId") as string;
  const meetingUrl = formData.get("meetingUrl") as string;
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0");

  if (!courseId || !title) return { error: "Missing required fields." };

  try {
    const { data, error } = await supabaseAdmin
      .from("lessons")
      .insert({
        course_id: courseId,
        title,
        description,
        content,
        duration,
        content_type: contentType,
        drive_file_id: driveFileId,
        meeting_url: meetingUrl,
        order_index: orderIndex,
        platform: 'gdrive'
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/teacher/courses/${courseId}/manage`);
    return { success: true, lessonId: data.id };
  } catch (err: any) {
    console.error("Add Lesson Error:", err);
    return { error: err.message || "Failed to add lesson." };
  }
}

export async function updateCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "teacher") {
    return { error: "Unauthorized" };
  }

  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const headline = formData.get("headline") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string || "0");
  const offeredPrice = formData.get("offeredPrice") ? parseFloat(formData.get("offeredPrice") as string) : null;
  const discountPercentage = formData.get("discountPercentage") ? parseFloat(formData.get("discountPercentage") as string) : 0;
  const isFree = formData.get("isFree") === "true";
  const durationMonths = parseInt(formData.get("durationMonths") as string || "1");
  const bannerFile = formData.get("banner") as File;
  let bannerUrl = formData.get("existingBannerUrl") as string || null;

  if (!courseId || !title) return { error: "Missing required fields." };

  try {
    // Handle Banner Update to Cloudinary if provided
    if (bannerFile && bannerFile.size > 0) {
      const arrayBuffer = await bannerFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadOptimizedImage(buffer, 'course-banners') as any;
      bannerUrl = uploadResult.secure_url;
    }
    const { error } = await supabaseAdmin
      .from("courses")
      .update({
        title,
        headline,
        description,
        price: isFree ? 0 : price,
        offered_price: isFree ? 0 : (offeredPrice || price),
        discount_percentage: isFree ? 0 : discountPercentage,
        is_free: isFree,
        duration_months: durationMonths,
        banner_url: bannerUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", courseId)
      .eq("teacher_id", session.user.id);

    if (error) throw error;

    // --- Save Payment Plans ---
    const plansJson = formData.get("plans") as string;
    if (plansJson) {
       let plans = [];
       try {
          plans = JSON.parse(plansJson);
       } catch (e) {
          console.error("[updateCourse] Plan JSON parse error:", e);
       }

       // Always ensure at least a 3-month default if no plans exist for premium
       if (!isFree && plans.length === 0) {
          plans = [{ name: "Standard 3-Month Access", duration_days: 90, price: offeredPrice || price }];
       }

       // Liquidate old plans first
       await supabaseAdmin.from("course_plans").delete().eq("course_id", courseId);
       
       // Re-anchor new plans
       if (plans.length > 0) {
          await supabaseAdmin.from("course_plans").insert(
             plans.map((p: any) => ({
                course_id: courseId,
                name: p.name,
                duration_days: p.durationDays || p.duration_days,
                price: p.price
             }))
          );
       }
    }

    revalidatePath(`/teacher/courses/${courseId}/manage`);
    revalidatePath("/teacher/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Update Course Error:", err);
    return { error: err.message || "Failed to update course." };
  }
}

export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "teacher") {
    return { error: "Unauthorized" };
  }

  try {
    console.log(`[deleteCourse] Initiating liquidation for Course ID: ${courseId}`);

    // 1. Fetch course details to get media references
    const { data: course, error: fetchError } = await supabaseAdmin
      .from("courses")
      .select("banner_url")
      .eq("id", courseId)
      .eq("teacher_id", session.user.id)
      .single();

    if (fetchError || !course) {
      console.error("[deleteCourse] Fetch Error - asset may not exist or unauthorized:", fetchError);
      return { error: "Course not found or unauthorized." };
    }

    // 2. Purge Cloudinary Assets if they exist
    const publicId = extractPublicId(course.banner_url);
    if (publicId) {
      console.log(`[deleteCourse] Purging Cloudinary asset: ${publicId}`);
      await deleteCloudinaryImage(publicId);
    }

    // 3. Scrub Supabase record
    const { error: deleteError } = await supabaseAdmin
      .from("courses")
      .delete()
      .eq("id", courseId)
      .eq("teacher_id", session.user.id);

    if (deleteError) throw deleteError;

    console.log(`[deleteCourse] Liquidation complete for: ${courseId}`);

    revalidatePath("/teacher/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Delete Course Error:", err);
    return { error: err.message || "Failed to delete course." };
  }
}

export async function getTeacherCourses() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("teacher_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Courses Error:", error);
    return [];
  }

  // Return simplified course data without contents
  return data.map((course: any) => ({
    ...course,
    counts: { notes: 0, videos: 0, live: 0 }
  }));
}

export async function getCourseWithContent(courseId: string) {
  console.log(`[getCourseWithContent] Initiating fetch for ID: "${courseId}"`);
  
  if (!courseId || courseId === "undefined" || courseId.length < 10) {
    console.warn("[getCourseWithContent] Aborting: Invalid or malformed ID passed.");
    return null;
  }

  try {
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .maybeSingle();

    if (courseError) {
      console.error("[getCourseWithContent] Database Error:", courseError);
      return null;
    }

    if (!course) {
      console.warn(`[getCourseWithContent] No course found in DB for ID: ${courseId}`);
      return null;
    }

    console.log("[getCourseWithContent] Successfully retrieved course:", course.title);

    // Fetch lessons for this course
    const { data: lessons, error: lessonError } = await supabaseAdmin
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (lessonError) throw lessonError;

    // Fetch payment plans for this course
    const { data: plans, error: planError } = await supabaseAdmin
      .from("course_plans")
      .select("*")
      .eq("course_id", courseId)
      .order("duration_days", { ascending: true });

    if (planError) throw planError;

    return { ...course, lessons: lessons || [], course_plans: plans || [] };
  } catch (err) {
    console.error("[getCourseWithContent] Unexpected Exception:", err);
    return null;
  }
}

export async function getAuthorizedAsset(contentId: string) {
  return { error: "Content access is temporarily paused." };
}


export async function deleteCourseContent(contentId: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "teacher") {
    return { error: "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin
      .from("lessons")
      .delete()
      .eq("id", contentId);

    if (error) throw error;

    revalidatePath(`/teacher/courses/${courseId}/manage`);
    return { success: true };
  } catch (err: any) {
    console.error("Delete Lesson Error:", err);
    return { error: err.message || "Failed to delete lesson." };
  }
}

export async function getTeacherAnalytics() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Get all courses for this teacher
    const { data: courses } = await supabaseAdmin
      .from("courses")
      .select("id, price")
      .eq("teacher_id", session.user.id);

    if (!courses || courses.length === 0) return { totalStudents: 0, totalRevenue: 0, activeCourses: 0, averageRevenue: 0 };

    const courseIds = courses.map(c => c.id);

    // 2. Get enrollments for these courses
    const { data: enrollments } = await supabaseAdmin
      .from("enrollments")
      .select("student_id, course_id, price_paid")
      .in("course_id", courseIds);

    if (!enrollments || enrollments.length === 0) return { totalStudents: 0, totalRevenue: 0, activeCourses: courseIds.length, averageRevenue: 0 };

    // 3. Aggregate data
    const uniqueStudents = new Set(enrollments.map(e => e.student_id));
    
    let totalRevenue = 0;
    enrollments.forEach(e => {
        totalRevenue += parseFloat(e.price_paid?.toString() || "0");
    });

    return {
      totalStudents: uniqueStudents.size,
      totalRevenue,
      activeCourses: courseIds.length,
      averageRevenue: uniqueStudents.size > 0 ? totalRevenue / uniqueStudents.size : 0
    };
  } catch (err) {
    console.error("Analytics Error:", err);
    return { error: "Failed to load analytics" };
  }
}

export async function getTeacherStudents(courseId?: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    // 1. Get courses for this teacher
    let courseQuery = supabaseAdmin.from("courses").select("id, title, price").eq("teacher_id", session.user.id);
    if (courseId) courseQuery = courseQuery.eq("id", courseId);
    
    const { data: courses } = await courseQuery;
    if (!courses || courses.length === 0) return [];
    const courseIds = courses.map(c => c.id);

    // 2. Get enrollments with student details
    let enrollmentQuery = supabaseAdmin
      .from("enrollments")
      .select("student_id, course_id, price_paid, purchased_at, students(id, name, email), courses(id, title, price)")
      .in("course_id", courseIds);

    const { data: enrollments } = await enrollmentQuery;
    if (!enrollments) return [];

    // 3. Group by student
    const studentMap = new Map();

    enrollments.forEach((e: any) => {
      const user = e.students;
      if (!user) return;
      if (!studentMap.has(user.id)) {
        studentMap.set(user.id, {
          id: user.id,
          name: user.name,
          email: user.email,
          joinedAt: e.purchased_at,
          totalSpent: 0,
          purchases: []
        });
      }

      const student = studentMap.get(user.id);
      
      // Update earliest join date
      if (new Date(e.purchased_at) < new Date(student.joinedAt)) {
        student.joinedAt = e.purchased_at;
      }

        const price = parseFloat(e.price_paid?.toString() || "0");
        student.totalSpent += price;
        student.purchases.push({
          title: e.courses?.title || "Unknown Course",
          date: e.purchased_at,
          price: price,
          type: "Full Course"
        });
    });

    return Array.from(studentMap.values()).sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
  } catch (err) {
    console.error("Get Students Error:", err);
    return [];
  }
}

export async function getFinancialOverview() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Get courses
    const { data: courses } = await supabaseAdmin
      .from("courses")
      .select("id, title, price")
      .eq("teacher_id", session.user.id);
    
    if (!courses || courses.length === 0) return { 
      history: Array.from({ length: 60 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (59 - i));
        return {
          name: d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
          revenue: 0,
          enrollments: 0
        };
      }), 
      stats: { lifetimeRevenue: 0, mrr: 0, averageTransaction: 0 } 
    };
    
    const courseIds = courses.map(c => c.id);

    // 2. Get enrollments with pricing info
    const { data: enrollments } = await supabaseAdmin
      .from("enrollments")
      .select("price_paid, purchased_at")
      .in("course_id", courseIds)
      .order("purchased_at", { ascending: true });

    if (!enrollments || enrollments.length === 0) return { 
      history: Array.from({ length: 60 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (59 - i));
        return {
          name: d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
          revenue: 0,
          enrollments: 0
        };
      }), 
      stats: { lifetimeRevenue: 0, mrr: 0, averageTransaction: 0 } 
    };

    // 3. Prepare Time Series (Last 5 Years)
    const history: any[] = [];
    const now = new Date();
    
    // Generate empty buckets for last 60 months
    for (let i = 59; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const name = d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      history.push({ name, key, revenue: 0, enrollments: 0 });
    }

    let lifetimeRevenue = 0;
    let mrrTotal = 0;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    enrollments.forEach(e => {
      const price = parseFloat(e.price_paid?.toString() || "0");

      lifetimeRevenue += price;
      
      const pDate = new Date(e.purchased_at);
      if (pDate > thirtyDaysAgo) {
        mrrTotal += price;
      }

      const key = `${pDate.getFullYear()}-${pDate.getMonth() + 1}`;
      
      const bucket = history.find(b => b.key === key);
      if (bucket) {
        bucket.revenue += price;
        bucket.enrollments += 1;
      }
    });

    return {
      history: history.slice(-60), // Ensure exactly 60 months
      stats: {
        lifetimeRevenue,
        mrr: mrrTotal,
        averageTransaction: enrollments.length > 0 ? lifetimeRevenue / enrollments.length : 0,
        growth: 0 // Will be calculated on frontend or AI
      }
    };
  } catch (err) {
    console.error("Financial Overview Error:", err);
    return { error: "Failed to load financial data" };
  }
}
