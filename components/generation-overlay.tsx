"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, LoaderCircle, X } from "lucide-react";

import type { WorldDefinition } from "@/types/story";

const steps = [
  "Analizando experiencia",
  "Identificando conflicto",
  "Construyendo personajes",
  "Creando mundo",
  "Generando historia"
];

export function GenerationOverlay({
  visible,
  activeStep,
  world,
  onCancel
}: {
  visible: boolean;
  activeStep: number;
  world: WorldDefinition;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#050709] p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Generando historia"
        >
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={world.image}
              alt=""
              fill
              priority
              className="object-cover opacity-45"
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050709_74%)]" />
          <div className="absolute inset-0 bg-[#050709]/35 backdrop-blur-[2px]" />

          <button
            type="button"
            onClick={onCancel}
            className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-md border border-white/15 bg-black/30 text-white/65 transition hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cancelar generacion"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <div className="relative w-full max-w-xl text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-8 grid size-20 place-items-center rounded-full border border-white/15 bg-black/30 shadow-[0_0_60px_rgba(255,255,255,0.08)]"
            >
              <LoaderCircle
                className="size-9"
                style={{ color: world.accent }}
                aria-hidden="true"
              />
            </motion.div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              StoryForge esta forjando tu aventura
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {steps[activeStep]}
            </h2>

            <div className="mx-auto mt-10 grid max-w-md gap-3 text-left">
              {steps.map((step, index) => {
                const completed = index < activeStep;
                const active = index === activeStep;
                return (
                  <motion.div
                    key={step}
                    animate={{ opacity: index <= activeStep ? 1 : 0.35 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="grid size-7 shrink-0 place-items-center rounded-full border text-xs"
                      style={{
                        borderColor: index <= activeStep ? world.accent : "rgba(255,255,255,.2)",
                        backgroundColor: completed ? world.accent : "rgba(0,0,0,.28)",
                        color: completed ? "#050709" : world.accent
                      }}
                    >
                      {completed ? (
                        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className={active ? "font-medium text-white" : "text-white/55"}>
                      {step}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

