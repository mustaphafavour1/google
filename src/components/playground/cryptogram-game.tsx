"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  Anchor,
  Box,
  Code2,
  Database,
  Eye,
  Frame,
  Grid3x3,
  Hexagon,
  Image as ImageIcon,
  Keyboard,
  Layers,
  Monitor,
  Network,
  Orbit,
  Palette,
  Ruler,
  Sparkles,
  Terminal,
  Upload,
  Video,
  Zap,
  RefreshCw,
  PartyPopper,
} from "lucide-react";
import { soundPreference } from "@/lib/persistent-toggle";
import { playTone } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";

const LETTER_ICONS: Record<string, typeof Anchor> = {
  A: Anchor,
  B: Box,
  C: Code2,
  D: Database,
  E: Eye,
  F: Frame,
  G: Grid3x3,
  H: Hexagon,
  I: ImageIcon,
  K: Keyboard,
  L: Layers,
  M: Monitor,
  N: Network,
  O: Orbit,
  P: Palette,
  R: Ruler,
  S: Sparkles,
  T: Terminal,
  U: Upload,
  V: Video,
  Y: Zap,
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const QUOTES = [
  { text: "SIMPLICITY IS THE ULTIMATE SOPHISTICATION", source: "Leonardo da Vinci" },
  { text: "STAY HUNGRY STAY FOOLISH", source: "Steve Jobs" },
  { text: "GOOD DESIGN IS OBVIOUS GREAT DESIGN IS TRANSPARENT", source: "Joe Sparano" },
  { text: "MOVE FAST AND BREAK THINGS", source: "Facebook, early motto" },
];

export function CryptogramGame() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const soundOn = soundPreference.useValue();

  const quote = QUOTES[quoteIndex];
  const uniqueLetters = new Set(quote.text.replace(/[^A-Z]/g, "").split(""));
  const solved = [...uniqueLetters].every((l) => guessed.has(l));

  function guess(letter: string) {
    if (solved || guessed.has(letter)) return;
    if (uniqueLetters.has(letter)) {
      const next = new Set(guessed).add(letter);
      setGuessed(next);
      if (soundOn) {
        const justSolved = [...uniqueLetters].every((l) => next.has(l));
        playTone(justSolved ? { frequency: 440, toFrequency: 880, duration: 0.35 } : { frequency: 480, duration: 0.1 });
      }
    } else {
      setWrong(letter);
      if (soundOn) playTone({ frequency: 160, duration: 0.15 });
      setTimeout(() => setWrong((w) => (w === letter ? null : w)), 400);
    }
  }

  function next() {
    const nextIndex = (quoteIndex + 1) % QUOTES.length;
    setQuoteIndex(nextIndex);
    setGuessed(new Set());
    setWrong(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const letter = event.key.toUpperCase();
    if (letter.length === 1 && ALPHABET.includes(letter)) guess(letter);
  }

  return (
    <div>
      <label className="sr-only" htmlFor="cryptogram-input">
        Type a letter to guess
      </label>
      <input
        id="cryptogram-input"
        type="text"
        inputMode="text"
        autoComplete="off"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        placeholder="Type a letter…"
        className="mb-5 h-10 w-full max-w-[200px] rounded-md border border-hairline bg-transparent px-3 text-[13px] text-ink-strong outline-none focus:ring-2 focus:ring-primary-500/15"
      />

      <div className="flex flex-wrap gap-x-1.5 gap-y-3">
        {quote.text.split(" ").map((word, wi) => (
          <div key={wi} className="flex flex-wrap gap-1">
            {word.split("").map((ch, ci) => {
              const Icon = LETTER_ICONS[ch];
              const revealed = guessed.has(ch);
              return (
                <motion.div
                  key={ci}
                  animate={wrong === ch ? { x: [0, -4, 4, -4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md border text-[15px] font-semibold",
                    revealed
                      ? "border-primary-300 bg-primary-tint text-primary-tint-text"
                      : "border-hairline bg-surface-muted text-ink-soft",
                  )}
                >
                  {revealed ? ch : Icon ? <Icon size={15} /> : ch}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-1">
        {ALPHABET.map((letter) => {
          const inQuote = uniqueLetters.has(letter);
          const done = guessed.has(letter);
          return (
            <button
              key={letter}
              type="button"
              onClick={() => guess(letter)}
              disabled={done || solved}
              className={cn(
                "data-mono flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-medium transition-colors",
                done
                  ? "border-primary-300 bg-primary-tint text-primary-tint-text"
                  : wrong === letter
                    ? "border-danger bg-danger-tint text-danger"
                    : "border-hairline text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
                !inQuote && !done && "opacity-60",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {solved ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-[13px] font-medium text-ink-em"
          >
            <PartyPopper size={14} className="text-primary-500" />
            Solved — {quote.source}
          </motion.p>
        ) : (
          <p className="type-meta">
            {guessed.size} / {uniqueLetters.size} letters
          </p>
        )}
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
        >
          <RefreshCw size={12} />
          {solved ? "Next quote" : "Skip"}
        </button>
      </div>
    </div>
  );
}
