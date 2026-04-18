"use client"

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Book,
  Video,
  FileText,
  Calendar,
  ArrowRight,
  Search,
  Sparkles,
  SearchX,
  PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  is_free: boolean;
  thumbnail_url: string | null;
  banner_url: string | null;
  offered_price: number;
  counts: {
    videos: number;
    notes: number;
    live: number;
  };
}

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const searchTokens = search.toLowerCase().trim().split(/\s+/);

    return courses.filter(c => {
      const title = c.title.toLowerCase();
      const description = c.description?.toLowerCase() || "";

      // Smart matching: Every token must be present in either title or description
      return searchTokens.every(token =>
        title.includes(token) || description.includes(token)
      );
    });
  }, [courses, search]);

  if (!isMounted) return null;

  return (
    <div className="pt-16 space-y-16" suppressHydrationWarning>
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif text-black flex items-center gap-6">
            Your Courses
            <span className="h-6 px-3 border border-black/10 text-black/40 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center rounded-full">
              {courses.length} Total Modules
            </span>
          </h2>
          <p className="text-black/40 font-serif italic text-sm">Manage and refine your academic offerings.</p>
        </div>

        <div className="relative w-full lg:w-[450px] group">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-black/20 transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search your modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-b border-black/10 py-4 pl-10 pr-12 text-base font-serif italic font-medium outline-none transition-all focus:border-black text-black placeholder:text-black/20 focus:bg-black/[0.02] px-4"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-black/20 hover:text-black transition-colors"
            >
              <SearchX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 transition-all duration-700">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-32 border border-dashed border-editorial-black/10 flex flex-col items-center justify-center text-center bg-editorial-black/[0.01]">
            <h3 className="text-3xl font-serif text-editorial-black mb-4">
              {search ? "No results found" : "Your curriculum is empty"}
            </h3>
            <p className="text-editorial-black/40 dark:text-white/40 max-w-sm font-serif italic mb-8">
              {search
                ? "We couldn't find any modules matching your query."
                : "Begin your journey as a mentor. Create your first high-quality module."}
            </p>
            {!search && (
              <Link
                href="/teacher/courses/new"
                className="flex items-center space-x-3 text-editorial-black dark:text-white font-bold text-xs uppercase tracking-widest hover:underline"
              >
                <span>Create first module</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="opacity-100 transition-all duration-500">
              <Link
                href={`/teacher/courses/${course.id}/manage`}
                className="group flex flex-col transition-all h-full"
              >
                <div className="relative h-72 lg:h-80 w-full bg-editorial-black/5 overflow-hidden filter grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
                  {course.banner_url || course.thumbnail_url ? (
                    <img
                      src={(course.banner_url || course.thumbnail_url) as string}
                      alt={course.title}
                      className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center dark:bg-editorial-black/20 border-b border-editorial-black/5">
                      <Book className="h-10 w-10 text-editorial-black/10" />
                    </div>
                  )}
                </div>
                <div className="py-8 flex-1 flex flex-col">
                  <div className="mb-4 inline-flex">
                    <span className="bg-editorial-black px-3 py-1 text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-sm">
                      {course.is_free ? "Complimentary" : `₹${course.offered_price || course.price}`}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif text-black mb-3 group-hover:text-[#C5A059] transition-colors">{course.title}</h3>
                  <p className="text-black/50 text-sm font-serif italic mb-8 line-clamp-2 flex-1">
                    {course.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-black/5">
                    <div className="flex space-x-8">
                      <div className="flex items-center space-x-2">
                        <Video className="h-3 w-3 text-black/30" />
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{course.counts?.videos || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 text-black/30" />
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{course.counts?.notes || 0}</span>
                      </div>
                    </div>
                    <div className="text-black/20 group-hover:text-black transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
