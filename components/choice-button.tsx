import { ArrowRight } from "lucide-react";

import type { StoryChoice } from "@/types/story";
import { cn } from "@/lib/utils";

export function ChoiceButton({
  choice,
  selected,
  onSelect
}: {
  choice: StoryChoice;
  selected?: boolean;
  onSelect: (choice: StoryChoice) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(choice)}
      className={cn(
        "group grid w-full gap-2 rounded-lg border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary bg-primary/5"
      )}
    >
      <span className="flex items-center justify-between gap-3 font-semibold">
        {choice.label}
        <ArrowRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary",
            selected && "text-primary"
          )}
          aria-hidden="true"
        />
      </span>
      <span className="text-sm leading-6 text-muted-foreground">
        {choice.description}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
        {choice.narrativeIntent}
      </span>
    </button>
  );
}

