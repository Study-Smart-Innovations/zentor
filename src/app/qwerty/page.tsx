"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Mail, Phone, Calendar, ShieldCheck, Download, RefreshCw } from "lucide-react"
import { getWaitlistEntries } from "@/lib/actions/waitlist"

export default function AdminRSVPPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchData = async () => {
    setIsLoading(true)
    const result = await getWaitlistEntries()
    if (result.success) {
      setEntries(result.data || [])
    } else {
      setError(result.error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const exportCSV = () => {
    const headers = ["Date", "Name", "Email", "Phone", "Role"]
    const rows = entries.map(entry => [
      new Date(entry.created_at).toLocaleDateString(),
      entry.full_name,
      entry.email,
      entry.phone_number,
      entry.role
    ])
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `zentor_waitlist_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="min-h-screen bg-editorial-cream selection:bg-editorial-black selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-editorial-black/5 bg-white/50 backdrop-blur-md sticky top-0 z-10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-editorial-black flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#C5A059]" />
              Zentor Registry Control
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-editorial-black/30 mt-1">
              Internal RSVP Management System
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="p-3 rounded-full hover:bg-editorial-black/5 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 text-editorial-black/60 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 bg-editorial-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-8 bg-white border border-editorial-black/5 shadow-sm space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Total RSVP</p>
            <p className="text-4xl font-serif text-editorial-black">{entries.length}</p>
          </div>
          <div className="p-8 bg-white border border-editorial-black/5 shadow-sm space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Students</p>
            <p className="text-4xl font-serif text-[#C5A059]">{entries.filter(e => e.role === 'student').length}</p>
          </div>
          <div className="p-8 bg-white border border-editorial-black/5 shadow-sm space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Teachers</p>
            <p className="text-4xl font-serif text-editorial-black/60">{entries.filter(e => e.role === 'teacher').length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-editorial-black/5 shadow-2xl overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-editorial-black/[0.02] border-b border-editorial-black/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Joined On</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Email</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Phone</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-editorial-black/40">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-black/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="h-8 w-8 text-[#C5A059] animate-spin" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/30">Syncing Registry...</p>
                      </div>
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-editorial-black/40 italic font-serif">No RSVP records found in the registry.</p>
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={entry.id} 
                      className="hover:bg-editorial-black/[0.01] transition-colors group"
                    >
                      <td className="px-8 py-6 text-[11px] font-medium text-editorial-black/40">
                        {new Date(entry.created_at).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-editorial-black font-serif">
                        {entry.full_name}
                      </td>
                      <td className="px-8 py-6 text-sm text-editorial-black/70">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 opacity-20" />
                          {entry.email}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-editorial-black/70">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 opacity-20" />
                          {entry.phone_number || "—"}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          entry.role === 'teacher' 
                            ? 'bg-editorial-black text-white' 
                            : 'bg-[#C5A059]/10 text-[#C5A059]'
                        }`}>
                          {entry.role}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
