import { cn } from "@/lib/utils";
import type { ProcessTimelineBlock as ProcessTimelineBlockT } from "@/lib/types";

export function ProcessTimelineBlock({ block }: { block: ProcessTimelineBlockT }) {
  return (
    <div className="rounded-2xl bg-[#11162b] px-6 py-8 sm:px-10 sm:py-10">
      {block.heading && <h3 className="type-subheading mb-6 text-white">{block.heading}</h3>}
      <ol className="flex flex-col">
        {block.phases.map((phase, i) => (
          <li
            key={phase.label}
            className={cn("flex gap-6 py-8 first:pt-0 last:pb-0", i > 0 && "border-t border-white/10")}
          >
            <span className="font-serif shrink-0 text-[32px] font-medium leading-none text-[#5b7ca8]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-1">
              <h4 className="font-serif text-[24px] font-bold leading-tight text-white">{phase.label}</h4>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/55">{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
