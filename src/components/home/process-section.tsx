"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProcessTrack } from "@/lib/types";

export function ProcessSection({ tracks }: { tracks: ProcessTrack[] }) {
  return (
    <div className="flex flex-col gap-10">
      {tracks.map((track, trackIndex) => (
        <DisciplineRow key={track._id} track={track} index={trackIndex} />
      ))}
    </div>
  );
}

function DisciplineRow({ track, index }: { track: ProcessTrack; index: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <div className="mb-3.5 flex items-baseline justify-between gap-4">
        <h3 className="text-[14.5px] font-semibold text-ink-em">{track.discipline}</h3>
        <p className="type-meta shrink-0">{track.phases.length} phases</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {track.phases.map((phase, i) => {
          const open = openIndex === i;
          return (
            <motion.button
              key={phase.label}
              type="button"
              layout
              onMouseEnter={() => setOpenIndex(i)}
              onFocus={() => setOpenIndex(i)}
              onMouseLeave={() => setOpenIndex((cur) => (cur === i ? null : cur))}
              onBlur={() => setOpenIndex((cur) => (cur === i ? null : cur))}
              transition={{ layout: { duration: 0.25, ease: "easeOut" } }}
              className={cn(
                "min-w-0 rounded-xl border px-4 py-3 text-left transition-colors",
                open
                  ? "border-primary-200 bg-primary-tint"
                  : "border-hairline bg-surface hover:border-primary-100",
              )}
              style={{ maxWidth: open ? 300 : 210 }}
            >
              <span className="flex items-center gap-2 text-[13px] font-medium text-ink-strong">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold text-white">
                  {i + 1}
                </span>
                <span className="truncate">{phase.label}</span>
              </span>
              <motion.span
                initial={false}
                animate={{
                  height: open ? "auto" : 0,
                  opacity: open ? 1 : 0,
                  marginTop: open ? 6 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="block overflow-hidden text-[12.5px] leading-relaxed text-ink-muted"
              >
                {phase.description}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
