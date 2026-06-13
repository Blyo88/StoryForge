"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, Sparkles } from "lucide-react";

import type { InputKind, WorldDefinition } from "@/types/story";

const inputLabels: Record<InputKind, string> = {
  experience: "Experiencia real",
  dream: "Sueno",
  goal: "Meta personal",
  problem: "Problema actual",
  free_idea: "Idea libre"
};

export function WorldPreview({
  world,
  inputKind
}: {
  world: WorldDefinition;
  inputKind: InputKind;
}) {
  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-[#0d1216] lg:sticky lg:top-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={world.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          <Image
            src={world.image}
            alt={`Vista previa de ${world.name}`}
            fill
            sizes="(max-width: 1024px) 100vw, 36vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a0d] via-[#070a0d]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070a0d]/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative flex min-h-[430px] flex-col justify-end p-6 sm:p-8">
        <motion.div
          key={`${world.id}-copy`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.16em]">
            <span
              className="rounded-md border px-2.5 py-1"
              style={{
                color: world.accent,
                borderColor: `${world.accent}66`,
                backgroundColor: world.accentSoft
              }}
            >
              {world.name}
            </span>
            <span className="rounded-md border border-white/15 bg-black/30 px-2.5 py-1 text-white/60">
              {inputLabels[inputKind]}
            </span>
          </div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/48">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Vista previa narrativa
          </p>
          <h3 className="max-w-md text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {world.previewTitle}
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/68">
            {world.previewExcerpt}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-white/48">
            <BookOpenText className="size-4" aria-hidden="true" />
            La escena cambiara segun tu texto y tus decisiones.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

