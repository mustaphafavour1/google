"use client";

import { useRef, type RefObject } from "react";
import { useInView } from "framer-motion";

/**
 * Framer Motion never applies `initial` for content that's part of the
 * first server-rendered paint — only genuinely post-hydration mounts get
 * the initial->animate transition — so a plain `initial`+`whileInView`
 * pair silently never animates for anything present in the initial HTML
 * (which, on a single-page-scroll site like this, is everything). Driving
 * `animate` off this hook's boolean, flipped inside an effect and
 * therefore always a real post-hydration state change, sidesteps that.
 */
type Margin = `${number}${"px" | "%"}`;

export function useScrollInView<T extends Element = HTMLDivElement>(
  margin: Margin = "-80px",
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}
