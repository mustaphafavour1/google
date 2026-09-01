import { cn } from "@/lib/utils";
import type { ProcessTimelineBlock as ProcessTimelineBlockT } from "@/lib/types";

export function ProcessTimelineBlock({ block }: { block: ProcessTimelineBlockT }) {
  return (
    <div className="rounded-2xl bg-[#11162b] px-6 py-7 sm:px-9 sm:py-9">
      {block.heading && <h3 className="type-subheading mb-5 text-white">{block.heading}</h3>}
      <ol className="flex flex-col">
        {block.phases.map((phase, i) => (
          <li
            key={phase.label}
            className={cn("flex gap-4 py-5 first:pt-0 last:pb-0", i > 0 && "border-t border-white/10")}
          >
            <span className="data-mono shrink-0 pt-0.5 text-[13px] text-white/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="text-[14.5px] font-semibold text-white">{phase.label}</h4>
              <p className="type-body mt-1.5 text-white/60">{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
