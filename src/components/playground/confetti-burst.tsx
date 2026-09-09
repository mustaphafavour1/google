"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// document.body isn't available during SSR, and the very first client
// render must match the server output exactly or React flags a hydration
// mismatch — useSyncExternalStore is the sanctioned way to read "has
// hydration finished yet" (it forces getServerSnapshot on that first
// render, then a second render sees getSnapshot), no setState-in-effect
// needed.
function subscribeNever() {
  return () => {};
}
function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

const PIECE_COLORS = [
  "var(--color-primary-500)",
  "var(--color-primary-300)",
  "#f5b942", // gold
  "#34d399", // emerald
  "#60a5fa", // soft blue
  "#f472b6", // soft pink
];
const PIECE_COUNT = 18;
const PIECE_DURATION = 1;
const MAX_DELAY = 0.15;
const BURST_MS = (PIECE_DURATION + MAX_DELAY) * 1000;
// Pieces travel a fraction of the smaller viewport dimension, so the burst
// visibly spans the screen on any device instead of a fixed pixel radius.
const MIN_SPREAD_FRACTION = 0.3;
const MAX_SPREAD_FRACTION = 0.62;

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
  const spread = Math.min(window.innerWidth, window.innerHeight);
  return Array.from({ length: PIECE_COUNT }, () => {
    // Fan out up and to the right from the emoji, like it's the source of
    // the burst — 0deg is straight right, 100deg is just past straight up.
    const angle = (-10 + Math.random() * 110) * (Math.PI / 180);
    const distance = spread * (MIN_SPREAD_FRACTION + Math.random() * (MAX_SPREAD_FRACTION - MIN_SPREAD_FRACTION));
    idSeq += 1;
    return {
      id: idSeq,
      color: PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)],
      x: Math.cos(angle) * distance,
      y: -Math.sin(angle) * distance,
      rotate: (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 360),
      width: 7 + Math.random() * 5,
      height: 5 + Math.random() * 4,
      delay: Math.random() * MAX_DELAY,
    };
  });
}

/**
 * A celebratory burst that fires whenever `fireKey` changes (not on mount):
 * a 🎉 emoji pops into the bottom-left of the SCREEN — portaled to
 * document.body so it isn't clipped to the calling game's card — and pieces
 * fan out across the viewport, tumbling away from it, before the whole
 * thing fades back out together. Nothing is rendered between bursts, so it
 * never lingers as a stray icon. Mount once per game; purely decorative, so
 * it's hidden from assistive tech.
 */
export function ConfettiBurst({ fireKey }: { fireKey: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [active, setActive] = useState(false);
  const mounted = useMounted();
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

  // document.body isn't available during SSR — the portal only ever needs
  // to exist once the burst can actually fire, i.e. after mount.
  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden="true">
      <AnimatePresence>
        {active && (
          <motion.span
            key="emoji"
            className="fixed bottom-6 left-6 block text-[30px] leading-none sm:bottom-8 sm:left-8"
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
              y: [0, piece.y, piece.y + 40],
              opacity: [1, 1, 0],
              rotate: piece.rotate,
            }}
            transition={{ duration: PIECE_DURATION, delay: piece.delay, ease: "easeOut" }}
            className="fixed bottom-8 left-8 rounded-[1px] sm:bottom-10 sm:left-10"
            style={{ width: piece.width, height: piece.height, backgroundColor: piece.color }}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
