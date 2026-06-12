import type {
  InputKind,
  NarrativeExtraction,
  StoryCharacter,
  StoryScene,
  StoryStartResponse,
  WorldDefinition,
  WorldId
} from "@/types/story";
import { generateStructuredOutput } from "@/lib/openai/client";
import { CHARACTER_GENERATION_PROMPT } from "@/lib/openai/prompts/characters";
import { NARRATIVE_EXTRACTION_PROMPT } from "@/lib/openai/prompts/extraction";
import { SCENE_GENERATION_PROMPT } from "@/lib/openai/prompts/scene";
import {
  charactersSchema,
  narrativeExtractionSchema,
  sceneSchema
} from "@/lib/openai/schemas";

type CharacterGenerationOutput = {
  characters: Array<Omit<StoryCharacter, "id">>;
};

type SceneGenerationOutput = {
  storyTitle: string;
  premise: string;
  sceneTitle: string;
  narration: string;
  dialogue: StoryScene["dialogue"];
  characterReactions: Array<{
    characterName: string;
    reaction: string;
    stateChanges: StoryCharacter["state"];
  }>;
  choices: Array<{
    label: string;
    description: string;
    narrativeIntent: string;
    predictedConsequence: string;
  }>;
};

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function buildExtractionInput(params: {
  inputKind: InputKind;
  inputText: string;
  world: WorldDefinition;
}) {
  return JSON.stringify(
    {
      inputKind: params.inputKind,
      inputText: params.inputText,
      selectedWorld: params.world
    },
    null,
    2
  );
}

function buildCharacterInput(params: {
  extraction: NarrativeExtraction;
  world: WorldDefinition;
}) {
  return JSON.stringify(
    {
      narrativeExtraction: params.extraction,
      selectedWorld: params.world,
      requiredCharacterCount: "3 to 5"
    },
    null,
    2
  );
}

function buildSceneInput(params: {
  extraction: NarrativeExtraction;
  characters: StoryCharacter[];
  world: WorldDefinition;
}) {
  return JSON.stringify(
    {
      narrativeExtraction: params.extraction,
      characters: params.characters,
      selectedWorld: params.world,
      requiredChoices: 3
    },
    null,
    2
  );
}

export async function generateOpenAIStory(params: {
  inputKind: InputKind;
  inputText: string;
  world: WorldDefinition;
}): Promise<StoryStartResponse> {
  const extraction = await generateStructuredOutput<NarrativeExtraction>({
    name: "narrative_extraction",
    instructions: NARRATIVE_EXTRACTION_PROMPT,
    input: buildExtractionInput(params),
    schema: narrativeExtractionSchema
  });

  const characterOutput =
    await generateStructuredOutput<CharacterGenerationOutput>({
      name: "story_characters",
      instructions: CHARACTER_GENERATION_PROMPT,
      input: buildCharacterInput({
        extraction,
        world: params.world
      }),
      schema: charactersSchema
    });

  const characters = characterOutput.characters.map((character) => ({
    ...character,
    id: createId("char")
  }));

  const sceneOutput = await generateStructuredOutput<SceneGenerationOutput>({
    name: "first_scene",
    instructions: SCENE_GENERATION_PROMPT,
    input: buildSceneInput({
      extraction,
      characters,
      world: params.world
    }),
    schema: sceneSchema
  });

  const scene: StoryScene = {
    id: createId("scene"),
    index: 1,
    title: sceneOutput.sceneTitle,
    narration: sceneOutput.narration,
    dialogue: sceneOutput.dialogue,
    characterReactions: sceneOutput.characterReactions.map((reaction) => {
      const character = characters.find(
        (candidate) =>
          candidate.name.toLowerCase() === reaction.characterName.toLowerCase()
      );

      return {
        characterId: character?.id ?? createId("char_reaction"),
        characterName: reaction.characterName,
        reaction: reaction.reaction,
        stateChanges: reaction.stateChanges
      };
    }),
    choices: sceneOutput.choices.slice(0, 3).map((choice) => ({
      ...choice,
      id: createId("choice")
    }))
  };

  return {
    storySession: {
      id: createId("story"),
      title: sceneOutput.storyTitle,
      premise: sceneOutput.premise,
      worldId: params.world.id as WorldId,
      worldName: params.world.name,
      status: "active"
    },
    input: {
      kind: params.inputKind,
      text: params.inputText
    },
    extraction,
    characters,
    firstScene: scene,
    generatedWith: "openai"
  };
}

