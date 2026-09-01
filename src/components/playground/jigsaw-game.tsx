"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, PartyPopper } from "lucide-react";
import { soundPreference } from "@/lib/persistent-toggle";
import { playTone } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const PUZZLES = [
  { id: "figma", label: "Figma & Friends", src: "/playground/jigsaw-figma.jpg" },
  { id: "grid", label: "The App Drawer", src: "/playground/jigsaw-grid.jpg" },
  { id: "social", label: "Social Stack", src: "/playground/jigsaw-social.jpg" },
];

function shuffledOrder(): number[] {
  const order = Array.from({ length: TILE_COUNT }, (_, i) => i);
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((piece, slot) => piece === slot));
  return order;
}

export function JigsawGame() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  // Starts in solved (identity) order — deterministic, so server and client
  // render the same markup — then shuffles client-side once mounted. Math.random()
  // can't safely pick the initial state here: it would run once during SSR and
  // again during hydration, and the two calls would disagree.
  const [order, setOrder] = useState<number[]>(() => Array.from({ length: TILE_COUNT }, (_, i) => i));
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const soundOn = soundPreference.useValue();

  useEffect(() => {
    // Randomizing during render would run once on the server and again on
    // the client during hydration, disagreeing both times (Math.random()
    // isn't deterministic) — this has to happen client-only, after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only randomization to avoid an SSR/hydration mismatch, not a synced value
    setOrder(shuffledOrder());
    setReady(true);
  }, []);

  const puzzle = PUZZLES[puzzleIndex];
  const solved = ready && order.every((piece, slot) => piece === slot);

  function reshuffle(index = puzzleIndex) {
    setPuzzleIndex(index);
    setOrder(shuffledOrder());
    setSelected(null);
    setMoves(0);
  }

  function handleTileClick(slot: number) {
    if (solved || !ready) return;
    if (selected === null) {
      setSelected(slot);
      return;
    }
    if (selected === slot) {
      setSelected(null);
      return;
    }
    const next = [...order];
    [next[selected], next[slot]] = [next[slot], next[selected]];
    setOrder(next);
    setSelected(null);
    setMoves((m) => m + 1);

    const justSolved = next.every((piece, i) => piece === i);
    if (soundOn) playTone(justSolved ? { frequency: 440, toFrequency: 880, duration: 0.35 } : { frequency: 320, duration: 0.08 });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {PUZZLES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => reshuffle(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
              i === puzzleIndex
                ? "border-primary-500 bg-primary-tint text-primary-tint-text"
                : "border-hairline text-ink-soft hover:text-ink-strong",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
        <div
          className="relative mx-auto grid aspect-square w-full max-w-sm gap-[3px] overflow-hidden rounded-xl bg-hairline p-[3px]"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {order.map((piece, slot) => {
            const row = Math.floor(piece / GRID_SIZE);
            const col = piece % GRID_SIZE;
            return (
              <motion.button
                key={slot}
                type="button"
                layout
                onClick={() => handleTileClick(slot)}
                disabled={solved}
                className={cn(
                  "relative overflow-hidden rounded-[3px] transition-shadow",
                  selected === slot && "ring-2 ring-primary-500 ring-offset-1",
                )}
                style={{
                  backgroundImage: `url(${puzzle.src})`,
                  backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                  backgroundPosition: `${(col / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`,
                }}
              />
            );
          })}

          <AnimatePresence>
            {solved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
              >
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink-em shadow-lg"
                >
                  <PartyPopper size={14} className="text-primary-500" />
                  Solved in {moves} moves
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-row items-center gap-3 text-[12.5px] text-ink-muted sm:flex-col sm:items-start">
          <p className="type-meta">Tap two tiles to swap them.</p>
          <p>
            Moves: <span className="data-mono text-ink-strong">{moves}</span>
          </p>
          <button
            type="button"
            onClick={() => reshuffle()}
            className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
          >
            <Shuffle size={13} />
            Shuffle again
          </button>
        </div>
      </div>
    </div>
  );
}
