"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div className="flex flex-col">
        {projects.map((project, i) => (
          <button
            key={project._id}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            aria-pressed={i === activeIndex}
            className={cn(
              "border-t border-hairline py-4 text-left transition-colors first:border-t-0 first:pt-0",
              i === activeIndex ? "text-ink-em" : "text-ink-soft",
            )}
          >
            <p className="text-[15px] font-semibold transition-colors">{project.name}</p>
            <p className="type-body mt-1 truncate text-ink-muted">{project.oneLiner}</p>
          </button>
        ))}
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
