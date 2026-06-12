import Link from "next/link";
import { ArrowRight, BookMarked, GitBranch, MessagesSquare } from "lucide-react";

import { StoryCard } from "@/components/story-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleStories = [
  {
    id: "demo-1",
    title: "La falla antes del salto",
    worldName: "Ciencia ficcion",
    premise:
      "Una ingeniera debe revelar una falla critica a una tripulacion que ya no confia en ella.",
    status: "Demo",
    updatedAt: "Ahora"
  },
  {
    id: "demo-2",
    title: "El juramento bajo la torre",
    worldName: "Medieval",
    premise:
      "Un aprendiz guarda una verdad que podria salvar al reino o destruir su unica familia.",
    status: "Demo",
    updatedAt: "Ahora"
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="story-surface text-white">
        <div className="mx-auto grid min-h-[520px] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
              Novela interactiva personalizada
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
              StoryForge transforma ideas reales en mundos jugables.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Escribe una experiencia, un sueno, una meta o una idea libre. Elige
              un mundo y deja que la IA cree titulo, premisa, personajes, escena
              inicial y decisiones con consecuencias.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/create">
                  Crear primera historia
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#mvp">Ver flujo MVP</a>
              </Button>
            </div>
          </div>

          <div className="grid content-center gap-4">
            <Card className="border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessagesSquare className="size-5 text-amber-200" aria-hidden="true" />
                  Entrada del usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-white/82">
                <p>
                  &quot;Tengo una meta importante, pero me paraliza decepcionar a mi
                  equipo si fallo.&quot;
                </p>
                <div className="grid gap-3 rounded-md border border-white/15 bg-black/20 p-4">
                  <div className="flex items-center gap-2">
                    <BookMarked className="size-4 text-teal-200" aria-hidden="true" />
                    Mundo: Cyberpunk
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="size-4 text-amber-200" aria-hidden="true" />
                    Tres decisiones abren rutas distintas.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="mvp" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold">Primera version funcional</h2>
            <p className="mt-3 text-muted-foreground">
              El MVP se concentra en crear y jugar una primera escena interactiva.
              El analisis personal queda como extraccion narrativa interna.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sampleStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
