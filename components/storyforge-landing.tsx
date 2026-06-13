"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  GitBranch,
  Orbit,
  Sparkles
} from "lucide-react";

import { CreateStoryForm } from "@/components/create-story-form";

export function StoryForgeLanding() {
  return (
    <main className="overflow-hidden bg-[#070a0d] text-white">
      <section className="relative flex min-h-[calc(100svh-7.5rem)] items-center overflow-hidden border-b border-white/10">
        <Image
          src="/images/storyforge-hero.webp"
          alt="Un libro luminoso abre portales hacia mundos de ciencia ficcion, fantasia, misterio y aventura"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050709] via-[#050709]/82 to-[#050709]/12" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a0d] via-transparent to-black/25" />
        <div className="absolute inset-0 hero-noise opacity-30" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-cyan-200/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-cyan-100/80 backdrop-blur">
              <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
              Narrativa interactiva generada con IA
            </div>
            <h1 className="text-4xl font-semibold leading-[1.04] text-white sm:text-6xl lg:text-7xl">
              Tu vida contiene mundos que aun no has explorado.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-xl sm:leading-8">
              Transforma experiencias, suenos y metas en aventuras interactivas
              impulsadas por IA.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#forge"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-black transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                Crear Historia
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#worlds"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/20 bg-black/20 px-6 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Explorar mundos
                <Orbit className="size-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-14 grid max-w-2xl grid-cols-3 divide-x divide-white/12 border-y border-white/12 py-4"
          >
            <HeroMetric icon={BookOpenText} value="6 mundos" label="para transformar tu historia" />
            <HeroMetric icon={GitBranch} value="3 decisiones" label="en cada escena" />
            <HeroMetric icon={Sparkles} value="1 aventura" label="creada para ti" />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0a0e12]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
          <ProcessStep number="01" title="Cuenta" copy="Una experiencia, un sueno o una meta." />
          <ProcessStep number="02" title="Transforma" copy="Elige el universo que cambiara sus reglas." />
          <ProcessStep number="03" title="Decide" copy="Cada eleccion altera personajes y consecuencias." />
        </div>
      </section>

      <section id="forge" className="scroll-mt-20 bg-[#070a0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="mb-16 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300/70">
              Forja narrativa
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              De una chispa real a una historia que responde a ti.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/48">
              Selecciona el origen, entra en un mundo y deja que cada decision
              escriba la siguiente escena.
            </p>
          </div>
          <div id="worlds">
            <CreateStoryForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050709]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>StoryForge</span>
          <span>La primera escena comienza con algo que solo tu puedes contar.</span>
        </div>
      </footer>
    </main>
  );
}

function HeroMetric({
  icon: Icon,
  value,
  label
}: {
  icon: typeof Sparkles;
  value: string;
  label: string;
}) {
  return (
    <div className="px-3 first:pl-0 sm:px-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon className="size-4 text-cyan-200" aria-hidden="true" />
        {value}
      </div>
      <p className="mt-1 hidden text-xs text-white/38 sm:block">{label}</p>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  copy
}: {
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-xs text-cyan-300/55">{number}</span>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-white/42">{copy}</p>
      </div>
    </div>
  );
}
