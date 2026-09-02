"use client";

import { motion } from "framer-motion";

type Blob = {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  moveX: number;
  moveY: number;
};

const BLOBS: Blob[] = [
  { color: "#4c8bf5", size: 380, top: "8%", left: "6%", duration: 26, moveX: 60, moveY: 40 },
  { color: "#eee75a", size: 320, top: "58%", left: "2%", duration: 32, moveX: 50, moveY: -50 },
  { color: "#ffd23f", size: 300, top: "4%", left: "62%", duration: 29, moveX: -50, moveY: 55 },
  { color: "#ff9f43", size: 340, top: "62%", left: "68%", duration: 35, moveX: -60, moveY: -35 },
  { color: "#4fd67a", size: 280, top: "32%", left: "40%", duration: 24, moveX: 45, moveY: 45 },
];

/**
 * Extremely slow, extremely blurred colour circles behind the hero copy —
 * decorative sparkle, not a focal element, so they're pointer-events-none
 * and sit behind the text at all times.
 */
export function HeroBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-white">
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0 }}
          animate={{ x: [0, blob.moveX, 0], y: [0, blob.moveY, 0] }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            backgroundColor: blob.color,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}
