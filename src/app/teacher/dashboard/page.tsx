import { getTeacherCourses, getTeacherAnalytics, getFinancialOverview } from "@/lib/actions/course";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Book, Users, Star, ArrowRight, Video, FileText, Calendar, TrendingUp, IndianRupee, Wallet, Sparkles } from "lucide-react";
import { CourseList } from "@/components/teacher/course-list";

export default async function TeacherDashboard() {
  const session = await auth();
  const [courses, analytics, finances] = await Promise.all([
    getTeacherCourses(),
    getTeacherAnalytics(),
    getFinancialOverview()
  ]);

  const stats = (finances as any).stats || {};

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-editorial-black tracking-tight leading-tight">
            Welcome back, <span className="text-[#C5A059] italic">{session?.user?.name}</span>
          </h1>
          <div className="flex items-center space-x-3">
             {session?.user?.teacherCode && (
               <div className="flex items-center space-x-2">
                 <span className="text-[10px] font-black text-editorial-black/20 uppercase tracking-[0.2em]">Teacher Code:</span>
                 <span className="text-[10px] uppercase font-black text-editorial-black/60 tracking-widest">{session?.user?.teacherCode}</span>
               </div>
             )}
          </div>
          <p className="text-editorial-black/60 text-lg font-serif italic">Manage your courses and track student progress.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/teacher/courses/new"
            className="flex items-center justify-center space-x-3 bg-editorial-black px-10 py-5 font-bold text-white text-xs uppercase tracking-[0.2em] transition-all hover:bg-editorial-black/90 shadow-2xl"
          >
            <Plus className="h-4 w-4" />
            <span>New Course</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Book, label: "Total Courses", value: courses.length },
          { icon: Users, label: "Total Students", value: (analytics as any).totalStudents || 0 },
          { icon: IndianRupee, label: "Total Revenue", value: `₹${(stats.lifetimeRevenue ?? 0).toFixed(2)}` },
        ].map((stat, i) => (
          <div key={i} className="p-8 border border-editorial-black/5 bg-editorial-black/[0.02]">
            <p className="text-[10px] font-bold text-editorial-black/30 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <p className="text-5xl font-serif text-editorial-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Wealth Strategy Widget */}
      <Link href="/teacher/finances">
        <div className="p-12 border border-editorial-black/5 bg-editorial-black/[0.02] flex flex-col md:flex-row items-center justify-between gap-12 group transition-all hover:bg-editorial-black/[0.04]">
          <div className="space-y-6">
            <h3 className="text-3xl font-serif text-editorial-black">Course Analytics</h3>
            <p className="text-editorial-black/40 font-serif italic max-w-xl text-lg">
              Monitor your course performance and financial growth. View detailed reports and student engagement metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-editorial-black font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
             <span>View Reports</span>
             <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      {/* Course Management with Smart Search */}
      <CourseList courses={courses} />
    </div>
  );
}
