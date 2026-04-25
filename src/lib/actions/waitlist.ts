"use server"

import { supabaseAdmin } from "@/lib/supabase"

export async function joinWaitlist(formData: FormData) {
  const full_name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone_number = formData.get("phone") as string
  const role = formData.get("role") as string

  if (!full_name || !email || !role) {
    return { success: false, error: "Missing required fields" }
  }

  const { error } = await supabaseAdmin
    .from("waitlist")
    .insert([{ full_name, email, phone_number, role }])

  if (error) {
    console.error("Waitlist error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getWaitlistEntries() {
  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Fetch waitlist error:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
