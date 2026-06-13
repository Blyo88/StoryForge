import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { StoryForgeLogo } from "@/components/storyforge-logo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "StoryForge | Tu historia. Tu mundo. Tus decisiones.",
  description:
    "Transforma experiencias, suenos y metas en aventuras interactivas impulsadas por IA."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070a0d]/88 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
            <StoryForgeLogo />
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/#worlds" className="hidden text-white/50 transition hover:text-white md:block">
                Mundos
              </Link>
              <Link href="/#forge" className="hidden text-white/50 transition hover:text-white md:block">
                Crear
              </Link>
              <Link
                href="/#forge"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 font-semibold text-black transition hover:bg-cyan-100"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Crear historia</span>
                <span className="sm:hidden">Crear</span>
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
