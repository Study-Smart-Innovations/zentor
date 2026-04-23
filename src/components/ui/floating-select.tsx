"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { label: string; value: string }[]
}

const FloatingSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="relative pt-2">
        <select
          className={cn("input-floating appearance-none cursor-pointer", className)}
          ref={ref}
          {...props}
        >
          <option value="" disabled hidden></option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-editorial-black text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <label className={cn(
          "label-floating",
          props.value ? "top-1 text-[10px] font-bold uppercase tracking-widest text-editorial-accent" : "top-4 text-sm font-medium normal-case tracking-normal text-editorial-accent/40"
        )}>
          {label}
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/4 pointer-events-none">
          <svg className="h-4 w-4 text-editorial-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }
)
FloatingSelect.displayName = "FloatingSelect"

export { FloatingSelect }
