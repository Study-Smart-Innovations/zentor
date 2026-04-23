"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getPendingTeachers() {
  const { data, error } = await supabaseAdmin
    .from("teacher_profiles")
    .select("*")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending teachers:", error)
    return { error: "Failed to fetch pending teachers" }
  }

  return { teachers: data }
}

export async function updateVerificationStatus(teacherId: string, status: "approved" | "rejected") {
  const { error } = await supabaseAdmin
    .from("teacher_profiles")
    .update({ verification_status: status })
    .eq("id", teacherId)

  if (error) {
    console.error("Error updating verification status:", error)
    return { error: "Failed to update status" }
  }

  revalidatePath("/admin/verification")
  return { success: true }
}
