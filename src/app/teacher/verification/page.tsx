"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Upload, FileText, CheckCircle2, AlertCircle, 
  Clock, ArrowLeft, ShieldCheck, ShieldAlert,
  ChevronRight, Download, X
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

export default function VerificationCenter() {
  const [status, setStatus] = useState<"unverified" | "pending" | "approved" | "rejected">("approved")
  const [files, setFiles] = useState<{ resume: File | null; idProof: File | null }>({
    resume: null,
    idProof: null,
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (type: "resume" | "idProof", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFiles(prev => ({ ...prev, [type]: file }))
  }

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      setStatus("pending")
    }, 2000)
  }

  const timeline = [
    { date: "Oct 20, 2023", event: "Profile Created", status: "completed" },
    { date: "Oct 21, 2023", event: "Documents Uploaded", status: status === "unverified" ? "pending" : "completed" },
    { date: "Pending", event: "Review in Progress", status: status === "pending" ? "active" : status === "approved" || status === "rejected" ? "completed" : "upcoming" },
    { date: "Final Result", event: "Verification Result", status: status === "approved" ? "completed" : status === "rejected" ? "failed" : "upcoming" },
  ]

  return (
    <main className="min-h-screen bg-editorial-cream dark:bg-black transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
        <Link 
          href="/teacher/dashboard" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40 dark:text-white/40 hover:text-editorial-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-8">
            <header>
              <h1 className="text-4xl font-serif text-editorial-black dark:text-white mb-2">Verification Center</h1>
              <p className="text-sm text-editorial-black/60 dark:text-white/60">Complete your professional verification to gain access to all platform features.</p>
            </header>

            {status === "unverified" && (
              <GlassCard className="space-y-8 border-2 border-primary/20">
                <div className="grid gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/40 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Professional Resume (PDF)
                    </label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => handleFileChange("resume", e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={cn(
                        "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all",
                        files.resume ? "border-green-400 bg-green-50/50" : "border-editorial-black/10 group-hover:border-primary/40 bg-editorial-black/5"
                      )}>
                        {files.resume ? (
                          <>
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                            <p className="text-xs font-bold text-green-700">{files.resume.name}</p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-editorial-black/20" />
                            <div className="text-center">
                              <p className="text-xs font-bold">Drop your resume here</p>
                              <p className="text-[10px] text-editorial-black/40 uppercase tracking-widest mt-1">Maximum size 5MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/40 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Identity Proof (Aadhar / Passport / License)
                    </label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={(e) => handleFileChange("idProof", e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={cn(
                        "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all",
                        files.idProof ? "border-green-400 bg-green-50/50" : "border-editorial-black/10 group-hover:border-primary/40 bg-editorial-black/5"
                      )}>
                        {files.idProof ? (
                          <>
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                            <p className="text-xs font-bold text-green-700">{files.idProof.name}</p>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-10 w-10 text-editorial-black/20" />
                            <div className="text-center">
                              <p className="text-xs font-bold">Upload Government ID</p>
                              <p className="text-[10px] text-editorial-black/40 uppercase tracking-widest mt-1">Image or PDF</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!files.resume || !files.idProof || isUploading}
                  className="w-full py-4 bg-editorial-black dark:bg-white dark:text-black text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading Credentials...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Submit for Verification
                    </>
                  )}
                </button>
              </GlassCard>
            )}

            {status === "pending" && (
              <GlassCard className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="mx-auto h-20 w-20 bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center rounded-full text-yellow-600 mb-6"
                >
                  <Clock className="h-10 w-10" />
                </motion.div>
                <h3 className="text-2xl font-serif text-editorial-black dark:text-white mb-2">Review in Progress</h3>
                <p className="text-sm text-editorial-black/60 dark:text-white/60 max-w-sm mx-auto">
                  Our academic excellence committee is currently reviewing your credentials. This usually takes 24-48 hours.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <div className="px-6 py-3 bg-editorial-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                    Reference ID: #ZNT-{Math.floor(Math.random() * 1000000)}
                  </div>
                </div>
              </GlassCard>
            )}

            {status === "approved" && (
              <GlassCard className="text-center py-12 border-2 border-green-500/20">
                <div className="mx-auto h-20 w-20 bg-green-100 dark:bg-green-900/20 flex items-center justify-center rounded-full text-green-600 mb-6">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-serif text-editorial-black dark:text-white mb-2">Verification Approved</h3>
                <p className="text-sm text-editorial-black/60 dark:text-white/60 mb-8">
                  You are now a verified member of the Zentor academic community.
                </p>
                <Link
                  href="/teacher/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-editorial-black dark:bg-white dark:text-black text-white rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  Return to Portal
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </GlassCard>
            )}
          </div>

          <aside className="w-full md:w-80 space-y-8">
            <GlassCard>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/40 mb-6">Verification Timeline</h4>
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i < timeline.length - 1 && (
                      <div className={cn(
                        "absolute left-[11px] top-6 w-[2px] h-full bg-editorial-black/5",
                        item.status === "completed" && "bg-primary/20"
                      )} />
                    )}
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10",
                      item.status === "completed" ? "bg-primary text-white" : 
                      item.status === "active" ? "bg-primary/20 text-primary border-2 border-primary" :
                      item.status === "failed" ? "bg-red-500 text-white" :
                      "bg-editorial-black/5 text-editorial-black/20"
                    )}>
                      {item.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : 
                       item.status === "active" ? <Clock className="h-3 w-3" /> :
                       item.status === "failed" ? <X className="h-3 w-3" /> :
                       <div className="h-1 w-1 bg-current rounded-full" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-editorial-black dark:text-white">{item.event}</p>
                      <p className="text-[10px] opacity-40 font-medium">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="p-6 bg-gradient-to-br from-editorial-black to-editorial-black/80 rounded-3xl text-white">
              <AlertCircle className="h-6 w-6 text-editorial-accent mb-4" />
              <h4 className="text-sm font-serif mb-2">Why Verify?</h4>
              <ul className="text-[10px] space-y-2 opacity-70 font-medium uppercase tracking-wider">
                <li>• Trust badge on profile</li>
                <li>• Higher search ranking</li>
                <li>• Direct payment processing</li>
                <li>• Access to exam portals</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
