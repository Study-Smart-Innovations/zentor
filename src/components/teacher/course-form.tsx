"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Book, FileText, Image as ImageIcon, CreditCard, ArrowRight, Loader2, Sparkles, Percent, Tag, Type, ChevronLeft, Plus, Trash2, Clock } from "lucide-react";
import { createCourse, updateCourse } from "@/lib/actions/course";

interface CourseFormProps {
  course?: any;
  onSuccess?: () => void;
}

export function CourseForm({ course, onSuccess }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFree, setIsFree] = useState(course ? course.is_free : true);
  const router = useRouter();

  const [headline, setHeadline] = useState(course?.headline || "");
  const [discountPercentage, setDiscountPercentage] = useState(course?.discount_percentage || 0);
  const [offeredPrice, setOfferedPrice] = useState(course?.offered_price || course?.price || 0);
  const [price, setPrice] = useState(course?.price || 0);

  // --- Linguistic Plan Registry State ---
  const [plans, setPlans] = useState<any[]>(course?.course_plans || [
    { name: "3-Month Access", durationDays: 90, price: course?.price || 0 }
  ]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: "Monthly Access", durationDays: 30, price: "" });

  const calculateDiscount = (p: number, o: number) => {
    if (p <= 0) return 0;
    const discount = ((p - o) / p) * 100;
    return Math.max(0, Math.min(100, Math.round(discount)));
  };

  const calculateOfferedPrice = (p: number, d: number) => {
    const off = p - (p * (d / 100));
    return parseFloat(off.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("isFree", String(isFree));
    formData.set("plans", JSON.stringify(plans));
    if (course) formData.set("courseId", course.id);

    try {
      const result = course
        ? await updateCourse(formData)
        : await createCourse(formData);

      if (result.success) {
        if (onSuccess) onSuccess();
        if (!course && (result as any).courseId) {
          router.push(`/teacher/courses/${(result as any).courseId}/manage`);
        }
      } else {
        setError(result.error || `Failed to ${course ? 'update' : 'create'} course.`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pb-12"
    >
      <div className="glass-card p-6 md:p-8 lg:p-12 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-foreground/5 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary-blue/10 blur-[80px] rounded-full" />

        <div className="flex items-center space-x-4 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-editorial-black font-bold">Course Details</h2>
            <p className="text-[10px] text-editorial-black/30 font-black uppercase tracking-[0.2em]">Mandatory Metadata</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-[0.2em]">Course Title</label>
              <div className="relative group">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-editorial-black/20 transition-colors group-focus-within:text-[#C5A059]" />
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Mastering Advanced Mathematics"
                  className="w-full bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl py-4 md:py-5 pl-12 pr-4 text-editorial-black outline-none transition-all focus:border-[#C5A059] focus:bg-white font-serif italic text-lg shadow-sm placeholder:text-editorial-black/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-[0.2em]">Academic Headline</label>
              <div className="relative group">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-editorial-black/20 transition-colors group-focus-within:text-[#C5A059]" />
                <input
                  name="headline"
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Elevate your algebraic understanding..."
                  className="w-full bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl py-4 md:py-5 pl-12 pr-4 text-editorial-black outline-none transition-all focus:border-[#C5A059] focus:bg-white font-serif italic text-lg shadow-sm placeholder:text-editorial-black/10"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-[0.2em]">Course Narrative</label>
            <div className="relative group">
              <FileText className="absolute left-4 top-6 h-5 w-5 text-editorial-black/20 transition-colors group-focus-within:text-[#C5A059]" />
              <textarea
                name="description"
                rows={4}
                placeholder="Compose a compelling narrative for your students..."
                className="w-full bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl py-4 md:py-5 pl-12 pr-4 text-editorial-black outline-none transition-all focus:border-[#C5A059] focus:bg-white font-serif italic text-lg shadow-sm placeholder:text-editorial-black/10 resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Course Banner (Cloudinary) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-[0.2em]">Curriculum Banner</label>
              <div className="relative group">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-editorial-black/20 transition-colors group-focus-within:text-[#C5A059]" />
                <input
                  name="banner"
                  type="file"
                  accept="image/*"
                  className="w-full bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl py-4 md:py-5 pl-12 pr-4 text-editorial-black outline-none transition-all focus:border-[#C5A059] focus:bg-white font-serif italic text-sm shadow-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[9px] file:font-black file:bg-[#C5A059]/10 file:text-[#C5A059] hover:file:bg-[#C5A059]/20"
                />
                {course?.banner_url && (
                  <input type="hidden" name="existingBannerUrl" value={course.banner_url} />
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-[0.2em]">Investment Model</label>
              <div className="flex p-1 bg-editorial-black/5 rounded-2xl relative">
                <motion.div
                  initial={false}
                  animate={{ x: isFree ? 0 : "100%" }}
                  className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm z-0"
                />
                <button
                  type="button"
                  onClick={() => setIsFree(true)}
                  className={`flex-1 py-4 px-2 md:px-4 relative z-10 text-[9px] md:text-[10px] font-black transition-colors uppercase tracking-widest ${isFree ? "text-editorial-black font-black" : "text-editorial-black/30"
                    }`}
                >
                  Complimentary
                </button>
                <button
                  type="button"
                  onClick={() => setIsFree(false)}
                  className={`flex-1 py-4 px-2 md:px-4 relative z-10 text-[9px] md:text-[10px] font-black transition-colors uppercase tracking-widest ${!isFree ? "text-[#C5A059] font-black" : "text-editorial-black/30"
                    }`}
                >
                  Premium
                </button>
              </div>

              <AnimatePresence>
                {!isFree && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 space-y-6 overflow-hidden"
                  >
                    {/* Base Price */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-widest">Global Asset Price</label>
                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-editorial-black/20 transition-colors group-focus-within:text-[#C5A059]" />
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={price}
                          onChange={(e) => {
                            const p = parseFloat(e.target.value) || 0;
                            setPrice(p);
                            const updatedOffered = calculateOfferedPrice(p, discountPercentage);
                            setOfferedPrice(updatedOffered);

                            // Authoritative Plan Synchronization
                            if (plans.length === 1 && plans[0].durationDays === 90) {
                              setPlans([{ ...plans[0], price: updatedOffered || p }]);
                            }
                          }}
                          placeholder="49.99"
                          required={!isFree}
                          className="w-full bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl py-4 md:py-5 pl-12 pr-4 text-editorial-black outline-none transition-all focus:border-[#C5A059] focus:bg-white font-black text-lg md:text-xl shadow-sm placeholder:text-editorial-black/10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Offered Price */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-widest">Entry Offer</label>
                        <div className="relative group">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-editorial-black/20 transition-colors group-focus-within:text-[#C5A059]" />
                          <input
                            name="offeredPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={offeredPrice}
                            onChange={(e) => {
                              const o = parseFloat(e.target.value) || 0;
                              setOfferedPrice(o);
                              setDiscountPercentage(calculateDiscount(price, o));

                              // Authoritative Plan Synchronization
                              if (plans.length === 1 && plans[0].durationDays === 90) {
                                setPlans([{ ...plans[0], price: o }]);
                              }
                            }}
                            placeholder="39.99"
                            className="w-full bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl py-4 pl-10 pr-4 text-[#C5A059] outline-none transition-all focus:border-[#C5A059] focus:bg-white font-black text-lg shadow-sm placeholder:text-editorial-black/10"
                          />
                        </div>
                      </div>

                      {/* Discount Percentage */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-editorial-black/40 ml-2 uppercase tracking-widest">Circle Privilege (%)</label>
                        <div className="relative group">
                          <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-editorial-black/20 transition-colors group-focus-within:text-[#C5A059]" />
                          <input
                            name="discountPercentage"
                            type="number"
                            min="0"
                            max="100"
                            value={discountPercentage}
                            onChange={(e) => {
                              const d = parseFloat(e.target.value) || 0;
                              setDiscountPercentage(d);
                              setOfferedPrice(calculateOfferedPrice(price, d));
                            }}
                            placeholder="20"
                            className="w-full bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl py-4 pl-10 pr-4 text-editorial-black outline-none transition-all focus:border-[#C5A059] focus:bg-white font-black text-lg shadow-sm placeholder:text-editorial-black/10"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Durational Pricing Registry Integration */}
          {!isFree && (
            <div className="space-y-6 pt-10 border-t border-editorial-black/5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-editorial-black/40 uppercase tracking-widest">Durational Pricing Registry</label>
                  <p className="text-[11px] font-serif italic text-editorial-black/30">Define the access windows for your circle.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlanForm(!showPlanForm)}
                  className="h-10 w-10 flex items-center justify-center border border-editorial-black/10 rounded-full hover:border-editorial-black hover:bg-editorial-black shadow-sm text-editorial-black hover:text-white transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4">
                {plans.map((plan, i) => (
                  <div key={i} className="p-4 md:p-6 bg-editorial-black/[0.02] border border-editorial-black/5 rounded-2xl flex justify-between items-center group">
                    <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-editorial-black/5 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-editorial-black/40" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-serif italic text-editorial-black truncate">{plan.name}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]">{plan.durationDays || plan.duration_days} Days Access</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
                      <span className="text-base md:text-lg font-serif italic text-editorial-black whitespace-nowrap">₹{plan.price}</span>
                      <button
                        type="button"
                        onClick={() => setPlans(plans.filter((_, idx) => idx !== i))}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {showPlanForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 border-2 border-editorial-black bg-white shadow-xl space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-editorial-black/30 tracking-widest">Duration Tier</label>
                        <select
                          value={newPlan.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            let days = 30;
                            if (val.includes("Quarterly")) days = 90;
                            if (val.includes("Half")) days = 180;
                            if (val.includes("Yearly")) days = 365;
                            setNewPlan({ ...newPlan, name: val, durationDays: days });
                          }}
                          className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-3 text-lg font-serif text-editorial-black outline-none appearance-none"
                        >
                          <option value="Monthly Access">Monthly (30 Days)</option>
                          <option value="Quarterly Access">Quarterly (90 Days)</option>
                          <option value="Half-Yearly Access">Half-Yearly (180 Days)</option>
                          <option value="Yearly Access">Yearly (365 Days)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-editorial-black/30 tracking-widest">Price (₹)</label>
                        <input
                          type="number"
                          value={newPlan.price}
                          onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                          placeholder="Price for this window"
                          className="w-full bg-editorial-black/[0.02] border-b-2 border-editorial-black/10 px-0 py-3 text-lg font-serif text-editorial-black outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPlan.price) return;
                        setPlans([...plans, { ...newPlan, price: parseFloat(newPlan.price) }]);
                        setShowPlanForm(false);
                        setNewPlan({ name: "Monthly Access", durationDays: 30, price: "" });
                      }}
                      className="w-full h-14 bg-editorial-black text-editorial-cream text-[10px] font-black uppercase tracking-widest"
                    >
                      Authorize Pricing Tier
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-sm font-bold ml-2 bg-red-500/5 p-4 rounded-xl border border-red-500/10"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 rounded-full bg-editorial-black py-6 font-black text-white shadow-2xl transition-all hover:bg-editorial-black/90 active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Synchronizing Assets...</span>
              </>
            ) : (
              <>
                <span>{course ? 'Update Curriculum' : 'Instantiate Circle'}</span>
                {!course && <ArrowRight className="h-5 w-5" />}
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
