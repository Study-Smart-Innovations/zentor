"use server"

import { supabaseAdmin, getSupabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function updateStudentProfile(userId: string, formData: FormData) {
  const admin = getSupabaseAdmin();

  const profileUpdates = {
    full_name: formData.get("full_name") as string,
    phone_number: formData.get("phone_number") as string,
    age: parseInt(formData.get("age") as string, 10) || null,
    school_or_college: formData.get("school_or_college") as string,
    standard_or_degree: formData.get("standard_or_degree") as string,
    interested_subjects: formData.get("interested_subjects") as string,
    hobbies: formData.get("hobbies") as string,
    ambition: formData.get("ambition") as string,
    instagram_url: formData.get("instagram_url") as string,
    facebook_url: formData.get("facebook_url") as string,
    linkedin_url: formData.get("linkedin_url") as string,
  };

  const bio = formData.get("bio") as string;
  const profileImageFile = formData.get("profile_image") as File;

  try {
    // 1. Update student_profiles
    const { error: profileError } = await admin
      .from("student_profiles")
      .update(profileUpdates)
      .eq("user_id", userId);

    if (profileError) throw profileError;

    // 2. Prepare users table updates (bio, name, image)
    const userTableUpdates: any = {};
    if (profileUpdates.full_name) userTableUpdates.name = profileUpdates.full_name;
    if (bio !== null) userTableUpdates.bio = bio;

    // 3. Handle profile image upload
    if (profileImageFile && profileImageFile.size > 0) {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await admin.storage
        .from('profiles')
        .upload(fileName, profileImageFile, { upsert: true, contentType: profileImageFile.type });

      if (!uploadError) {
        const { data: { publicUrl } } = admin.storage.from('profiles').getPublicUrl(fileName);
        userTableUpdates.profile_image = publicUrl;
      } else {
        console.error("Image Upload Error:", uploadError);
      }
    }

    // 4. Update users table
    if (Object.keys(userTableUpdates).length > 0) {
      const { error: userError } = await admin
        .from("users")
        .update(userTableUpdates)
        .eq("id", userId);
      if (userError) throw userError;
    }

    return { success: true };
  } catch (err: any) {
    console.error("Student Profile Update Error:", err);
    return { success: false, error: err.message };
  }
}


export async function getStudentDashboard() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const now = new Date().toISOString();

  try {
    const { data: accessList, error: accessError } = await supabaseAdmin
      .from("course_access")
      .select(`
        *,
        courses (
          *,
          teacher_profiles (
            full_name
          )
        )
      `)
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .gt("access_end", now);

    if (accessError) {
      if (accessError.code === 'PGRST205') return { enrolledCourses: [], suggestions: [], user: session.user };
      throw accessError;
    }

    const enrolledCourses = accessList?.map(a => ({
      ...a.courses,
      teacher: a.courses?.teacher_profiles,
      access_start: a.access_start,
      access_end: a.access_end
    })) || [];

    return {
      enrolledCourses,
      suggestions: [],
      user: session.user
    };
  } catch (err) {
    console.error("Dashboard Error:", err);
    return { enrolledCourses: [], suggestions: [], user: session.user };
  }
}

export async function searchSmart(query: string) {
  if (!query) return { teachers: [], courses: [] };

  try {
    // Search teachers by name — schema-correct columns only
    const { data: teachers } = await supabaseAdmin
      .from("teacher_profiles")
      .select("user_id, full_name, location_city, experience_years, highest_qualification")
      .ilike("full_name", `%${query}%`)
      .limit(5);

    return {
      teachers: teachers || [],
      courses: [],
    };
  } catch (err) {
    console.error("Search Error:", err);
    return { teachers: [], courses: [] };
  }
}
