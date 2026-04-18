import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/cta-footer";
import { getStudentDashboard } from "@/lib/actions/student";
import { EnrolledCoursesGrid, FacultySuggestions } from "@/components/student/dashboard-courses";
import { SmartSearchSection } from "@/components/student/smart-searchbar";
import { GraduationCap, BookOpen, Clock, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "student") {
    redirect("/login");
  }

  const { enrolledCourses = [], suggestions = [], error } = await getStudentDashboard();

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[80vh] items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
            <p className="font-black text-xl mb-2">Sync Error</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-editorial-cream flex flex-col font-sans">
      <Navbar />

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif text-editorial-black tracking-tight">
              Welcome back, <span className="text-[#C5A059] italic">{session?.user?.name}</span>
            </h1>
            <p className="text-editorial-black/60 text-lg font-serif italic">Curate your curriculum and engage with your academic circle.</p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8">
            <div className="pr-12 md:border-r border-editorial-black/5">
              <p className="text-[10px] font-bold text-editorial-black/30 uppercase tracking-[0.2em] mb-3">Enrolled</p>
              <p className="text-5xl font-serif text-editorial-black tracking-tighter">{enrolledCourses.length}</p>
            </div>
          </div>
        </div>

        {/* Smart Search - Highest Priority per User */}
        <div className="mb-16">
          <SmartSearchSection />
        </div>

        <section className="mb-32">
          <div className="mb-12">
            <h2 className="text-4xl font-serif text-editorial-black">Current Curriculum</h2>
            <p className="text-editorial-black/40 font-bold uppercase tracking-widest text-[10px] mt-2">Active Modules and Progress</p>
          </div>
          <EnrolledCoursesGrid courses={enrolledCourses} />
        </section>

        {/* Faculty Suggestions */}
        <section className="mb-24">
          <div className="p-16 border border-editorial-black/5 bg-editorial-black/[0.02] relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl font-serif text-editorial-black mb-6">Deepen your Expertise.</h2>
              <p className="text-editorial-black/60 text-lg mb-12 font-serif italic">We found these specialized modules from your trusted faculty members—designed to expand your academic horizon.</p>
              <FacultySuggestions suggestions={suggestions} />
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
