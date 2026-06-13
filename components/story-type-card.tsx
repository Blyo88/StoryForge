"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { InputKind } from "@/types/story";

export function StoryTypeCard({
  value,
  label,
  helper,
  icon: Icon,
  selected,
  onSelect
}: {
  value: InputKind;
  label: string;
  helper: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (value: InputKind) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(value)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative min-h-36 overflow-hidden rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
        selected
          ? "border-cyan-300/80 bg-cyan-300/[0.09] text-white shadow-[0_0_32px_rgba(70,215,232,0.12)]"
          : "border-white/10 bg-white/[0.035] text-white/76 hover:border-white/25 hover:bg-white/[0.06]"
      )}
      aria-pressed={selected}
    >
      <span
        className={cn(
          "mb-5 grid size-10 place-items-center rounded-md border transition-colors",
          selected
            ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-200"
            : "border-white/10 bg-black/20 text-white/64 group-hover:text-white"
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="block font-semibold text-white">{label}</span>
      <span className="mt-1.5 block text-xs leading-5 text-white/50">{helper}</span>
      {selected ? (
        <motion.span
          layoutId="story-type-indicator"
          className="absolute inset-x-4 bottom-0 h-0.5 bg-cyan-300"
        />
      ) : null}
    </motion.button>
  );
}

