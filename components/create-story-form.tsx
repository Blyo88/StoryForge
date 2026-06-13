"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  History,
  Lightbulb,
  MoonStar,
  Puzzle,
  RefreshCw,
  Sparkles,
  Target,
  WandSparkles
} from "lucide-react";

import type {
  InputKind,
  StoryApiErrorResponse,
  StoryStartRequest,
  StoryStartResponse,
  WorldId
} from "@/types/story";
import { WORLDS } from "@/lib/story/worlds";
import { StoryPlayer } from "@/components/story-player";
import { StoryTypeCard } from "@/components/story-type-card";
import { WorldCard } from "@/components/world-card";
import { WorldPreview } from "@/components/world-preview";
import { GenerationOverlay } from "@/components/generation-overlay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_CHARACTERS = 2400;
const MIN_CHARACTERS = 12;
const REQUEST_TIMEOUT_MS = 180000;

const inputKinds = [
  {
    value: "experience" as const,
    label: "Experiencia real",
    helper: "Un momento que viviste.",
    icon: History
  },
  {
    value: "dream" as const,
    label: "Sueno",
    helper: "Una imagen que aun recuerdas.",
    icon: MoonStar
  },
  {
    value: "goal" as const,
    label: "Meta personal",
    helper: "Algo que quieres alcanzar.",
    icon: Target
  },
  {
    value: "problem" as const,
    label: "Problema actual",
    helper: "Una situacion por resolver.",
    icon: Puzzle
  },
  {
    value: "free_idea" as const,
    label: "Idea libre",
    helper: "Una chispa para una aventura.",
    icon: Lightbulb
  }
];

type GenerationError = {
  message: string;
  requestId?: string;
};

export function CreateStoryForm() {
  const [inputKind, setInputKind] = useState<InputKind>("experience");
  const [worldId, setWorldId] = useState<WorldId>("science_fiction");
  const [inputText, setInputText] = useState("");
  const [story, setStory] = useState<StoryStartResponse | null>(null);
  const [error, setError] = useState<GenerationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const selectedWorld = useMemo(
    () => WORLDS.find((world) => world.id === worldId) ?? WORLDS[0],
    [worldId]
  );

  useEffect(() => {
    return () => controllerRef.current?.abort("navigation");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generateStory();
  }

  async function generateStory() {
    const cleanText = inputText.trim();

    if (cleanText.length < MIN_CHARACTERS) {
      setError({
        message: `Escribe al menos ${MIN_CHARACTERS} caracteres para que podamos construir una escena.`
      });
      return;
    }

    setError(null);
    setStory(null);
    setIsLoading(true);
    setActiveStep(0);

    const controller = new AbortController();
    controllerRef.current = controller;
    const startedAt = Date.now();
    const timeout = window.setTimeout(
      () => controller.abort("timeout"),
      REQUEST_TIMEOUT_MS
    );
    const progress = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, 4));
    }, 1750);

    const payload: StoryStartRequest = {
      inputKind,
      inputText: cleanText,
      worldId
    };

    try {
      const response = await fetch("/api/stories/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const rawBody = await response.text();
      const requestId = response.headers.get("x-request-id") ?? undefined;
      let data: StoryStartResponse | StoryApiErrorResponse | null = null;

      if (rawBody) {
        try {
          data = JSON.parse(rawBody) as StoryStartResponse | StoryApiErrorResponse;
        } catch {
          throw new Error(
            "El servidor devolvio una respuesta inesperada. Reinicia el servidor e intenta nuevamente."
          );
        }
      }

      if (!response.ok) {
        const apiError = data as StoryApiErrorResponse | null;
        throw new RequestError(
          apiError?.error ?? getStatusMessage(response.status),
          apiError?.requestId ?? requestId
        );
      }

      if (!isStoryStartResponse(data)) {
        throw new RequestError(
          "La historia fue generada, pero su formato no es valido.",
          requestId
        );
      }

      setActiveStep(4);
      const minimumAnimationTime = 2600;
      const remainingAnimation = minimumAnimationTime - (Date.now() - startedAt);
      if (remainingAnimation > 0) {
        await wait(remainingAnimation);
      }

      if (controller.signal.aborted) {
        throw new DOMException("Generation cancelled", "AbortError");
      }

      setStory(data);
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (caughtError) {
      if (controller.signal.aborted) {
        setError({
          message:
            controller.signal.reason === "timeout"
              ? "La generacion tomo demasiado tiempo. Comprueba tu conexion e intenta nuevamente."
              : "La generacion fue cancelada. Tu texto sigue aqui para intentarlo de nuevo."
        });
      } else if (caughtError instanceof RequestError) {
        setError({ message: caughtError.message, requestId: caughtError.requestId });
      } else if (caughtError instanceof TypeError) {
        setError({
          message:
            "No pudimos conectar con StoryForge. Verifica que el servidor este activo y vuelve a intentar."
        });
      } else {
        setError({
          message:
            caughtError instanceof Error
              ? caughtError.message
              : "Ocurrio un error inesperado al generar la historia."
        });
      }
    } finally {
      window.clearTimeout(timeout);
      window.clearInterval(progress);
      controllerRef.current = null;
      setIsLoading(false);
    }
  }

  function cancelGeneration() {
    controllerRef.current?.abort("cancelled");
  }

  return (
    <>
      <GenerationOverlay
        visible={isLoading}
        activeStep={activeStep}
        world={selectedWorld}
        onCancel={cancelGeneration}
      />

      <div className="grid gap-14">
        <section aria-labelledby="story-type-heading">
          <SectionHeading
            id="story-type-heading"
            number="01"
            title="Que quieres transformar"
            description="Elige el origen de la historia. La esencia permanece; el mundo cambia."
          />
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {inputKinds.map((kind) => (
              <StoryTypeCard
                key={kind.value}
                {...kind}
                selected={inputKind === kind.value}
                onSelect={setInputKind}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="world-heading">
          <SectionHeading
            id="world-heading"
            number="02"
            title="Elige tu mundo"
            description="Cada universo cambia el tono, las reglas y la forma que toma el conflicto."
          />
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {WORLDS.map((world) => (
              <WorldCard
                key={world.id}
                world={world}
                selected={worldId === world.id}
                onSelect={(selected) => setWorldId(selected.id)}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="story-input-heading">
          <SectionHeading
            id="story-input-heading"
            number="03"
            title="Escribe la chispa"
            description="Puede ser breve, imperfecta y completamente tuya."
          />

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-7"
            >
              <label
                htmlFor="inputText"
                className="text-sm font-medium text-white"
              >
                Tu punto de partida
              </label>
              <div className="relative mt-3">
                <Textarea
                  id="inputText"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  maxLength={MAX_CHARACTERS}
                  placeholder="Cuentame algo que te paso, sonaste o quieres lograr..."
                  className="min-h-[250px] resize-none border-white/10 bg-black/25 px-5 py-5 text-base leading-7 text-white shadow-none placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/50"
                  aria-describedby="character-count"
                />
                <span
                  id="character-count"
                  className="absolute bottom-4 right-4 rounded-md bg-black/45 px-2 py-1 text-xs tabular-nums text-white/42"
                >
                  {inputText.length}/{MAX_CHARACTERS}
                </span>
              </div>

              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  aria-live="assertive"
                  className="mt-4 flex items-start gap-3 rounded-lg border border-red-400/25 bg-red-400/[0.08] p-4"
                >
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-300" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-red-100">No pudimos forjar la historia</p>
                    <p className="mt-1 text-sm leading-6 text-red-100/65">{error.message}</p>
                    {error.requestId ? (
                      <p className="mt-2 font-mono text-[11px] text-red-100/35">
                        Referencia: {error.requestId}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void generateStory()}
                    className="grid size-9 shrink-0 place-items-center rounded-md border border-red-200/15 text-red-100/65 transition hover:bg-red-100/10 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                    aria-label="Intentar nuevamente"
                  >
                    <RefreshCw className="size-4" aria-hidden="true" />
                  </button>
                </motion.div>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs text-white/38">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Tu texto se usa para construir esta aventura.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="h-12 min-w-52 bg-white text-black hover:bg-white/88"
                >
                  <WandSparkles className="mr-2 size-4" aria-hidden="true" />
                  Generar Historia
                </Button>
              </div>
            </form>

            <WorldPreview world={selectedWorld} inputKind={inputKind} />
          </div>
        </section>

        <div className="flex justify-center text-white/25" aria-hidden="true">
          <ArrowDown className="size-5 animate-bounce" />
        </div>

        <div ref={resultRef} className="scroll-mt-24">
          {story ? (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <StoryPlayer story={story} />
            </motion.div>
          ) : (
            <div className="border-t border-white/10 pt-8 text-center text-sm text-white/28">
              Tu historia aparecera aqui cuando termine la forja.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SectionHeading({
  id,
  number,
  title,
  description
}: {
  id: string;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="pt-1 font-mono text-xs text-cyan-300/70">{number}</span>
      <div>
        <h2 id={id} className="text-2xl font-semibold text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">{description}</p>
      </div>
    </div>
  );
}

class RequestError extends Error {
  requestId?: string;

  constructor(message: string, requestId?: string) {
    super(message);
    this.name = "RequestError";
    this.requestId = requestId;
  }
}

function getStatusMessage(status: number) {
  if (status === 400) return "Revisa el texto y el mundo seleccionado.";
  if (status === 429) return "Hay demasiadas solicitudes. Espera un momento.";
  if (status >= 500) return "El servicio de generacion no esta disponible.";
  return "La solicitud no pudo completarse.";
}

function isStoryStartResponse(
  value: StoryStartResponse | StoryApiErrorResponse | null
): value is StoryStartResponse {
  if (!value || !("storySession" in value)) return false;

  return Boolean(
    value.storySession?.id &&
      value.storySession?.title &&
      Array.isArray(value.characters) &&
      value.characters.length > 0 &&
      value.firstScene?.narration &&
      Array.isArray(value.firstScene?.choices) &&
      value.firstScene.choices.length === 3
  );
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
