import type {
  InputKind,
  NarrativeExtraction,
  StoryCharacter,
  StoryScene,
  StoryStartResponse,
  WorldId
} from "@/types/story";
import { getWorldById } from "@/lib/story/worlds";

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function createDemoStory(params: {
  inputKind: InputKind;
  inputText: string;
  worldId: WorldId;
}): StoryStartResponse {
  const world = getWorldById(params.worldId);
  const worldName = world?.name ?? "Mundo real";

  const extraction: NarrativeExtraction = {
    mainConflict:
      "El protagonista debe actuar aunque teme que su decision cambie una relacion importante.",
    protagonistGoal:
      "Encontrar una forma honesta de avanzar sin perder aquello que considera valioso.",
    emotions: ["duda", "expectativa", "miedo", "determinacion"],
    relationships: [
      {
        label: "Aliado cercano",
        dynamic: "Quiere ayudar, pero necesita una senal de confianza.",
        tension: "medium"
      }
    ],
    coreEssence: params.inputText.slice(0, 240),
    narrativeStakes:
      "Si el protagonista calla, el conflicto crecera; si actua, todo puede cambiar."
  };

  const characters: StoryCharacter[] = [
    {
      id: id("char"),
      name: "Ari Vela",
      role: "Protagonista",
      archetype: "La persona ante el umbral",
      motivation: "Dar un paso que lleva demasiado tiempo aplazando.",
      fear: "Que la verdad cierre una puerta para siempre.",
      relationToProtagonist: "Es el reflejo jugable del usuario.",
      traits: ["observador", "contenido", "resuelto"],
      state: {
        trust: 2,
        tension: 3,
        loyalty: 4,
        suspicion: 1
      }
    },
    {
      id: id("char"),
      name: "Nara Quill",
      role: "Aliada",
      archetype: "La testigo incomoda",
      motivation: "Evitar que Ari cargue solo con el secreto.",
      fear: "Que la indecision rompa al grupo.",
      relationToProtagonist: "Conoce parte de la verdad y presiona con cuidado.",
      traits: ["directa", "leal", "impaciente"],
      state: {
        trust: 4,
        tension: 2,
        loyalty: 5,
        suspicion: 1
      }
    },
    {
      id: id("char"),
      name: "Mael Orin",
      role: "Figura de autoridad",
      archetype: "El guardian de la consecuencia",
      motivation: "Mantener la estabilidad del mundo.",
      fear: "Que una mala decision desate un dano mayor.",
      relationToProtagonist: "Puede convertirse en obstaculo o mentor.",
      traits: ["prudente", "severo", "estrategico"],
      state: {
        trust: 1,
        tension: 4,
        loyalty: 2,
        suspicion: 3
      }
    }
  ];

  const scene: StoryScene = {
    id: id("scene"),
    index: 1,
    title: "El instante antes de hablar",
    narration: `En el mundo de ${worldName}, Ari Vela observa el lugar donde una sola frase puede cambiar el curso de todo. La senal de alerta no es ruidosa; late como una luz pequena al fondo de la sala. Nara nota su silencio. Mael espera una respuesta.`,
    dialogue: [
      {
        character: "Nara Quill",
        line: "Si lo sabes, Ari, este es el momento de decirlo."
      },
      {
        character: "Mael Orin",
        line: "No necesito valentia perfecta. Necesito una decision."
      }
    ],
    characterReactions: [
      {
        characterId: characters[1].id,
        characterName: "Nara Quill",
        reaction: "Nara se acerca, lista para apoyar si Ari habla primero.",
        stateChanges: {
          trust: 1,
          tension: 0,
          loyalty: 1,
          suspicion: 0
        }
      }
    ],
    choices: [
      {
        id: id("choice"),
        label: "Revelar la verdad",
        description: "Ari explica lo que ocurre antes de que sea imposible ocultarlo.",
        narrativeIntent: "Honestidad directa",
        predictedConsequence:
          "Nara gana confianza en Ari, pero Mael exigira pruebas inmediatas."
      },
      {
        id: id("choice"),
        label: "Pedir tiempo",
        description: "Ari retrasa la decision para reunir mas informacion.",
        narrativeIntent: "Cautela estrategica",
        predictedConsequence:
          "La tension baja por un instante, pero la sospecha de Mael aumenta."
      },
      {
        id: id("choice"),
        label: "Hablar con Nara aparte",
        description: "Ari busca una aliada antes de enfrentar a todos.",
        narrativeIntent: "Alianza privada",
        predictedConsequence:
          "Nara se compromete mas, pero el grupo nota que algo se oculta."
      }
    ]
  };

  return {
    storySession: {
      id: id("story"),
      title: `El eco de ${worldName}`,
      premise:
        "Una decision aplazada se convierte en el centro de una historia donde cada personaje recuerda como el protagonista decide actuar.",
      worldId: params.worldId,
      worldName,
      status: "active"
    },
    input: {
      kind: params.inputKind,
      text: params.inputText
    },
    extraction,
    characters,
    firstScene: scene,
    generatedWith: "demo"
  };
}
