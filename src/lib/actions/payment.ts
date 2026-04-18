
"use server"

import { razorpay } from "@/lib/razorpay";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function createRazorpayOrder(courseId: string, planId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Fetch Plan Details to get the price
    const { data: plan, error: planError } = await supabaseAdmin
      .from("course_plans")
      .select("price, name")
      .eq("id", planId)
      .eq("course_id", courseId)
      .single();

    if (planError || !plan) throw new Error("Plan not found.");

    // 2. Create Razorpay Order
    // Amount must be in paise (INR * 100)
    const amount = Math.round(Number(plan.price) * 100);
    
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${courseId.substring(0, 8)}_${Date.now()}`,
      notes: {
        courseId,
        planId,
        userId: session.user.id
      }
    };

    const order = await razorpay.orders.create(options);
    
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZ_API
    };
  } catch (err: any) {
    console.error("[createRazorpayOrder] Error:", err);
    return { error: err.message || "Failed to create payment order." };
  }
}

export async function verifyRazorpayPayment({
  orderId,
  paymentId,
  signature,
  courseId,
  planId
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  courseId: string;
  planId: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // 1. Verify Signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZ_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return { error: "Invalid payment signature. Verification failed." };
    }

    // 2. Clear to Enroll - Fetch Plan Details again for duration and price
    const { data: plan } = await supabaseAdmin
      .from("course_plans")
      .select("duration_days, price")
      .eq("id", planId)
      .single();

    if (!plan) throw new Error("Plan metadata lost during verification.");

    const durationDays = plan.duration_days;
    const pricePaid = plan.price;
    const accessEnd = new Date();
    accessEnd.setDate(accessEnd.getDate() + durationDays);

    // 3. Update Course Access Entitlement
    const { error: accessError } = await supabaseAdmin
      .from("course_access")
      .upsert({
        user_id: session.user.id,
        course_id: courseId,
        access_start: new Date().toISOString(),
        access_end: accessEnd.toISOString(),
        is_active: true
      }, { onConflict: 'user_id,course_id' });

    if (accessError) throw accessError;

    // 4. Record Transaction in Enrollments (for Financials)
    const { error: enrollmentError } = await supabaseAdmin
      .from("enrollments")
      .insert({
        student_id: session.user.id,
        course_id: courseId,
        price_paid: pricePaid,
        purchased_at: new Date().toISOString()
      });

    if (enrollmentError) console.error("[verifyPayment] Enrollment logging failed:", enrollmentError);

    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (err: any) {
    console.error("[verifyRazorpayPayment] Error:", err);
    return { error: err.message || "Failed to verify payment." };
  }
}
