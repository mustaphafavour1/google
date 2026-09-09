"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PIECE_COLORS = [
  "var(--color-primary-500)",
  "var(--color-primary-300)",
  "#f5b942", // gold
  "#34d399", // emerald
  "#60a5fa", // soft blue
  "#f472b6", // soft pink
];
const PIECE_COUNT = 12;
const PIECE_DURATION = 0.75;
const MAX_DELAY = 0.12;
const BURST_MS = (PIECE_DURATION + MAX_DELAY) * 1000;

type Piece = {
  id: number;
  color: string;
  x: number;
  y: number;
  rotate: number;
  width: number;
  height: number;
  delay: number;
};

let idSeq = 0;

function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, () => {
    // Fan out up and to the right from the emoji, like it's the source of
    // the burst — 0deg is straight right, 100deg is just past straight up.
    const angle = (-10 + Math.random() * 110) * (Math.PI / 180);
    const distance = 46 + Math.random() * 58;
    idSeq += 1;
    return {
      id: idSeq,
      color: PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)],
      x: Math.cos(angle) * distance,
      y: -Math.sin(angle) * distance,
      rotate: (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 360),
      width: 5 + Math.random() * 3,
      height: 3 + Math.random() * 3,
      delay: Math.random() * MAX_DELAY,
    };
  });
}

/**
 * A small celebratory burst that fires whenever `fireKey` changes (not on
 * mount): a 🎉 emoji pops into the bottom-left corner, several small pieces
 * fan out and tumble away from it, then the whole thing — emoji included —
 * fades back out together. Nothing is rendered between bursts, so it never
 * lingers as a stray icon in an unsolved game. Mount once inside a
 * `relative` game container; purely decorative, so it's hidden from
 * assistive tech.
 */
export function ConfettiBurst({ fireKey }: { fireKey: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [active, setActive] = useState(false);
  // Compare against the previous value rather than a one-shot "have we
  // mounted yet" flag — a boolean flag gets consumed by React StrictMode's
  // dev-only double-invocation of mount effects (mount -> cleanup ->
  // remount), which would otherwise make the second synthetic invocation
  // look like a real fireKey change and fire a burst with no correct
  // answer given. A value comparison is idempotent across any number of
  // re-invocations, since nothing has actually changed.
  const prevFireKey = useRef(fireKey);

  useEffect(() => {
    if (fireKey === prevFireKey.current) return;
    prevFireKey.current = fireKey;
    setPieces(makePieces());
    setActive(true);
    const clearId = setTimeout(() => {
      setPieces([]);
      setActive(false);
    }, BURST_MS);
    return () => clearTimeout(clearId);
  }, [fireKey]);

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 z-20" aria-hidden="true">
      <AnimatePresence>
        {active && (
          <motion.span
            key="emoji"
            className="block text-[18px] leading-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], rotate: [0, -8, 0], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            🎉
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.span
            key={piece.id}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: piece.x,
              y: [0, piece.y, piece.y + 22],
              opacity: [1, 1, 0],
              rotate: piece.rotate,
            }}
            transition={{ duration: PIECE_DURATION, delay: piece.delay, ease: "easeOut" }}
            className="absolute bottom-2 left-2 rounded-[1px]"
            style={{ width: piece.width, height: piece.height, backgroundColor: piece.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
