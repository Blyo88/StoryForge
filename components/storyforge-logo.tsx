import Link from "next/link";
import type { Route } from "next";
import { BookOpenText, Sparkles } from "lucide-react";

export function StoryForgeLogo({ href = "/" }: { href?: Route }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <span className="relative grid size-9 place-items-center rounded-md border border-white/15 bg-white/[0.06] text-cyan-200 transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/10">
        <BookOpenText className="size-5" aria-hidden="true" />
        <Sparkles
          className="absolute -right-1 -top-1 size-3 text-amber-300"
          aria-hidden="true"
        />
      </span>
      <span className="text-base font-semibold tracking-[0.02em] text-white">
        StoryForge
      </span>
    </Link>
  );
}
