"use server"

import bcrypt from "bcrypt";
import { supabaseAdmin } from "@/lib/supabase";

export async function registerStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const age = formData.get("age") as string;
  const school = formData.get("school") as string;
  const degree = formData.get("degree") as string;
  const subjects = formData.get("subjects") as string;
  const hobbies = formData.get("hobbies") as string;
  const ambition = formData.get("ambition") as string;
  const instagram = formData.get("instagram") as string;
  const facebook = formData.get("facebook") as string;
  const linkedin = formData.get("linkedin") as string;

  if (!name || !email || !password) {
    throw new Error("Required fields are missing.");
  }

  try {
    // 1. Create Auth User in Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        name: name,
        full_name: name,
        role: "student" 
      }
    });
    
    if (authError) {
      if (authError.message.includes("already registered")) {
        throw new Error("Email already exists.");
      }
      throw authError;
    }

    const userId = authData.user.id;

    // 2. Insert into the intermediate 'users' table (Identity Layer)
    // This is mandatory for the foreign key constraint on student_profiles.user_id
    const { error: userTableError } = await supabaseAdmin
      .from("users")
      .insert({
        id: userId,
        name: name,
        role: "student",
        is_verified: true
      });

    if (userTableError) {
      console.error("Users Table Error:", userTableError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error("Failed to initialize user identity.");
    }

    // 3. Create Student Profile Record
    const { error: profileError } = await supabaseAdmin
      .from("student_profiles")
      .insert({
        user_id: userId,
        full_name: name,
        email,
        phone_number: phone,
        age: parseInt(age) || null,
        school_or_college: school,
        standard_or_degree: degree,
        interested_subjects: subjects,
        hobbies: hobbies,
        ambition: ambition,
        instagram_url: instagram,
        facebook_url: facebook,
        linkedin_url: linkedin,
      });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw profileError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message || "Failed to register. Please try again.");
  }
}

// Password reset is handled via Supabase Auth's built-in email flow.
// The security_question/security_answer columns do not exist in the current schema.
export async function sendPasswordResetEmail(email: string) {
  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  if (error) throw new Error(error.message);
  return { success: true };
}
