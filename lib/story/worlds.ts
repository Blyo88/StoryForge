import type { WorldDefinition, WorldId } from "@/types/story";

export const WORLDS: WorldDefinition[] = [
  {
    id: "science_fiction",
    name: "Ciencia ficcion",
    shortName: "Sci-fi",
    description:
      "Naves, estaciones orbitales, IA, exploracion y dilemas de supervivencia.",
    tone: "Asombro tecnico con tension humana.",
    visualCue: "Orbitas, metal frio, luces de emergencia."
  },
  {
    id: "fantasy",
    name: "Fantasia",
    shortName: "Fantasia",
    description:
      "Reinos, magia, criaturas antiguas, juramentos y profecias personales.",
    tone: "Maravilla, destino y conflictos del corazon.",
    visualCue: "Bosques imposibles, runas, antorchas y reliquias."
  },
  {
    id: "mystery",
    name: "Misterio",
    shortName: "Misterio",
    description:
      "Secretos, pistas ambiguas, habitaciones cerradas y verdades ocultas.",
    tone: "Suspenso cerebral con revelaciones graduales.",
    visualCue: "Sombras, lluvia, papeles marcados y relojes."
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    shortName: "Cyberpunk",
    description:
      "Megaciudades, corporaciones, implantes, datos robados y lealtades rotas.",
    tone: "Tenso, urbano, brillante y moralmente gris.",
    visualCue: "Neon, pantallas, callejones y lluvia acida."
  },
  {
    id: "medieval",
    name: "Medieval",
    shortName: "Medieval",
    description:
      "Castillos, gremios, duelos, alianzas familiares y decisiones de honor.",
    tone: "Dramatico, politico y ligado a promesas.",
    visualCue: "Piedra, mapas, sellos de cera y estandartes."
  },
  {
    id: "real_world",
    name: "Mundo real",
    shortName: "Real",
    description:
      "Escenas contemporaneas, conversaciones dificiles, trabajo, familia y ciudad.",
    tone: "Intimo, cinematografico y cercano.",
    visualCue: "Cafes, apartamentos, oficinas y calles conocidas."
  }
];

export function getWorldById(worldId: WorldId) {
  return WORLDS.find((world) => world.id === worldId);
}

export function isWorldId(value: string): value is WorldId {
  return WORLDS.some((world) => world.id === value);
}

