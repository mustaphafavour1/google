"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

const CYCLE_MS = 4000;
const PAGE_SIZE = 4;

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}

export function CaseStudyMiniMetrics({ project }: { project: Project }) {
  const pages = chunk(project.scale, PAGE_SIZE);
  const [page, setPage] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (pages.length < 2 || hovered) return;
    const id = setInterval(() => setPage((p) => (p + 1) % pages.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [pages.length, hovered]);

  if (project.scale.length === 0) return null;

  const currentItems = pages[page];
  const placeholderCount = PAGE_SIZE - currentItems.length;

  function goTo(delta: 1 | -1) {
    setPage((p) => (p + delta + pages.length) % pages.length);
  }

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <p className="type-eyebrow mb-2.5">Scope at a glance</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 gap-2"
        >
          {currentItems.map((metric) => (
            <div
              key={metric.label}
              className="min-h-[60px] rounded-lg border border-hairline bg-surface px-2.5 py-2"
            >
              <p className="text-[15px] font-semibold leading-none text-ink-em">{metric.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-ink-muted">{metric.label}</p>
            </div>
          ))}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div key={`placeholder-${i}`} aria-hidden="true" className="invisible min-h-[60px] rounded-lg border px-2.5 py-2">
              <p className="text-[15px] font-semibold leading-none">0</p>
              <p className="mt-1 text-[10px] leading-tight">—</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {pages.length > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous highlights"
            className="text-ink-soft transition-colors hover:text-ink-strong"
          >
            <ChevronLeft size={13} />
          </button>
          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Show highlights ${i + 1}`}
                aria-current={i === page}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === page ? "w-4 bg-primary-500" : "w-1.5 bg-hairline",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next highlights"
            className="text-ink-soft transition-colors hover:text-ink-strong"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
