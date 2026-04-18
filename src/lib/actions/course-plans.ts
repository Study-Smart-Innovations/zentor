
"use server"

import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addCoursePlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "teacher") {
    return { error: "Unauthorized" };
  }

  const courseId = formData.get("courseId") as string;
  const name = formData.get("name") as string;
  const durationDays = parseInt(formData.get("durationDays") as string || "0");
  const price = parseFloat(formData.get("price") as string || "0");

  if (!courseId || !name || !durationDays) return { error: "Missing required fields." };

  try {
    const { data, error } = await supabaseAdmin
      .from("course_plans")
      .insert({
        course_id: courseId,
        name,
        duration_days: durationDays,
        price
      })
      .select()
      .single();

    if (error) {
      console.error(`[addCoursePlan] Database Error [${error.code}]:`, error.message);
      return { error: error.message };
    }

    revalidatePath(`/teacher/courses/${courseId}/manage`);
    return { success: true, planId: data.id };
  } catch (err: any) {
    console.error("[addCoursePlan] Unexpected Exception:", err.message);
    return { error: err.message || "Failed to add plan." };
  }
}

export async function getCoursePlans(courseId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("course_plans")
      .select("*")
      .eq("course_id", courseId)
      .order("duration_days", { ascending: true });

    if (error) {
      console.error(`[getCoursePlans] Database Error [${error.code}]:`, error.message);
      return { error: error.message, plans: [] };
    }
    return { plans: data || [] };
  } catch (err: any) {
    console.error("[getCoursePlans] Unexpected Exception:", err.message);
    return { error: "Failed to fetch plans", plans: [] };
  }
}

export async function deleteCoursePlan(planId: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "teacher") {
    return { error: "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin
      .from("course_plans")
      .delete()
      .eq("id", planId);

    if (error) {
      console.error(`[deleteCoursePlan] Database Error [${error.code}]:`, error.message);
      return { error: error.message };
    }

    revalidatePath(`/teacher/courses/${courseId}/manage`);
    return { success: true };
  } catch (err: any) {
    console.error("[deleteCoursePlan] Unexpected Exception:", err.message);
    return { error: err.message || "Failed to delete plan." };
  }
}
