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
        "group grid w-full gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
        selected && "border-cyan-300/70 bg-cyan-300/[0.08]"
      )}
    >
      <span className="flex items-center justify-between gap-3 font-semibold text-white">
        {choice.label}
        <ArrowRight
          className={cn(
            "size-4 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-cyan-200",
            selected && "text-cyan-200"
          )}
          aria-hidden="true"
        />
      </span>
      <span className="text-sm leading-6 text-white/48">
        {choice.description}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-200/70">
        {choice.narrativeIntent}
      </span>
    </button>
  );
}
