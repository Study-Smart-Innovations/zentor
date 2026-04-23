"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="relative pt-2">
        <input
          className={cn("input-floating", className)}
          ref={ref}
          placeholder=" "
          {...props}
        />
        <label className="label-floating">{label}</label>
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
