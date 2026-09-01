"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, AnimatePresence, useReducedMotion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { soundPreference } from "@/lib/persistent-toggle";
import { playTone } from "@/lib/ui-sound";
import { ResumeGateButton } from "@/components/resume/resume-gate-button";
import { RocketPieceArt, pieceDimensions, type PieceId } from "./rocket-pieces";

const PIECE_ORDER: PieceId[] = ["nose", "body", "fins"];
const PIECE_COLOR: Record<PieceId, string> = {
  nose: "#A55C4E",
  body: "#BA7A69",
  fins: "#D19686",
};
const START_OFFSET: Record<PieceId, { top: number; left?: number; right?: number }> = {
  nose: { top: 8, left: 8 },
  body: { top: 130, right: 8 },
  fins: { top: 260, left: 8 },
};
const SNAP_THRESHOLD = 55;

function DraggablePiece({
  id,
  snapped,
  onSnapCheck,
}: {
  id: PieceId;
  snapped: boolean;
  onSnapCheck: (id: PieceId, point: { x: number; y: number }) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { width, height } = pieceDimensions(id);
  const start = START_OFFSET[id];

  if (snapped) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.15}
      style={{
        x,
        y,
        position: "absolute",
        top: start.top,
        left: start.left,
        right: start.right,
        width,
        height,
        touchAction: "none",
      }}
      whileDrag={{ scale: 1.08, zIndex: 20 }}
      onDragEnd={(_event, info) => onSnapCheck(id, info.point)}
      role="button"
      tabIndex={0}
      aria-label={`${id} piece — drag onto the rocket outline`}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      <RocketPieceArt id={id} color={PIECE_COLOR[id]} />
    </motion.div>
  );
}

export function RocketPuzzle({ hasResume }: { hasResume: boolean }) {
  const reduceMotion = useReducedMotion();
  const soundEnabled = soundPreference.useValue();
  const [snapped, setSnapped] = useState<Record<PieceId, boolean>>({
    nose: false,
    body: false,
    fins: false,
  });
  const [launching, setLaunching] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const targetRefs = {
    nose: useRef<HTMLDivElement>(null),
    body: useRef<HTMLDivElement>(null),
    fins: useRef<HTMLDivElement>(null),
  };

  function handleSnapCheck(id: PieceId, point: { x: number; y: number }) {
    const targetEl = targetRefs[id].current;
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const distance = Math.hypot(point.x - cx, point.y - cy);
    if (distance > SNAP_THRESHOLD) return;

    if (soundEnabled) playTone({ frequency: 480, toFrequency: 880, duration: 0.16, type: "triangle" });
    const next = { ...snapped, [id]: true };
    setSnapped(next);

    if (PIECE_ORDER.every((piece) => next[piece])) {
      window.setTimeout(() => {
        setLaunching(true);
        if (soundEnabled) {
          playTone({ frequency: 220, toFrequency: 40, duration: 0.7, type: "sawtooth", gain: 0.08 });
        }
        window.setTimeout(() => setRevealed(true), reduceMotion ? 50 : 750);
      }, 500);
    }
  }

  function reset() {
    setSnapped({ nose: false, body: false, fins: false });
    setLaunching(false);
    setRevealed(false);
  }

  const allSnapped = PIECE_ORDER.every((p) => snapped[p]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto h-[340px] w-[300px]">
        <motion.div
          className="absolute left-1/2 top-[8px] flex -translate-x-1/2 flex-col items-center"
          animate={launching ? { y: reduceMotion ? 0 : -420, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeIn" }}
        >
          {PIECE_ORDER.map((id) => (
            <div
              key={id}
              ref={targetRefs[id]}
              className="flex items-center justify-center rounded-md border border-dashed border-primary-300"
              style={{ ...pieceDimensions(id), opacity: snapped[id] ? 1 : 0.35 }}
            >
              {snapped[id] ? (
                <RocketPieceArt id={id} color={PIECE_COLOR[id]} />
              ) : (
                <span className="text-[10px] text-ink-faint">{id}</span>
              )}
            </div>
          ))}
        </motion.div>

        {PIECE_ORDER.map((id) => (
          <DraggablePiece key={id} id={id} snapped={snapped[id]} onSnapCheck={handleSnapCheck} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-hairline bg-surface p-6 text-center"
          >
            <p className="text-[15px] font-semibold text-ink-em">Built it. 🚀</p>
            <p className="type-body max-w-xs text-ink-muted">
              You assembled the rocket — here&rsquo;s the resume it was guarding.
            </p>
            <div className="flex items-center gap-2.5">
              {hasResume && (
                <ResumeGateButton className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary-500 px-4 text-[13px] font-medium text-white transition-colors hover:bg-primary-600">
                  <Download size={14} />
                  Download resume
                </ResumeGateButton>
              )}
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-4 text-[13px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
              >
                <RotateCcw size={13} />
                Again
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex flex-col items-center gap-2"
          >
            <p className="type-meta">
              {allSnapped ? "Launching…" : "Drag each piece onto the outline to assemble the rocket."}
            </p>
            {!allSnapped && (
              <button
                type="button"
                onClick={reset}
                className="text-[12px] font-medium text-ink-soft underline decoration-dotted underline-offset-2 hover:text-ink-strong"
              >
                Reset pieces
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
