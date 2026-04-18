"use client"

import { useState, useEffect } from "react";
import { Search, Loader2, Sparkles, User, Play, ArrowRight, ShieldCheck, AlertCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchSmart } from "@/lib/actions/student";
import Link from "next/link";

export function SmartSearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);

  const idMatch = query.match(/\d{6}/);
  const teacherIdDetected = idMatch ? idMatch[0] : null;

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoading(true);
        const data = await searchSmart(query);
        setResults(data?.courses || []);
        setTeacherProfile((data as any)?.teacher || null);
        setIsLoading(false);
        setHasSearched(true);
      } else {
        setResults([]);
        setTeacherProfile(null);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="relative">
      <div className="mx-auto max-w-5xl">

        {/* Search Container */}
        <div className="relative group">
          <div className="relative flex items-center">
            <Search className="absolute left-0 h-5 w-5 text-editorial-black/20 group-focus-within:text-editorial-black transition-colors" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all courses..."
              className="w-full h-24 pl-12 pr-12 bg-transparent border-b border-editorial-black/10 text-2xl font-serif italic text-editorial-black outline-none transition-all focus:border-editorial-black placeholder:text-editorial-black/20"
            />

            <div className="absolute right-0 flex items-center">
              {isLoading && (
                <Loader2 className="h-5 w-5 text-editorial-black/40 animate-spin" />
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-black tracking-[0.3em] text-editorial-black/20">
            <span>Search Courses</span>
            <span>Type to find lessons</span>
          </div>
        </div>

        {/* Input Helper */}
        <div className="mt-8 flex items-center gap-6">
          <AnimatePresence>
            {teacherIdDetected ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center space-x-3"
              >
                <div className="h-2 w-2 rounded-full bg-editorial-black" />
                <span className="text-[10px] font-bold text-editorial-black uppercase tracking-[0.2em]">Teacher ID Detected: {teacherIdDetected}</span>
              </motion.div>
            ) : query.length > 0 && !teacherIdDetected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="h-2 w-2 rounded-full bg-editorial-black/20" />
                <span className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-[0.2em]">Enter 6-digit ID to unlock results</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.8 }}
              className="mt-20"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-serif text-editorial-black">
                  Results
                </h3>
                <span className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-[0.3em]">
                  {teacherProfile && results.length === 0 ? 1 : results.length} Matches Found
                </span>
              </div>

              {/* Teacher Profile Card */}
              {teacherProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-16 p-12 border border-editorial-black/5 bg-editorial-black/[0.01] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8">
                    <ShieldCheck className="h-12 w-12 text-[#C5A059]/10" />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-1 w-8 bg-[#C5A059]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">Verified Teacher</span>
                      </div>

                      <h4 className="text-5xl font-serif text-editorial-black tracking-tight italic">
                        {teacherProfile.name}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                        <div>
                          <p className="text-[10px] font-black text-editorial-black/20 uppercase tracking-widest mb-1">Subject</p>
                          <p className="text-sm font-bold text-editorial-black">{teacherProfile.specialization}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-editorial-black/20 uppercase tracking-widest mb-1">Credentials</p>
                          <p className="text-sm font-bold text-editorial-black">{teacherProfile.degree}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-editorial-black/20 uppercase tracking-widest mb-1">Experience</p>
                          <p className="text-sm font-bold text-editorial-black">{teacherProfile.experience} Years</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-editorial-black/20 uppercase tracking-widest mb-1">Rating</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-[#C5A059] fill-[#C5A059]" />
                            <span className="text-sm font-bold text-editorial-black">{teacherProfile.rating || "5.0"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {results.length > 0 ? (
                <div className="grid gap-12 md:grid-cols-2">
                  {results.map((course) => (
                    <motion.div
                      key={course.id}
                      className="group flex items-start space-x-8 pb-8 border-b border-editorial-black/5"
                    >
                      <div className="h-24 w-24 shrink-0 bg-editorial-black/5 filter grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
                        {course.banner_url || course.thumbnail_url ? (
                          <img
                            src={course.banner_url || course.thumbnail_url}
                            alt={course.title}
                            className="h-full w-full object-contain transition-transform duration-1000 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-white/40"><Play className="h-6 w-6 text-editorial-black/10" /></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Teacher:</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-black underline decoration-editorial-black/10 underline-offset-4">
                            {course.teacher?.name}
                          </span>
                        </div>

                        <h4 className="font-serif text-xl text-editorial-black mb-3 group-hover:text-[#C5A059] transition-colors leading-tight">
                          {course.title}
                        </h4>

                        <p className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest">
                          {course.is_free ? "Complimentary" : `₹${course.offered_price || course.price}`} Account Access
                        </p>
                      </div>

                      <Link
                        href={`/courses/${course.id}`}
                        className="h-10 w-10 shrink-0 flex items-center justify-center text-editorial-black/20 group-hover:text-editorial-black transition-colors"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-24 border border-dashed border-editorial-black/10 flex flex-col items-center justify-center text-center bg-editorial-black/[0.01]">
                  <p className="text-xl font-serif italic text-editorial-black/40 uppercase">
                    No registry match for this entry.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}