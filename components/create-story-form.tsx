"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, WandSparkles } from "lucide-react";

import type {
  InputKind,
  StoryStartRequest,
  StoryStartResponse,
  WorldId
} from "@/types/story";
import { WORLDS } from "@/lib/story/worlds";
import { cn } from "@/lib/utils";
import { StoryPlayer } from "@/components/story-player";
import { AlertMessage } from "@/components/ui/alert-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const inputKinds: Array<{
  value: InputKind;
  label: string;
  helper: string;
}> = [
  {
    value: "experience",
    label: "Experiencia",
    helper: "Algo que viviste o estas viviendo."
  },
  {
    value: "dream",
    label: "Sueno",
    helper: "Una imagen, deseo o escena onirica."
  },
  {
    value: "goal",
    label: "Meta",
    helper: "Algo que quieres lograr."
  },
  {
    value: "problem",
    label: "Problema",
    helper: "Una situacion que necesita resolverse."
  },
  {
    value: "free_idea",
    label: "Idea libre",
    helper: "Un concepto para convertir en ficcion."
  }
];

const placeholders: Record<InputKind, string> = {
  experience:
    "Ej: Queria contarles algo importante a mis padres, pero me dio miedo hacerlo.",
  dream:
    "Ej: Sone con una ciudad cubierta de lluvia donde todos conocian mi nombre.",
  goal:
    "Ej: Quiero presentar mi proyecto final, pero temo no estar listo.",
  problem:
    "Ej: Mi equipo no se pone de acuerdo y nadie quiere tomar la primera decision.",
  free_idea:
    "Ej: Una persona descubre una puerta que aparece solo cuando duda de si misma."
};

export function CreateStoryForm() {
  const [inputKind, setInputKind] = useState<InputKind>("experience");
  const [worldId, setWorldId] = useState<WorldId>("science_fiction");
  const [inputText, setInputText] = useState("");
  const [story, setStory] = useState<StoryStartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedWorld = useMemo(
    () => WORLDS.find((world) => world.id === worldId),
    [worldId]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (inputText.trim().length < 12) {
      setError("Escribe al menos una frase para forjar la historia.");
      return;
    }

    const payload: StoryStartRequest = {
      inputKind,
      inputText: inputText.trim(),
      worldId
    };

    setIsLoading(true);

    try {
      const response = await fetch("/api/stories/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as
        | StoryStartResponse
        | { error: string };

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "No se pudo crear la historia.");
      }

      setStory(data as StoryStartResponse);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Ocurrio un error creando la historia."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear historia</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label>Tipo de entrada</Label>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                {inputKinds.map((kind) => (
                  <button
                    key={kind.value}
                    type="button"
                    onClick={() => setInputKind(kind.value)}
                    className={cn(
                      "grid min-h-24 gap-2 rounded-lg border bg-white p-3 text-left transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      inputKind === kind.value && "border-primary bg-primary/5"
                    )}
                  >
                    <span className="font-semibold">{kind.label}</span>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {kind.helper}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="inputText">Texto base</Label>
              <Textarea
                id="inputText"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder={placeholders[inputKind]}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="worldId">Mundo</Label>
              <Select
                id="worldId"
                value={worldId}
                onChange={(event) => setWorldId(event.target.value as WorldId)}
              >
                {WORLDS.map((world) => (
                  <option key={world.id} value={world.id}>
                    {world.name}
                  </option>
                ))}
              </Select>
              {selectedWorld ? (
                <div className="rounded-md border bg-muted/40 p-3 text-sm leading-6 text-muted-foreground">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{selectedWorld.shortName}</Badge>
                    <span>{selectedWorld.tone}</span>
                  </div>
                  {selectedWorld.description}
                </div>
              ) : null}
            </div>

            {error ? <AlertMessage variant="error" message={error} /> : null}

            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              ) : (
                <WandSparkles className="mr-2 size-4" aria-hidden="true" />
              )}
              {isLoading ? "Forjando..." : "Generar historia"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {story ? <StoryPlayer story={story} /> : null}
    </div>
  );
}

