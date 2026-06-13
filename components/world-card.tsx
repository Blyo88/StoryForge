"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WorldDefinition } from "@/types/story";

export function WorldCard({
  world,
  selected,
  onSelect
}: {
  world: WorldDefinition;
  selected: boolean;
  onSelect: (world: WorldDefinition) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(world)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-lg border text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        selected ? "border-white/80" : "border-white/10 hover:border-white/35"
      )}
      style={{
        boxShadow: selected ? `0 0 38px ${world.accentSoft}` : undefined
      }}
      aria-pressed={selected}
    >
      <Image
        src={world.image}
        alt={`Mundo ${world.name}`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
      <span
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ backgroundColor: selected ? world.accent : "transparent" }}
      />
      <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <span className="block text-sm font-semibold text-white sm:text-base">
          {world.name}
        </span>
        <span className="mt-1 hidden text-xs text-white/55 sm:block">
          {world.tone}
        </span>
      </span>
      {selected ? (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-3 top-3 grid size-7 place-items-center rounded-full text-black"
          style={{ backgroundColor: world.accent }}
        >
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        </motion.span>
      ) : null}
    </motion.button>
  );
}

