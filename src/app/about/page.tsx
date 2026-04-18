"use client"

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/cta-footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Heart, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <main className="min-h-screen bg-editorial-cream flex flex-col font-sans selection:bg-editorial-black selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-8 sm:px-12 lg:px-24">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl"
        >
          <motion.p variants={itemVariants} className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-black/40 mb-6 font-sans">
            Our Raison D&apos;être
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-serif text-editorial-black leading-[1.05] tracking-tight mb-12">
            Where Local Teachers <br />
            <span className="text-[#C5A059] italic">Become Global Mentors.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-2xl text-xl text-editorial-black/70 leading-relaxed font-serif italic">
            &ldquo;We empower passionate educators to teach online and help students learn smarter, grow faster, and achieve more.&rdquo;
          </motion.p>
        </motion.div>
      </section>

      {/* The Problem/Solution Context */}
      <section className="bg-editorial-black py-32 px-8 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 font-sans">The Challenge</h2>
              <p className="text-3xl font-serif text-white/90 leading-snug">
                For years, students have struggled to find the right teachers, while talented local educators remain limited to small classrooms.
              </p>
            </div>
            <div className="p-1 w-full bg-white/5" />
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] font-sans">The Zentor Reality</h2>
              <p className="text-xl text-white/60 leading-relaxed">
                We built a platform where students discover trusted teachers and attend live, interactive classes—while educators create, teach, and earn without limits.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            <div className="p-10 bg-white/5 border border-white/10 space-y-4">
              <Zap className="h-6 w-6 text-[#C5A059]" />
              <h3 className="text-white font-serif text-2xl">Flexible Learning</h3>
              <p className="text-white/40 text-sm leading-relaxed">Personalized paths that adapt to the student&apos;s unique pace and lifestyle.</p>
            </div>
            <div className="p-10 bg-white/5 border border-white/10 space-y-4">
              <Globe className="h-6 w-6 text-[#C5A059]" />
              <h3 className="text-white font-serif text-2xl">Unlimited Reach</h3>
              <p className="text-white/40 text-sm leading-relaxed">Breaking the bounds of geography to connect the best minds, globally.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Shield */}
      <section className="py-40 px-8 text-center bg-[#FDFCF9]">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto"
        >
          <div className="inline-block p-1 bg-[#C5A059]/10 rounded-full mb-12">
            <div className="bg-[#C5A059] p-3 rounded-full">
               <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-black/40 mb-8">Our Mission is Simple</h2>
          <p className="text-4xl md:text-5xl font-serif text-editorial-black leading-tight italic">
            &ldquo;To make high-quality education accessible to every student and give every teacher the tools to grow beyond boundaries.&rdquo;
          </p>
        </motion.div>
      </section>

      {/* Differentiation */}
      <section className="py-32 px-8 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-black/40 mb-20">The Zentor Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-6">
              <div className="text-3xl font-serif text-editorial-black/20">01.</div>
              <h4 className="text-xl font-serif text-editorial-black">Local Educators</h4>
              <p className="text-sm text-editorial-black/60 leading-relaxed">We focus on real local mentors, not just large institutions, preserving the personal touch.</p>
            </div>
            <div className="space-y-6">
              <div className="text-3xl font-serif text-editorial-black/20">02.</div>
              <h4 className="text-xl font-serif text-editorial-black">Live & Interactive</h4>
              <p className="text-sm text-editorial-black/60 leading-relaxed">Engagement is key. We offer live classes where students participate, not just watch.</p>
            </div>
            <div className="space-y-6">
              <div className="text-3xl font-serif text-editorial-black/20">03.</div>
              <h4 className="text-xl font-serif text-editorial-black">Income Pathways</h4>
              <p className="text-sm text-editorial-black/60 leading-relaxed">Giving teachers the tools to monetize their expertise and build a sustainable career.</p>
            </div>
            <div className="space-y-6">
              <div className="text-3xl font-serif text-editorial-black/20">04.</div>
              <h4 className="text-xl font-serif text-editorial-black">Growth Focus</h4>
              <p className="text-sm text-editorial-black/60 leading-relaxed">Continuous improvement metrics that show real student and teacher progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-editorial-black text-white px-8 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div>
              <h3 className="text-4xl font-serif mb-8">Built on Trust.</h3>
              <p className="text-white/40 leading-relaxed">Our commitment is to the community we serve—students searching for knowledge and teachers sharing their mastery.</p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
               {['Transparency', 'Student Success', 'Teacher Empowerment', 'Continuous Improvement'].map((item) => (
                 <div key={item} className="flex items-center space-x-6">
                   <ShieldCheck className="h-5 w-5 text-[#C5A059]" />
                   <span className="text-xs font-bold uppercase tracking-widest">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-serif text-editorial-black mb-12 leading-tight">
            Learning has no limits. <br />
            Teaching has no boundaries.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link href="/register?role=student" className="w-full sm:w-auto bg-editorial-black text-white px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 shadow-2xl">
                Start Learning
             </Link>
             <Link href="/register?role=teacher" className="w-full sm:w-auto border border-editorial-black text-editorial-black px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black hover:text-white">
                Start Teaching
             </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
