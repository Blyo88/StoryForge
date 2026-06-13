import type { WorldDefinition, WorldId } from "@/types/story";

export const WORLDS: WorldDefinition[] = [
  {
    id: "science_fiction",
    name: "Ciencia ficcion",
    shortName: "Sci-fi",
    description:
      "Naves, estaciones orbitales, IA, exploracion y dilemas de supervivencia.",
    tone: "Asombro tecnico con tension humana.",
    visualCue: "Orbitas, metal frio, luces de emergencia.",
    image: "/images/worlds/science-fiction.jpg",
    accent: "#46d7e8",
    accentSoft: "rgba(70, 215, 232, 0.18)",
    previewTitle: "La ultima senal de Eos",
    previewExcerpt:
      "La estacion lleva once minutos en silencio. Tu mensaje puede salvar a la tripulacion o revelar por que la Tierra dejo de responder."
  },
  {
    id: "fantasy",
    name: "Fantasia",
    shortName: "Fantasia",
    description:
      "Reinos, magia, criaturas antiguas, juramentos y profecias personales.",
    tone: "Maravilla, destino y conflictos del corazon.",
    visualCue: "Bosques imposibles, runas, antorchas y reliquias.",
    image: "/images/worlds/fantasy.jpg",
    accent: "#8fd36b",
    accentSoft: "rgba(143, 211, 107, 0.18)",
    previewTitle: "El bosque que recuerda nombres",
    previewExcerpt:
      "Las ruinas flotantes despiertan cuando pronuncias tu meta. Una criatura antigua ofrece guiarte, pero pide un recuerdo a cambio."
  },
  {
    id: "mystery",
    name: "Misterio",
    shortName: "Misterio",
    description:
      "Secretos, pistas ambiguas, habitaciones cerradas y verdades ocultas.",
    tone: "Suspenso cerebral con revelaciones graduales.",
    visualCue: "Sombras, lluvia, papeles marcados y relojes.",
    image: "/images/worlds/mystery.jpg",
    accent: "#e4a84d",
    accentSoft: "rgba(228, 168, 77, 0.18)",
    previewTitle: "La habitacion sin testigos",
    previewExcerpt:
      "La nota en tu bolsillo tiene tu letra, pero no recuerdas haberla escrito. Afuera, alguien espera bajo la lluvia."
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    shortName: "Cyberpunk",
    description:
      "Megaciudades, corporaciones, implantes, datos robados y lealtades rotas.",
    tone: "Tenso, urbano, brillante y moralmente gris.",
    visualCue: "Neon, pantallas, callejones y lluvia acida.",
    image: "/images/worlds/cyberpunk.jpg",
    accent: "#f05ac8",
    accentSoft: "rgba(240, 90, 200, 0.2)",
    previewTitle: "Memoria de contrabando",
    previewExcerpt:
      "La corporacion compro tu pasado. Esta noche puedes recuperarlo, si confias en la unica persona que ya te traiciono."
  },
  {
    id: "medieval",
    name: "Medieval",
    shortName: "Medieval",
    description:
      "Castillos, gremios, duelos, alianzas familiares y decisiones de honor.",
    tone: "Dramatico, politico y ligado a promesas.",
    visualCue: "Piedra, mapas, sellos de cera y estandartes.",
    image: "/images/worlds/medieval.jpg",
    accent: "#d7aa62",
    accentSoft: "rgba(215, 170, 98, 0.2)",
    previewTitle: "El juramento de la torre gris",
    previewExcerpt:
      "El consejo exige una respuesta antes del amanecer. Decir la verdad puede salvar el reino y destruir tu apellido."
  },
  {
    id: "real_world",
    name: "Mundo real",
    shortName: "Real",
    description:
      "Escenas contemporaneas, conversaciones dificiles, trabajo, familia y ciudad.",
    tone: "Intimo, cinematografico y cercano.",
    visualCue: "Cafes, apartamentos, oficinas y calles conocidas.",
    image: "/images/worlds/real-world.jpg",
    accent: "#ff8d72",
    accentSoft: "rgba(255, 141, 114, 0.18)",
    previewTitle: "La conversacion pendiente",
    previewExcerpt:
      "La ciudad sigue su ritmo mientras ensayas una frase sencilla. Al otro lado de la puerta, alguien tambien tiene algo que decir."
  }
];

export function getWorldById(worldId: WorldId) {
  return WORLDS.find((world) => world.id === worldId);
}

export function isWorldId(value: string): value is WorldId {
  return WORLDS.some((world) => world.id === value);
}
