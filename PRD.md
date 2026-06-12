# StoryForge PRD

## Vision

StoryForge es una plataforma de historias interactivas personalizadas. El usuario introduce una experiencia real, un sueno, una meta, un problema o una idea libre, selecciona un mundo narrativo y la IA transforma esa entrada en una novela interactiva dinamica.

La funcionalidad principal no es el analisis conductual ni psicologico. El analisis existe solo como una etapa interna de adaptacion narrativa: extraer conflicto, objetivo, emociones y relaciones para construir una historia coherente, con personajes que reaccionan a las decisiones del usuario.

## Enfoque Del Producto

StoryForge debe sentirse como:

- Una novela interactiva generada para el usuario.
- Un motor de historias con continuidad.
- Una experiencia narrativa donde las decisiones importan.
- Una transformacion creativa de entradas personales o libres.

StoryForge no debe sentirse como:

- Una app terapeutica.
- Un sistema de diagnostico.
- Un analizador de conducta.
- Una herramienta de coaching obligatorio.

## Usuario Objetivo

Usuarios que quieren convertir ideas, problemas, recuerdos, metas o suenos en historias interactivas. El valor principal esta en la personalizacion narrativa, la inmersion y la sensacion de que los personajes recuerdan y reaccionan.

## Entrada Principal

El usuario puede introducir:

- Una experiencia real.
- Un sueno.
- Una meta.
- Un problema.
- Una idea libre.

Ejemplo:

Entrada: "Queria contarles algo importante a mis padres pero me dio miedo hacerlo."

Mundo: Ciencia ficcion.

Salida narrativa: "Una mision espacial donde una ingeniera teme informar a la tripulacion que detecto una falla critica antes del salto hiperespacial."

## Mundos Disponibles En El MVP

- Ciencia ficcion.
- Fantasia.
- Misterio.
- Cyberpunk.
- Medieval.
- Mundo real.

Cada mundo debe tener reglas narrativas propias: tono, tipos de conflicto, arquetipos, ambientacion, vocabulario, limites y recursos dramaticos.

## Funcionamiento De IA

La IA debe realizar dos fases principales.

### Fase 1: Extraccion Narrativa

Extrae de la entrada del usuario:

- Conflicto principal.
- Objetivo del protagonista.
- Emociones presentes.
- Relaciones relevantes.
- Nivel de urgencia narrativa.
- Elementos que deben conservarse como esencia.

Esta informacion no se muestra como diagnostico. Puede mostrarse parcialmente como "inspiracion de la historia" si aporta valor, pero la experiencia principal debe llevar rapido al usuario a la historia.

### Fase 2: Generacion Interactiva

Genera:

- Titulo.
- Premisa.
- Personajes.
- Primera escena.
- Dialogos.
- Tres decisiones.

Cada decision posterior genera:

- Reacciones de personajes.
- Consecuencias narrativas.
- Cambios en relaciones.
- Nueva escena.
- Tres nuevas decisiones.

## Requisitos Narrativos

Cada historia debe incluir:

- Personajes con objetivos, temores, motivaciones y relacion con el protagonista.
- Dialogos integrados en la escena.
- Decisiones claras, distintas entre si y con consecuencias visibles.
- Continuidad de eventos.
- Reacciones coherentes de personajes.
- Cambios acumulativos en estado narrativo.

Los personajes no deben actuar como generadores aleatorios de dialogo. Deben recordar decisiones previas dentro de la sesion y ajustar su confianza, tension, lealtad o sospecha.

## Arquitectura General

### 1. Frontend

Responsabilidades:

- Capturar entrada del usuario.
- Permitir seleccion de mundo.
- Mostrar pantalla de generacion.
- Mostrar historia en formato novela interactiva.
- Presentar decisiones.
- Mostrar consecuencias y nueva escena.
- Permitir continuar sesiones guardadas.

Vistas principales:

- Landing / entrada rapida.
- Nueva historia.
- Seleccion de mundo.
- Vista de historia activa.
- Biblioteca de historias.
- Detalle de historia guardada.

### 2. Backend

Responsabilidades:

- Autenticacion.
- Validacion de entradas.
- Persistencia de historias.
- Orquestacion de llamadas a IA.
- Control de costos y limites.
- Generacion de escenas y decisiones.
- Mantenimiento de memoria narrativa.

### 3. Motor Narrativo IA

Componentes:

- `NarrativeExtractor`: convierte entrada libre en estructura narrativa.
- `WorldAdapter`: adapta la esencia al mundo seleccionado.
- `StorySeeder`: crea titulo, premisa, personajes y primera escena.
- `SceneGenerator`: crea escenas nuevas segun decision y estado.
- `ContinuityManager`: mantiene memoria de hechos, relaciones y conflictos pendientes.
- `CharacterConsistencyEngine`: valida que los personajes reaccionen de acuerdo con su personalidad y decisiones previas.

### 4. Base De Datos

Debe guardar tanto la historia visible como el estado interno que permite continuidad.

Entidades principales:

- `users`: usuario de la plataforma.
- `worlds`: mundos narrativos disponibles.
- `story_inputs`: entrada original del usuario.
- `narrative_extractions`: conflicto, objetivo, emociones y relaciones extraidas.
- `story_sessions`: sesion principal de historia.
- `characters`: personajes generados.
- `character_states`: confianza, tension, lealtad, sospecha u otros valores narrativos.
- `scenes`: escenas generadas.
- `choices`: decisiones disponibles por escena.
- `decision_events`: decisiones tomadas y consecuencias.
- `story_memory`: hechos persistentes, conflictos abiertos y promesas narrativas.

### 5. Seguridad Y Limites

StoryForge debe tener una capa de seguridad de contenido, pero sin convertir la app en producto psicologico.

Reglas:

- No diagnosticar al usuario.
- No ofrecer terapia.
- No afirmar interpretaciones psicologicas profundas.
- Si la entrada contiene crisis, autolesion, violencia grave o peligro inmediato, responder con un flujo seguro y recursos adecuados.
- Permitir borrar historias y entradas.
- Separar claramente "inspiracion narrativa" de consejo personal.

## MVP Redefinido

El MVP debe probar esta promesa:

"El usuario escribe una entrada personal o libre, elige un mundo, y StoryForge genera una historia interactiva que continua de forma coherente segun sus decisiones."

### Incluido En MVP

- Entrada de texto libre.
- Seleccion de uno de seis mundos.
- Extraccion interna de conflicto, objetivo, emociones y relaciones.
- Generacion de titulo.
- Generacion de premisa.
- Generacion de 3 a 5 personajes.
- Generacion de primera escena con dialogos.
- Generacion de tres decisiones.
- Continuacion por decision seleccionada.
- Consecuencias narrativas visibles.
- Reacciones de personajes.
- Persistencia de escenas y decisiones.
- Biblioteca basica de historias.
- Estado narrativo minimo para continuidad.

### No Incluido En MVP

- Analisis personal visible como funcionalidad principal.
- Tareas del mundo real.
- Misiones reales.
- Sistema avanzado de progreso.
- Logros.
- Puntos.
- Entrada por voz.
- Memoria entre sesiones distintas.
- Multijugador.
- Marketplace de mundos.

## Flujo De Usuario MVP

1. El usuario entra a StoryForge.
2. Escribe una experiencia, sueno, meta, problema o idea libre.
3. Selecciona un mundo.
4. La app genera titulo, premisa y personajes.
5. El usuario inicia la primera escena.
6. La escena presenta narracion, dialogos y tres decisiones.
7. El usuario elige una decision.
8. La app genera consecuencias y reacciones de personajes.
9. La app actualiza memoria narrativa.
10. La app genera la siguiente escena y tres decisiones nuevas.
11. El usuario puede continuar o guardar la historia.

## APIs Principales

### `POST /api/stories/start`

Crea una nueva historia.

Entrada:

- `inputText`
- `worldId`

Salida:

- `storySession`
- `title`
- `premise`
- `characters`
- `firstScene`
- `choices`

### `POST /api/stories/:storyId/choose`

Procesa una decision del usuario.

Entrada:

- `sceneId`
- `choiceId`

Salida:

- `consequence`
- `characterReactions`
- `updatedCharacterStates`
- `nextScene`
- `nextChoices`

### `GET /api/stories`

Lista historias del usuario.

### `GET /api/stories/:storyId`

Devuelve una historia completa o su estado actual.

### `DELETE /api/stories/:storyId`

Elimina una historia.

## Contratos IA Sugeridos

### Extraccion Narrativa

```json
{
  "mainConflict": "string",
  "protagonistGoal": "string",
  "emotions": ["string"],
  "relationships": [
    {
      "label": "string",
      "dynamic": "string",
      "tension": "low | medium | high"
    }
  ],
  "coreEssence": "string",
  "narrativeStakes": "string"
}
```

### Escena

```json
{
  "title": "string",
  "narration": "string",
  "dialogue": [
    {
      "character": "string",
      "line": "string"
    }
  ],
  "characterReactions": [
    {
      "characterId": "string",
      "reaction": "string",
      "stateChanges": {
        "trust": 0,
        "tension": 0,
        "loyalty": 0,
        "suspicion": 0
      }
    }
  ],
  "choices": [
    {
      "label": "string",
      "description": "string",
      "narrativeIntent": "string"
    }
  ]
}
```

## Stack Tecnologico Propuesto

- Frontend: Next.js + TypeScript.
- UI: Tailwind CSS + shadcn/ui.
- Backend: Next.js Route Handlers o API separada en Node.js si el proyecto crece.
- Base de datos: PostgreSQL.
- Backend gestionado: Supabase para Auth y Postgres.
- ORM: Prisma.
- IA: OpenAI Responses API con structured outputs.
- Deploy: Vercel + Supabase.
- Testing: Vitest para logica y Playwright para flujos de usuario.

## Roadmap Universitario Para 3 Personas

### Semana 1: Fundacion

- Persona 1: wireframes y flujo de novela interactiva.
- Persona 2: modelo de datos, autenticacion y estructura backend.
- Persona 3: prompts, contratos JSON y pruebas de generacion IA.

### Semana 2: Creacion De Historia

- Persona 1: pantalla de entrada y seleccion de mundo.
- Persona 2: endpoint `POST /api/stories/start` y persistencia.
- Persona 3: extractor narrativo y generador de primera escena.

### Semana 3: Interactividad

- Persona 1: lector interactivo y componentes de decision.
- Persona 2: endpoint `POST /api/stories/:storyId/choose`.
- Persona 3: continuidad, memoria narrativa y coherencia de personajes.

### Semana 4: MVP Demo

- Integracion completa.
- Biblioteca de historias.
- Pruebas con ejemplos variados.
- Ajustes de prompts.
- Manejo de errores y limites de seguridad.
- Preparacion de demo.

## Versiones Futuras

- Puntos.
- Logros.
- Misiones del mundo real.
- Seguimiento de progreso.
- Adaptacion segun sesiones anteriores.
- Entrada por voz.
- Mundos desbloqueables.
- Campanas narrativas largas.
- Editor de personajes.
- Compartir historias.

