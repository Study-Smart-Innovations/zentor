"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, User, Mail, Phone } from "lucide-react"
import { Navbar } from "@/components/navbar-waitlist"
import { FloatingInput } from "@/components/ui/floating-input"
import { RoleToggle } from "@/components/ui/role-toggle"
import { joinWaitlist } from "@/lib/actions/waitlist"

type Role = "student" | "teacher"

export default function WaitlistPage() {
  const [role, setRole] = useState<Role>("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("phone", formData.phone)
      data.append("role", role)

      const result = await joinWaitlist(data)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to join waitlist")
      }
    } catch (err: any) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col bg-editorial-cream">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="royal-card max-w-md w-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="mx-auto h-20 w-20 bg-[#C5A059]/20 flex items-center justify-center rounded-full text-[#C5A059] mb-6"
            >
              <CheckCircle2 className="h-12 w-12" />
            </motion.div>
            <h2 className="text-3xl font-serif text-editorial-black mb-2">You&apos;re on the list!</h2>
            <p className="text-editorial-black/60 mb-8 text-sm">
              Thank you for your interest. We&apos;ll notify you as soon as Zentor is ready for you.
            </p>
            <Link
              href="/"
              className="w-full inline-block bg-editorial-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-editorial-cream paper-texture pb-20">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-12">
        <div className="max-w-xl w-full">
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif text-editorial-black mb-4 tracking-tight"
            >
              Join the Waitlist<span className="text-[#C5A059]">.</span>
            </motion.h1>
            <p className="text-editorial-black/40 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]">
              Early Access Registration
            </p>
          </div>

          <div className="royal-card">
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#C5A059]/60 mb-4 text-center">I am a</p>
              <RoleToggle role={role} setRole={setRole} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <FloatingInput 
                  label="Full Name" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
                <FloatingInput 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
                <FloatingInput 
                  label="Phone Number" 
                  name="phone" 
                  type="tel" 
                  required 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>

              {error && (
                <p className="p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-xl text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-editorial-black text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-editorial-black/90 transition-all disabled:opacity-50 mt-10 shadow-2xl"
              >
                {isLoading ? "Processing..." : "Reserve My Spot"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">
            Be the first to know when we launch.
          </p>
        </div>
      </div>
    </main>
  )
}
