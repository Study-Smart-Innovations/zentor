import { getCourseWithContent } from "@/lib/actions/course";
import { ContentForm } from "@/components/teacher/content-form";
import { CourseTabs } from "@/components/teacher/course-tabs";
import { CourseSettingsModal } from "@/components/teacher/course-settings-modal";
import { DeleteCourseModal } from "@/components/teacher/delete-course-modal";
import { getCoursePlans } from "@/lib/actions/course-plans";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log(`[ManageCoursePage] Rendering for ID: ${id}`);
  const course = await getCourseWithContent(id);
  const { plans } = await getCoursePlans(id);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-black text-foreground">Course not found.</h2>
        <Link href="/teacher/dashboard" className="px-8 py-3 rounded-xl bg-primary-blue text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-blue/20">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-editorial-cream text-editorial-black p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Editorial Control Center Feel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-editorial-black/5">
        <div className="flex items-center space-x-8">
          <Link 
            href="/teacher/dashboard"
            className="h-16 w-16 bg-editorial-black/5 flex items-center justify-center text-editorial-black/40 hover:text-editorial-black hover:bg-editorial-black/10 transition-all shadow-sm"
          >
            <ChevronLeft className="h-10 w-10" />
          </Link>
          <div className="space-y-2">
             <div className="flex items-center space-x-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-editorial-black/30">Faculty Registry Manager</span>
                <div className="flex items-center space-x-2">
                   <span className="text-[14px] font-serif italic text-editorial-black font-bold">
                      ₹{course.offered_price || course.price}
                   </span>
                   {course.offered_price < course.price && (
                      <span className="text-[12px] font-serif text-editorial-black/20 line-through">
                         ₹{course.price}
                      </span>
                   )}
                </div>
             </div>
            <h1 className="text-5xl font-serif italic text-editorial-black tracking-tight">{course.title}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href={`/courses/${course.id}`}
            className="h-16 px-8 border-2 border-editorial-black/10 bg-white flex items-center justify-center font-black uppercase text-[10px] tracking-[0.2em] text-editorial-black hover:border-editorial-black hover:bg-editorial-black/5 transition-all shadow-sm group"
          >
            <Eye className="h-4 w-4 mr-3 text-editorial-black/30 group-hover:text-editorial-black" />
            <span>Curriculum Preview</span>
          </Link>
          
          <DeleteCourseModal courseId={course.id} courseTitle={course.title} />
          
          <CourseSettingsModal course={course} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Curriculum Engine */}
        <div className="lg:col-span-2 space-y-12">
          <ContentForm courseId={course.id} initialLessons={course.lessons} />
        </div>

        {/* Financial & Plan Configuration */}
        <div className="space-y-10">
           <div className="sticky top-12">
             {/* Registry Metadata Status */}
             <div className="p-12 border border-editorial-black/10 bg-white shadow-xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-editorial-black/20 mb-6">Registry Status</h4>
                <div className="space-y-4">
                   <div className="flex justify-between text-sm font-serif italic">
                      <span className="text-editorial-black/40">Modules Active</span>
                      <span className="text-editorial-black">{course.lessons?.length || 0}</span>
                   </div>
                   <div className="flex justify-between text-sm font-serif italic">
                      <span className="text-editorial-black/40">Asset Integrity</span>
                      <span className="text-green-600">Verified</span>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
