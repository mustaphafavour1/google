"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const SPARK_POINTS = [
  [0, 42],
  [20, 34],
  [40, 38],
  [60, 20],
  [80, 26],
  [100, 12],
  [120, 18],
  [140, 6],
  [160, 14],
] as const;

const SPARK_PATH = SPARK_POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

/**
 * The hero's one signature idea: a tiny dashboard that's actually alive —
 * a line chart that draws itself in and a metric that visibly ticks,
 * literal enough that "I build dashboards" needs no caption.
 */
export function LiveDashboardMock() {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(2481);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setValue((prev) => prev + Math.round((Math.random() - 0.3) * 14));
    }, 2400);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_24px_60px_rgb(15_15_15_/_0.12)]">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-danger/50" />
          <span className="h-2 w-2 rounded-full bg-warning/50" />
          <span className="h-2 w-2 rounded-full bg-success/50" />
        </div>
        <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink-soft">
          <motion.span
            animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-success"
          />
          Live
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="type-label">Active sessions</p>
            <p className="data-mono mt-1 text-[26px] font-semibold text-ink-em">
              {value.toLocaleString()}
            </p>
          </div>
          <span className="mt-1 flex items-center gap-0.5 rounded-full bg-success-tint px-2 py-1 text-[11px] font-medium text-success">
            <ArrowUpRight size={11} />
            12%
          </span>
        </div>

        <svg viewBox="0 0 160 48" className="mt-4 h-14 w-full overflow-visible">
          <defs>
            <linearGradient id="hero-spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`${SPARK_PATH} L160 48 L0 48 Z`}
            fill="url(#hero-spark-fill)"
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          />
          <motion.path
            d={SPARK_PATH}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-hairline pt-3">
          {["Dashboards", "Apps", "Systems"].map((label, i) => (
            <div key={label}>
              <p className="type-meta truncate">{label}</p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-muted">
                <motion.div
                  className="h-full rounded-full bg-primary-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${[72, 54, 88][i]}%` }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
