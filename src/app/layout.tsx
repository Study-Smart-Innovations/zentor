import { Inter, Libre_Bodoni, Public_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fontSerif = Libre_Bodoni({
  variable: "--font-serif",
  subsets: ["latin"],
});

const fontSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Zentor. | The Academic Circle for Excellence",
  description:
    "A premium platform for students and teachers to learn, teach, and grow together in a high-end academic environment.",
  keywords: ["zentor", "study", "learning", "editorial", "education"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${fontSans.variable} ${fontSerif.variable} font-sans min-h-screen antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}