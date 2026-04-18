"use client"

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

// Optimized for Zentor Academic Portal (SSR Sync)

type Role = "student" | "teacher";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<Role>("student");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role, // Pass the selected role to authorize
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        if (role === "teacher") {
          router.push("/teacher/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="h-screen overflow-hidden flex flex-col bg-editorial-cream">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-8">
              <span className="text-4xl font-black tracking-tighter text-editorial-black font-serif">
                Zentor<span className="text-[#C5A059]">.</span>
              </span>
            </Link>
            <h1 className="text-5xl font-serif text-editorial-black mb-4 tracking-tight">
              Welcome Back.
            </h1>
            <p className="text-editorial-black/60 font-medium uppercase tracking-[0.2em] text-[10px]">
              Access Your Personal Academic Portal
            </p>
          </div>

          {/* Minimalist Role Switcher */}
          <div className="flex border-b border-editorial-black/10 mb-10">
            <button
              onClick={() => setRole("student")}
              className={`pb-4 px-8 text-xs font-bold uppercase tracking-widest transition-all relative ${
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
              className={`pb-4 px-8 text-xs font-bold uppercase tracking-widest transition-all relative ${
                role === "teacher" ? "text-editorial-black" : "text-editorial-black/30"
              }`}
            >
              Teacher
              {role === "teacher" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-editorial-black" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="alex@zentor.com"
                className="w-full bg-transparent border-b border-editorial-black/10 py-3 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-editorial-black/40 hover:text-editorial-black uppercase tracking-widest border-b border-transparent hover:border-editorial-black transition-all"
                >
                  Recovery
                </Link>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-editorial-black/10 py-3 px-1 text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
              />
            </div>

            {error && (
              <p className="text-red-900 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-editorial-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 disabled:opacity-50 mt-4"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-editorial-black/40">
            New to the circle?{" "}
            <Link href="/register" className="text-editorial-black border-b border-editorial-black/20 pb-0.5 hover:border-editorial-black">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
