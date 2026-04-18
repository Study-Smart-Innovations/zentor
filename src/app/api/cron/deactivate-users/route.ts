import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  // In a real production app, you would verify a secret token in the header
  // to ensure only your cron service can call this.
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString();

    // 1. Deactivate inactive students
    const { data: students, error: sError } = await supabaseAdmin
      .from("students")
      .update({ active: false })
      .lt("last_login", dateStr)
      .select();

    if (sError) throw sError;

    // 2. Deactivate inactive teachers
    const { data: teachers, error: tError } = await supabaseAdmin
      .from("teachers")
      .update({ active: false })
      .lt("last_login", dateStr)
      .select();

    if (tError) throw tError;

    const deactivatedCount = (students?.length || 0) + (teachers?.length || 0);

    return NextResponse.json({
      message: "Deactivation check completed",
      deactivatedCount,
      deactivatedItems: [
        ...(students?.map((u: any) => `Student: ${u.email}`) || []),
        ...(teachers?.map((u: any) => `Teacher: ${u.email}`) || [])
      ]
    });
  } catch (error: any) {
    console.error("Error in deactivation cron:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
