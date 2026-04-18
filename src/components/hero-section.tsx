"use client"

import { motion } from "framer-motion";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative px-4 w-full h-full flex items-center justify-center">
      <div className="mx-auto max-w-7xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[6rem] font-black leading-[1.0] tracking-tighter text-editorial-black font-serif">
            Turn <span className="text-[#C5A059] drop-shadow-[0_0_20px_rgba(197,160,89,0.1)]">Knowledge</span> <br />
            Into <span className="text-[#C5A059] drop-shadow-[0_0_20px_rgba(197,160,89,0.1)]">Impact.</span> <br />
            <span className="text-3xl lg:text-5xl block mt-4 uppercase tracking-widest font-sans font-bold text-editorial-black/30">Learn From the Best Near You.</span>
          </h1>
          
          <p className="mt-8 text-xl sm:text-2xl text-editorial-black/70 max-w-2xl leading-relaxed font-medium">
            A space where teachers build their income and students build their future.
          </p>
          
          <div className="mt-12">
            <Link href="/register">
              <button className="rounded-full bg-editorial-black px-12 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>

          <p className="mt-16 text-[9px] text-editorial-black/20 font-medium uppercase tracking-[0.5em] italic">
            Credit: kras99 / Adobe Stock
          </p>
        </motion.div>
      </div>
    </section>
  );
};
