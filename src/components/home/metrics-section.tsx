"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { CountUpValue } from "@/components/cards/count-up-value";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import { buttonVariants } from "@/components/ui/button";
import { GridSquaresBackground, GRID_SQUARE_SIZE } from "./grid-squares-background";
import { cn } from "@/lib/utils";
import type { SiteMetric } from "@/lib/types";

const CYCLE_MS = 1800;
const CARD_WIDTH = GRID_SQUARE_SIZE * 16;
const CARD_HEIGHT = GRID_SQUARE_SIZE * 10;
const CARD_GAP = GRID_SQUARE_SIZE;

export function MetricsSection({
  metrics,
  resumeUrl,
  visitorMetrics,
}: {
  metrics: SiteMetric[];
  resumeUrl?: string;
  visitorMetrics?: ReactNode;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (metrics.length === 0) return;
    const id = setInterval(() => setCycle((c) => (c + 1) % metrics.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [metrics.length]);

  const activeIndex = hovered ?? cycle;
  const hasPlaceholder = metrics.some((m) => m.isPlaceholder);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline px-4 py-16 sm:px-8">
      <GridSquaresBackground />

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-ink-em">
          Meet The Metrics
        </h2>
        <p className="type-body mt-3.5 text-[17px] font-medium leading-relaxed text-ink-muted">
          Highlight of the most important figures of my design journey.
        </p>
      </div>

      <div className="relative mx-auto mt-10 flex flex-wrap justify-center" style={{ gap: CARD_GAP }}>
        {metrics.map((metric, i) => (
          <motion.button
            key={metric.key}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            className="flex flex-col items-center justify-center rounded-lg border border-hairline bg-surface shadow-[0_2px_10px_rgb(35_25_15_/_0.06)]"
          >
            <p
              className={cn(
                "text-[clamp(2.25rem,4.5vw,3.25rem)] font-extrabold leading-none tracking-tight transition-colors duration-500",
                i === activeIndex ? "text-primary-500" : "text-ink-faint",
              )}
            >
              <CountUpValue value={metric.value} />
              {metric.isPlaceholder && <span className="ml-0.5 text-ink-faint">*</span>}
            </p>
            <p className="type-meta mt-2 text-[13px] font-medium">{metric.label}</p>
          </motion.button>
        ))}
      </div>

      {hasPlaceholder && (
        <p className="type-meta relative mt-4 text-center">
          * Placeholder figures — update with real numbers in Site settings.
        </p>
      )}

      <div className="relative mt-8 flex justify-center">
        {resumeUrl && (
          <ResumeGateButton className={buttonVariants({ size: "lg" })}>
            <Download size={15} />
            View My CV
          </ResumeGateButton>
        )}
      </div>

      <div className="relative">{visitorMetrics}</div>
    </div>
  );
}
