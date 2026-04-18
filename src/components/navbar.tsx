"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Sign in", href: "/login" },
  ];

  return (
    <nav className="z-50 w-full bg-transparent">
      <div className="px-8 sm:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-black tracking-tighter text-editorial-black font-serif">
               Zentor<span className="text-[#C5A059]">.</span>
            </span>
          </Link>

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

          <div className="flex md:hidden">
            {!isAuthenticated ? (
              <Link
                href="/register"
                className="rounded-full bg-editorial-black px-6 py-2.5 text-xs font-bold text-white shadow-lg"
              >
                Get started
              </Link>
            ) : (
              <button
                onClick={() => signOut()}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-editorial-black text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
