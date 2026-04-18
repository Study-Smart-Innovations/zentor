"use client"

import { motion } from "framer-motion";
import { Users, Video, FileText, LayoutDashboard, ShieldCheck, MessageSquare, GraduationCap, MapPin, Sparkles } from "lucide-react";

const FeatureCard = ({ title, description, icon: Icon, color, delay }: { title: string, description: string, icon: any, color: string, delay: number }) => {
  const colorMap: Record<string, string> = {
    blue: "bg-primary-blue shadow-primary-blue/20",
    purple: "bg-primary-purple shadow-primary-purple/20",
    mint: "bg-primary-mint shadow-primary-mint/20",
    orange: "bg-primary-orange shadow-primary-orange/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group relative flex flex-col items-center p-10 rounded-[2.5rem] border border-foreground/5 bg-background shadow-lg transition-all hover:-translate-y-2 hover:shadow-premium dark:hover:shadow-premium-dark"
    >
      <div className={`absolute inset-0 -z-10 rounded-[2.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-transparent via-transparent to-${colorMap[color].split(' ')[0].replace('bg-', '')}/5`} />
      
      <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${colorMap[color]} text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-10 w-10" />
      </div>
      
      <h3 className="mt-8 text-2xl font-black text-foreground text-center tracking-tight">{title}</h3>
      <p className="mt-4 text-base text-foreground/50 text-center leading-relaxed">
        {description}
      </p>

      <div className="mt-8 h-1.5 w-12 rounded-full bg-foreground/10 transition-all duration-300 group-hover:w-24 group-hover:bg-primary-blue" />
    </motion.div>
  );
};

export const FeaturesGrid = () => {
  const features = [
    {
      title: "Verified Teachers",
      description: "Connect with the best local expertise. All teachers are verified for quality and experience.",
      icon: Users,
      color: "blue",
      delay: 0.1,
    },
    {
      title: "Interactive Courses",
      description: "Access premium video courses with interactive quizzes and assignments to master any subject.",
      icon: Video,
      color: "purple",
      delay: 0.2,
    },
    {
      title: "Smart Study Notes",
      description: "Download high-quality, curated study materials and notes designed specifically for your curriculum.",
      icon: FileText,
      color: "mint",
      delay: 0.3,
    },
    {
      title: "Student Dashboard",
      description: "Track your learning progress, manage assignments, and stay organized with your personal dashboard.",
      icon: LayoutDashboard,
      color: "orange",
      delay: 0.4,
    },
    {
      title: "Local Learning",
      description: "Find teachers in your locality for physical tuition or join online batches from anywhere.",
      icon: MapPin,
      color: "blue",
      delay: 0.5,
    },
    {
      title: "Direct Messaging",
      description: "Communicate directly with your teachers. Ask doubts, schedule classes, and get instant feedback.",
      icon: MessageSquare,
      color: "purple",
      delay: 0.6,
    },
    {
      title: "Final Mock Exams",
      description: "Prepare for success with our realistic mock exams and detailed performance analytics.",
      icon: GraduationCap,
      color: "mint",
      delay: 0.7,
    },
    {
      title: "Secure Platform",
      description: "Safe payments, data privacy, and a trusted community environment for students and teachers.",
      icon: ShieldCheck,
      color: "orange",
      delay: 0.8,
    },
  ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" id="features">
      <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-blue/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-primary-purple/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 rounded-full bg-primary-blue/10 px-4 py-1.5 text-sm font-black text-primary-blue"
          >
            <Sparkles className="h-4 w-4" />
            <span className="uppercase tracking-[0.1em]">Why Choose Zentor</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl font-black tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
          >
            Built for <span className="text-primary-blue">Student Success</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 text-xl text-foreground/50 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to find the right teacher, learn complex concepts, and achieve your educational goals.
          </motion.p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
