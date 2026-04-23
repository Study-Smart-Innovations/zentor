"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  FileText, Share2, Globe, Link as LinkIcon, Edit3, ShieldCheck,
  Calendar, Save, X
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { VerificationBadge } from "@/components/ui/verification-badge"
import { cn } from "@/lib/utils"
import { updateTeacherProfile } from "@/lib/actions/teacher"

interface TeacherProfileProps {
  user: any
}


export function TeacherProfile({ user }: TeacherProfileProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(user.image || "")

  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    phone_number: user.phone_number || "",
    whatsapp_number: user.whatsapp_number || "",
    location_city: user.location_city || "",
    location_state: user.location_state || "",
    location_country: user.location_country || "",
    dob: user.dob || "",
    experience_years: user.experience_years || "",
    highest_qualification: user.highest_qualification || "",
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
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString())
    })

    if (imageFile) {
      data.append("profile_image", imageFile)
    }

    const res = await updateTeacherProfile(user.user_id, data)
    if (res.success) {
      setIsEditing(false)
      router.refresh()
    } else {
      setError(res.error || "Failed to update profile")
    }
    setIsSaving(false)
  }

  const calculateAge = (dobString: string) => {
    if (!dobString || !mounted) return null
    const birthDate = new Date(dobString)
    if (isNaN(birthDate.getTime())) return null
    
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge(user.dob)

  const inputClass = "w-full bg-transparent border-0 border-b-2 border-editorial-black/10 py-3 text-editorial-black placeholder-editorial-black/25 outline-none focus:border-editorial-accent transition-colors duration-200 font-medium text-sm"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.25em] text-editorial-black/40"

  if (isEditing) {
    return (
      <div className="max-w-6xl mx-auto pb-24">
        {/* Editorial Edit Header */}
        <div className="relative pt-12 pb-10 border-b border-editorial-black/10 mb-12">
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-editorial-accent" />
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-accent">Editing</span>
              <h2 className="text-6xl font-serif text-editorial-black tracking-tighter leading-none">
                Your Profile<span className="text-editorial-accent">.</span>
              </h2>
              <p className="text-editorial-black/40 text-sm font-medium pt-1">All changes are saved to your Zentor identity record.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-6 py-3 border border-editorial-black/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors text-editorial-black/60"
            >
              <X className="h-4 w-4" />
              Discard
            </button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column — Main Fields */}
            <div className="lg:col-span-8 space-y-16">

              {/* Identity */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-editorial-black/30">Identity</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>

                {/* Avatar + Bio row */}
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
                    <label className={labelClass}>Professional Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Share your teaching philosophy, expertise, and what makes you unique..."
                      className="w-full mt-2 bg-transparent border-0 border-b-2 border-editorial-black/10 py-3 text-editorial-black placeholder-editorial-black/20 outline-none focus:border-editorial-accent transition-colors duration-200 font-medium text-sm resize-none h-28 leading-relaxed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input value={user.email || ""} disabled placeholder="your@email.com" className={`${inputClass} opacity-40 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-editorial-black/30">Contact & Location</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+91 00000 00000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp Number</label>
                    <input name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} placeholder="+91 00000 00000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input name="location_city" value={formData.location_city} onChange={handleChange} placeholder="Mumbai" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input name="location_state" value={formData.location_state} onChange={handleChange} placeholder="Maharashtra" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input name="location_country" value={formData.location_country} onChange={handleChange} placeholder="India" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Professional */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-editorial-black/30">Professional Details</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} placeholder="5" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Highest Qualification</label>
                    <input name="highest_qualification" value={formData.highest_qualification} onChange={handleChange} placeholder="e.g. M.Sc. Mathematics, B.Ed." className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Social */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-editorial-black/30">Digital Footprint</span>
                  <div className="h-[1px] flex-1 bg-editorial-black/8" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className={labelClass}>Instagram</label>
                    <input type="url" name="instagram_url" value={formData.instagram_url} onChange={handleChange} placeholder="https://instagram.com/yourhandle" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Facebook</label>
                    <input type="url" name="facebook_url" value={formData.facebook_url} onChange={handleChange} placeholder="https://facebook.com/yourprofile" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>LinkedIn</label>
                    <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" className={inputClass} />
                  </div>
                </div>
              </section>

            </div>

            {/* Right Sidebar — Save Panel */}
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
                    <p>✓ Contact & Location</p>
                    <p>✓ Professional Details</p>
                    <p>✓ Digital Footprint</p>
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs font-bold uppercase">{error}</p>
                  )}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-4 bg-editorial-accent text-editorial-black font-black uppercase tracking-widest text-xs rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSaving ? "Saving Changes..." : "Save All Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-white/60 border border-editorial-black/5 rounded-[32px] space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-editorial-black/30">Note</p>
                  <p className="text-xs text-editorial-black/50 leading-relaxed">
                    Your email address is linked to your Zentor auth account and cannot be changed here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Editorial Header */}
      <div className="relative pt-12 pb-8 border-b border-editorial-black/10">
        <div className="absolute top-0 left-0 w-12 h-[2px] bg-editorial-accent" />
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-accent">Profile Portfolio</span>
              <div className="h-[1px] w-12 bg-editorial-accent/30" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif text-editorial-black tracking-tighter leading-[0.9]"
            >
              {user.full_name}<span className="text-editorial-accent">.</span>
            </motion.h1>

            <div className="min-h-[1.5rem]">
              {mounted && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl"
                >
                  {user.bio ? (
                    <p className="text-lg text-editorial-black/60 italic font-serif leading-relaxed">
                      "{user.bio}"
                    </p>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-editorial-accent text-sm font-bold uppercase tracking-widest hover:underline"
                    >
                      + Add Professional Bio
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-editorial-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-editorial-black/60">
                  {user.location_city}, {user.location_state}
                </span>
              </div>
              {age && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-editorial-accent" />
                  <span suppressHydrationWarning className="text-xs font-bold uppercase tracking-widest text-editorial-black/60">
                    {age} Years Old
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Link href="/teacher/verification">
                  <VerificationBadge status="approved" className="scale-90" />
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
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
            
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-3 px-8 py-4 bg-editorial-black text-white rounded-2xl shadow-xl hover:bg-editorial-accent hover:text-editorial-black transition-all font-bold uppercase tracking-widest text-xs group"
            >
              <Edit3 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              Edit Profile
            </button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 bg-white border border-editorial-black/5 rounded-[32px] space-y-4 shadow-sm"
            >
              <div className="h-12 w-12 bg-editorial-black/5 rounded-2xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-editorial-accent" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Professional Experience</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-serif text-editorial-black">{user.experience_years}</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-editorial-black/30">Years in Field</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 bg-white border border-editorial-black/5 rounded-[32px] space-y-4 shadow-sm"
            >
              <div className="h-12 w-12 bg-editorial-black/5 rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-editorial-accent" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Highest Qualification</p>
                <p className="text-xl font-serif text-editorial-black leading-tight pt-1">{user.highest_qualification}</p>
              </div>
            </motion.div>
          </div>

          {/* Social Presence */}
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
                <a
                  key={social.label}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 bg-white border border-editorial-black/5 rounded-2xl transition-all duration-300",
                    !social.url && "opacity-30 cursor-not-allowed",
                    social.url && social.color + " hover:border-transparent hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  {social.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Contact Details */}
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
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 bg-editorial-cream rounded-xl flex items-center justify-center group-hover:bg-editorial-accent transition-colors">
                  <Phone className="h-4 w-4 text-editorial-black/40 group-hover:text-editorial-black" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-editorial-black/30">Communication</p>
                  <p className="text-xs font-medium text-editorial-black">{user.whatsapp_number || user.phone_number}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
