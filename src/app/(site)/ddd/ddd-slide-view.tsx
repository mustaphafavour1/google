"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DddTile } from "./ddd-tile";
import { cn } from "@/lib/utils";
import type { DddEntry } from "@/lib/types";

const SWIPE_THRESHOLD_PX = 60;

export function DddSlideView({
  pairs,
  index,
  onNavigate,
}: {
  pairs: DddEntry[][];
  index: number;
  onNavigate: (delta: 1 | -1) => void;
}) {
  const pair = pairs[index] ?? [];

  function handleDragEnd(_event: PointerEvent, info: PanInfo) {
    if (info.offset.x <= -SWIPE_THRESHOLD_PX) onNavigate(1);
    else if (info.offset.x >= SWIPE_THRESHOLD_PX) onNavigate(-1);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          aria-label="Previous slide"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:text-ink-strong"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="grid cursor-grab grid-cols-1 gap-4 active:cursor-grabbing sm:grid-cols-2"
            >
              {pair.map((entry) => (
                <DddTile key={entry._id} entry={entry} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(1)}
          aria-label="Next slide"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:text-ink-strong"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {pairs.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {pairs.map((_, i) => (
            <span
              key={i}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-primary-500" : "w-1.5 bg-hairline")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
