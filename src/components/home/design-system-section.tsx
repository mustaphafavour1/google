"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DESIGN_SYSTEM_URL = "https://designsystem.headfavour.com";

const SWATCHES: ("circle" | "pill" | "square")[] = ["circle", "circle", "pill", "square", "circle", "pill"];

const swatchShape: Record<(typeof SWATCHES)[number], string> = {
  circle: "h-5 w-5 rounded-full",
  pill: "h-5 w-9 rounded-full",
  square: "h-5 w-5 rounded-md",
};

export function DesignSystemSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-hairline bg-surface p-6 sm:p-9"
    >
      <div className="flex flex-wrap items-center gap-2">
        {SWATCHES.map((shape, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.35, ease: "backOut" }}
            className={cn(swatchShape[shape], "border-2 border-primary-500 bg-primary-500")}
          />
        ))}
        <span className="type-eyebrow ml-1">Consistent, every time</span>
      </div>

      <h2 className="mt-4 max-w-2xl text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight tracking-tight">
        <span className="block font-semibold text-ink-em">
          Worried AI-built design means inconsistent design?
        </span>
        <span className="block font-medium text-ink-soft">I already solved that.</span>
      </h2>
      <p className="type-body mt-4 max-w-2xl text-ink-muted">
        Free to download: the exact specs and taste guidelines I use to keep AI-generated work
        on-brand and senior-grade, every time, not just occasionally. Tested across four live
        products.
      </p>
      <p className="type-body mt-3 max-w-2xl text-ink-muted">
        Most companies bringing AI into their design workflow are still figuring out how to keep
        quality consistent. I already built the system for it. Use mine as a starting point, or
        bring me in to build yours.
      </p>
      <div className="mt-6">
        <Button asChild>
          <a href={DESIGN_SYSTEM_URL} target="_blank" rel="noopener noreferrer">
            Visit the Design System
            <ArrowUpRight size={14} />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
