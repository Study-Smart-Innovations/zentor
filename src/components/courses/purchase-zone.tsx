"use client"

import { useState, useEffect } from "react";
import { enrollInCourse } from "@/lib/actions/course-access";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/actions/payment";
import { Check, Sparkles, ShieldCheck, ArrowRight, Loader2, CreditCard, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CoursePurchaseSection({ course, plans }: { course: any, plans: any[] }) {
   const [isLoading, setIsLoading] = useState(false);
   const [isMounted, setIsMounted] = useState(false);
   const [selectedPlanId, setSelectedPlanId] = useState<string | null>(plans?.[0]?.id || null);
   const router = useRouter();

   useEffect(() => {
      setIsMounted(true);
      if (plans && plans.length > 0 && !selectedPlanId) {
         setSelectedPlanId(plans[0].id);
      }
   }, [plans]);

   if (!isMounted) return null;

    const handlePurchase = async () => {
       if (!selectedPlanId && plans.length > 0) {
          alert("Please select an access plan.");
          return;
       }
       
       setIsLoading(true);

       try {
          // 1. If it's a free course, bypass payment
          if (course.is_free || displayPrice === 0) {
             const result = await enrollInCourse(course.id, selectedPlanId || undefined);
             if (result.success) {
                router.refresh();
             } else {
                alert(result.error);
             }
             setIsLoading(false);
             return;
          }

          // 2. Create Order on Server
          const orderData = await createRazorpayOrder(course.id, selectedPlanId!);
          if (orderData.error) throw new Error(orderData.error);

          // 3. Configure Razorpay Options
          const options = {
             key: orderData.key,
             amount: orderData.amount,
             currency: orderData.currency,
             name: "Zentor",
             description: `Course: ${course.title}`,
             order_id: orderData.orderId,
             handler: async function (response: any) {
                const verification = await verifyRazorpayPayment({
                   orderId: response.razorpay_order_id,
                   paymentId: response.razorpay_payment_id,
                   signature: response.razorpay_signature,
                   courseId: course.id,
                   planId: selectedPlanId!
                });

                if (verification.success) {
                   router.refresh();
                } else {
                   alert("Payment verification failed: " + verification.error);
                   setIsLoading(false);
                }
             },
             prefill: {
                name: "", 
                email: "",
             },
             theme: {
                color: "#1a1a1a",
             },
             modal: {
                ondismiss: function() {
                   setIsLoading(false);
                }
             }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();

       } catch (err: any) {
          console.error("Purchase Error:", err);
          alert(err.message || "Failed to initiate payment.");
          setIsLoading(false);
       }
    };

   const selectedPlan = plans.find(p => p.id === selectedPlanId);
   const displayPrice = selectedPlan ? selectedPlan.price : (course.offered_price || course.price);

   return (
      <>
      <section className="relative py-12 md:py-20">
         <div className="grid gap-12 md:gap-20 lg:grid-cols-2">

            {/* Left: Value Proposition */}
            <div className="space-y-12">
               <div className="space-y-6">
                  <h2 className="text-4xl font-serif italic text-editorial-black tracking-tight">Join This Course</h2>
                  <p className="text-editorial-black/60 text-xl font-serif italic leading-relaxed">
                     Get secure access to all lessons and features created by <span className="text-editorial-black font-black">{course.teacherName}</span>.
                     Choose the access duration that fits your learning pace.
                  </p>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-4">
                        <div className="h-6 w-6 rounded-full border border-editorial-black/10 flex items-center justify-center text-editorial-black shadow-sm shrink-0">
                           <Check className="h-3 w-3" />
                        </div>
                        <span className="text-editorial-black font-serif text-lg">Durational Access (Renew easily)</span>
                     </div>
                     <div className="flex items-center space-x-4">
                        <div className="h-6 w-6 rounded-full border border-editorial-black/10 flex items-center justify-center text-editorial-black shadow-sm shrink-0">
                           <Check className="h-3 w-3" />
                        </div>
                        <span className="text-editorial-black font-serif text-lg">Downloadable Notes & Live Mentorship</span>
                     </div>
                  </div>

                  <div className="p-8 border-l-4 border-editorial-black/5 bg-editorial-black/[0.01] flex items-center space-x-6">
                     <div className="h-14 w-14 rounded-full border border-editorial-black/10 flex items-center justify-center text-editorial-black">
                        <CreditCard className="h-6 w-6" />
                     </div>
                     <p className="text-sm font-serif italic text-editorial-black/40">
                        Payment is processed securely. Access is granted <span className="text-editorial-black font-bold">Instantly</span> upon verification.
                     </p>
                  </div>
               </div>
            </div>

            {/* Right: Pricing Card & Plan Selection */}
            <div className="relative">
               <div className="p-6 md:p-12 border border-editorial-black/10 bg-white shadow-2xl relative flex flex-col h-full">

                  <div className="mb-12">
                     <p className="text-[10px] font-black uppercase text-editorial-black/20 tracking-[0.4em] mb-4">Select Access Tier</p>

                     <div className="space-y-3 mb-8">
                        {plans.length > 0 ? (
                           plans.map((plan) => (
                              <button
                                 key={plan.id}
                                 onClick={() => setSelectedPlanId(plan.id)}
                                 className={`w-full p-4 md:p-6 border flex items-center justify-between transition-all ${selectedPlanId === plan.id
                                    ? 'border-editorial-black bg-editorial-black/[0.02] shadow-sm'
                                    : 'border-editorial-black/5 hover:border-editorial-black/20'
                                    }`}
                              >
                                 <div className="flex items-center space-x-4">
                                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedPlanId === plan.id ? 'border-editorial-black' : 'border-editorial-black/20'}`}>
                                       {selectedPlanId === plan.id && <div className="h-2 w-2 rounded-full bg-editorial-black" />}
                                    </div>
                                    <div className="text-left">
                                       <p className="text-sm font-serif italic text-editorial-black">{plan.name}</p>
                                       <p className="text-[10px] uppercase font-black text-editorial-black/30 tracking-widest">{plan.duration_days} Days Access</p>
                                    </div>
                                 </div>
                                 <span className="text-xl font-serif italic text-editorial-black">₹{plan.price}</span>
                              </button>
                           ))
                        ) : (
                           <div className="p-6 border border-editorial-black/5 bg-editorial-black/[0.02] flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                 <div className="h-4 w-4 rounded-full border border-editorial-black flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-editorial-black" />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-sm font-serif italic text-editorial-black">Full Access (Legacy)</p>
                                    <p className="text-[10px] uppercase font-black text-editorial-black/30 tracking-widest">365 Days Access</p>
                                 </div>
                              </div>
                              <span className="text-xl font-serif italic text-editorial-black">₹{course.offered_price || course.price}</span>
                           </div>
                        )}
                     </div>

                     <div className="flex items-baseline space-x-4">
                        <span className="text-5xl md:text-7xl font-serif italic text-editorial-black tabular-nums">
                           ₹{displayPrice}
                        </span>
                        {selectedPlan && selectedPlan.price < (course.price) && (
                           <span className="text-xl md:text-2xl font-serif text-editorial-black/20 line-through tabular-nums">
                              ₹{course.price}
                           </span>
                        )}
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 mb-12">
                     <p className="text-[11px] text-editorial-black/30 font-serif italic text-center px-6 leading-relaxed">
                        Access starts from the date of enrollment and expires automatically.
                     </p>
                  </div>

                  <button
                     onClick={handlePurchase}
                     disabled={isLoading}
                     className="w-full h-16 md:h-24 bg-editorial-black text-editorial-cream hover:bg-editorial-black/90 transition-all flex items-center justify-center space-x-4 group"
                  >
                     {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                     ) : (
                        <>
                           <span className="text-xl font-black uppercase tracking-[0.2em]">Confirm Enrollment</span>
                           <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </>
                     )}
                  </button>

               </div>
            </div>

         </div>
      </section>
      <Script 
         src="https://checkout.razorpay.com/v1/checkout.js" 
         strategy="lazyOnload"
      />
      </>
   );
}
