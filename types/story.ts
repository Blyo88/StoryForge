export const WORLD_IDS = [
  "science_fiction",
  "fantasy",
  "mystery",
  "cyberpunk",
  "medieval",
  "real_world"
] as const;

export type WorldId = (typeof WORLD_IDS)[number];

export type InputKind =
  | "experience"
  | "dream"
  | "goal"
  | "problem"
  | "free_idea";

export type StoryStatus = "draft" | "active" | "finished" | "archived";

export type TensionLevel = "low" | "medium" | "high";

export interface WorldDefinition {
  id: WorldId;
  name: string;
  shortName: string;
  description: string;
  tone: string;
  visualCue: string;
}

export interface RelationshipExtraction {
  label: string;
  dynamic: string;
  tension: TensionLevel;
}

export interface NarrativeExtraction {
  mainConflict: string;
  protagonistGoal: string;
  emotions: string[];
  relationships: RelationshipExtraction[];
  coreEssence: string;
  narrativeStakes: string;
}

export interface CharacterState {
  trust: number;
  tension: number;
  loyalty: number;
  suspicion: number;
}

export interface StoryCharacter {
  id: string;
  name: string;
  role: string;
  archetype: string;
  motivation: string;
  fear: string;
  relationToProtagonist: string;
  traits: string[];
  state: CharacterState;
}

export interface DialogueLine {
  character: string;
  line: string;
}

export interface CharacterReaction {
  characterId: string;
  characterName: string;
  reaction: string;
  stateChanges: CharacterState;
}

export interface StoryChoice {
  id: string;
  label: string;
  description: string;
  narrativeIntent: string;
  predictedConsequence: string;
}

export interface StoryScene {
  id: string;
  title: string;
  index: number;
  narration: string;
  dialogue: DialogueLine[];
  characterReactions: CharacterReaction[];
  choices: StoryChoice[];
}

export interface StorySession {
  id: string;
  title: string;
  premise: string;
  worldId: WorldId;
  worldName: string;
  status: StoryStatus;
}

export interface StoryStartRequest {
  inputKind: InputKind;
  inputText: string;
  worldId: WorldId;
}

export interface StoryStartResponse {
  storySession: StorySession;
  input: {
    kind: InputKind;
    text: string;
  };
  extraction: NarrativeExtraction;
  characters: StoryCharacter[];
  firstScene: StoryScene;
  generatedWith: "openai" | "demo";
}

export interface StorySummary {
  id: string;
  title: string;
  worldName: string;
  premise: string;
  status: string;
  updatedAt: string;
}

