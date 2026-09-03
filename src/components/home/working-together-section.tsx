"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  "Web Development": "didii-ai",
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
  const activePercent = items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 50;
  const lo = Math.max(0, activePercent - 22);
  const hi = Math.min(100, activePercent + 22);
  const lineBackground = `linear-gradient(to bottom, var(--color-hairline) 0%, var(--color-hairline) ${lo}%, var(--color-primary-500) ${activePercent}%, var(--color-hairline) ${hi}%, var(--color-hairline) 100%)`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-12">
      <div className="flex h-full flex-col">
        <div className="relative flex flex-1 flex-col justify-around">
          <div
            className="absolute bottom-4 left-[9px] top-4 w-px"
            style={{ background: lineBackground }}
            aria-hidden="true"
          />
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={item.discipline}
                type="button"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-pressed={isActive}
                className="relative flex min-h-[6.5rem] gap-5 text-left"
              >
                <span
                  className={cn(
                    "relative z-10 mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-colors",
                    isActive ? "border-primary-500" : "border-hairline",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      isActive ? "bg-primary-500" : "bg-hairline",
                    )}
                  />
                </span>
                <div>
                  <h3
                    className={cn(
                      "text-[19px] font-bold transition-colors",
                      isActive ? "text-ink-em" : "text-ink-soft",
                    )}
                  >
                    {item.discipline}
                  </h3>
                  <p
                    className={cn(
                      "type-body mt-1.5 max-w-xl text-ink-muted transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4">
          <Button variant="outline" href="/process">
            See The Process in Full
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      <div className="flex aspect-square w-full gap-2 overflow-hidden rounded-2xl">
        {items.map((item, i) => {
          const project = projects.find((p) => p.slug === DISCIPLINE_PROJECT_SLUG[item.discipline]);
          const isActive = i === activeIndex;
          const coverSrc = project && (isActive ? project.coverGifUrl ?? project.coverImage : project.coverImage);
          return (
            <motion.div
              key={item.discipline}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              animate={{ flexGrow: isActive ? 10 : 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ flexBasis: 0 }}
              className="relative h-full min-w-0 cursor-pointer overflow-hidden border border-hairline bg-surface-muted first:rounded-l-2xl last:rounded-r-2xl"
            >
              {coverSrc && (
                // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted image, arbitrary remote host
                <img src={coverSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
