"use server"

import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function generateTeacherCode(): Promise<string> {
  let code = "";
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    attempts++;
    // Generate a 6-digit random number
    code = Math.floor(100000 + Math.random() * 900000).toString();

    // Check uniqueness in the teachers table
    const { data, error } = await supabaseAdmin
      .from("teachers")
      .select("id")
      .eq("teacher_code", code);

    // If no error occurred and no rows were returned, the code is unique
    if (!error && data && data.length === 0) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    throw new Error("Failed to generate a unique teacher code. Please try again.");
  }

  return code;
}

export async function signUpTeacher(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const security_question = formData.get("security_question") as string;
  const security_answer = formData.get("security_answer") as string;
  const specialization = formData.get("specialization") as string;
  const degree = formData.get("degree") as string;
  const experience = parseInt(formData.get("experience") as string, 10);
  const mobile_number = formData.get("mobile_number") as string;

  if (
    !name || 
    !email || 
    !password || 
    !security_question || 
    !security_answer || 
    !specialization || 
    !degree || 
    mobile_number === undefined || mobile_number === "" ||
    isNaN(experience)
  ) {
    return { error: "All fields are required" };
  }

  try {
    // 1. Cross-table email uniqueness check
    const { data: studentExists } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq("email", email)
      .single();

    if (studentExists) {
      return { error: "This email is already registered as a Student." };
    }

    // 2. Hash security info
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(security_answer.toLowerCase().trim(), 10);

    // 3. Generate Unique 6-Digit Code
    const teacherCode = await generateTeacherCode();

    // 4. Create Unified Teacher Record
    const { data: teacherData, error: teacherError } = await supabaseAdmin
      .from("teachers")
      .insert({
        name,
        email,
        password: hashedPassword,
        security_question,
        security_answer: hashedSecurityAnswer,
        teacher_code: teacherCode,
        specialization,
        degree,
        experience,
        mobile_number,
        rating: 5.0,
      })
      .select()
      .single();

    if (teacherError) {
      if (teacherError.code === "23505") {
        return { error: "Email already exists" };
      }
      throw teacherError;
    }

    return { success: true, teacherCode };
  } catch (err: any) {
    console.error("Teacher Signup Error:", err);
    return { error: err.message || "An unexpected error occurred during signup." };
  }
}
