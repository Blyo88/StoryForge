import Link from "next/link";
import { Clock, Compass } from "lucide-react";

import type { StorySummary } from "@/types/story";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StoryCard({ story }: { story: StorySummary }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{story.worldName}</Badge>
          <Badge variant="muted">{story.status}</Badge>
        </div>
        <CardTitle className="text-xl leading-tight">{story.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{story.premise}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {story.updatedAt}
          </span>
          <Link
            href="/create"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Forjar similar
            <Compass className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

