"use client"

import { useState, useEffect } from "react";
import { Star, Loader2, Check } from "lucide-react";
import { submitRating, getUserRating } from "@/lib/actions/ratings";
import { motion } from "framer-motion";

export function RatingWidget({ courseId, teacherName }: { courseId: string, teacherName: string }) {
  const [courseScore, setCourseScore] = useState<number>(0);
  const [teacherScore, setTeacherScore] = useState<number>(0);
  const [hoverCourse, setHoverCourse] = useState<number>(0);
  const [hoverTeacher, setHoverTeacher] = useState<number>(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    async function loadExisting() {
      const { rating } = await getUserRating(courseId);
      if (rating) {
        setCourseScore(Number(rating.course_rating));
        setTeacherScore(Number(rating.teacher_rating));
        setHasRated(true);
      }
    }
    loadExisting();
  }, [courseId]);

  const handleSubmit = async () => {
    if (courseScore === 0 || teacherScore === 0) return;
    
    setIsSubmitting(true);
    const res = await submitRating(courseId, courseScore, teacherScore);
    
    setIsSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setIsSuccess(true);
      setHasRated(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  return (
    <div className="p-8 border border-editorial-black/10 bg-white shadow-sm mt-12 mb-12 max-w-xl mx-auto rounded-[2rem]">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-serif text-editorial-black italic mb-2">
          {hasRated ? "Update your Rating" : "Rate your Experience"}
        </h3>
        <p className="text-[10px] font-bold text-editorial-black/40 uppercase tracking-widest">
          Your feedback shapes our curriculum.
        </p>
      </div>

      <div className="space-y-8">
        {/* Course Rating */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
             <label className="text-xs font-black text-editorial-black uppercase tracking-widest">The Course</label>
             <span className="text-2xl font-serif text-[#C5A059] italic">{courseScore > 0 ? courseScore.toFixed(1) : "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`c-${star}`}
                onMouseEnter={() => setHoverCourse(star)}
                onMouseLeave={() => setHoverCourse(0)}
                onClick={() => setCourseScore(star)}
                className="transition-transform hover:scale-110"
              >
                <Star 
                  className={`h-8 w-8 ${
                    (hoverCourse || courseScore) >= star 
                      ? "fill-[#C5A059] text-[#C5A059]" 
                      : "text-editorial-black/10"
                  } transition-colors duration-200`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Rating */}
        <div className="space-y-4 pt-6 border-t border-editorial-black/5">
          <div className="flex justify-between items-end">
             <label className="text-xs font-black text-editorial-black uppercase tracking-widest">{teacherName}</label>
             <span className="text-2xl font-serif text-[#C5A059] italic">{teacherScore > 0 ? teacherScore.toFixed(1) : "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`t-${star}`}
                onMouseEnter={() => setHoverTeacher(star)}
                onMouseLeave={() => setHoverTeacher(0)}
                onClick={() => setTeacherScore(star)}
                className="transition-transform hover:scale-110"
              >
                <Star 
                  className={`h-8 w-8 ${
                    (hoverTeacher || teacherScore) >= star 
                      ? "fill-[#C5A059] text-[#C5A059]" 
                      : "text-editorial-black/10"
                  } transition-colors duration-200`} 
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || courseScore === 0 || teacherScore === 0 || isSuccess}
          className="w-full h-14 bg-editorial-black text-editorial-cream font-bold text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSuccess ? (
            <>
               <Check className="h-4 w-4 text-[#C5A059]" />
               <span className="text-[#C5A059]">Submitted</span>
            </>
          ) : (
            <span>Submit Rating</span>
          )}
        </button>
      </div>
    </div>
  );
}
