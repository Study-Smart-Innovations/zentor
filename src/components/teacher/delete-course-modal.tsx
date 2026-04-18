"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import { deleteCourse } from "@/lib/actions/course";
import { useRouter } from "next/navigation";

interface DeleteCourseModalProps {
  courseId: string;
  courseTitle: string;
}

export function DeleteCourseModal({ courseId, courseTitle }: DeleteCourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isMatched = confirmationTitle === courseTitle;

  const handleDelete = async () => {
    if (!isMatched) return;
    
    setIsDeleting(true);
    setError("");
    
    try {
      const result = await deleteCourse(courseId);
      if (result.success) {
        setIsOpen(false);
        router.push("/teacher/dashboard");
      } else {
        setError(result.error || "Deletion failed.");
        setIsDeleting(false);
      }
    } catch (err) {
      setError("A critical system error occurred.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="h-16 px-6 border-2 border-red-600/10 bg-red-600/5 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm space-x-3 group"
        title="Permanently Delete Course"
      >
        <Trash2 className="h-5 w-5" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Delete</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsOpen(false)}
              className="absolute inset-0 bg-editorial-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-white border border-editorial-black shadow-[0_0_100px_rgba(255,0,0,0.1)] overflow-hidden"
            >
              {/* Danger Accents */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
              <div className="p-8 lg:p-12 space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="h-16 w-16 bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-serif italic text-editorial-black">Delete Course</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600/50">Permanent Deletion</p>
                  </div>
                </div>

                <div className="p-6 bg-red-600/5 border border-red-600/10 text-editorial-black font-serif italic leading-relaxed">
                  This action will permanently remove <span className="font-bold text-red-600">{courseTitle}</span>. All course materials and images will be deleted.
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black/30 block ml-2">
                    Type course title to confirm deletion
                  </label>
                  <input
                    type="text"
                    value={confirmationTitle}
                    onChange={(e) => setConfirmationTitle(e.target.value)}
                    disabled={isDeleting}
                    placeholder={courseTitle}
                    className="w-full bg-editorial-black/[0.02] border-2 border-editorial-black/10 p-5 font-serif italic text-lg outline-none focus:border-red-600/30 transition-all placeholder:opacity-20"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-xs font-bold bg-red-600/5 p-4 border border-red-600/20">{error}</p>
                )}

                <div className="flex flex-col space-y-4 pt-4">
                  <button
                    onClick={handleDelete}
                    disabled={!isMatched || isDeleting}
                    className={`h-16 w-full flex items-center justify-center font-black uppercase text-[10px] tracking-[0.3em] transition-all
                      ${isMatched && !isDeleting 
                        ? "bg-red-600 text-white shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98]" 
                        : "bg-editorial-black/5 text-editorial-black/20 border-2 border-editorial-black/5"
                      }`}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                        <span>Deleting course data...</span>
                      </>
                    ) : (
                      <span>Delete Course Permanently</span>
                    )}
                  </button>
                  
                  {!isDeleting && (
                    <button
                      onClick={() => setIsOpen(false)}
                      className="h-16 w-full flex items-center justify-center font-black uppercase text-[10px] tracking-[0.3em] text-editorial-black/40 hover:text-editorial-black transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
