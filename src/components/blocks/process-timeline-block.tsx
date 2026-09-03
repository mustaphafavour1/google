"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProcessTimelineBlock as ProcessTimelineBlockT } from "@/lib/types";

export function ProcessTimelineBlock({ block }: { block: ProcessTimelineBlockT }) {
  return (
    <div>
      {block.heading && <h3 className="text-[22px] font-semibold text-ink-em mb-6">{block.heading}</h3>}
      <ol className="flex flex-col">
        {block.phases.map((phase, i) => (
          <motion.li
            key={phase.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, duration: 0.45, ease: "easeOut" }}
            className={cn("flex gap-6 py-8 first:pt-0 last:pb-0", i > 0 && "border-t border-hairline")}
          >
            <span className="data-mono shrink-0 text-[30px] font-medium leading-none text-primary-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-0.5">
              <h4 className="text-[19px] font-semibold text-ink-em">{phase.label}</h4>
              <p className="type-body mt-1.5 max-w-lg text-ink-muted">{phase.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
