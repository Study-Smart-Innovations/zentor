"use client"

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, HelpCircle, ArrowRight, ShieldCheck, Rocket, GraduationCap, ChevronDown, Eye, EyeOff } from "lucide-react";
import { registerStudent } from "@/lib/actions/auth";
import { Navbar } from "@/components/navbar";
import { TeacherSignupForm } from "@/components/auth/teacher-signup-form";

// Optimized for Zentor Academic Portal (SSR Sync)

type Role = "student" | "teacher";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [teacherCode, setTeacherCode] = useState<string | null>(null);

  const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await registerStudent(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherSuccess = (code: string) => {
    setTeacherCode(code);
    setSuccess(true);
  };

  const securityQuestions = [
    "What's your mother's maiden name?",
    "What's your school name?",
    "What's your favourite sports?",
    "What's your private code?",
  ];

  if (success) {
    return (
      <main className="min-h-screen overflow-y-auto flex flex-col bg-editorial-cream">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 pb-20 md:pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="mx-auto h-20 w-20 bg-editorial-black/5 flex items-center justify-center rounded-full text-editorial-black mb-8">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h2 className="text-4xl font-serif text-editorial-black mb-4">Registration Complete.</h2>
            <p className="text-editorial-black/60 mb-10 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Your {role} profile has been successfully integrated into the circle.
            </p>
            
            {role === "teacher" && teacherCode && (
              <div className="mb-10 p-8 border border-editorial-black/10 bg-editorial-black/[0.02]">
                <p className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-[0.2em] mb-3">Academic Identifier</p>
                <p className="text-5xl font-serif text-editorial-black tracking-tighter">{teacherCode}</p>
                <p className="text-[9px] text-editorial-black/30 mt-4 uppercase tracking-widest italic">Save this for future verification</p>
              </div>
            )}

            <Link
              href="/login"
              className="w-full inline-block bg-editorial-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90"
            >
              Sign In to Portal
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-y-auto flex flex-col bg-editorial-cream pb-20">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full"
        >
          <div className="text-center mb-4">
            <Link href="/" className="inline-block mb-4">
              <span className="text-4xl font-black tracking-tighter text-editorial-black font-serif">
                Zentor<span className="text-[#C5A059]">.</span>
              </span>
            </Link>
            <h1 className="text-4xl font-serif text-editorial-black mb-3 tracking-tight">
              {role === "student" ? "Start Your Journey." : "Establish Your Presence."}
            </h1>
            <p className="text-editorial-black/60 font-medium uppercase tracking-[0.2em] text-[10px]">
              Institutional Admission Protocol
            </p>
          </div>

          {/* Minimalist Role Switcher */}
          <div className="flex border-b border-editorial-black/10 mb-4">
            <button
              onClick={() => setRole("student")}
              className={`pb-3 px-8 text-xs font-bold uppercase tracking-widest transition-all relative ${
                role === "student" ? "text-editorial-black" : "text-editorial-black/30"
              }`}
            >
              Student
              {role === "student" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-editorial-black" />
              )}
            </button>
            <button
              onClick={() => setRole("teacher")}
              className={`pb-3 px-8 text-xs font-bold uppercase tracking-widest transition-all relative ${
                role === "teacher" ? "text-editorial-black" : "text-editorial-black/30"
              }`}
            >
              Teacher
              {role === "teacher" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-editorial-black" />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {role === "student" ? (
              <motion.div
                key="student"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <form onSubmit={handleStudentSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Alex Johnson"
                        className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="alex@zentor.com"
                        className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-editorial-black/20 hover:text-editorial-black transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Security Question</label>
                      <div className="relative">
                        <select
                          name="security_question"
                          required
                          defaultValue=""
                          className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none appearance-none cursor-pointer focus:border-editorial-black"
                        >
                          <option value="" disabled>Select Question</option>
                          {securityQuestions.map((q) => (
                            <option key={q} value={q}>{q}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-editorial-black/20 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Secret Response</label>
                      <input
                        name="security_answer"
                        type="text"
                        required
                        placeholder="Your private response..."
                        className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-900 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-editorial-black text-white py-4 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 disabled:opacity-50 mt-2"
                  >
                    {isLoading ? "Validating..." : "Create Account"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="teacher"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TeacherSignupForm 
                  onSuccess={handleTeacherSuccess} 
                  securityQuestions={securityQuestions} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-editorial-black/40">
            Enrolled already?{" "}
            <Link href="/login" className="text-editorial-black border-b border-editorial-black/20 pb-0.5 hover:border-editorial-black transition-all">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
