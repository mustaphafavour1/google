"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LETTER_ICONS } from "@/lib/letter-icons";

const REVEAL_STAGGER_MS = 65;
const IDLE_INTERVAL_MS = 4000;

type Mode = "icon" | "letter";
type LetterState = { mode: Mode; manual: boolean };

function isLetter(ch: string): boolean {
  return /[a-zA-Z]/.test(ch);
}

function initialLetters(text: string): LetterState[] {
  return Array.from(text).map((ch) => ({ mode: isLetter(ch) ? "icon" : "letter", manual: false }));
}

/**
 * Each letter starts as a design-icon "card", flips face-up to its real
 * letter on a staggered reveal, then stays clickable (flip back to icon and
 * back again). Once idle, one random non-manually-touched letter flips to
 * its icon every 4s and reverts on the next tick — a click "pins" a letter
 * so the idle cycle leaves it alone until clicked again.
 */
export function HeroTitleFlip({ text }: { text: string }) {
  const chars = useMemo(() => Array.from(text), [text]);
  const letterIdxs = useMemo(
    () => Array.from(text).map((ch, i) => (isLetter(ch) ? i : -1)).filter((i) => i !== -1),
    [text],
  );

  const [letters, setLetters] = useState<LetterState[]>(() => initialLetters(text));
  const [revealed, setRevealed] = useState(false);
  const autoIndexRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    letterIdxs.forEach((idx, order) => {
      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          setLetters((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], mode: "letter" };
            return next;
          });
          if (order === letterIdxs.length - 1) setRevealed(true);
        }, order * REVEAL_STAGGER_MS),
      );
    });
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // Runs once on mount — a title change remounts this component via a
    // `key` in the parent rather than resetting state in place here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!revealed || letterIdxs.length === 0) return;
    const id = setInterval(() => {
      setLetters((prev) => {
        const next = [...prev];
        const prevAuto = autoIndexRef.current;
        if (prevAuto !== null && !next[prevAuto].manual) {
          next[prevAuto] = { ...next[prevAuto], mode: "letter" };
        }
        const candidates = letterIdxs.filter((idx) => !next[idx].manual);
        if (candidates.length === 0) {
          autoIndexRef.current = null;
          return next;
        }
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        next[pick] = { ...next[pick], mode: "icon" };
        autoIndexRef.current = pick;
        return next;
      });
    }, IDLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [revealed, letterIdxs]);

  function toggleLetter(idx: number) {
    setLetters((prev) => {
      const next = [...prev];
      next[idx] = { mode: next[idx].mode === "icon" ? "letter" : "icon", manual: true };
      return next;
    });
  }

  return (
    <span className="inline">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((ch, idx) => {
          if (!isLetter(ch)) return <span key={idx}>{ch}</span>;
          const state = letters[idx];
          const Icon = LETTER_ICONS[ch.toUpperCase()];
          return (
            <button
              key={idx}
              type="button"
              tabIndex={-1}
              onClick={() => toggleLetter(idx)}
              className="relative inline-block cursor-pointer border-0 bg-transparent p-0 align-baseline [perspective:400px]"
              style={{ width: "0.66em", height: "1em" }}
            >
              <motion.span
                className="absolute inset-0 [transform-style:preserve-3d]"
                animate={{ rotateY: state.mode === "icon" ? 0 : 180 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
                  {Icon && <Icon className="h-[0.68em] w-[0.68em]" strokeWidth={2.25} />}
                </span>
                <span
                  className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {ch}
                </span>
              </motion.span>
            </button>
          );
        })}
      </span>
    </span>
  );
}
