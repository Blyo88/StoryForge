import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { isGeminiConfigured } from "@/lib/openai/client";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { generateGeminiStory } from "@/lib/story/generate";
import { createDemoStory } from "@/lib/story/mock";
import { getWorldById, isWorldId } from "@/lib/story/worlds";
import type { InputKind, StoryStartRequest, StoryStartResponse } from "@/types/story";

export const runtime = "nodejs";

const inputKinds = new Set<InputKind>([
  "experience",
  "dream",
  "goal",
  "problem",
  "free_idea"
]);

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function isInputKind(value: string): value is InputKind {
  return inputKinds.has(value as InputKind);
}

function validatePayload(payload: Partial<StoryStartRequest>) {
  if (!payload.inputText || payload.inputText.trim().length < 12) {
    return "Escribe al menos 12 caracteres para crear una historia.";
  }

  if (payload.inputText.trim().length > 5000) {
    return "El texto no puede superar 5000 caracteres.";
  }

  if (!payload.inputKind || !isInputKind(payload.inputKind)) {
    return "inputKind no es valido.";
  }

  if (!payload.worldId || !isWorldId(payload.worldId)) {
    return "worldId no es valido.";
  }

  return null;
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const responseHeaders = {
    "X-Request-Id": requestId
  };

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      {
        error: "La solicitud debe enviarse como JSON.",
        code: "INVALID_CONTENT_TYPE",
        requestId
      },
      { status: 415, headers: responseHeaders }
    );
  }

  let payload: Partial<StoryStartRequest>;

  try {
    payload = (await request.json()) as Partial<StoryStartRequest>;
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer los datos enviados.", code: "INVALID_JSON", requestId },
      { status: 400, headers: responseHeaders }
    );
  }

  const validationError = validatePayload(payload);

  if (validationError) {
    return NextResponse.json(
      { error: validationError, code: "VALIDATION_ERROR", requestId },
      { status: 400, headers: responseHeaders }
    );
  }

  const inputKind = payload.inputKind as InputKind;
  const inputText = payload.inputText!.trim();
  const world = getWorldById(payload.worldId!);

  if (!world) {
    return NextResponse.json(
      { error: "El mundo seleccionado no existe.", code: "WORLD_NOT_FOUND", requestId },
      { status: 404, headers: responseHeaders }
    );
  }

  try {
    let story: StoryStartResponse;
    const geminiConfigured = isGeminiConfigured();

    if (!geminiConfigured) {
      story = createDemoStory({ inputKind, inputText, worldId: world.id });
      story.generationNotice =
        "Modo demo activo: configura GEMINI_API_KEY para generar historias con IA.";
    } else {
      try {
        story = await generateGeminiStory({ inputKind, inputText, world });
      } catch (geminiError) {
        const allowDemoFallback =
          process.env.STORYFORGE_DEMO_FALLBACK === "true" ||
          process.env.NODE_ENV !== "production";

        if (!allowDemoFallback) {
          throw geminiError;
        }

        console.error(`[${requestId}] Gemini generation failed; using demo`, geminiError);
        story = createDemoStory({ inputKind, inputText, worldId: world.id });
        story.generationNotice =
          "Gemini no estuvo disponible. Mostramos una historia demo para que puedas continuar.";
      }
    }

    story.requestId = requestId;

    await persistStoryIfConfigured(story);

    return NextResponse.json(story, { headers: responseHeaders });
  } catch (error) {
    console.error(`[${requestId}] Story generation failed`, error);

    return NextResponse.json(
      {
        error: getPublicGenerationError(error),
        code: "GENERATION_FAILED",
        requestId
      },
      { status: 502, headers: responseHeaders }
    );
  }
}

function getPublicGenerationError(error: unknown) {
  if (!(error instanceof Error)) {
    return "No pudimos generar la historia. Intenta nuevamente.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("timeout") || message.includes("timed out")) {
    return "La generacion tomo demasiado tiempo. Intenta de nuevo en unos segundos.";
  }

  if (message.includes("api key") || message.includes("authentication")) {
    return "La conexion con Gemini no esta configurada correctamente.";
  }

  if (message.includes("rate limit") || message.includes("429")) {
    return "El servicio de IA esta ocupado. Espera un momento e intenta nuevamente.";
  }

  return "No pudimos completar la generacion con IA. Intenta nuevamente.";
}

async function persistStoryIfConfigured(story: StoryStartResponse) {
  if (!isDatabaseConfigured()) {
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.world.upsert({
        where: { id: story.storySession.worldId },
        update: {
          name: story.storySession.worldName,
          description: `Mundo narrativo ${story.storySession.worldName}`,
          tone: "Definido por StoryForge",
          rules: {}
        },
        create: {
          id: story.storySession.worldId,
          name: story.storySession.worldName,
          description: `Mundo narrativo ${story.storySession.worldName}`,
          tone: "Definido por StoryForge",
          rules: {}
        }
      });

      const input = await tx.storyInput.create({
        data: {
          kind: story.input.kind,
          rawText: story.input.text,
          worldId: story.storySession.worldId
        }
      });

      await tx.narrativeExtraction.create({
        data: {
          inputId: input.id,
          mainConflict: story.extraction.mainConflict,
          protagonistGoal: story.extraction.protagonistGoal,
          emotions: toJson(story.extraction.emotions),
          relationships: toJson(story.extraction.relationships),
          coreEssence: story.extraction.coreEssence,
          narrativeStakes: story.extraction.narrativeStakes
        }
      });

      const session = await tx.storySession.create({
        data: {
          id: story.storySession.id,
          inputId: input.id,
          worldId: story.storySession.worldId,
          title: story.storySession.title,
          premise: story.storySession.premise,
          status: story.storySession.status
        }
      });

      for (const character of story.characters) {
        await tx.character.create({
          data: {
            id: character.id,
            storySessionId: session.id,
            name: character.name,
            role: character.role,
            archetype: character.archetype,
            motivation: character.motivation,
            fear: character.fear,
            relationToProtagonist: character.relationToProtagonist,
            traits: toJson(character.traits),
            state: {
              create: character.state
            }
          }
        });
      }

      const scene = await tx.scene.create({
        data: {
          id: story.firstScene.id,
          storySessionId: session.id,
          index: story.firstScene.index,
          title: story.firstScene.title,
          narration: story.firstScene.narration,
          dialogue: toJson(story.firstScene.dialogue),
          reactions: toJson(story.firstScene.characterReactions)
        }
      });

      await tx.choice.createMany({
        data: story.firstScene.choices.map((choice) => ({
          id: choice.id,
          storySessionId: session.id,
          sceneId: scene.id,
          label: choice.label,
          description: choice.description,
          narrativeIntent: choice.narrativeIntent,
          predictedConsequence: choice.predictedConsequence
        }))
      });

      await tx.storyMemory.create({
        data: {
          storySessionId: session.id,
          facts: toJson([
            story.extraction.coreEssence,
            `Primera escena: ${story.firstScene.title}`
          ]),
          unresolvedConflicts: toJson([story.extraction.mainConflict]),
          relationshipChanges: toJson([])
        }
      });

      await tx.storySession.update({
        where: { id: session.id },
        data: {
          currentSceneId: scene.id
        }
      });
    });
  } catch (error) {
    console.warn("Story generated but was not persisted", error);
  }
}
