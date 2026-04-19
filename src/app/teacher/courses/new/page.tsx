"use client"

import { CourseForm } from "@/components/teacher/course-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NewCoursePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-4 mb-4">
        <Link 
          href="/teacher/dashboard"
          className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-primary-blue hover:bg-primary-blue/5 transition-all shrink-0"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-editorial-black tracking-tight">Create New Course</h1>
          <p className="text-editorial-black/60 text-xs md:text-sm font-medium">Define your course basics to get started.</p>
        </div>
      </div>

      <CourseForm />
    </motion.div>
  );
}
