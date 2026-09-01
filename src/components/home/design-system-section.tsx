"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DESIGN_SYSTEM_URL = "https://designsystem.headfavour.com";

export function DesignSystemSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-hairline bg-surface p-6 sm:p-9"
    >
      <p className="type-eyebrow mb-2.5">The AI-native design system</p>
      <h2 className="max-w-2xl text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold leading-tight tracking-tight text-ink-em">
        Worried AI-built design means inconsistent design? I already solved that.
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
