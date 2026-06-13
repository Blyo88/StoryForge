"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BookOpen, GitBranch, Info, MessagesSquare, Sparkles } from "lucide-react";

import type { StoryChoice, StoryStartResponse } from "@/types/story";
import { getWorldById } from "@/lib/story/worlds";
import { Badge } from "@/components/ui/badge";
import { CharacterCard } from "@/components/character-card";
import { ChoiceButton } from "@/components/choice-button";

export function StoryPlayer({ story }: { story: StoryStartResponse }) {
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const world = getWorldById(story.storySession.worldId);

  const selectedReaction = useMemo(
    () => selectedChoice?.predictedConsequence ?? null,
    [selectedChoice]
  );

  return (
    <article className="grid gap-10 border-t border-white/10 pt-14">
      <header className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10">
        {world ? (
          <Image
            src={world.image}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070a0d] via-[#070a0d]/72 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a0d] via-transparent to-black/25" />
        <div className="relative flex min-h-[430px] max-w-3xl flex-col justify-end p-6 sm:p-10">
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge variant="secondary">{story.storySession.worldName}</Badge>
            <Badge variant="outline" className="border-white/20 bg-black/20 text-white">
              {story.generatedWith === "openai" ? "Generada con IA" : "Demo local"}
            </Badge>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/65">
            Tu historia ha comenzado
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
            {story.storySession.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            {story.storySession.premise}
          </p>
        </div>
      </header>

      {story.generationNotice ? (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm text-amber-100/68">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
          <p>{story.generationNotice}</p>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <Insight label="Conflicto" value={story.extraction.mainConflict} />
        <Insight label="Objetivo" value={story.extraction.protagonistGoal} />
        <Insight label="Emociones" value={story.extraction.emotions.join(", ")} />
      </section>

      <section className="grid gap-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md border border-white/10 bg-white/5 text-cyan-200">
            <BookOpen className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Reparto</p>
            <h3 className="text-xl font-semibold text-white">Personajes</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {story.characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <MessagesSquare className="size-5 text-cyan-200" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">Escena 01</p>
              <h3 className="text-2xl font-semibold text-white">{story.firstScene.title}</h3>
            </div>
          </div>
          <p className="whitespace-pre-line text-base leading-8 text-white/70">
            {story.firstScene.narration}
          </p>
          <div className="mt-8 grid gap-3">
            {story.firstScene.dialogue.map((line, index) => (
              <blockquote
                key={`${line.character}-${index}`}
                className="border-l-2 border-cyan-300/45 bg-black/20 px-4 py-3"
              >
                <p className="text-sm font-semibold text-white">{line.character}</p>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  &quot;{line.line}&quot;
                </p>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="grid content-start gap-4">
          <div className="flex items-center gap-3">
            <GitBranch className="size-5 text-cyan-200" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">Tu turno</p>
              <h3 className="text-xl font-semibold text-white">Que haces ahora</h3>
            </div>
          </div>
          {story.firstScene.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              selected={selectedChoice?.id === choice.id}
              onSelect={setSelectedChoice}
            />
          ))}

          {selectedReaction ? (
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Consecuencia prevista
              </p>
              <p className="mt-3 text-sm leading-7 text-white/62">{selectedReaction}</p>
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/62">
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/50">{value}</p>
    </div>
  );
}

