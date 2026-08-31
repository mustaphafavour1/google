"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function SelectedWorkShowcase({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];
  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {projects.map((project, i) => (
          <button
            key={project._id}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-pressed={i === activeIndex}
            className={cn(
              "shrink-0 rounded-lg px-4 py-3 text-left transition-colors lg:shrink",
              i === activeIndex
                ? "bg-primary-tint text-primary-tint-text"
                : "text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
            )}
          >
            <p className="whitespace-nowrap text-[13.5px] font-semibold lg:whitespace-normal">
              {project.name}
            </p>
            <p className="type-meta mt-0.5">{project.industry}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/projects/${active.slug}`}
            className="group block overflow-hidden rounded-2xl border border-hairline bg-surface transition-shadow hover:shadow-[0_16px_40px_rgb(15_15_15_/_0.1)]"
          >
            <div
              className="relative h-56 w-full sm:h-64"
              style={{
                background: `linear-gradient(135deg, ${active.accent.primary}, ${active.accent.secondary})`,
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
                <span className="type-eyebrow text-white/85">{active.industry}</span>
                <h3 className="type-display mt-1 text-white">{active.name}</h3>
              </div>
              <span className="absolute right-5 top-5 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white/90">
                {active.year}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="min-w-0 flex-1">
                <p className="type-body text-ink-muted">{active.oneLiner}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {active.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-primary-500 transition-all group-hover:gap-2">
                View case study
                <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
