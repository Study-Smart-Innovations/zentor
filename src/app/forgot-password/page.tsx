"use client"

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ShieldCheck, KeyRound, ArrowLeft, ArrowRight, AlertCircle, Rocket } from "lucide-react";
import { getSecurityQuestion, verifySecurityAnswer, resetPassword } from "@/lib/actions/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/cta-footer";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Security Question, 3: New Password
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const q = await getSecurityQuestion(email);
      setQuestion(q);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Email not found.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { success: isCorrect } = await verifySecurityAnswer(email, answer);
      if (isCorrect) {
        setStep(3);
      } else {
        setError("Invalid answer to the security question.");
      }
    } catch (err: any) {
      setError("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await resetPassword(email, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex flex-col bg-editorial-cream">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="mx-auto h-24 w-24 bg-editorial-black/5 flex items-center justify-center rounded-full text-editorial-black mb-12">
              <KeyRound className="h-10 w-10" />
            </div>
            <h2 className="text-4xl font-serif text-editorial-black mb-6 tracking-tight">Access Restored.</h2>
            <p className="text-editorial-black/60 mb-12 font-medium">
              Your credentials have been updated. You may now return to the academic portal.
            </p>
            <Link
              href="/login"
              className="w-full inline-block bg-editorial-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90"
            >
              Back to Login
            </Link>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-editorial-cream">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full"
        >
          <div className="text-center mb-16">
            <Link href="/" className="inline-block mb-8">
              <span className="text-4xl font-black tracking-tighter text-editorial-black font-serif">
                Zentor<span className="text-[#C5A059]">.</span>
              </span>
            </Link>
            <h1 className="text-5xl font-serif text-editorial-black mb-4 tracking-tight">
              Recovery.
            </h1>
            <p className="text-editorial-black/60 font-medium uppercase tracking-[0.2em] text-[10px]">
              Credential Verification Protocol
            </p>
          </div>

          {/* Minimalist Step Indicator */}
          <div className="flex justify-between items-center mb-16 px-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div className={`text-[10px] font-black mb-2 transition-all duration-500 ${step >= s ? "text-editorial-black" : "text-editorial-black/20"}`}>
                  0{s}
                </div>
                <div className={`h-0.5 w-16 sm:w-32 transition-all duration-500 ${step >= s ? "bg-editorial-black" : "bg-editorial-black/10"}`} />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleStep1}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="alex@zentor.com"
                    className="w-full bg-transparent border-b border-editorial-black/10 py-3 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
                  />
                </div>
                {error && <p className="text-red-900 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-3">{error}</p>}
                <button
                  disabled={isLoading}
                  className="w-full bg-editorial-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 disabled:opacity-50 mt-4"
                  type="submit"
                >
                  {isLoading ? "Consulting Records..." : "Identify Email"}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleStep2}
                className="space-y-8"
              >
                <div className="bg-editorial-black/[0.02] p-8 border border-editorial-black/5 mb-8">
                  <p className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest mb-3">Identity Challenge</p>
                  <p className="text-2xl font-serif text-editorial-black">{question}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Your Response</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                    placeholder="Provide the secret answer..."
                    className="w-full bg-transparent border-b border-editorial-black/10 py-3 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
                  />
                </div>
                {error && <p className="text-red-900 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-3">{error}</p>}
                <button
                  disabled={isLoading}
                  className="w-full bg-editorial-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 disabled:opacity-50 mt-4"
                  type="submit"
                >
                  {isLoading ? "Verifying..." : "Verify Identity"}
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleStep3}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-editorial-black/10 py-3 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
                  />
                </div>
                {error && <p className="text-red-900 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-3">{error}</p>}
                <button
                  disabled={isLoading}
                  className="w-full bg-editorial-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 disabled:opacity-50 mt-4"
                  type="submit"
                >
                  {isLoading ? "Updating Records..." : "Finalize Reset"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
