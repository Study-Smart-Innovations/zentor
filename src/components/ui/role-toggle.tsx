"use client"

import { motion } from "framer-motion"
import { GraduationCap, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleToggleProps {
  role: "student" | "teacher"
  setRole: (role: "student" | "teacher") => void
}

export function RoleToggle({ role, setRole }: RoleToggleProps) {
  return (
    <div className="flex p-1 bg-black/40 border border-editorial-accent/20 rounded-full mb-8 relative overflow-hidden">
      <motion.div
        className="absolute inset-y-1 bg-editorial-accent rounded-full shadow-lg z-0"
        initial={false}
        animate={{
          x: role === "student" ? 0 : "100%",
          width: "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        type="button"
        onClick={() => setRole("student")}
        className={cn(
          "flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest relative z-10 transition-all duration-300",
          role === "student" ? "text-editorial-black" : "text-editorial-accent/40 hover:text-editorial-accent/60"
        )}
      >
        <GraduationCap className={cn("h-4 w-4 transition-transform", role === "student" && "scale-110")} />
        Student
      </button>
      <button
        type="button"
        onClick={() => setRole("teacher")}
        className={cn(
          "flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest relative z-10 transition-all duration-300",
          role === "teacher" ? "text-editorial-black" : "text-editorial-accent/40 hover:text-editorial-accent/60"
        )}
      >
        <UserCircle className={cn("h-4 w-4 transition-transform", role === "teacher" && "scale-110")} />
        Teacher
      </button>
    </div>
  )
}
