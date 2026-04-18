
import Razorpay from "razorpay";

if (!process.env.RAZ_API || !process.env.RAZ_SECRET) {
  console.warn("Razorpay API keys are missing in environment variables.");
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZ_API || "",
  key_secret: process.env.RAZ_SECRET || "",
});
