"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import { CourseForm } from "./course-form";

interface CourseSettingsModalProps {
  course: any;
}

export function CourseSettingsModal({ course }: CourseSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="h-16 px-10 bg-editorial-black text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center space-x-3 transition-all hover:bg-editorial-black/90 active:scale-95"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-background rounded-[3rem] shadow-2xl border border-foreground/10 overflow-hidden"
            >
              <div className="p-8 lg:p-12">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-8 right-8 h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/10 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <CourseForm 
                  course={course} 
                  onSuccess={() => {
                    setIsOpen(false);
                    // Page will revalidate via server action
                  }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
