"use client"

import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/cta-footer";

// Disable SSR for the background and main layout shell to fix the persistent dev-server hydration cache bug
const ClientContent = dynamic(() => Promise.resolve(MainLayout), { 
  ssr: false,
  loading: () => <div className="h-screen w-full bg-editorial-cream" /> 
});

function MainLayout() {
  const { BackgroundLayer } = require("@/components/background-layer");
  
  return (
    <>
      <BackgroundLayer />
      <Navbar />
      <div className="flex-grow flex items-center justify-center overflow-hidden">
        <HeroSection />
      </div>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <main suppressHydrationWarning className="relative h-screen overflow-hidden flex flex-col selection:bg-mint-500/30">
       <ClientContent />
    </main>
  );
}
