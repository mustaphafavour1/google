import { cn } from "@/lib/utils";
import type { ProcessTimelineBlock as ProcessTimelineBlockT } from "@/lib/types";

const gridColsClass: Record<number, string> = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3",
};

export function ProcessTimelineBlock({ block }: { block: ProcessTimelineBlockT }) {
  const cols = gridColsClass[block.phases.length] ?? "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div>
      {block.heading && <h3 className="type-subheading mb-4">{block.heading}</h3>}
      <ol className={cn("grid gap-5", cols)}>
        {block.phases.map((phase, i) => (
          <li key={phase.label} className="card p-4">
            <span className="data-mono flex h-6 w-6 items-center justify-center rounded-full border border-hairline text-[11px] text-ink-soft">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-3 text-[13.5px] font-semibold text-ink-em">{phase.label}</h4>
            <p className="type-body mt-1.5 text-ink-muted">{phase.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
