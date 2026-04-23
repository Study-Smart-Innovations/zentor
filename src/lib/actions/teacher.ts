"use server"

import { supabaseAdmin, getSupabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function signUpTeacher(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const dob = formData.get("dob") as string;
  const experience = parseInt(formData.get("experience") as string, 10) || 0;
  const qualification = formData.get("qualification") as string;

  // Social Links
  const instagram = formData.get("instagram") as string;
  const facebook = formData.get("facebook") as string;
  const linkedin = formData.get("linkedin") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Required fields are missing" };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is missing in server environment!");
    return { success: false, error: "Server configuration error. Please contact support." };
  } else {
    console.log("Service Role Key length:", process.env.SUPABASE_SERVICE_ROLE_KEY.length);
    console.log("Service Role Key starts with:", process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10));
  }

  try {
    const admin = getSupabaseAdmin();
    // 1. Create Auth User in Supabase
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name,
        full_name: name,
        role: "teacher"
      }
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return { success: false, error: "Email already exists" };
      }
      throw authError;
    }

    const userId = authData.user.id;

    // 2. Insert into the intermediate 'users' table (Identity Layer)
    const { error: userTableError } = await admin
      .from("users")
      .insert({
        id: userId,
        name: name,
        role: "teacher",
        is_verified: true
      });

    if (userTableError) {
      console.error("Users Table Error:", userTableError);
      await admin.auth.admin.deleteUser(userId);
      return { success: false, error: "Failed to initialize user identity." };
    }

    // 3. Generate unique 6-digit teacher code (storing in metadata since it's not in the DB schema)
    const teacherCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user metadata with the generated teacher code
    await admin.auth.admin.updateUserById(userId, {
      user_metadata: { ...authData.user.user_metadata, teacher_code: teacherCode }
    });

    // 4. Create Teacher Profile Record (Role-Specific Layer)
    const { error: profileError } = await admin
      .from("teacher_profiles")
      .insert({
        user_id: userId,
        full_name: name,
        phone_number: whatsapp,
        whatsapp_number: whatsapp,
        location_city: city || "Not Provided",
        location_state: state || "Not Provided",
        location_country: country || "India",
        dob: dob || new Date().toISOString().split('T')[0],
        experience_years: experience,
        highest_qualification: qualification || "Not Provided",
        instagram_url: instagram || null,
        facebook_url: facebook || null,
        linkedin_url: linkedin || null
      });

    if (profileError) {
      console.error("Profile Error:", profileError);
      // Cleanup auth user if profile creation fails
      await admin.auth.admin.deleteUser(userId);
      return { success: false, error: profileError.message };
    }

    return { success: true, teacherCode };
  } catch (err: any) {
    console.error("Teacher Signup Error:", err);
    return { success: false, error: err.message || "An unexpected error occurred during signup." };
  }
}

export async function updateTeacherProfile(userId: string, formData: FormData) {
  const admin = getSupabaseAdmin();
  
  const profileUpdates = {
    full_name: formData.get("full_name") as string,
    phone_number: formData.get("phone_number") as string,
    whatsapp_number: formData.get("whatsapp_number") as string,
    location_city: formData.get("location_city") as string,
    location_state: formData.get("location_state") as string,
    location_country: formData.get("location_country") as string,
    dob: formData.get("dob") as string,
    experience_years: parseInt(formData.get("experience_years") as string, 10) || 0,
    highest_qualification: formData.get("highest_qualification") as string,
    instagram_url: formData.get("instagram_url") as string,
    facebook_url: formData.get("facebook_url") as string,
    linkedin_url: formData.get("linkedin_url") as string,
  };

  const bio = formData.get("bio") as string;
  const profileImageFile = formData.get("profile_image") as File;

  try {
    // 1. Update teacher_profiles
    const { error: profileError } = await admin
      .from("teacher_profiles")
      .update(profileUpdates)
      .eq("user_id", userId);

    if (profileError) throw profileError;

    // 2. Prepare user table updates
    const userTableUpdates: any = {};
    if (profileUpdates.full_name) userTableUpdates.name = profileUpdates.full_name;
    if (bio !== null) userTableUpdates.bio = bio;

    // 3. Handle Profile Image Upload
    if (profileImageFile && profileImageFile.size > 0) {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; // Uploading to root of bucket

      const { error: uploadError } = await admin.storage
        .from('profiles')
        .upload(filePath, profileImageFile, {
          upsert: true,
          contentType: profileImageFile.type
        });

      if (!uploadError) {
        const { data: { publicUrl } } = admin.storage
          .from('profiles')
          .getPublicUrl(filePath);
        userTableUpdates.profile_image = publicUrl;
      } else {
        console.error("Image Upload Error:", uploadError);
        // We continue even if image fails, or throw if preferred
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
    console.error("Profile Update Error:", err);
    return { success: false, error: err.message };
  }
}

