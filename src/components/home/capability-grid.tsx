"use client";

import { motion } from "framer-motion";
import { BarChart3, Code2, Layers, Palette, Target, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CAPABILITIES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Product strategy & UX",
    body: "Research, IA, and interaction design — figuring out what to build before deciding how it looks.",
  },
  {
    icon: Layers,
    title: "Design systems",
    body: "Tokens before components, components before pages — the discipline behind every project here.",
  },
  {
    icon: Palette,
    title: "Visual & brand",
    body: "Typography, colour systems, and art direction that make restraint look intentional, not empty.",
  },
  {
    icon: Code2,
    title: "Front-end build",
    body: "Next.js, TypeScript, and Tailwind — I ship the systems I design, not just hand off a file.",
  },
  {
    icon: BarChart3,
    title: "Data & analytics",
    body: "Dashboards and data visualization that make a decision obvious, not just a number pretty.",
  },
  {
    icon: Workflow,
    title: "Tools & workflow",
    body: "Figma, Framer, Linear, and a headless CMS — the actual toolchain behind a 12-page build.",
  },
];

export function CapabilityGrid() {
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {CAPABILITIES.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.45 }}
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08 + 0.1, type: "spring", stiffness: 260, damping: 16 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint text-primary-tint-text"
            >
              <Icon size={18} strokeWidth={1.75} />
            </motion.span>
            <h3 className="mt-4 text-[15px] font-semibold text-ink-em">{item.title}</h3>
            <p className="type-body mt-1.5 max-w-xs text-ink-muted">{item.body}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
