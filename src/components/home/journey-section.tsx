"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useContactForm } from "@/components/contact/contact-form-context";
import type { JourneyMilestone } from "@/lib/types";

const VB_WIDTH = 1000;
const VB_HEIGHT = 320;
const TOP_PADDING_PCT = 12;
const BASELINE_PCT = 92;
const YEARS_WITH_JAN = new Set(["2019", "2025"]);
const TILTS = [-3, 2, -2, 3, -3, 2, -2, 3];

function impactPercent(index: number, count: number): number {
  const t = count > 1 ? index / (count - 1) : 1;
  return 6 + 94 * Math.pow(t, 1.7);
}

function toXY(xPercent: number, yPercent: number) {
  return { x: (xPercent / 100) * VB_WIDTH, y: (yPercent / 100) * VB_HEIGHT };
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = p0.x + (p1.x - p0.x) / 2;
    d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

export function JourneySection({ milestones }: { milestones: JourneyMilestone[] }) {
  const gradientId = `journey-fill-${useId()}`;
  const arrowUpId = `journey-arrow-up-${useId()}`;
  const arrowRightId = `journey-arrow-right-${useId()}`;
  const { openForm } = useContactForm();

  if (milestones.length === 0) return null;

  const points = milestones.map((_, i) => {
    const yPercent = BASELINE_PCT - (impactPercent(i, milestones.length) / 100) * (BASELINE_PCT - TOP_PADDING_PCT);
    return toXY((i / (milestones.length - 1 || 1)) * 100, yPercent);
  });

  const linePath = buildSmoothPath(points);
  const baselineY = (BASELINE_PCT / 100) * VB_HEIGHT;
  const topY = (TOP_PADDING_PCT / 100) * VB_HEIGHT;
  const areaPath = `${linePath} L ${points[points.length - 1].x},${baselineY} L ${points[0].x},${baselineY} Z`;

  return (
    <div>
      <div className="relative mx-auto aspect-[1000/430] w-full max-w-4xl">
        <div
          className="absolute left-0 whitespace-nowrap text-center text-[10px] font-semibold uppercase tracking-wide text-ink-faint"
          style={{ top: `${(topY / VB_HEIGHT) * 100}%`, transform: "translate(-10%, -140%)" }}
        >
          <span className="block">My design</span>
          <span className="block">Impact</span>
        </div>

        <svg
          viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" />
            </linearGradient>
            <marker id={arrowUpId} markerWidth="8" markerHeight="8" refX="4" refY="1" orient="auto">
              <path d="M 0,7 L 4,0 L 8,7 Z" fill="var(--color-ink-faint)" />
            </marker>
            <marker id={arrowRightId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M 0,0 L 8,4 L 0,8 Z" fill="var(--color-ink-faint)" />
            </marker>
          </defs>
          {points.map((point, i) => (
            <line
              key={`grid-${i}`}
              x1={point.x}
              y1={topY}
              x2={point.x}
              y2={baselineY}
              stroke="var(--color-hairline)"
              strokeWidth="1"
            />
          ))}
          <line
            x1={points[0].x}
            y1={baselineY}
            x2={points[0].x}
            y2={topY}
            stroke="var(--color-ink-faint)"
            strokeWidth="1.5"
            markerEnd={`url(#${arrowUpId})`}
          />
          <line
            x1={points[0].x}
            y1={baselineY}
            x2={points[points.length - 1].x + 14}
            y2={baselineY}
            stroke="var(--color-ink-faint)"
            strokeWidth="1.5"
            markerEnd={`url(#${arrowRightId})`}
          />
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <motion.path
            d={linePath}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>

        {milestones.map((milestone, i) => {
          const point = points[i];
          const xPercent = (point.x / VB_WIDTH) * 100;
          const yPercent = (point.y / VB_HEIGHT) * 100;
          const above = i % 2 === 0;
          const label = YEARS_WITH_JAN.has(milestone.year) ? `Jan. ${milestone.year}` : milestone.year;

          return (
            <div key={`${milestone.year}-${i}`} className="absolute" style={{ left: `${xPercent}%`, top: `${yPercent}%` }}>
              <span className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500" />
              <motion.div
                initial={{ opacity: 0, y: above ? 8 : -8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                className="absolute w-[6.5rem] max-w-[9rem] -translate-x-1/2 rounded-md border border-hairline bg-surface px-1.5 py-1 text-[9px] leading-snug text-ink-soft shadow-[0_4px_10px_rgb(35_25_15_/_0.08)] sm:w-28"
                style={{
                  top: above ? "-4.75rem" : "0.75rem",
                  transform: `translateX(-50%) rotate(${TILTS[i % TILTS.length]}deg)`,
                }}
              >
                <span className="data-mono block text-[9px] font-semibold text-primary-500">{label}</span>
                {milestone.text}
              </motion.div>
            </div>
          );
        })}

        <div className="absolute inset-x-0 bottom-[-1.6rem] flex justify-between px-1">
          {milestones.map((milestone, i) => (
            <span key={`axis-${milestone.year}-${i}`} className="type-meta text-[9px]">
              {YEARS_WITH_JAN.has(milestone.year) ? `Jan. ${milestone.year}` : milestone.year}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button type="button" onClick={openForm} className={buttonVariants({ size: "lg" })}>
          Let&rsquo;s discuss
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
