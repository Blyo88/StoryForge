import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { BookOpenText, Sparkles } from "lucide-react";

// TypeScript puede advertir sobre importaciones de CSS con efectos secundarios si no hay
// declaraciones. Esto no afecta al runtime; Next.js gestiona estas importaciones.
// @ts-ignore
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
  title: "StoryForge",
  description: "Historias interactivas personalizadas generadas con IA."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
                <BookOpenText className="size-5" aria-hidden="true" />
              </span>
              <span>StoryForge</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Crear historia
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

