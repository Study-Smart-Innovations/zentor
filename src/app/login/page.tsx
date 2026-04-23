"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { FloatingInput } from "@/components/ui/floating-input"
import { RoleToggle } from "@/components/ui/role-toggle"

type Role = "student" | "teacher"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<Role>("student")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password.")
      } else {
        router.push("/profile")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-editorial-cream paper-texture transition-colors duration-500">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif text-editorial-black mb-4 tracking-tight"
            >
              Zentor<span className="text-editorial-accent">.</span>
            </motion.h1>
            <p className="text-editorial-black/40 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]">
              Institutional Access Protocol
            </p>
          </div>

          <div className="royal-card">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-editorial-accent/60 mb-4 text-center">Identity Verification</p>
              <RoleToggle role={role} setRole={setRole} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <FloatingInput 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  required 
                  className="peer"
                />
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <FloatingInput 
                    label="Password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="peer"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-6 text-editorial-accent/40 hover:text-editorial-accent z-10 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end pt-2">
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-editorial-accent/60 hover:text-editorial-accent uppercase tracking-widest transition-all"
                  >
                    Recovery
                  </Link>
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-editorial-accent text-editorial-black rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? "Authenticating..." : "Sign In to Portal"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">
            New to the circle?{" "}
            <Link href="/register" className="text-editorial-accent border-b border-editorial-accent/20 pb-0.5 hover:border-editorial-accent transition-all">
              Establish Your Presence
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
