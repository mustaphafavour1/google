"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAIRS = [
  { was: "Design → dev handoff, something lost in translation", now: "Design and dev fluency, same person" },
  { was: "A design hire and a brand hire", now: "One senior hire, both disciplines" },
  { was: "Ramp-up time on regulated, high-stakes work", now: "Already fluent — fintech, health-tech, B2B SaaS" },
];

export function AboutPreviewSection() {
  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="type-body max-w-2xl text-[16px] leading-relaxed text-ink-muted"
      >
        An engineering background, a product-and-brand range, and years across high-stakes
        industries — here&rsquo;s what that actually changes for the team hiring me.
      </motion.p>

      <div className="mt-7 flex flex-col gap-3">
        {PAIRS.map((pair, i) => (
          <motion.div
            key={pair.now}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            className="flex flex-col gap-1.5 border-t border-hairline pt-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="text-[13px] text-ink-faint line-through decoration-1 sm:w-[19rem] sm:shrink-0">
              {pair.was}
            </span>
            <span className="text-[13.5px] font-medium text-ink-em">{pair.now}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-7">
        <Button variant="outline" href="/profile#about">
          Read the Full Background
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
