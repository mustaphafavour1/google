"use client";

import { motion } from "framer-motion";
import { CountUpValue } from "@/components/cards/count-up-value";
import type { SiteMetric } from "@/lib/types";

/**
 * Landing-page-only reframing of the CMS labels/values — kept here rather
 * than on SiteMetric itself since this copy is specific to the pitch this
 * section makes, not a general fact about each metric (the same metrics
 * show their plain CMS label elsewhere, e.g. the Profile page).
 */
const STATUS_COPY: Record<string, { label: string; descriptor: string }> = {
  projects: { label: "Live Products", descriptor: "Shipped and running, not concept-only." },
  years: { label: "Years Shipping", descriptor: "Senior judgment, proven under real deadlines." },
  countries: { label: "Countries Reached", descriptor: "Design that's already worked across markets." },
  brands: { label: "Brands Designed For", descriptor: "Range, across fintech, health-tech, and beyond." },
};

export function StatsStrip({ metrics }: { metrics: SiteMetric[] }) {
  const hasPlaceholder = metrics.some((m) => m.isPlaceholder);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-hairline">
        <div className="flex items-center gap-2 border-b border-hairline bg-surface-muted px-4 py-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="type-meta">Live — reflects the current portfolio</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {metrics.map((metric, i) => {
            const copy = STATUS_COPY[metric.key];
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="border-b border-r border-hairline p-5 [&:nth-child(2n)]:border-r-0 sm:border-b-0 sm:[&:nth-child(2n)]:border-r sm:last:border-r-0"
              >
                <p className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-none tracking-tight text-ink-em">
                  <CountUpValue value={metric.value} />
                  {metric.isPlaceholder && <span className="ml-0.5 text-ink-faint">*</span>}
                </p>
                <p className="type-meta mt-2">{copy?.label ?? metric.label}</p>
                {copy && <p className="type-body mt-1 text-ink-muted">{copy.descriptor}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
      {hasPlaceholder && (
        <p className="type-meta mt-4">
          * Placeholder figures — update with real numbers in Site settings.
        </p>
      )}
    </div>
  );
}
