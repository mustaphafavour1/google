"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const backgrounds = {
  default: "",
  surface: "bg-surface",
  tint: "bg-primary-tint/30",
};

/**
 * Framer Motion never applies `initial` for content that's already part of
 * the first server-rendered paint (only genuinely post-hydration mounts get
 * the initial->animate transition) — so a plain `initial`+`whileInView`
 * pair silently never animates here, since every section ships in the
 * initial HTML. Driving `animate` off a real React state flip (set inside
 * an effect, definitionally post-hydration) sidesteps that entirely.
 */
export function LandingSection({
  children,
  id,
  background = "default",
  className,
  containerClassName,
}: {
  children: ReactNode;
  id?: string;
  background?: keyof typeof backgrounds;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("scroll-mt-20 py-28 sm:py-36", backgrounds[background], className)}
    >
      <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-10", containerClassName)}>{children}</div>
    </motion.section>
  );
}
