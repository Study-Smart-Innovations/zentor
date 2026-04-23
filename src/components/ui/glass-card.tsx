"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  initial?: any
  animate?: any
  transition?: any
}

export function GlassCard({ children, className, initial, animate, transition }: GlassCardProps) {
  return (
    <motion.div
      initial={initial || { opacity: 0, y: 20 }}
      animate={animate || { opacity: 1, y: 0 }}
      transition={transition || { duration: 0.5 }}
      className={cn("glass-morphism p-8", className)}
    >
      {children}
    </motion.div>
  )
}
