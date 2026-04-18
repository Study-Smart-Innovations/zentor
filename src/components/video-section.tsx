"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, BookOpen, GraduationCap, Video, Star, Clock, Users } from "lucide-react";

const VideoCard = ({ title, instructor, duration, students, rating, thumbnail, delay }: { title: string, instructor: string, duration: string, students: string, rating: number, thumbnail: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="group relative overflow-hidden rounded-[2.5rem] border border-foreground/5 bg-background shadow-lg transition-all hover:scale-[1.02] hover:shadow-premium dark:hover:shadow-premium-dark"
  >
    <div className="relative aspect-video w-full overflow-hidden">
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/40 backdrop-blur-md transition-all group-hover:bg-primary-blue group-hover:text-white"
        >
          <Play className="h-8 w-8 fill-current translate-x-0.5" />
        </motion.div>
      </div>
      <div className="absolute top-4 left-4 flex items-center space-x-2 rounded-full bg-primary-blue px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
        <Video className="h-3 w-3" />
        <span className="uppercase tracking-widest">Live Demo</span>
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-black text-primary-purple uppercase tracking-widest">{instructor}</p>
        <div className="flex items-center space-x-1 text-primary-orange">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs font-black">{rating}</span>
        </div>
      </div>
      <h3 className="text-xl font-black text-foreground tracking-tight leading-snug group-hover:text-primary-blue transition-colors">{title}</h3>
      
      <div className="mt-6 flex items-center justify-between border-t border-foreground/5 pt-4">
        <div className="flex items-center space-x-2 text-foreground/40">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-bold">{duration}</span>
        </div>
        <div className="flex items-center space-x-2 text-foreground/40">
          <Users className="h-4 w-4" />
          <span className="text-xs font-bold">{students} Students</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export const VideoSection = () => {
  const courses = [
    {
      title: "Advanced Mathematics: Calculus Mastery",
      instructor: "Prof. Sarah Miller",
      duration: "12 Hours",
      students: "1,200",
      rating: 4.9,
      thumbnail: "/math-course.png",
      delay: 0.1,
    },
    {
      title: "Full-Stack Web Dev with Next.js 16",
      instructor: "Alex Rivera",
      duration: "24 Hours",
      students: "3,500",
      rating: 4.8,
      thumbnail: "/web-course.png",
      delay: 0.2,
    },
    {
      title: "Competitive Physics for Top Exams",
      instructor: "Dr. James Wilson",
      duration: "18 Hours",
      students: "850",
      rating: 5.0,
      thumbnail: "/physics-course.png",
      delay: 0.3,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-foreground/[0.01]" id="courses">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
            >
              Explore <span className="text-primary-blue">Top-Rated</span> Courses
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-6 text-xl text-foreground/50 leading-relaxed"
            >
              Watch preview lessons from our expert teachers and start your learning journey today.
            </motion.p>
          </div>
          <button className="flex items-center space-x-2 rounded-full border-2 border-primary-blue/20 px-8 py-4 text-sm font-black text-primary-blue transition-all hover:bg-primary-blue hover:text-white">
            <span>View All Courses</span>
            <BookOpen className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <VideoCard key={course.title} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};
