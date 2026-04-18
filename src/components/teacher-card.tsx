"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, BookOpen, GraduationCap, CheckCircle } from "lucide-react";

interface TeacherCardProps {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviews: number;
  students: number;
  location: string;
  subjects: string[];
  delay?: number;
}

export const TeacherCard = ({
  name,
  role,
  avatar,
  rating,
  reviews,
  students,
  location,
  subjects,
  delay = 0,
}: TeacherCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="glass-card group relative overflow-hidden rounded-[2.5rem] p-6 transition-all hover:-translate-y-2 hover:shadow-premium dark:hover:shadow-premium-dark"
    >
      <div className="flex items-start justify-between">
        <div className="relative">
          <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-primary-blue/20 bg-foreground/5 transition-transform group-hover:scale-105">
             {avatar ? (
                <Image src={avatar} alt={name} width={80} height={80} className="h-full w-full object-cover" />
             ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-blue/10 text-primary-blue">
                   <GraduationCap className="h-10 w-10" />
                </div>
             )}
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-mint text-white shadow-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end space-x-1 text-primary-orange">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-black">{rating}</span>
          </div>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{reviews} Reviews</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-black tracking-tight text-foreground">{name}</h3>
        <p className="text-sm font-medium text-primary-purple">{role}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <span
            key={subject}
            className="rounded-lg bg-foreground/[0.03] px-3 py-1 text-[11px] font-bold text-foreground/60 transition-colors group-hover:bg-primary-blue/10 group-hover:text-primary-blue"
          >
            {subject}
          </span>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-foreground/5 pt-6">
        <div className="flex items-center space-x-2 text-foreground/50">
          <MapPin className="h-4 w-4" />
          <span className="text-xs font-bold">{location}</span>
        </div>
        <div className="flex items-center justify-end space-x-2 text-foreground/50">
          <BookOpen className="h-4 w-4" />
          <span className="text-xs font-bold">{students}+ Students</span>
        </div>
      </div>

      <button className="mt-6 w-full rounded-2xl bg-foreground text-background py-4 text-sm font-black transition-all hover:bg-primary-blue hover:text-white active:scale-95">
        View Profile
      </button>
    </motion.div>
  );
};
