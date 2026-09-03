"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

const CYCLE_MS = 4500;

export function SelectedWorkShowcase({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (projects.length < 2 || hovered !== null) return;
    const id = setInterval(() => setCycle((c) => (c + 1) % projects.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [projects.length, hovered]);

  const activeIndex = hovered ?? cycle;
  const active = projects[activeIndex];
  if (!active) return null;
  const coverSrc = active.coverGifUrl ?? active.coverImage;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-stretch lg:gap-12">
      <div className="flex h-full min-w-0 flex-col justify-between">
        {projects.map((project, i) => (
          <div
            key={project._id}
            className={cn(
              "flex min-w-0 items-center justify-between gap-3 border-t border-hairline first:border-t-0",
            )}
          >
            <button
              type="button"
              onClick={() => setHovered(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              aria-pressed={i === activeIndex}
              className={cn(
                "min-w-0 flex-1 py-2 text-left transition-colors",
                i === activeIndex ? "text-ink-em" : "text-ink-soft",
              )}
            >
              <p className="text-[20px] font-bold transition-colors">{project.name}</p>
              <p className="type-body mt-1 truncate text-ink-muted">{project.oneLiner}</p>
            </button>
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`Open ${project.name} case study`}
              className="shrink-0 rounded-md p-1.5 text-ink-faint transition-colors hover:bg-surface-muted hover:text-primary-500"
            >
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ))}

        <div className="border-t border-hairline pt-4">
          <Button variant="outline" href="/projects">
            View All Projects
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            href={`/projects/${active.slug}`}
            className="group block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hairline bg-surface transition-shadow hover:shadow-[0_16px_40px_rgb(15_15_15_/_0.1)]"
            style={{
              background: coverSrc
                ? undefined
                : `linear-gradient(135deg, ${active.accent.primary}, ${active.accent.secondary})`,
            }}
          >
            {coverSrc && (
              // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
              <img src={coverSrc} alt="" className="h-full w-full object-cover" />
            )}
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
