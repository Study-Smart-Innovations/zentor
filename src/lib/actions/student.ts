"use server"

import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function getStudentDashboard() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Get Course Access (joining courses and the mentor's teacher profile)
    // We fetch from course_access where access_end > now to only show active unexpired courses.
    const now = new Date().toISOString();
    const { data: accessList, error: accessError } = await supabaseAdmin
      .from("course_access")
      .select(`
        *,
        courses (
          *,
          teachers (
            name,
            email
          )
        )
      `)
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .gt("access_end", now);

    if (accessError) throw accessError;

    const enrolledCourses = accessList?.map(a => ({
      ...a.courses,
      teacher: a.courses.teachers,
      access_start: a.access_start,
      access_end: a.access_end
    })) || [];

    // 2. Suggestions Logic: courses from the same mentors
    const teacherIds = [...new Set(enrolledCourses.map(c => c.teacher_id))];
    const enrolledCourseIds = enrolledCourses.map(c => c.id);

    let suggestions: any[] = [];
    if (teacherIds.length > 0) {
      const { data: suggestedData } = await supabaseAdmin
        .from("courses")
        .select("*, teachers(name)")
        .in("teacher_id", teacherIds)
        .not("id", "in", `(${enrolledCourseIds.join(',')})`)
        .limit(6);
      
      suggestions = suggestedData?.map(s => ({
        ...s,
        teacher: s.teachers
      })) || [];
    } else {
        // Fallback: Show featured/recent courses if no enrollments
        const { data: featured } = await supabaseAdmin
          .from("courses")
          .select("*, teachers(name)")
          .limit(6);
        
        suggestions = featured?.map(s => ({
          ...s,
          teacher: s.teachers
        })) || [];
    }

    return { 
      enrolledCourses, 
      suggestions,
      user: session.user 
    };
  } catch (err) {
    console.error("Dashboard Error:", err);
    return { error: "Failed to load dashboard." };
  }
}

export async function searchSmart(query: string) {
  if (!query) return { teacher: null, courses: [] };

  const idMatch = query.match(/\d{6}/);
  const teacherCode = idMatch ? idMatch[0] : null;
  const remainingText = query.replace(teacherCode || "", "").trim();

  try {
    if (teacherCode) {
      // 1. Find the teacher by code with full profile info
      const { data: teacher } = await supabaseAdmin
        .from("teachers")
        .select("id, name, specialization, degree, experience, rating")
        .eq("teacher_code", teacherCode)
        .single();

      if (teacher) {
        // 2. Get courses for this mentor
        let dbQuery = supabaseAdmin
          .from("courses")
          .select("*, teachers(name)")
          .eq("teacher_id", teacher.id);

        if (remainingText) {
          dbQuery = dbQuery.ilike("title", `%${remainingText}%`);
        }

        const { data: courses } = await dbQuery;
        return {
          teacher,
          courses: courses?.map(c => ({ ...c, teacher: c.teachers })) || []
        };
      }
      return { teacher: null, courses: [] }; 
    }

    return { teacher: null, courses: [] };
  } catch (err) {
      console.error("Search Error:", err);
      return { teacher: null, courses: [] };
  }
}
