"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, HelpCircle, ArrowRight, BookOpen, GraduationCap, Clock, Phone, Star, ChevronDown } from "lucide-react";
import { signUpTeacher } from "@/lib/actions/teacher";

interface TeacherSignupFormProps {
  onSuccess: (teacherCode: string) => void;
  securityQuestions: string[];
}

export function TeacherSignupForm({ onSuccess, securityQuestions }: TeacherSignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await signUpTeacher(formData);
      if (result.success && result.teacherCode) {
        onSuccess(result.teacherCode);
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Full Name</label>
          <input
            name="name"
            type="text"
            required
            placeholder="Dr. Sarah Smith"
            className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Email Address</label>
          <input
            name="email"
            type="email"
            required
            placeholder="sarah@zentor.com"
            className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Specialization</label>
          <input
            name="specialization"
            type="text"
            required
            placeholder="Theoretical Physics"
            className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Highest Degree</label>
          <input
            name="degree"
            type="text"
            required
            placeholder="Ph.D. in Education"
            className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Experience (Years)</label>
          <input
            name="experience"
            type="number"
            required
            min="0"
            placeholder="10"
            className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Mobile Number</label>
          <input
            name="mobile_number"
            type="tel"
            required
            placeholder="+1 (555) 012-3456"
            className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Password</label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
          />
        </div>
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
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Security Answer</label>
        <input
          name="security_answer"
          type="text"
          required
          placeholder="Your private response..."
          className="w-full bg-transparent border-b border-editorial-black/10 py-2 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
        />
      </div>

      {error && (
        <p className="text-red-900 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-editorial-black text-white py-4 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 disabled:opacity-50 mt-2"
      >
        {isLoading ? "Verifying..." : "Complete Registration"}
      </button>
    </form>
  );
}
