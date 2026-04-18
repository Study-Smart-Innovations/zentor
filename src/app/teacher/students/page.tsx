"use client"

import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  IndianRupee, 
  BookOpen, 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowUpRight,
  User as UserIcon,
  Calendar,
  Mail,
  History,
  Loader2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getTeacherAnalytics, getTeacherStudents, getTeacherCourses } from "@/lib/actions/course";

interface Student {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  totalSpent: number;
  purchases: Array<{
    title: string;
    date: string;
    price: number;
    type: string;
  }>;
}

export default function StudentsAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      // Only set full loading on initial load or course swap
      setLoading(true);
      const [analyticsData, studentsData, coursesData] = await Promise.all([
        getTeacherAnalytics(),
        getTeacherStudents(selectedCourse === "all" ? undefined : selectedCourse),
        getTeacherCourses()
      ]);
      setAnalytics(analyticsData);
      setStudents(studentsData);
      setCourses(coursesData);
      setLoading(false);
    }
    loadData();
  }, [selectedCourse]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    console.log("[CSV Export] Initiated. Student count:", students.length);
    
    if (students.length === 0) {
      alert("No student data available to export yet.");
      return;
    }

    try {
      // 1. Prepare Headers and Data with escaping for commas
      const headers = ["Name", "Email", "Join Date", "Total Spent (LTV)"];
      const escape = (val: any) => `"${String(val).replace(/"/g, '""')}"`;

      const csvRows = [
        headers.map(escape).join(","),
        ...students.map(s => [
          s.name,
          s.email,
          new Date(s.joinedAt).toLocaleDateString(),
          s.totalSpent.toFixed(2)
        ].map(escape).join(","))
      ];

      const csvContent = csvRows.join("\n");
      
      // 2. Create Blob and Trigger Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = `student_report_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Append to body to ensure it works in all browsers
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("[CSV Export] Completed successfully.");
      }, 100);

    } catch (err) {
      console.error("[CSV Export] Error generating report:", err);
      alert("Failed to generate report. Please try again.");
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary-blue mb-4" />
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Loading Insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">Student Insights</h1>
          <p className="text-foreground/40 font-medium">Analyze growth and curriculum performance</p>
        </div>
        <div className="flex items-center space-x-3 bg-foreground/5 p-2 rounded-3xl border border-foreground/5">
           <button className="px-6 py-3 rounded-2xl bg-background text-foreground font-black text-xs shadow-xl scale-105">Analytics</button>
           <button 
            onClick={handleExportCSV}
            className="px-6 py-3 rounded-2xl text-foreground/40 font-black text-xs hover:text-foreground hover:bg-foreground/5 transition-all"
           >
            Report
           </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: analytics?.totalStudents ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Revenue", value: `₹${(analytics?.totalRevenue ?? 0).toFixed(2)}`, icon: IndianRupee, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Active Courses", value: analytics?.activeCourses ?? 0, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Avg. Revenue", value: `₹${(analytics?.averageRevenue ?? 0).toFixed(2)}`, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat, i) => ( stat.value !== undefined && (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] border border-foreground/5 shadow-xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 h-24 w-24 ${stat.bg} blur-3xl rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150`} />
            <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
          </motion.div>
        )))}
      </div>

      {/* Student Management Hub */}
      <div className="glass-card p-10 rounded-[3rem] border border-foreground/5 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
             <UserIcon className="h-6 w-6 text-primary-blue" />
             Student Directory
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20 group-focus-within:text-primary-blue transition-colors" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10"
              />
            </div>

            {/* Course Filter */}
            <div className="relative group min-w-[200px]">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
               <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full appearance-none bg-foreground/[0.03] border border-foreground/10 rounded-2xl py-3.5 pl-12 pr-10 text-sm font-black outline-none transition-all focus:border-primary-blue cursor-pointer"
               >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/5">
                <th className="pb-6 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Student</th>
                <th className="pb-6 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Join Date</th>
                <th className="pb-6 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">LTV</th>
                <th className="pb-6 pt-2 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-foreground/20 font-black italic tracking-widest uppercase">
                    No students found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <React.Fragment key={student.id}>
                    <tr className={`border-b border-foreground/5 transition-all hover:bg-foreground/[0.02] ${expandedStudent === student.id ? 'bg-foreground/[0.02]' : ''}`}>
                      <td className="py-6 px-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary-blue/10 text-primary-blue flex items-center justify-center font-black text-lg shadow-inner">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-foreground">{student.name}</p>
                            <p className="text-xs font-semibold text-foreground/40">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground/60">{new Date(student.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-tighter">Verified Enrollment</span>
                         </div>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <span className="text-lg font-black text-foreground tracking-tighter">₹{student.totalSpent.toFixed(2)}</span>
                      </td>
                      <td className="py-6 px-4 text-right">
                         <button 
                          onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                          className="px-6 py-2.5 rounded-xl bg-foreground/5 text-foreground/60 font-black text-[10px] uppercase tracking-widest hover:bg-primary-blue/10 hover:text-primary-blue transition-all"
                         >
                          {expandedStudent === student.id ? 'Close' : 'View History'}
                         </button>
                      </td>
                    </tr>
                    
                    {/* Expanded History */}
                    <AnimatePresence>
                      {expandedStudent === student.id && (
                        <tr>
                          <td colSpan={4} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-foreground/[0.01]"
                            >
                              <div className="px-10 py-8 space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                   <History className="h-4 w-4 text-primary-blue" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-primary-blue">Purchase History</span>
                                </div>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {student.purchases.map((purchase, idx) => (
                                    <div key={idx} className="glass-card p-4 rounded-2xl border border-foreground/5 bg-background shadow-sm">
                                       <div className="flex items-center justify-between mb-2">
                                          <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/40 uppercase tracking-tighter">{purchase.type}</span>
                                          <span className="text-[10px] font-black text-primary-mint">₹{purchase.price}</span>
                                       </div>
                                       <p className="font-bold text-foreground text-sm truncate mb-1">{purchase.title}</p>
                                       <div className="flex items-center text-[10px] font-semibold text-foreground/30">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          {new Date(purchase.date).toLocaleDateString()}
                                       </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

