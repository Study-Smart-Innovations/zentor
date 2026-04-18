"use client"

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/cta-footer";
import { PricingSection } from "@/components/pricing-section";
import dynamic from "next/dynamic";

const BackgroundLayer = dynamic(() => import("@/components/background-layer").then(mod => mod.BackgroundLayer), { ssr: false });

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-editorial-cream flex flex-col font-sans selection:bg-editorial-black selection:text-white">
      <BackgroundLayer />
      <Navbar />
      
      <div className="pt-8">
        <PricingSection />
      </div>

      <Footer />
    </main>
  );
}
