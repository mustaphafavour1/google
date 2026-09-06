"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type Blob = {
  color: string;
  darkColor: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  moveX: number;
  moveY: number;
};

const BLOBS: Blob[] = [
  { color: "#4c8bf5", darkColor: "#0f1a30", size: 380, top: "8%", left: "6%", duration: 26, moveX: 60, moveY: 40 },
  { color: "#eee75a", darkColor: "#211f0a", size: 320, top: "58%", left: "2%", duration: 32, moveX: 50, moveY: -50 },
  { color: "#ffd23f", darkColor: "#241c07", size: 300, top: "4%", left: "62%", duration: 29, moveX: -50, moveY: 55 },
  { color: "#ff9f43", darkColor: "#241705", size: 340, top: "62%", left: "68%", duration: 35, moveX: -60, moveY: -35 },
  { color: "#4fd67a", darkColor: "#0e2117", size: 280, top: "32%", left: "40%", duration: 24, moveX: 45, moveY: 45 },
];

// Only the left/right/bottom edges fade — the hero is the first section on
// the page (nothing above it to blend into), so its top edge stays fully
// opaque and touches the true top of the page instead of appearing to
// float below a faded margin.
const EDGE_FADE_MASK = [
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
  "linear-gradient(to bottom, black, black 80%, transparent)",
].join(", ");

/**
 * Extremely slow, extremely blurred colour circles behind the hero copy —
 * decorative sparkle, not a focal element, so they're pointer-events-none
 * and sit behind the text at all times. The base panel is theme-aware
 * (light: white, dark: the surface token) so it doesn't render as a stark
 * white rectangle when the rest of the page is dark.
 */
export function HeroBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-surface"
      style={{
        maskImage: EDGE_FADE_MASK,
        WebkitMaskImage: EDGE_FADE_MASK,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0 }}
          animate={{ x: [0, blob.moveX, 0], y: [0, blob.moveY, 0] }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full opacity-40 blur-[120px] [background-color:var(--blob-color)] dark:[background-color:var(--blob-dark-color)]"
          style={
            {
              width: blob.size,
              height: blob.size,
              top: blob.top,
              left: blob.left,
              "--blob-color": blob.color,
              "--blob-dark-color": blob.darkColor,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
