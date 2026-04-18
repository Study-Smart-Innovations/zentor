"use client"

import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-transparent py-8 border-t border-editorial-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-editorial-black/30">
            Learn better. Teach smarter. Grow together.
          </span>
        </div>
      </div>
    </footer>
  );
};
