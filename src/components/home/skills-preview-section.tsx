"use client";

import { motion } from "framer-motion";
import { ArrowRight, Palette, Sparkles, Code2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkillCategory } from "@/lib/types";

const GAPS: { category: SkillCategory; icon: typeof Palette; gapFilled: string }[] = [
  { category: "Product / UX", icon: Palette, gapFilled: "Product and UX design, end to end." },
  { category: "Visual / Brand", icon: Sparkles, gapFilled: "Visual and brand systems, not just screens." },
  {
    category: "Technical",
    icon: Code2,
    gapFilled: "Enough technical fluency to work directly with engineering, not just hand off a file.",
  },
  { category: "Tools", icon: Wand2, gapFilled: "The AI tooling to move fast across all of it." },
];

export function SkillsPreviewSection() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {GAPS.map((gap, i) => (
          <motion.div
            key={gap.category}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -3 }}
            className="group rounded-xl border border-hairline bg-surface p-5 transition-shadow hover:shadow-[0_10px_28px_rgb(35_25_15_/_0.08)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-tint text-primary-tint-text transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <gap.icon size={16} />
            </span>
            <h3 className="mt-3.5 text-[14.5px] font-semibold text-ink-em">{gap.category}</h3>
            <p className="type-body mt-1.5 text-ink-muted">{gap.gapFilled}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" href="/skills">
          See the Full Skill Set
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
