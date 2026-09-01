"use client";

import { motion } from "framer-motion";
import { Palette, Code2, Sparkles, Wand2, PenTool } from "lucide-react";
import { initials } from "@/components/shell/logo";
import type { SiteSettings } from "@/lib/types";

type Chip = {
  label: string;
  icon: typeof Palette;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  floatDelay: number;
  floatDuration: number;
};

const CHIPS: Chip[] = [
  { label: "Product Design", icon: Palette, top: "2%", left: "6%", rotate: -6, floatDelay: 0, floatDuration: 5.5 },
  { label: "Brand Design", icon: PenTool, top: "10%", right: "2%", rotate: 5, floatDelay: 0.6, floatDuration: 6.2 },
  { label: "Front-End Build", icon: Code2, top: "58%", left: "0%", rotate: 4, floatDelay: 1.1, floatDuration: 5.8 },
  { label: "Motion", icon: Sparkles, top: "72%", right: "8%", rotate: -4, floatDelay: 0.3, floatDuration: 6.6 },
  { label: "AI-Native Workflow", icon: Wand2, top: "0%", left: "38%", rotate: 3, floatDelay: 0.85, floatDuration: 5.2 },
];

export function RoleConstellation({ profile }: { profile: SiteSettings["profile"] }) {
  return (
    <div className="relative h-[340px] w-full max-w-md sm:h-[400px]">
      {CHIPS.map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, scale: 0.8, rotate: chip.rotate * 2 }}
          animate={{ opacity: 1, scale: 1, rotate: chip.rotate }}
          transition={{ delay: 0.3 + i * 0.09, duration: 0.5, ease: "easeOut" }}
          className="absolute"
          style={{ top: chip.top, left: chip.left, right: chip.right }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              delay: chip.floatDelay,
              duration: chip.floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-strong shadow-[0_6px_18px_rgb(35_25_15_/_0.1)]"
          >
            <chip.icon size={12} className="shrink-0 text-primary-500" />
            {chip.label}
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-2xl border border-hairline bg-surface px-5 py-4 shadow-[0_16px_40px_rgb(35_25_15_/_0.14)]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-[14px] font-semibold text-white">
          {initials(profile.name)}
        </span>
        <div className="whitespace-nowrap">
          <p className="text-[14px] font-semibold text-ink-em">{profile.name}</p>
          <p className="type-meta mt-0.5">{profile.title}</p>
        </div>
      </motion.div>
    </div>
  );
}
