export const narrativeExtractionSchema = {
  type: "object",
  properties: {
    mainConflict: { type: "string" },
    protagonistGoal: { type: "string" },
    emotions: {
      type: "array",
      items: { type: "string" }
    },
    relationships: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          dynamic: { type: "string" },
          tension: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["label", "dynamic", "tension"],
        additionalProperties: false
      }
    },
    coreEssence: { type: "string" },
    narrativeStakes: { type: "string" }
  },
  required: [
    "mainConflict",
    "protagonistGoal",
    "emotions",
    "relationships",
    "coreEssence",
    "narrativeStakes"
  ],
  additionalProperties: false
} as const;

export const charactersSchema = {
  type: "object",
  properties: {
    characters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          role: { type: "string" },
          archetype: { type: "string" },
          motivation: { type: "string" },
          fear: { type: "string" },
          relationToProtagonist: { type: "string" },
          traits: {
            type: "array",
            items: { type: "string" }
          },
          state: {
            type: "object",
            properties: {
              trust: { type: "number" },
              tension: { type: "number" },
              loyalty: { type: "number" },
              suspicion: { type: "number" }
            },
            required: ["trust", "tension", "loyalty", "suspicion"],
            additionalProperties: false
          }
        },
        required: [
          "name",
          "role",
          "archetype",
          "motivation",
          "fear",
          "relationToProtagonist",
          "traits",
          "state"
        ],
        additionalProperties: false
      }
    }
  },
  required: ["characters"],
  additionalProperties: false
} as const;

export const sceneSchema = {
  type: "object",
  properties: {
    storyTitle: { type: "string" },
    premise: { type: "string" },
    sceneTitle: { type: "string" },
    narration: { type: "string" },
    dialogue: {
      type: "array",
      items: {
        type: "object",
        properties: {
          character: { type: "string" },
          line: { type: "string" }
        },
        required: ["character", "line"],
        additionalProperties: false
      }
    },
    characterReactions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          characterName: { type: "string" },
          reaction: { type: "string" },
          stateChanges: {
            type: "object",
            properties: {
              trust: { type: "number" },
              tension: { type: "number" },
              loyalty: { type: "number" },
              suspicion: { type: "number" }
            },
            required: ["trust", "tension", "loyalty", "suspicion"],
            additionalProperties: false
          }
        },
        required: ["characterName", "reaction", "stateChanges"],
        additionalProperties: false
      }
    },
    choices: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          description: { type: "string" },
          narrativeIntent: { type: "string" },
          predictedConsequence: { type: "string" }
        },
        required: [
          "label",
          "description",
          "narrativeIntent",
          "predictedConsequence"
        ],
        additionalProperties: false
      }
    }
  },
  required: [
    "storyTitle",
    "premise",
    "sceneTitle",
    "narration",
    "dialogue",
    "characterReactions",
    "choices"
  ],
  additionalProperties: false
} as const;

export const continuationSchema = {
  type: "object",
  properties: {
    consequence: { type: "string" },
    nextScene: sceneSchema
  },
  required: ["consequence", "nextScene"],
  additionalProperties: false
} as const;

