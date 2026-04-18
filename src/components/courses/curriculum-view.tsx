"use client"

import { useState, useEffect } from "react";
import { Play, FileText, Video, Radio, Clock, ArrowRight, User, BookOpen, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function CourseCurriculum({ course }: { course: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const contents = course.contents || [];

  // Metadata Aggregation
  const totalDuration = contents.reduce((acc: number, item: any) => {
    // Attempt to parse out numbers from strings like "45 mins" or "1.5 hours"
    // This is a simple heuristic; and we'll show the raw sum message
    const d = parseFloat(item.duration) || 0;
    return acc + d;
  }, 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (contents.length === 0) {
    return (
      <div className="rounded-[3rem] border-2 border-dashed border-foreground/10 p-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-foreground/5 text-foreground/20 mb-8">
          <BookOpen className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-black text-black">Curriculum Pending</h3>
        <p className="text-black mt-4 max-w-sm mx-auto font-medium leading-relaxed">
          The faculty is currently finalizing the modules for this course. Please check back shortly for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-3">

      {/* Sidebar: Course Overview */}
      <div className="lg:col-span-1 space-y-10">
        <div>
          <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tight">Curriculum</h2>
          <p className="text-black font-medium leading-relaxed">
            Master each module at your own pace. All materials are updated for the <span className="text-primary-blue font-black">{new Date().getFullYear()} Academic Year</span>.
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-foreground/[0.03] border border-foreground/5 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-black uppercase tracking-widest">Total Modules</span>
            <span className="text-sm font-black text-black">{contents.length} Items</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-black uppercase tracking-widest">Est. Duration</span>
            <span className="text-sm font-black text-black">{totalDuration > 0 ? `${totalDuration} Hours` : "As specified below"}</span>
          </div>
          <div className="pt-6 border-t border-foreground/5 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary-blue/10 flex items-center justify-center text-primary-blue">
              <Star className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main: Module List */}
      <div className="lg:col-span-2 space-y-6">
        {contents.map((item: any, i: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="flex items-center space-x-6 p-8 rounded-3xl bg-white dark:bg-foreground/[0.03] border border-foreground/5 shadow-xl hover:border-primary-blue/30 transition-all group cursor-pointer"
          >
            <div className="h-16 w-16 rounded-2xl bg-primary-blue/5 flex items-center justify-center text-primary-blue shadow-inner shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-all">
              {getContentIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-[9px] font-black uppercase tracking-widest text-black">{item.type}</span>
                </div>
                {item.duration && (
                  <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">{item.duration}</span>
                )}
              </div>
              <h4 className="font-black text-black text-xl line-clamp-1 uppercase tracking-tight">{item.title}</h4>
              {item.description && (
                <p className="text-sm font-medium text-black line-clamp-1">{item.description}</p>
              )}
            </div>

            <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-black group-hover:bg-primary-blue/10 group-hover:text-primary-blue transition-all">
              <Play className="h-6 w-6 ml-1" />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

function getContentIcon(type: string) {
  switch (type) {
    case 'video':
      return <Video className="h-7 w-7" />;
    case 'note':
      return <FileText className="h-7 w-7" />;
    case 'live':
      return <Radio className="h-7 w-7" />;
    default:
      return <Play className="h-7 w-7" />;
  }
}
