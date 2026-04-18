"use client"

import { motion } from "framer-motion";
import { TeacherCard } from "./teacher-card";
import { Sparkles, ArrowRight } from "lucide-react";

export const FeaturedTeachers = () => {
  const teachers = [
    {
      name: "Dr. Arpan Das",
      role: "Senior Physics Faculty",
      avatar: "",
      rating: 4.9,
      reviews: 124,
      students: 450,
      location: "Kolkata / Online",
      subjects: ["Physics", "Mechanics", "IE Irodov"],
      delay: 0.1,
    },
    {
      name: "Sarah Miller",
      role: "Mathematics Specialist",
      avatar: "",
      rating: 5.0,
      reviews: 89,
      students: 320,
      location: "London / Online",
      subjects: ["Calculus", "Algebra", "Geometry"],
      delay: 0.2,
    },
    {
      name: "Alex Rivera",
      role: "Full-Stack Instructor",
      avatar: "",
      rating: 4.8,
      reviews: 210,
      students: 1200,
      location: "Remote",
      subjects: ["Next.js", "React", "Node.js"],
      delay: 0.3,
    },
    {
      name: "Priya Sharma",
      role: "Biology Expert",
      avatar: "",
      rating: 4.9,
      reviews: 156,
      students: 580,
      location: "Mumbai / Online",
      subjects: ["Genetics", "Botany", "NEET Prep"],
      delay: 0.4,
    },
  ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" id="teachers">
      <div className="absolute top-1/2 left-0 -z-10 -translate-y-1/2 w-[500px] h-[500px] bg-primary-blue/5 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 rounded-full bg-primary-purple/10 px-4 py-1.5 text-sm font-black text-primary-purple mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="uppercase tracking-[0.1em]">Expert Educators</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
            >
              Learn from the <span className="text-primary-blue">Top 1%.</span>
            </motion.h2>
          </div>
          <button className="flex items-center space-x-2 rounded-full border-2 border-primary-purple/20 px-8 py-4 text-sm font-black text-primary-purple transition-all hover:bg-primary-purple hover:text-white">
            <span>Explore All Teachers</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, i) => (
            <TeacherCard key={i} {...teacher} />
          ))}
        </div>
      </div>
    </section>
  );
};
