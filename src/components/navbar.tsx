"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Sign in", href: "/login" },
  ];

  return (
    <nav className="relative z-50 w-full bg-transparent">
      <div className="px-8 sm:px-12">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <span className="text-3xl font-black tracking-tighter text-editorial-black font-serif">
              Zentor<span className="text-[#C5A059]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {!isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-editorial-black/70 transition-colors hover:text-editorial-black"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/register"
                  className="rounded-full bg-editorial-black px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Get started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  href={session?.user?.role === "teacher" ? "/teacher/dashboard" : "/dashboard"}
                  className="flex items-center space-x-2 text-sm font-bold text-editorial-black/60 hover:text-editorial-black transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-3 rounded-full border border-editorial-black/10 px-8 py-3 text-sm font-bold text-editorial-black transition-all hover:bg-editorial-black hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-editorial-black transition-transform active:scale-95"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full bg-editorial-cream/95 backdrop-blur-xl border-b border-editorial-black/5 px-8 py-10 md:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-8">
              {!isAuthenticated ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-serif text-editorial-black/80 hover:text-editorial-black transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center rounded-full bg-editorial-black py-5 text-sm font-bold text-white shadow-xl"
                  >
                    Get started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={session?.user?.role === "teacher" ? "/teacher/dashboard" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 text-2xl font-serif text-editorial-black/80 hover:text-editorial-black"
                  >
                    <LayoutDashboard className="h-6 w-6 text-[#C5A059]" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="flex items-center space-x-4 text-2xl font-serif text-editorial-black/80 text-left"
                  >
                    <LogOut className="h-6 w-6 text-red-900/50" />
                    <span>Sign out</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
