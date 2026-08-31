"use client";

import { motion } from "framer-motion";
import { CountUpValue } from "@/components/cards/count-up-value";
import type { SiteMetric } from "@/lib/types";

export function StatsStrip({ metrics }: { metrics: SiteMetric[] }) {
  const hasPlaceholder = metrics.some((m) => m.isPlaceholder);

  return (
    <div>
      <div className="grid grid-cols-2 divide-y divide-hairline sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="px-1 py-5 text-center sm:px-6 sm:py-0"
          >
            <p className="text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none tracking-tight text-ink-em">
              <CountUpValue value={metric.value} />
              {metric.isPlaceholder && <span className="ml-0.5 text-ink-faint">*</span>}
            </p>
            <p className="type-meta mt-2">{metric.label}</p>
          </motion.div>
        ))}
      </div>
      {hasPlaceholder && (
        <p className="type-meta mt-6 text-center">
          * Placeholder figures — update with real numbers in Site settings.
        </p>
      )}
    </div>
  );
}
