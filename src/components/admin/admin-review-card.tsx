"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  User, Mail, Phone, MapPin, Briefcase, 
  FileText, Check, X, ExternalLink, ShieldCheck 
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { updateVerificationStatus } from "@/lib/actions/admin"
import { cn } from "@/lib/utils"

interface AdminReviewCardProps {
  teacher: any
}

export function AdminReviewCard({ teacher }: AdminReviewCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleAction = async (status: "approved" | "rejected") => {
    setIsUpdating(true)
    try {
      await updateVerificationStatus(teacher.id, status)
    } catch (error) {
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-2xl bg-editorial-black/5 flex items-center justify-center">
                <User className="h-8 w-8 text-editorial-black/20" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-editorial-black">{teacher.name}</h3>
                <p className="text-xs font-medium text-editorial-black/40">{teacher.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-editorial-black/[0.02] rounded-xl border border-editorial-black/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/30 mb-1">Qualification</p>
              <p className="text-xs font-medium">{teacher.qualification || teacher.degree}</p>
            </div>
            <div className="p-3 bg-editorial-black/[0.02] rounded-xl border border-editorial-black/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/30 mb-1">Experience</p>
              <p className="text-xs font-medium">{teacher.experience} Years</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/40">Submitted Documents</p>
            <div className="flex flex-wrap gap-3">
              <a 
                href={teacher.resume_url || "#"} 
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-editorial-black/5 rounded-xl text-xs font-bold hover:bg-editorial-black/10 transition-all"
              >
                <FileText className="h-4 w-4" />
                Resume
                <ExternalLink className="h-3 w-3 opacity-30" />
              </a>
              <a 
                href={teacher.id_proof_url || "#"} 
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-editorial-black/5 rounded-xl text-xs font-bold hover:bg-editorial-black/10 transition-all"
              >
                <ShieldCheck className="h-4 w-4" />
                ID Proof
                <ExternalLink className="h-3 w-3 opacity-30" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:w-48 flex flex-col gap-3 justify-center">
          <button
            onClick={() => handleAction("approved")}
            disabled={isUpdating}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Approve
          </button>
          <button
            onClick={() => handleAction("rejected")}
            disabled={isUpdating}
            className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-all disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
