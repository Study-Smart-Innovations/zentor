"use server"

import bcrypt from "bcrypt";
import { supabaseAdmin } from "@/lib/supabase";

export async function registerStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const security_question = formData.get("security_question") as string;
  const security_answer = formData.get("security_answer") as string;

  if (!name || !email || !password || !security_question || !security_answer) {
    throw new Error("All fields are required.");
  }

  // Cross-table email uniqueness check
  const { data: teacherExists } = await supabaseAdmin
    .from("teachers")
    .select("id")
    .eq("email", email)
    .single();

  if (teacherExists) {
    throw new Error("This email is already registered as a Teacher.");
  }

  // Hash password and security answer
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedAnswer = await bcrypt.hash(security_answer.toLowerCase().trim(), 10);

  const { data, error } = await supabaseAdmin
    .from("students")
    .insert([
      {
        name,
        email,
        password: hashedPassword,
        security_question,
        security_answer: hashedAnswer,
        paid: false,
        active: true,
      },
    ]);

  if (error) {
    console.error("Registration error:", error);
    if (error.code === '23505') throw new Error("Email already exists.");
    throw new Error("Failed to register. Please try again.");
  }

  return { success: true };
}

export async function verifySecurityAnswer(email: string, answer: string) {
  // Check students table first
  let { data: user, error } = await supabaseAdmin
    .from("students")
    .select("security_answer")
    .eq("email", email)
    .single();

  // If not found, check teachers
  if (error || !user) {
    const { data: teacher, error: tError } = await supabaseAdmin
      .from("teachers")
      .select("security_answer")
      .eq("email", email)
      .single();
    
    user = teacher;
    error = tError;
  }

  if (error || !user) return { success: false, error: "User not found." };

  const isAnswerCorrect = await bcrypt.compare(
    answer.toLowerCase().trim(),
    user.security_answer
  );

  return { success: isAnswerCorrect };
}

export async function getSecurityQuestion(email: string) {
  // Check students table
  let { data: user, error } = await supabaseAdmin
    .from("students")
    .select("security_question")
    .eq("email", email)
    .single();

  // Check teachers table
  if (error || !user) {
    const { data: teacher, error: tError } = await supabaseAdmin
      .from("teachers")
      .select("security_question")
      .eq("email", email)
      .single();
    
    user = teacher;
    error = tError;
  }

  if (error || !user) throw new Error("No user found with this email.");

  return user.security_question;
}

export async function resetPassword(email: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Attempt update on students
  const { error: sError, data: sData } = await supabaseAdmin
    .from("students")
    .update({ password: hashedPassword })
    .eq("email", email)
    .select();

  // If student update didn't affect any rows (or error), try teachers
  if (sError || !sData || sData.length === 0) {
    const { error: tError } = await supabaseAdmin
      .from("teachers")
      .update({ password: hashedPassword })
      .eq("email", email);
    
    if (tError) throw new Error("Failed to update password.");
  }

  return { success: true };
}
