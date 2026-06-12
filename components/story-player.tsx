"use client";

import { useMemo, useState } from "react";
import { BookOpen, GitBranch, MessagesSquare } from "lucide-react";

import type { StoryChoice, StoryStartResponse } from "@/types/story";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CharacterCard } from "@/components/character-card";
import { ChoiceButton } from "@/components/choice-button";

export function StoryPlayer({ story }: { story: StoryStartResponse }) {
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);

  const selectedReaction = useMemo(() => {
    if (!selectedChoice) {
      return null;
    }

    return selectedChoice.predictedConsequence;
  }, [selectedChoice]);

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-primary/30">
        <div className="story-surface p-6 text-white">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{story.storySession.worldName}</Badge>
            <Badge variant="outline" className="border-white/30 text-white">
              {story.generatedWith === "openai" ? "OpenAI" : "Demo local"}
            </Badge>
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-tight">
            {story.storySession.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78">
            {story.storySession.premise}
          </p>
        </div>
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <Insight label="Conflicto" value={story.extraction.mainConflict} />
          <Insight label="Objetivo" value={story.extraction.protagonistGoal} />
          <Insight
            label="Emociones"
            value={story.extraction.emotions.join(", ")}
          />
        </CardContent>
      </Card>

      <section className="grid gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" aria-hidden="true" />
          <h3 className="text-xl font-semibold">Personajes</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {story.characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessagesSquare className="size-5 text-primary" aria-hidden="true" />
              {story.firstScene.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <p className="whitespace-pre-line text-base leading-8">
              {story.firstScene.narration}
            </p>
            <div className="grid gap-3">
              {story.firstScene.dialogue.map((line, index) => (
                <blockquote
                  key={`${line.character}-${index}`}
                  className="rounded-md border-l-4 border-secondary bg-muted/50 p-4"
                >
                  <p className="font-semibold">{line.character}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    &quot;{line.line}&quot;
                  </p>
                </blockquote>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="size-5 text-primary" aria-hidden="true" />
            <h3 className="text-xl font-semibold">Decisiones</h3>
          </div>
          <div className="grid gap-3">
            {story.firstScene.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                selected={selectedChoice?.id === choice.id}
                onSelect={setSelectedChoice}
              />
            ))}
          </div>
        </div>

        {selectedReaction ? (
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Consecuencia prevista</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">{selectedReaction}</p>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
