import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { getOpenAIClient } from "@/lib/openai/client";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { generateOpenAIStory } from "@/lib/story/generate";
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
    return "inputText debe tener al menos 12 caracteres.";
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
  let payload: Partial<StoryStartRequest>;

  try {
    payload = (await request.json()) as Partial<StoryStartRequest>;
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const validationError = validatePayload(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const inputKind = payload.inputKind as InputKind;
  const inputText = payload.inputText!.trim();
  const world = getWorldById(payload.worldId!);

  if (!world) {
    return NextResponse.json({ error: "Mundo no encontrado." }, { status: 404 });
  }

  try {
    const story = getOpenAIClient()
      ? await generateOpenAIStory({
          inputKind,
          inputText,
          world
        })
      : createDemoStory({
          inputKind,
          inputText,
          worldId: world.id
        });

    await persistStoryIfConfigured(story);

    return NextResponse.json(story);
  } catch (error) {
    console.error("Story generation failed", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo generar la historia."
      },
      { status: 500 }
    );
  }
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
