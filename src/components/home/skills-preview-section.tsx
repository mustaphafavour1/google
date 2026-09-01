"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkillCategory } from "@/lib/types";

const GAPS: { category: SkillCategory; gapFilled: string }[] = [
  { category: "Product / UX", gapFilled: "Product and UX design, end to end." },
  { category: "Visual / Brand", gapFilled: "Visual and brand systems, not just screens." },
  {
    category: "Technical",
    gapFilled: "Enough technical fluency to work directly with engineering, not just hand off a file.",
  },
  { category: "Tools", gapFilled: "The AI tooling to move fast across all of it." },
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
            className="rounded-xl border border-hairline bg-surface p-5"
          >
            <h3 className="text-[14.5px] font-semibold text-ink-em">{gap.category}</h3>
            <p className="type-body mt-2 text-ink-muted">{gap.gapFilled}</p>
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
