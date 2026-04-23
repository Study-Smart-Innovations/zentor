"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full mb-12">
      {steps.map((step, index) => {
        const isCompleted = currentStep > index + 1
        const isActive = currentStep === index + 1

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? "#C5A059" : isActive ? "#002147" : "rgba(197, 160, 89, 0)",
                  borderColor: isCompleted || isActive ? "#C5A059" : "rgba(197, 160, 89, 0.2)",
                  color: isCompleted ? "#002147" : isActive ? "#C5A059" : "rgba(197, 160, 89, 0.4)",
                }}
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-bold transition-all z-10",
                  isActive && "shadow-[0_0_20px_rgba(197,160,89,0.3)] scale-110"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 md:h-5 md:w-5" strokeWidth={3} /> : index + 1}
              </motion.div>
              <span
                className={cn(
                  "absolute -bottom-8 text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors hidden sm:block",
                  isActive ? "text-editorial-black" : "text-editorial-black/30"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 md:mx-4 bg-editorial-accent/20 relative overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  className="absolute inset-0 bg-editorial-accent transition-all duration-500"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
