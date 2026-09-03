"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project, WorkingTogetherItem } from "@/lib/types";

const CYCLE_MS = 4000;

/**
 * One representative project per discipline, for the image panel — not
 * CMS-editable (unlike the description copy), since the user only asked
 * for the text to be editable; picked by tag/type rather than
 * project.projectType, which every project currently has set to the
 * same "Website" value.
 */
const DISCIPLINE_PROJECT_SLUG: Record<string, string> = {
  "UI/UX": "probity",
  "Web Development": "ample-market",
  Branding: "the-bonito-spa",
  "Campaigns & Marketing": "flutterbytes-conference-2025",
};

export function WorkingTogetherSection({
  items,
  projects,
}: {
  items: WorkingTogetherItem[];
  projects: Project[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (items.length < 2 || hovered !== null) return;
    const id = setInterval(() => setCycle((c) => (c + 1) % items.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [items.length, hovered]);

  const activeIndex = hovered ?? cycle;
  const active = items[activeIndex];
  const activeSlug = active ? DISCIPLINE_PROJECT_SLUG[active.discipline] : undefined;
  const activeProject = projects.find((p) => p.slug === activeSlug);
  const coverSrc = activeProject && (activeProject.coverGifUrl ?? activeProject.coverImage);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-center">
      <div className="relative flex flex-col">
        <div className="absolute bottom-4 left-[9px] top-4 w-px bg-hairline" aria-hidden="true" />
        {items.map((item, i) => (
          <button
            key={item.discipline}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            aria-pressed={i === activeIndex}
            className="relative flex gap-5 py-4 text-left first:pt-0 last:pb-0"
          >
            <span
              className={cn(
                "relative z-10 mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-colors",
                i === activeIndex ? "border-primary-500" : "border-hairline",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i === activeIndex ? "bg-primary-500" : "bg-hairline",
                )}
              />
            </span>
            <div>
              <h3
                className={cn(
                  "text-[17px] font-bold transition-colors",
                  i === activeIndex ? "text-ink-em" : "text-ink-soft",
                )}
              >
                {item.discipline}
              </h3>
              <AnimatePresence>
                {i === activeIndex && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="type-body mt-1.5 max-w-xl overflow-hidden text-ink-muted"
                  >
                    {item.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlug ?? activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="aspect-square w-full overflow-hidden rounded-2xl border border-hairline bg-surface-muted"
        >
          {coverSrc && (
            // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
            <img src={coverSrc} alt="" className="h-full w-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="lg:col-span-2">
        <Button variant="outline" href="/process">
          See The Process in Full
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
