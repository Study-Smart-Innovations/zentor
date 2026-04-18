"use client"

import Image from "next/image";

export function BackgroundLayer() {
  return (
    <div className="absolute inset-0 -z-10 bg-editorial-cream" suppressHydrationWarning>
      <div className="relative h-full w-full">
        <Image
          src="/learning-hero.jpg"
          alt="Background"
          fill
          className="object-cover brightness-[1.0] contrast-[1.1] opacity-40 transition-opacity duration-1000"
          priority
        />
        {/* Light Airy Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-editorial-cream/40 via-transparent to-editorial-cream/80" />
      </div>
    </div>
  );
}
