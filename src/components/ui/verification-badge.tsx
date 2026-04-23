"use client"

import { ShieldCheck, ShieldAlert, ShieldX, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type VerificationStatus = "pending" | "approved" | "rejected" | "unverified"

interface VerificationBadgeProps {
  status: VerificationStatus
  className?: string
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    unverified: "bg-gray-100 text-gray-700 border-gray-200",
  }

  const icons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    approved: <ShieldCheck className="h-3 w-3 mr-1" />,
    rejected: <ShieldX className="h-3 w-3 mr-1" />,
    unverified: <ShieldAlert className="h-3 w-3 mr-1" />,
  }

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
        styles[status],
        className
      )}
    >
      {icons[status]}
      {status}
    </div>
  )
}
