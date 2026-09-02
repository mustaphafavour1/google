"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { CountUpValue } from "@/components/cards/count-up-value";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import { buttonVariants } from "@/components/ui/button";
import { GridSquaresBackground } from "./grid-squares-background";
import { cn } from "@/lib/utils";
import type { SiteMetric } from "@/lib/types";

const CYCLE_MS = 1800;

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
    <div className="relative overflow-hidden rounded-2xl border border-hairline px-4 py-12 sm:px-8">
      <GridSquaresBackground className="opacity-60" />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="type-eyebrow mb-2.5">Live numbers</p>
        <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight text-ink-em">
          Meet The Metrics
        </h2>
        <p className="type-body mt-3 text-ink-muted">
          Highlight of the most important figures of my design journey.
        </p>
      </div>

      <div className="relative mx-auto mt-9 flex max-w-3xl flex-wrap justify-center divide-x divide-hairline">
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
            className="min-w-[7rem] flex-1 px-5 py-2 text-center"
          >
            <p
              className={cn(
                "text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-none tracking-tight transition-colors duration-500",
                i === activeIndex ? "text-primary-500" : "text-ink-faint",
              )}
            >
              <CountUpValue value={metric.value} />
              {metric.isPlaceholder && <span className="ml-0.5 text-ink-faint">*</span>}
            </p>
            <p className="type-meta mt-2">{metric.label}</p>
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
