import { cn } from "@/lib/utils";
import type { ProcessTimelineBlock as ProcessTimelineBlockT } from "@/lib/types";

export function ProcessTimelineBlock({ block }: { block: ProcessTimelineBlockT }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-muted px-6 py-8 sm:px-10 sm:py-10">
      {block.heading && <h3 className="type-subheading mb-6">{block.heading}</h3>}
      <ol className="flex flex-col">
        {block.phases.map((phase, i) => (
          <li
            key={phase.label}
            className={cn("flex gap-6 py-7 first:pt-0 last:pb-0", i > 0 && "border-t border-hairline")}
          >
            <span className="data-mono shrink-0 text-[15px] text-primary-500">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="text-[16px] font-semibold text-ink-em">{phase.label}</h4>
              <p className="type-body mt-1.5 max-w-lg text-ink-muted">{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
