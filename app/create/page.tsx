import { CreateStoryForm } from "@/components/create-story-form";

export default function CreateStoryPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
      <section className="lg:sticky lg:top-8 lg:h-fit">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Forja inicial
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
          Crea una historia interactiva desde una idea personal o libre.
        </h1>
        <p className="mt-4 text-muted-foreground">
          StoryForge extrae conflicto, objetivo, emociones y relaciones para
          convertirlos en titulo, premisa, personajes, primera escena y tres
          decisiones.
        </p>
      </section>
      <CreateStoryForm />
    </main>
  );
}

