"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center", className)}
    >
      <p className="type-eyebrow mb-2.5">{eyebrow}</p>
      <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight text-ink-em">
        {title}
      </h2>
      {subtitle && <p className="type-body mt-3 text-ink-muted">{subtitle}</p>}
    </motion.div>
  );
}
