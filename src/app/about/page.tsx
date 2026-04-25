"use client"

import { Navbar } from "@/components/navbar-waitlist";
import { Footer } from "@/components/cta-footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Heart, ShieldCheck, Users, Network, MapPin } from "lucide-react";

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
          <motion.p suppressHydrationWarning variants={itemVariants} className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-black/40 mb-6 font-sans">
            Notre Raison d&apos;être
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-serif text-editorial-black leading-[1.05] tracking-tight mb-12">
            Zentor is where education <br />
            <span className="text-[#C5A059] italic">meets opportunity.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-2xl text-xl text-editorial-black/70 leading-relaxed font-serif italic mb-8">
            &ldquo;No matter where you come from, your start shouldn&apos;t decide how far you go.&rdquo;
          </motion.p>
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-[#C5A059]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">
              An initiative by Study Smart Innovations
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* The Vision Context */}
      <section className="bg-editorial-black py-32 px-8 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 font-sans">The Connection</h2>
              <p className="text-3xl font-serif text-white/90 leading-snug">
                From metro cities to small towns and villages—Zentor connects students, teachers, and learners across every corner.
              </p>
            </div>
            <div className="p-1 w-full bg-white/5" />
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059] font-sans">Bridging the Gap</h2>
              <p className="text-xl text-white/60 leading-relaxed">
                For students in Tier 3 cities and rural areas, Zentor acts as a bridge—bringing exposure, guidance, and opportunities that are often hard to access.
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
              <Users className="h-6 w-6 text-[#C5A059]" />
              <h3 className="text-white font-serif text-2xl">Collaborative Learning</h3>
              <p className="text-white/40 text-sm leading-relaxed">A space where students learn, share, and grow together beyond classrooms.</p>
            </div>
            <div className="p-10 bg-white/5 border border-white/10 space-y-4">
              <MapPin className="h-6 w-6 text-[#C5A059]" />
              <h3 className="text-white font-serif text-2xl">Geographic Equality</h3>
              <p className="text-white/40 text-sm leading-relaxed">Access to resources and mentorship that isn&apos;t limited by where you live.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
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
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-black/40 mb-8">Zentor&apos;s Mission</h2>
          <p className="text-4xl md:text-5xl font-serif text-editorial-black leading-tight italic">
            &ldquo;To make quality learning, meaningful connections, and real opportunities accessible to every student, everywhere.&rdquo;
          </p>
        </motion.div>
      </section>

      {/* The Network */}
      <section className="py-32 px-8 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-editorial-black/40 mb-20">We are building a network where</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="text-3xl font-serif text-editorial-black/20">01.</div>
              <h4 className="text-xl font-serif text-editorial-black">Learning is Collaborative</h4>
              <p className="text-sm text-editorial-black/60 leading-relaxed">No longer isolated, but shared within a thriving community of peers and mentors.</p>
            </div>
            <div className="space-y-6">
              <div className="text-3xl font-serif text-editorial-black/20">02.</div>
              <h4 className="text-xl font-serif text-editorial-black">Opportunities are Accessible</h4>
              <p className="text-sm text-editorial-black/60 leading-relaxed">Talent and ambition exist everywhere; we ensure the path to success does too.</p>
            </div>
            <div className="space-y-6">
              <div className="text-3xl font-serif text-editorial-black/20">03.</div>
              <h4 className="text-xl font-serif text-editorial-black">Growth is Continuous</h4>
              <p className="text-sm text-editorial-black/60 leading-relaxed">Learning that goes beyond exams, fostering lifelong development and career exploration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-32 bg-editorial-black text-white px-8 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h3 className="text-4xl font-serif mb-8">For Educators.</h3>
              <p className="text-white/40 leading-relaxed text-lg">
                Zentor is a powerful platform for teachers to reach, inspire, and impact learners at scale. We provide the tools to turn passionate teaching into global mentorship.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
               {['Exposure', 'Scale', 'Impact', 'Sustainability'].map((item) => (
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
            The future of learning <br />
            <span className="italic text-[#C5A059]">is everywhere.</span>
          </h2>
          <div className="flex items-center justify-center">
             <Link href="/waitlist" className="w-full sm:w-auto bg-editorial-black text-white px-16 py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-editorial-black/90 shadow-2xl">
                Join Waitlist
             </Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-editorial-black/10" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-editorial-black/40">
              Initiative by Study Smart Innovations
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
