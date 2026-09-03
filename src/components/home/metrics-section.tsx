"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { CountUpValue } from "@/components/cards/count-up-value";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import { buttonVariants } from "@/components/ui/button";
import { GridSquaresBackground, GRID_SQUARE_SIZE } from "./grid-squares-background";
import type { SiteMetric } from "@/lib/types";

const FILL_MS = 2200;
const TICK_MS = 30;
const CARD_WIDTH = GRID_SQUARE_SIZE * 16;
const CARD_HEIGHT = GRID_SQUARE_SIZE * 7;
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    if (metrics.length === 0 || hovered !== null) return;
    const id = setInterval(() => {
      setFillPercent((prev) => {
        const next = prev + (TICK_MS / FILL_MS) * 100;
        if (next >= 100) {
          setActiveIndex((i) => (i + 1) % metrics.length);
          return 0;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [metrics.length, hovered]);

  const hasPlaceholder = metrics.some((m) => m.isPlaceholder);

  return (
    <div className="relative overflow-hidden px-4 py-8 sm:px-8">
      <GridSquaresBackground />

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-ink-em">
          Meet The Metrics
        </h2>
        <p className="type-body mt-3.5 text-[17px] font-medium leading-relaxed text-ink-muted">
          Highlight of the most important figures of my design journey.
        </p>
      </div>

      <div className="relative mx-auto mt-6 flex flex-wrap justify-center" style={{ gap: CARD_GAP }}>
        {metrics.map((metric, i) => {
          const fill = hovered === i ? 100 : hovered !== null ? 0 : activeIndex === i ? fillPercent : 0;
          return (
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
              className="flex flex-col items-center justify-center"
            >
              <span className="relative inline-block text-[clamp(2.75rem,5.5vw,4rem)] font-semibold leading-none tracking-tight">
                <span
                  aria-hidden="true"
                  className="text-transparent"
                  style={{ WebkitTextStroke: "1.5px var(--color-ink-faint)" }}
                >
                  <CountUpValue value={metric.value} />
                  {metric.isPlaceholder && "*"}
                </span>
                <span
                  className="absolute inset-0 text-primary-500"
                  style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }}
                >
                  <CountUpValue value={metric.value} />
                  {metric.isPlaceholder && "*"}
                </span>
              </span>
              <p className="type-meta mt-2 text-[13px] font-medium">{metric.label}</p>
            </motion.button>
          );
        })}
      </div>

      {hasPlaceholder && (
        <p className="type-meta relative mt-4 text-center">
          * Placeholder figures — update with real numbers in Site settings.
        </p>
      )}

      <div className="relative mt-4 flex justify-center">
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
