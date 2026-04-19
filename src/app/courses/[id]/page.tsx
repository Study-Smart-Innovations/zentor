import { getCourseWithAccess, enrollInCourse } from "@/lib/actions/course-access";
import { getCoursePlans } from "@/lib/actions/course-plans";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/cta-footer";
import { notFound, redirect } from "next/navigation";
import { CoursePurchaseSection } from "@/components/courses/purchase-zone";
import { CourseCurriculum } from "@/components/courses/curriculum-view";
import { RatingWidget } from "@/components/courses/rating-modal";
import { Sparkles, BookOpen, Clock, Star, Play, ShieldCheck, GraduationCap, Lock, StarHalf } from "lucide-react";
import Link from "next/link";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;
   const result = await getCourseWithAccess(id);
   const { plans } = await getCoursePlans(id);

   if (result.error === "Unauthorized") redirect("/login");
   if (!result.course || result.error) notFound();

   const { course, isEnrolled, canAccess, hasPaid } = result;

   return (
      <main className="min-h-screen bg-editorial-cream selection:bg-editorial-black selection:text-editorial-cream">
         <Navbar />

         {/* Dynamic Hero Section */}
         <div className="relative pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden border-b border-editorial-black/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

               <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                  {/* Left: Info */}
                  <div className="space-y-6 md:space-y-8">
                     <div className="inline-flex items-center space-x-3">
                        <div className="h-1 w-10 bg-[#C5A059]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">
                           {canAccess ? "Enrolled" : "Verified Course"}
                        </span>
                     </div>

                     <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif italic text-editorial-black leading-tight md:leading-[0.9] tracking-tighter">
                        {course.title}
                     </h1>

                     <p className="text-xl md:text-2xl font-serif text-editorial-black/60 leading-tight max-w-xl">
                        {course.headline || course.description}
                     </p>

                     <div className="flex items-center space-x-6 pt-4">
                        {canAccess ? (
                           <Link 
                              href={`/courses/${id}/learn`}
                              className="inline-flex items-center space-x-4 bg-editorial-black text-editorial-cream px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all"
                           >
                              <Play className="h-4 w-4 fill-editorial-cream" />
                              <span>Resume Learning</span>
                           </Link>
                        ) : (
                           <div className="flex items-center space-x-3 text-editorial-black/40">
                              <Lock className="h-3 w-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Enroll to access curriculum</span>
                           </div>
                        )}
                     </div>

                     <div className="flex flex-wrap gap-12 pt-8">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-editorial-black/20 tracking-widest">Teacher</p>
                           <p className="font-serif italic text-xl text-editorial-black">{course.teacherName}</p>
                           {course.teacherRatingCount > 0 && (
                             <div className="flex items-center space-x-2 text-[#C5A059]">
                               <Star className="h-4 w-4 fill-[#C5A059]" />
                               <span className="text-lg font-serif italic">{course.teacherRating}</span>
                               <span className="text-[10px] uppercase font-black text-editorial-black/30 tracking-widest">({course.teacherRatingCount})</span>
                             </div>
                           )}
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase text-editorial-black/20 tracking-widest">Course Rating</p>
                           {course.rating_count > 0 ? (
                             <div className="flex items-center space-x-2 text-[#C5A059]">
                               <Star className="h-4 w-4 fill-[#C5A059]" />
                               <span className="text-xl font-serif italic">{course.rating}</span>
                               <span className="text-[10px] uppercase font-black text-editorial-black/30 tracking-widest">({course.rating_count})</span>
                             </div>
                           ) : (
                             <p className="font-serif italic text-xl text-editorial-black/40">New</p>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Right: Media / Action Preview */}
                  <div className="relative">
                     <div className="w-full bg-editorial-black/[0.02] border border-editorial-black/10 shadow-sm relative group overflow-hidden min-h-[300px] flex items-center justify-center">
                        {course.banner_url || course.thumbnail_url ? (
                           <img
                              src={course.banner_url || course.thumbnail_url}
                              alt={course.title}
                              className="w-full h-auto max-h-[600px] object-contain grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 group-hover:scale-[1.01]"
                           />
                        ) : (
                           <div className="h-64 w-full flex items-center justify-center">
                              <Play className="h-20 w-20 text-editorial-black/5" />
                           </div>
                        )}
                        {canAccess && (
                           <Link 
                              href={`/courses/${id}/learn`}
                              className="absolute inset-0 bg-editorial-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                           >
                              <div className="h-24 w-24 rounded-full border border-editorial-cream/30 flex items-center justify-center">
                                 <Play className="h-10 w-10 text-editorial-cream fill-editorial-cream ml-1" />
                              </div>
                           </Link>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            {!isEnrolled ? (
               <>
                  <CoursePurchaseSection course={course} plans={plans || []} />

                  {course.description && course.headline && (
                     <div className="max-w-2xl mt-24 mb-32">
                        <p className="text-[10px] font-black uppercase text-editorial-black/20 tracking-widest mb-8">About this course</p>
                        <p className="text-xl font-serif text-editorial-black/70 leading-relaxed italic">
                           "{course.description}"
                        </p>
                     </div>
                  )}
               </>
            ) : (
               <div className="mb-16 mt-8 p-6 md:p-8 border border-[#C5A059]/30 bg-[#C5A059]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                 <div>
                    <h3 className="text-2xl font-serif text-editorial-black">Active Curriculum</h3>
                    <p className="text-sm font-bold text-editorial-black/40 uppercase tracking-widest mt-1">Your enrollment is verified</p>
                 </div>
                 {result.accessInfo?.access_end && (
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-[#C5A059] tracking-widest">Valid Until</p>
                      <p className="font-serif italic text-xl text-editorial-black">
                         {new Date(result.accessInfo.access_end).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                   </div>
                 )}
               </div>
            )}

            {/* Curriculum Section - Always visible as Syllabus */}
            <div className="mt-16 md:mt-24 border-t border-editorial-black/5 pt-16 md:pt-24">
               <div className="mb-12 md:mb-16">
                  <p className="text-[10px] font-black uppercase text-editorial-black/20 tracking-widest mb-4">Lessons</p>
                  <h2 className="text-4xl md:text-5xl font-serif italic text-editorial-black">Course Content</h2>
               </div>
               
               <div className="flex flex-col lg:flex-row gap-16 items-start">
                  <div className="flex-1 w-full relative">
                     <CourseCurriculum course={course} />
                  </div>
                  {hasPaid && (
                     <div className="w-full lg:w-96 sticky top-24 shrink-0">
                        <RatingWidget courseId={course.id} teacherName={course.teacherName} />
                     </div>
                  )}
               </div>
            </div>
         </div>

         <Footer />
      </main>
   );
}
