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
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {metrics.map((metric, i) => {
          const copy = STATUS_COPY[metric.key];
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="border-t border-hairline pt-4"
            >
              <p className="text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none tracking-tight text-ink-em">
                <CountUpValue value={metric.value} />
                {metric.isPlaceholder && <span className="ml-0.5 text-ink-faint">*</span>}
              </p>
              <p className="type-meta mt-2">{copy?.label ?? metric.label}</p>
              {copy && <p className="type-body mt-1 text-ink-muted">{copy.descriptor}</p>}
            </motion.div>
          );
        })}
      </div>
      {hasPlaceholder && (
        <p className="type-meta mt-6">
          * Placeholder figures — update with real numbers in Site settings.
        </p>
      )}
    </div>
  );
}
