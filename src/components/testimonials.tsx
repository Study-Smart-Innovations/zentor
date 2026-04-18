"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TestimonialCard = ({ name, role, content, avatar, rating, delay }: { name: string, role: string, content: string, avatar: string, rating: number, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="group relative p-10 rounded-[2.5rem] border border-foreground/5 bg-background shadow-lg transition-all hover:shadow-premium dark:hover:shadow-premium-dark"
  >
    <Quote className="absolute top-8 right-8 h-12 w-12 text-primary-purple/10 transform -scale-x-100" />
    
    <div className="flex items-center space-x-1 mb-8">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-primary-orange text-primary-orange" : "text-foreground/10"}`} />
      ))}
    </div>
    
    <p className="text-xl text-foreground/80 leading-relaxed font-medium mb-10 italic">
      "{content}"
    </p>
    
    <div className="flex items-center space-x-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-primary-blue/20 bg-foreground/5">
        <div className="flex h-full w-full items-center justify-center text-primary-blue font-black uppercase tracking-tighter">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-black text-foreground tracking-tight">{name}</h4>
        <p className="text-[10px] font-black text-foreground/30 tracking-[0.2em] uppercase">{role}</p>
      </div>
    </div>
  </motion.div>
);

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "High School Senior",
      content: "Finding a local Physics teacher through Zentor was a game-changer. The personalized attention and premium notes helped me ace my finals!",
      avatar: "/avatar-1.png",
      rating: 5,
      delay: 0.1,
    },
    {
      name: "Sarah Chen",
      role: "Med-School Aspirant",
      content: "The Biology video courses are so in-depth. I love how I can directly message my instructor whenever I'm stuck on a complex concept.",
      avatar: "/avatar-2.png",
      rating: 5,
      delay: 0.2,
    },
    {
      name: "Jordan Smith",
      role: "Engineering Student",
      content: "The marketplace is smooth. I found a great Calculus teacher and the study notes are the best curated materials I've ever used.",
      avatar: "/avatar-3.png",
      rating: 5,
      delay: 0.3,
    },
  ];

  return (
    <section className="py-24 lg:py-32 relative bg-foreground/[0.01]" id="testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
          >
            Loved by <span className="text-primary-purple">Learners</span> Worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-xl text-foreground/40 leading-relaxed font-bold"
          >
            Real success stories from students who found their perfect teacher on Zentor.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};
