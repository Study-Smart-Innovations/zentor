"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  User, Mail, Phone, GraduationCap, BookOpen, Heart,
  Rocket, Share2, Globe, Link as LinkIcon, Edit3, X,
  MapPin, Calendar, Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { updateStudentProfile } from "@/lib/actions/student"

interface StudentProfileProps {
  user: any
}

export function StudentProfile({ user }: StudentProfileProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(user.image || "")

  useEffect(() => { setMounted(true) }, [])

  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    phone_number: user.phone_number || "",
    age: user.age || "",
    school_or_college: user.school_or_college || "",
    standard_or_degree: user.standard_or_degree || "",
    interested_subjects: user.interested_subjects || "",
    hobbies: user.hobbies || "",
    ambition: user.ambition || "",
    instagram_url: user.instagram_url || "",
    facebook_url: user.facebook_url || "",
    linkedin_url: user.linkedin_url || "",
    bio: user.bio || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => data.append(key, value.toString()))
    if (imageFile) data.append("profile_image", imageFile)
    const res = await updateStudentProfile(user.user_id, data)
    if (res.success) {
      setIsEditing(false)
      router.refresh()
    } else {
      setError(res.error || "Failed to update profile")
    }
    setIsSaving(false)
  }

  const parseTags = (value: string): string[] => {
    if (!value) return []
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map((s: string) => s.trim()).filter(Boolean)
    } catch {}
    return value.split(",").map((s: string) => s.trim()).filter(Boolean)
  }

  const subjectTags = parseTags(user.interested_subjects)
  const hobbyTags = parseTags(user.hobbies)

  const inputClass = "w-full bg-transparent border-0 border-b-2 border-editorial-black/10 py-3 text-editorial-black placeholder-editorial-black/25 outline-none focus:border-editorial-accent transition-colors duration-200 font-medium text-sm"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.25em] text-editorial-black/40"

  // ── EDIT MODE ──────────────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="max-w-6xl mx-auto pb-24">
        <div className="relative pt-12 pb-10 border-b border-editorial-black/10 mb-12">
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-editorial-accent" />
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-accent">Editing</span>
              <h2 className="text-6xl font-serif text-editorial-black tracking-tighter leading-none">
                Your Profile<span className="text-editorial-accent">.</span>
              </h2>
              <p className="text-editorial-black/40 text-sm font-medium pt-1">Changes are saved to your Zentor student record.</p>
            </div>
            <button type="button" onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-6 py-3 border border-editorial-black/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors text-editorial-black/60">
              <X className="h-4 w-4" /> Discard
            </button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left — Fields */}
            <div className="lg:col-span-8 space-y-16">

              {/* Identity */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className={labelClass}>Identity</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>
                <div className="flex gap-8 items-start">
                  <div className="relative shrink-0">
                    <div className="h-28 w-28 rounded-[24px] overflow-hidden bg-editorial-cream border border-editorial-black/8 flex items-center justify-center shadow-sm">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-12 w-12 text-editorial-black/10" />
                      )}
                    </div>
                    <label className="absolute -bottom-3 -right-3 p-2.5 bg-editorial-black text-white rounded-xl cursor-pointer hover:bg-editorial-accent hover:text-editorial-black transition-all shadow-lg">
                      <Edit3 className="h-3.5 w-3.5" />
                      <input type="file" name="profile_image" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Bio / About Me</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange}
                      placeholder="Share a little about yourself, your goals and passions..."
                      className="w-full mt-2 bg-transparent border-0 border-b-2 border-editorial-black/10 py-3 text-editorial-black placeholder-editorial-black/20 outline-none focus:border-editorial-accent transition-colors duration-200 font-medium text-sm resize-none h-28 leading-relaxed" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input value={user.email || ""} disabled className={`${inputClass} opacity-40 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+91 00000 00000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 17" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Academic */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className={labelClass}>Academic Details</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className={labelClass}>School / College</label>
                    <input name="school_or_college" value={formData.school_or_college} onChange={handleChange} placeholder="e.g. Delhi Public School" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Grade / Degree</label>
                    <input name="standard_or_degree" value={formData.standard_or_degree} onChange={handleChange} placeholder="e.g. Class 12 / B.Sc." className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Interested Subjects</label>
                    <input name="interested_subjects" value={formData.interested_subjects} onChange={handleChange}
                      placeholder="Comma-separated, e.g. Mathematics, Physics, Chemistry" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Hobbies</label>
                    <input name="hobbies" value={formData.hobbies} onChange={handleChange}
                      placeholder="Comma-separated, e.g. Reading, Music, Football" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Ambition */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className={labelClass}>Ambition</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>
                <div>
                  <label className={labelClass}>Your Dream / Goal</label>
                  <textarea name="ambition" value={formData.ambition} onChange={handleChange}
                    placeholder="What do you want to become? What drives you?"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-editorial-black/10 py-3 text-editorial-black placeholder-editorial-black/20 outline-none focus:border-editorial-accent transition-colors duration-200 font-medium text-sm resize-none h-24 leading-relaxed" />
                </div>
              </section>

              {/* Digital Footprint */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className={labelClass}>Digital Footprint</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className={labelClass}>Instagram</label>
                    <input type="url" name="instagram_url" value={formData.instagram_url} onChange={handleChange}
                      placeholder="https://instagram.com/yourhandle" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Facebook</label>
                    <input type="url" name="facebook_url" value={formData.facebook_url} onChange={handleChange}
                      placeholder="https://facebook.com/yourprofile" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>LinkedIn</label>
                    <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourname" className={inputClass} />
                  </div>
                </div>
              </section>
            </div>

            {/* Right — Save Panel */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <div className="p-8 bg-editorial-black rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-editorial-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Status</p>
                    <h3 className="text-2xl font-serif">Profile Editor</h3>
                  </div>
                  <div className="py-6 border-y border-white/10 space-y-3 text-[11px] font-bold uppercase tracking-widest opacity-50">
                    <p>✓ Identity</p>
                    <p>✓ Academic Details</p>
                    <p>✓ Ambition</p>
                    <p>✓ Digital Footprint</p>
                  </div>
                  {error && <p className="text-red-400 text-xs font-bold uppercase">{error}</p>}
                  <div className="space-y-3">
                    <button type="submit" disabled={isSaving}
                      className="w-full py-4 bg-editorial-accent text-editorial-black font-black uppercase tracking-widest text-xs rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50">
                      {isSaving ? "Saving Changes..." : "Save All Changes"}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-white/60 border border-editorial-black/5 rounded-[32px] space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-editorial-black/30">Note</p>
                  <p className="text-xs text-editorial-black/50 leading-relaxed">
                    Your email is linked to your Zentor auth account and cannot be changed here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Editorial Header */}
      <div className="relative pt-12 pb-8 border-b border-editorial-black/10">
        <div className="absolute top-0 left-0 w-12 h-[2px] bg-editorial-accent" />
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-accent">Student Portfolio</span>
              <div className="h-[1px] w-12 bg-editorial-accent/30" />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif text-editorial-black tracking-tighter leading-[0.9]">
              {user.full_name}<span className="text-editorial-accent">.</span>
            </motion.h1>

            <div className="min-h-[1.5rem]">
              {mounted && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-xl">
                  {user.bio ? (
                    <p className="text-lg text-editorial-black/60 italic font-serif leading-relaxed">"{user.bio}"</p>
                  ) : (
                    <button onClick={() => setIsEditing(true)}
                      className="text-editorial-accent text-sm font-bold uppercase tracking-widest hover:underline">
                      + Add Personal Bio
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-6 pt-4">
              {user.school_or_college && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-editorial-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-editorial-black/60">{user.school_or_college}</span>
                </div>
              )}
              {user.standard_or_degree && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-editorial-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-editorial-black/60">{user.standard_or_degree}</span>
                </div>
              )}
              {user.age && mounted && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-editorial-accent" />
                  <span suppressHydrationWarning className="text-xs font-bold uppercase tracking-widest text-editorial-black/60">{user.age} Years Old</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Avatar + Edit button */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-editorial-accent/5 rounded-[40px] blur-2xl group-hover:bg-editorial-accent/10 transition-all duration-700" />
              <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-[32px] overflow-hidden border border-editorial-black/5 bg-white p-2 shadow-2xl">
                <div className="h-full w-full rounded-[24px] overflow-hidden bg-editorial-cream flex items-center justify-center">
                  {user.image ? (
                    <img src={user.image} alt={user.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-24 w-24 text-editorial-black/10" />
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => setIsEditing(true)}
              className="flex items-center gap-3 px-8 py-4 bg-editorial-black text-white rounded-2xl shadow-xl hover:bg-editorial-accent hover:text-editorial-black transition-all font-bold uppercase tracking-widest text-xs group">
              <Edit3 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              Edit Profile
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left — Academic */}
        <div className="lg:col-span-8 space-y-12">

          {/* Ambition */}
          {user.ambition && (
            <motion.div whileHover={{ y: -2 }} className="p-8 bg-editorial-black rounded-[40px] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-editorial-accent/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="h-6 w-6 text-editorial-accent" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">The Ambition</p>
              <p className="text-xl font-serif italic opacity-80 leading-relaxed">"{user.ambition}"</p>
            </motion.div>
          )}

          {/* Subjects + Hobbies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjectTags.length > 0 && (
              <div className="p-8 bg-white border border-editorial-black/5 rounded-[32px] space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-editorial-black/5 rounded-2xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-editorial-accent" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Subjects</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjectTags.map((sub: string) => (
                    <span key={sub} className="px-4 py-1.5 bg-editorial-black/5 rounded-full text-xs font-bold uppercase tracking-widest text-editorial-black/60">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hobbyTags.length > 0 && (
              <div className="p-8 bg-white border border-editorial-black/5 rounded-[32px] space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-editorial-black/5 rounded-2xl flex items-center justify-center">
                    <Heart className="h-5 w-5 text-editorial-accent" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Hobbies</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hobbyTags.map((hobby: string) => (
                    <span key={hobby} className="px-4 py-1.5 bg-editorial-accent/10 rounded-full text-xs font-bold uppercase tracking-widest text-editorial-black/60">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Digital Footprint */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-editorial-black/30 flex items-center gap-4">
              Digital Footprint
              <div className="h-[1px] flex-1 bg-editorial-black/5" />
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Share2 className="h-5 w-5" />, label: "Instagram", url: user.instagram_url, color: "hover:bg-pink-50 hover:text-pink-600" },
                { icon: <Globe className="h-5 w-5" />, label: "Facebook", url: user.facebook_url, color: "hover:bg-blue-50 hover:text-blue-600" },
                { icon: <LinkIcon className="h-5 w-5" />, label: "LinkedIn", url: user.linkedin_url, color: "hover:bg-cyan-50 hover:text-cyan-700" },
              ].map((social) => (
                <a key={social.label} href={social.url || "#"} target="_blank" rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 bg-white border border-editorial-black/5 rounded-2xl transition-all duration-300",
                    !social.url && "opacity-30 cursor-not-allowed",
                    social.url && social.color + " hover:border-transparent hover:shadow-lg hover:-translate-y-1"
                  )}>
                  {social.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 bg-white border border-editorial-black/5 rounded-[40px] space-y-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-editorial-black/30">Direct Access</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 bg-editorial-cream rounded-xl flex items-center justify-center group-hover:bg-editorial-accent transition-colors">
                  <Mail className="h-4 w-4 text-editorial-black/40 group-hover:text-editorial-black" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-editorial-black/30">Email Address</p>
                  <p className="text-xs font-medium text-editorial-black">{user.email || "Not Linked"}</p>
                </div>
              </div>
              {user.phone_number && (
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="h-10 w-10 bg-editorial-cream rounded-xl flex items-center justify-center group-hover:bg-editorial-accent transition-colors">
                    <Phone className="h-4 w-4 text-editorial-black/40 group-hover:text-editorial-black" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-editorial-black/30">Phone</p>
                    <p className="text-xs font-medium text-editorial-black">{user.phone_number}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
