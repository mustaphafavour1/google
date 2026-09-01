"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, Trash2, Sparkles } from "lucide-react";
import { soundPreference } from "@/lib/persistent-toggle";
import { playTone } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";

const COLS = 7;
const ROWS = 7;
const MIN_FILLED_TO_WIN = 12;

type Offset = [number, number];

const SHAPES: Record<string, Offset[]> = {
  I: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  O: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  T: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
  ],
  S: [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
  ],
  L: [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
  ],
};

const SHAPE_NAMES = Object.keys(SHAPES);
const COLORS = ["bg-highlight-blue", "bg-highlight-green", "bg-highlight-orange", "bg-highlight-purple"];

function rotate(shape: Offset[]): Offset[] {
  const maxCol = Math.max(...shape.map(([, c]) => c));
  return shape.map(([r, c]): Offset => [c, maxCol - r]);
}

function randomShape(): Offset[] {
  return SHAPES[SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)]];
}

function cellKey(r: number, c: number) {
  return `${r}:${c}`;
}

export function SymmetryGame() {
  const [filled, setFilled] = useState<Map<string, number>>(new Map());
  // Starts on a fixed shape (deterministic, so server and client agree) and
  // picks a real random one client-side after mount — Math.random() can't
  // safely choose the initial state, since SSR and hydration would each call
  // it separately and disagree.
  const [current, setCurrent] = useState<Offset[]>(SHAPES.O);
  const [pieceCount, setPieceCount] = useState(0);
  const [rejected, setRejected] = useState(false);
  const soundOn = soundPreference.useValue();

  useEffect(() => {
    // Same reasoning as jigsaw-game.tsx: a random initial shape can't be
    // chosen during render without disagreeing between server and client.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only randomization to avoid an SSR/hydration mismatch, not a synced value
    setCurrent(randomShape());
  }, []);

  const { matched, total, isSymmetric } = useMemo(() => {
    let matchedCount = 0;
    for (const key of filled.keys()) {
      const [r, c] = key.split(":").map(Number);
      const mirrorC = COLS - 1 - c;
      if (filled.has(cellKey(r, mirrorC))) matchedCount++;
    }
    return {
      matched: matchedCount,
      total: filled.size,
      isSymmetric: filled.size >= MIN_FILLED_TO_WIN && matchedCount === filled.size,
    };
  }, [filled]);

  function tryPlace(anchorR: number, anchorC: number) {
    if (isSymmetric) return;
    const cells = current.map(([dr, dc]): [number, number] => [anchorR + dr, anchorC + dc]);
    const valid = cells.every(
      ([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS && !filled.has(cellKey(r, c)),
    );

    if (!valid) {
      setRejected(true);
      if (soundOn) playTone({ frequency: 160, duration: 0.12 });
      setTimeout(() => setRejected(false), 300);
      return;
    }

    const next = new Map(filled);
    const colorIndex = pieceCount % COLORS.length;
    for (const [r, c] of cells) next.set(cellKey(r, c), colorIndex);
    setFilled(next);
    setPieceCount((n) => n + 1);
    setCurrent(randomShape());

    const nowSymmetric = next.size >= MIN_FILLED_TO_WIN && [...next.keys()].every((key) => {
      const [r, c] = key.split(":").map(Number);
      return next.has(cellKey(r, COLS - 1 - c));
    });
    if (soundOn) playTone(nowSymmetric ? { frequency: 440, toFrequency: 880, duration: 0.4 } : { frequency: 380, duration: 0.08 });
  }

  function clear() {
    setFilled(new Map());
    setPieceCount(0);
    setCurrent(randomShape());
  }

  const symmetryPct = total === 0 ? 0 : Math.round((matched / total) * 100);

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
      <div>
        <div
          className="relative mx-auto grid w-fit gap-[3px] rounded-xl bg-hairline p-[3px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, 34px)`, gridTemplateRows: `repeat(${ROWS}, 34px)` }}
        >
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-primary-300"
            style={{ left: "50%" }}
            aria-hidden="true"
          />
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const key = cellKey(r, c);
              const colorIndex = filled.get(key);
              const isMirrored = colorIndex !== undefined && filled.has(cellKey(r, COLS - 1 - c));
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => tryPlace(r, c)}
                  className={cn(
                    "rounded-[3px] transition-colors",
                    colorIndex !== undefined
                      ? cn(COLORS[colorIndex], isMirrored && "ring-1 ring-inset ring-white/50")
                      : "bg-surface hover:bg-surface-muted",
                  )}
                />
              );
            }),
          )}
        </div>
        <motion.p
          animate={rejected ? { x: [0, -4, 4, -4, 0] } : {}}
          className="type-meta mt-3 text-center"
        >
          {rejected ? "Doesn't fit there" : "Click a cell to drop the next block"}
        </motion.p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="type-meta mb-2">Next block</p>
          <div className="relative grid h-[76px] w-[76px] gap-[2px]" style={{ gridTemplateColumns: "repeat(4, 18px)", gridTemplateRows: "repeat(4, 18px)" }}>
            {current.map(([r, c], i) => (
              <span
                key={i}
                className="rounded-[2px] bg-primary-500"
                style={{ gridRow: r + 1, gridColumn: c + 1 }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrent(rotate(current))}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
          >
            <RotateCw size={12} />
            Rotate
          </button>
        </div>

        <div>
          <p className="type-meta mb-1.5">Mirror symmetry</p>
          <div className="h-2 w-full max-w-[180px] overflow-hidden rounded-full bg-surface-muted">
            <motion.div
              animate={{ width: `${symmetryPct}%` }}
              className={cn("h-full rounded-full", isSymmetric ? "bg-success" : "bg-primary-500")}
            />
          </div>
          <p className="type-meta mt-1.5">{total === 0 ? "Empty board" : `${symmetryPct}% mirrored`}</p>
        </div>

        {isSymmetric && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-[13px] font-medium text-ink-em"
          >
            <Sparkles size={14} className="text-primary-500" />
            Perfectly symmetric.
          </motion.p>
        )}

        <button
          type="button"
          onClick={clear}
          className="inline-flex w-fit items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
        >
          <Trash2 size={12} />
          Clear board
        </button>
      </div>
    </div>
  );
}
