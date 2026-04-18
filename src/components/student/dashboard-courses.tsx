"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, FileText, Calendar, ArrowRight, User, Star, BookOpen } from "lucide-react";



interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  teacher?: {
    name: string;
  };
  purchased_at?: string;
}

export function EnrolledCoursesGrid({ courses }: { courses: any[] }) {
  if (!courses || courses.length === 0) {
    return (
      <div className="py-24 border border-dashed border-editorial-black/10 flex flex-col items-center justify-center text-center bg-editorial-black/[0.01]">
        <h3 className="text-3xl font-serif text-editorial-black mb-4">No active curriculum</h3>
        <p className="text-editorial-black/40 max-w-sm font-serif italic mb-8">
          You haven't initiated any professional modules yet. Begin your academic journey today.
        </p>
        <Link
          href="/#courses"
          className="flex items-center space-x-3 text-editorial-black font-bold text-xs uppercase tracking-widest hover:underline"
        >
          <span>Discover Modules</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="group flex flex-col border-b border-editorial-black/5 pb-8"
        >
          {/* Thumbnail */}
          <div className="w-full overflow-hidden relative filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 bg-editorial-black/5">
            {course.thumbnail_url ? (
              <img src={course.thumbnail_url} className="w-full h-auto max-h-[250px] object-contain transition-transform duration-1000 group-hover:scale-[1.01]" />
            ) : (
              <div className="h-48 w-full flex items-center justify-center border-b border-editorial-black/5">
                <Play className="h-10 w-10 text-editorial-black/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <div className="h-12 w-12 rounded-full bg-white text-editorial-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                  <Play className="h-4 w-4 fill-current ml-1" />
               </div>
            </div>
          </div>

          <div className="pt-8 flex-1 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-black/40">Mentor:</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-black underline decoration-editorial-black/10 underline-offset-4">{course.teacher?.name || "Premium Faculty"}</span>
              </div>
              {course.access_end && (
                 <div className="flex items-center space-x-2 text-[#C5A059]">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                       Ends: {new Date(course.access_end).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                 </div>
              )}
            </div>

            <h3 className="text-2xl font-serif text-editorial-black mb-4 group-hover:text-[#C5A059] transition-colors leading-tight">{course.title}</h3>
            <p className="line-clamp-2 text-sm text-editorial-black/50 font-serif italic mb-8">{course.description}</p>
            
            <div className="mt-auto pt-6 border-t border-editorial-black/5 flex items-center justify-between">
               <Link href={`/courses/${course.id}`} className="flex items-center space-x-3 text-editorial-black font-bold text-[10px] uppercase tracking-widest group/btn">
                  <span>Resume Curriculum</span>
                  <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function FacultySuggestions({ suggestions }: { suggestions: any[] }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
       {suggestions.map((s, i) => (
          <Link key={s.id} href={`/courses/${s.id}`} className="flex items-center space-x-6 p-6 border border-editorial-black/5 hover:border-editorial-black/20 transition-all group bg-white/40">
             <div className="h-16 w-16 shrink-0 bg-editorial-black/5 overflow-hidden filter grayscale-[0.8] group-hover:grayscale-0 transition-all duration-700">
                {s.thumbnail_url ? (
                   <img src={s.thumbnail_url} alt={s.title} className="h-full w-full object-cover" />
                ) : (
                   <div className="h-full w-full flex items-center justify-center"><BookOpen className="h-5 w-5 text-editorial-black/20" /></div>
                )}
             </div>
             <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-editorial-black/40 mb-1 leading-none italic">Mentor: {s.teacher?.name}</p>
                <p className="font-serif text-base text-editorial-black line-clamp-1 group-hover:text-[#C5A059] transition-colors">{s.title}</p>
             </div>
          </Link>
       ))}
    </div>
  );
}
