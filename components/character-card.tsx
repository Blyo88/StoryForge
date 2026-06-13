import { Shield, Sparkle } from "lucide-react";

import type { StoryCharacter } from "@/types/story";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CharacterCard({ character }: { character: StoryCharacter }) {
  return (
    <Card className="h-full border-white/10 bg-white/[0.035] shadow-none">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{character.name}</CardTitle>
            <p className="mt-1 text-sm text-white/42">{character.role}</p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-md border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <Shield className="size-4" aria-hidden="true" />
          </span>
        </div>
        <Badge variant="outline">{character.archetype}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="leading-6 text-white/48">
          {character.relationToProtagonist}
        </p>
        <div className="grid gap-2">
          <p>
            <span className="font-medium">Motivacion:</span>{" "}
            {character.motivation}
          </p>
          <p>
            <span className="font-medium">Temor:</span> {character.fear}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {character.traits.map((trait) => (
            <Badge key={trait} variant="muted" className="gap-1">
              <Sparkle className="size-3" aria-hidden="true" />
              {trait}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Stat label="Confianza" value={character.state.trust} />
          <Stat label="Tension" value={character.state.tension} />
          <Stat label="Lealtad" value={character.state.loyalty} />
          <Stat label="Sospecha" value={character.state.suspicion} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/8 bg-black/20 p-2 text-white/60">
      <div className="font-medium">{label}</div>
      <div className="mt-1 h-1.5 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-300"
          style={{ width: `${Math.min(Math.max(value, 0), 5) * 20}%` }}
        />
      </div>
    </div>
  );
}
