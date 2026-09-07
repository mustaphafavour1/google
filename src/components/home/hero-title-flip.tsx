"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DESIGN_LETTER_ICONS, BUSINESS_LETTER_ICONS } from "@/lib/letter-icons";

const REVEAL_STAGGER_MS = 65;
const IDLE_INTERVAL_MS = 4000;
const ICON_STROKE = 1.5;

function isLetter(ch: string): boolean {
  return /[a-zA-Z]/.test(ch);
}

function pickRandomExcluding(pool: number[], exclude: number | null): number {
  const candidates = exclude === null ? pool : pool.filter((i) => i !== exclude);
  const from = candidates.length > 0 ? candidates : pool;
  return from[Math.floor(Math.random() * from.length)];
}

/**
 * Each letter starts as a design/business-themed icon "card" (split at the
 * title's first semicolon — text before it draws from the design set, text
 * after from the business set) and flips face-up to its real letter in a
 * staggered reveal on mount. After that, at most one letter shows as an
 * icon at a time: every 4s idle it flips a random letter to its icon and
 * back, and clicking any letter immediately makes it (or nothing, if it
 * was already the one showing) the active icon, resetting that 4s clock.
 */
export function HeroTitleFlip({ text }: { text: string }) {
  const chars = useMemo(() => Array.from(text), [text]);
  const letterIdxs = useMemo(
    () => chars.map((ch, i) => (isLetter(ch) ? i : -1)).filter((i) => i !== -1),
    [chars],
  );
  const splitAt = useMemo(() => {
    const semi = text.indexOf(";");
    return semi === -1 ? text.length : semi;
  }, [text]);

  const [revealed, setRevealed] = useState<boolean[]>(() => chars.map(() => false));
  const [revealDone, setRevealDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    letterIdxs.forEach((idx, order) => {
      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          setRevealed((prev) => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
          if (order === letterIdxs.length - 1) setRevealDone(true);
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

  function scheduleAutoFlip() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const next = pickRandomExcluding(letterIdxs, activeIndexRef.current);
      activeIndexRef.current = next;
      setActiveIndex(next);
      scheduleAutoFlip();
    }, IDLE_INTERVAL_MS);
  }

  useEffect(() => {
    if (!revealDone || letterIdxs.length === 0) return;
    scheduleAutoFlip();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealDone]);

  function handleClick(idx: number) {
    const next = activeIndexRef.current === idx ? null : idx;
    activeIndexRef.current = next;
    setActiveIndex(next);
    if (revealDone) scheduleAutoFlip();
  }

  return (
    <span className="inline">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((ch, idx) => {
          if (!isLetter(ch)) return <span key={idx}>{ch}</span>;

          const showIcon = !revealed[idx] || activeIndex === idx;
          const isUpper = ch === ch.toUpperCase();
          const icons = idx < splitAt ? DESIGN_LETTER_ICONS : BUSINESS_LETTER_ICONS;
          const Icon = icons[ch.toUpperCase()];
          const iconSize = isUpper ? "0.62em" : "0.46em";

          return (
            <button
              key={idx}
              type="button"
              tabIndex={-1}
              onClick={() => handleClick(idx)}
              className="relative inline-block cursor-pointer border-0 bg-transparent p-0 align-baseline [perspective:400px]"
            >
              <motion.span
                className="relative inline-block [transform-style:preserve-3d]"
                animate={{ rotateY: showIcon ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="[backface-visibility:hidden]">{ch}</span>
                <span
                  className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {Icon && <Icon style={{ height: iconSize, width: iconSize }} strokeWidth={ICON_STROKE} />}
                </span>
              </motion.span>
            </button>
          );
        })}
      </span>
    </span>
  );
}
