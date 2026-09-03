"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The site's one headline mechanism (bold assertive line + softer qualifying
 * line underneath, applied consistently everywhere a major headline
 * appears — see the hero's h1 for the same device at a larger size).
 * A plain string still renders as a single bold line where a title has no
 * natural two-part split — the mechanism is the weight/tone contrast, not a
 * forced line break.
 */
export type HeadlineTitle = string | { bold: string; soft: string };

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: HeadlineTitle;
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
      <p className="type-eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-ink-em">
        {typeof title === "string" ? (
          title
        ) : (
          <>
            <span className="block">{title.bold}</span>
            <span className="block font-semibold text-ink-soft">{title.soft}</span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="type-body mt-3.5 text-[17px] font-medium leading-relaxed text-ink-muted">{subtitle}</p>
      )}
    </motion.div>
  );
}
