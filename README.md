# StoryForge

Primera version funcional de StoryForge: una app Next.js 15 que convierte una experiencia, sueno, meta, problema o idea libre en una novela interactiva generada con IA.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- Supabase
- Prisma
- OpenAI Responses API
- Framer Motion

## Estructura

```txt
app/
  api/stories/start/route.ts
  create/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  ui/
  character-card.tsx
  choice-button.tsx
  create-story-form.tsx
  story-card.tsx
  story-player.tsx
lib/
  openai/
    prompts/
    client.ts
    schemas.ts
  story/
    generate.ts
    mock.ts
    worlds.ts
  supabase/
  prisma.ts
prisma/
  schema.prisma
supabase/
  config.toml
  seed.sql
  migrations/
types/
  story.ts
```

## Variables de entorno

Copia `.env.local.example` a `.env.local` y configura:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
OPENAI_TIMEOUT_MS=60000
STORYFORGE_DEMO_FALLBACK=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=
```

Si `OPENAI_API_KEY` no existe, `/api/stories/start` responde con una historia demo local para permitir probar la UI.

Si OpenAI falla durante desarrollo, `STORYFORGE_DEMO_FALLBACK=true` mantiene el flujo funcional y muestra un aviso visible indicando que se uso el modo demo.

Si `DATABASE_URL` no existe, la historia se genera pero no se persiste.

## Comandos

```bash
pnpm install
pnpm prisma:generate
pnpm dev
pnpm test:smoke
```

## Endpoint principal

`POST /api/stories/start`

Body:

```json
{
  "inputKind": "experience",
  "inputText": "Queria contarles algo importante a mis padres pero me dio miedo hacerlo.",
  "worldId": "science_fiction"
}
```

Devuelve:

- analisis narrativo
- titulo
- premisa
- personajes
- primera escena
- tres decisiones

## Diagnostico de generacion

El formulario incluye validacion visible, contador de caracteres, timeout, cancelacion, progreso por etapas y mensajes con `requestId`. El endpoint devuelve errores JSON estandarizados y la cabecera `X-Request-Id`.

La prueba `pnpm test:smoke` usa Chrome para verificar el boton de generacion, las tres decisiones, el estado visual de error y la ausencia de overflow horizontal en movil.

