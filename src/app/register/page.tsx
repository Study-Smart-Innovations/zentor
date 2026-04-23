"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, Mail, Lock, Phone, MapPin, GraduationCap, 
  Calendar, Briefcase, FileText, Share2, ArrowRight, 
  ArrowLeft, CheckCircle2, ShieldCheck, Eye, EyeOff,
  Globe, Link as LinkIcon, Plus, X
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Stepper } from "@/components/ui/stepper"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { RoleToggle } from "@/components/ui/role-toggle"

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
].map(state => ({ label: state, value: state }))
import { registerStudent } from "@/lib/actions/auth"
import { signUpTeacher } from "@/lib/actions/teacher"
import { cn } from "@/lib/utils"

type Role = "student" | "teacher"

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("student")
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form State
  const [formData, setFormData] = useState<any>({
    // Common
    name: "",
    email: "",
    password: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    // Student
    phone: "",
    age: "",
    school: "",
    degree: "",
    subjects: [],
    hobbies: [],
    ambition: "",
    // Teacher
    whatsapp: "",
    city: "",
    state: "",
    country: "India",
    dob: "",
    experience: "",
    qualification: "",
  })

  const studentSteps = ["Basic", "Academic", "Personal", "Social"]
  const teacherSteps = ["Basic", "Location", "Professional", "Social"]
  const currentSteps = role === "student" ? studentSteps : teacherSteps

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleArrayAdd = (field: string, value: string) => {
    if (!value.trim()) return
    if (formData[field].includes(value.trim())) return
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }))
  }

  const handleArrayRemove = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((item: string) => item !== value)
    }))
  }

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, currentSteps.length))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          data.append(key, JSON.stringify(formData[key]))
        } else {
          data.append(key, formData[key])
        }
      })
      data.append("role", role)

      if (role === "student") {
        await registerStudent(data)
        setSuccess(true)
      } else {
        const result = await signUpTeacher(data)
        if (result.success) {
          setSuccess(true)
        } else {
          setError(result.error || "Signup failed")
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col bg-editorial-cream transition-colors duration-500">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="royal-card max-w-md w-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="mx-auto h-20 w-20 bg-green-900/20 flex items-center justify-center rounded-full text-green-400 mb-6"
            >
              <CheckCircle2 className="h-12 w-12" />
            </motion.div>
            <h2 className="text-3xl font-serif text-editorial-cream mb-2">Welcome Aboard!</h2>
            <p className="text-editorial-cream/60 mb-8 text-sm">
              Your {role} profile has been successfully created.
            </p>

            <Link
              href="/login"
              className="w-full inline-block bg-editorial-accent text-editorial-black py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-editorial-cream paper-texture transition-colors duration-500 pb-20">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif text-editorial-black mb-4 tracking-tight"
            >
              Zentor<span className="text-editorial-accent">.</span>
            </motion.h1>
            <p className="text-editorial-black/40 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]">
              Institutional Admission Protocol
            </p>
          </div>

          <Stepper steps={currentSteps} currentStep={step} />

          <div className="royal-card mt-8">
            {step === 1 && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-editorial-accent/60 mb-4 text-center">Select Your Path</p>
                <RoleToggle role={role} setRole={(r) => { setRole(r); setStep(1); }} />
              </div>
            )}

            <form onSubmit={step === currentSteps.length ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${role}-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* STEP 1: BASIC INFO */}
                  {step === 1 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="relative group">
                        <FloatingInput 
                          label="Full Name" 
                          name="name" 
                          required 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          className="peer"
                        />
                      </div>
                      <div className="relative group">
                        <FloatingInput 
                          label="Email Address" 
                          name="email" 
                          type="email" 
                          required 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          className="peer"
                        />
                      </div>
                      <div className="relative group">
                        <FloatingInput 
                          label="Password" 
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={formData.password} 
                          onChange={handleInputChange} 
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
                      {role === "student" ? (
                        <FloatingInput 
                          label="Phone Number (Optional)" 
                          name="phone" 
                          type="tel" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                        />
                      ) : (
                        <FloatingInput 
                          label="WhatsApp Number" 
                          name="whatsapp" 
                          type="tel" 
                          required 
                          value={formData.whatsapp} 
                          onChange={handleInputChange} 
                        />
                      )}
                    </div>
                  )}

                  {/* STEP 2: STUDENT - ACADEMIC / TEACHER - LOCATION */}
                  {step === 2 && role === "student" && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <FloatingInput 
                        label="Age" 
                        name="age" 
                        type="number" 
                        required 
                        value={formData.age} 
                        onChange={handleInputChange} 
                      />
                      <FloatingInput 
                        label="School / College" 
                        name="school" 
                        required 
                        value={formData.school} 
                        onChange={handleInputChange} 
                      />
                      <div className="md:col-span-2">
                        <FloatingInput 
                          label="Standard / Degree" 
                          name="degree" 
                          required 
                          value={formData.degree} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && role === "teacher" && (
                    <div className="grid gap-6 md:grid-cols-3">
                      <FloatingInput 
                        label="City" 
                        name="city" 
                        required 
                        value={formData.city} 
                        onChange={handleInputChange} 
                      />
                      <FloatingSelect 
                        label="State" 
                        name="state" 
                        required 
                        options={indianStates}
                        value={formData.state} 
                        onChange={handleInputChange} 
                      />
                      <FloatingSelect 
                        label="Country" 
                        name="country" 
                        required 
                        options={[
                          { label: "India", value: "India" },
                          { label: "USA", value: "USA" },
                          { label: "UK", value: "UK" },
                          { label: "Canada", value: "Canada" },
                          { label: "Australia", value: "Australia" },
                        ]}
                        value={formData.country} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  )}

                  {/* STEP 3: STUDENT - PERSONAL / TEACHER - PROFESSIONAL */}
                  {step === 3 && role === "student" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent/60">Interested Subjects</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a subject and press Enter..."
                            className="input-floating flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                const val = e.currentTarget.value.trim()
                                if (val) {
                                  handleArrayAdd("subjects", val)
                                  e.currentTarget.value = ""
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.subjects.map((sub: string) => (
                            <span key={sub} className="px-3 py-1 bg-editorial-black/5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              {sub}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => handleArrayRemove("subjects", sub)} />
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent/60">Hobbies (Tags)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add hobby..."
                            className="input-floating flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleArrayAdd("hobbies", e.currentTarget.value)
                                e.currentTarget.value = ""
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.hobbies.map((hobby: string) => (
                            <span key={hobby} className="px-3 py-1 bg-editorial-black/5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              {hobby}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => handleArrayRemove("hobbies", hobby)} />
                            </span>
                          ))}
                        </div>
                      </div>
                      <FloatingInput 
                        label="Ambition" 
                        name="ambition" 
                        required 
                        value={formData.ambition} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  )}

                  {step === 3 && role === "teacher" && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <FloatingInput 
                        label="Date of Birth" 
                        name="dob" 
                        type="date" 
                        required 
                        value={formData.dob} 
                        onChange={handleInputChange} 
                      />
                      <FloatingInput 
                        label="Years of Experience" 
                        name="experience" 
                        type="number" 
                        required 
                        value={formData.experience} 
                        onChange={handleInputChange} 
                      />
                      <div className="md:col-span-2">
                        <FloatingInput 
                          label="Highest Qualification" 
                          name="qualification" 
                          required 
                          value={formData.qualification} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: SOCIAL LINKS */}
                  {step === 4 && (
                    <div className="grid gap-6 md:grid-cols-1">
                      <div className="relative group">
                        <FloatingInput 
                          label="Instagram Profile" 
                          name="instagram" 
                          className="peer" 
                          value={formData.instagram} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="relative group">
                        <FloatingInput 
                          label="Facebook Profile" 
                          name="facebook" 
                          className="peer" 
                          value={formData.facebook} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="relative group">
                        <FloatingInput 
                          label="LinkedIn Profile" 
                          name="linkedin" 
                          className="peer" 
                          value={formData.linkedin} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-xl text-center"
                >
                  {error}
                </motion.p>
              )}

              <div className="mt-10 flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-4 border border-editorial-black/10 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-editorial-black/5 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] py-4 bg-editorial-accent text-editorial-black rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : step === currentSteps.length ? "Complete Admission" : "Continue"}
                  {step < currentSteps.length && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">
            Already registered?{" "}
            <Link href="/login" className="text-editorial-accent border-b border-editorial-accent/20 pb-0.5 hover:border-editorial-accent transition-all">
              Sign In to Portal
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
