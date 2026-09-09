"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, PartyPopper, SkipForward } from "lucide-react";
import { playTone } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";
import { LETTER_ICONS } from "@/lib/letter-icons";
import { ConfettiBurst } from "./confetti-burst";

const ALPHABET_RE = /^[A-Z]$/;
const SEED_REVEAL_COUNT = 3;
const MAX_HINTS = 3;

const QUOTES = [
  { text: "SIMPLICITY IS THE ULTIMATE SOPHISTICATION", source: "Leonardo da Vinci" },
  { text: "STAY HUNGRY STAY FOOLISH", source: "Steve Jobs" },
  { text: "GOOD DESIGN IS OBVIOUS GREAT DESIGN IS TRANSPARENT", source: "Joe Sparano" },
  { text: "MOVE FAST AND BREAK THINGS", source: "Facebook, early motto" },
];

type Origin = "seed" | "hint" | "typed" | null;

function firstUnfilled(text: string, filled: boolean[], from: number): number {
  for (let i = from; i < text.length; i++) {
    if (text[i] !== " " && !filled[i]) return i;
  }
  return -1;
}

function lastTypedBefore(origins: Origin[], from: number): number {
  for (let i = from; i >= 0; i--) {
    if (origins[i] === "typed") return i;
  }
  return -1;
}

function seedState(text: string): { filled: boolean[]; origins: Origin[] } {
  const filled = new Array(text.length).fill(false);
  const origins: Origin[] = new Array(text.length).fill(null);
  let seeded = 0;
  for (let i = 0; i < text.length && seeded < SEED_REVEAL_COUNT; i++) {
    if (text[i] !== " ") {
      filled[i] = true;
      origins[i] = "seed";
      seeded++;
    }
  }
  return { filled, origins };
}

function CryptogramPuzzle({
  quote,
  onNext,
}: {
  quote: { text: string; source: string };
  onNext: () => void;
}) {
  const [filled, setFilled] = useState<boolean[]>(() => seedState(quote.text).filled);
  const [origins, setOrigins] = useState<Origin[]>(() => seedState(quote.text).origins);
  const [cursor, setCursor] = useState<number>(() => firstUnfilled(quote.text, seedState(quote.text).filled, 0));
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const words = quote.text.split(" ");
  const wordIndices: number[][] = [];
  let flat = 0;
  for (const word of words) {
    const idxs: number[] = [];
    for (let c = 0; c < word.length; c++, flat++) idxs.push(flat);
    wordIndices.push(idxs);
    flat += 1;
  }

  const letterCount = quote.text.replace(/ /g, "").length;
  const filledCount = filled.filter(Boolean).length;
  const solved = letterCount > 0 && filledCount === letterCount;
  const hintsLeft = MAX_HINTS - hintsUsed;

  function focusInput() {
    inputRef.current?.focus();
  }

  function handleKeyInput(rawValue: string) {
    if (solved || cursor === -1) return;
    const letter = rawValue.slice(-1).toUpperCase();
    if (!ALPHABET_RE.test(letter)) return;

    if (letter === quote.text[cursor]) {
      const nextFilled = [...filled];
      nextFilled[cursor] = true;
      const nextOrigins = [...origins];
      nextOrigins[cursor] = "typed";
      const nextCursor = firstUnfilled(quote.text, nextFilled, cursor + 1);

      setFilled(nextFilled);
      setOrigins(nextOrigins);
      setCursor(nextCursor);
      setWrongIndex(null);

      if (nextCursor === -1) {
        setCelebrateKey((k) => k + 1);
        playTone({ frequency: 440, toFrequency: 880, duration: 0.35 });
      } else {
        playTone({ frequency: 480, duration: 0.1 });
      }
    } else {
      setWrongIndex(cursor);
      playTone({ frequency: 160, duration: 0.15 });
      setTimeout(() => setWrongIndex((w) => (w === cursor ? null : w)), 400);
    }
  }

  function handleBackspace() {
    if (solved) return;
    const searchFrom = cursor === -1 ? quote.text.length - 1 : cursor - 1;
    const target = lastTypedBefore(origins, searchFrom);
    if (target === -1) return;
    setFilled((prev) => {
      const next = [...prev];
      next[target] = false;
      return next;
    });
    setOrigins((prev) => {
      const next = [...prev];
      next[target] = null;
      return next;
    });
    setCursor(target);
  }

  function useHint() {
    if (solved || hintsLeft <= 0 || cursor === -1) return;
    const target = cursor;
    const nextFilled = [...filled];
    nextFilled[target] = true;
    const nextOrigins = [...origins];
    nextOrigins[target] = "hint";
    const nextCursor = firstUnfilled(quote.text, nextFilled, target + 1);

    setHintsUsed((h) => h + 1);
    setFilled(nextFilled);
    setOrigins(nextOrigins);
    setCursor(nextCursor);
    focusInput();
  }

  return (
    <div className="relative">
      <ConfettiBurst fireKey={celebrateKey} />
      <label htmlFor="cryptogram-input" className="sr-only">
        Type letters to solve the quote
      </label>
      <input
        id="cryptogram-input"
        ref={inputRef}
        value=""
        onChange={(event) => {
          handleKeyInput(event.target.value);
          event.target.value = "";
        }}
        onKeyDown={(event) => {
          if (event.key === "Backspace") handleBackspace();
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        inputMode="text"
        disabled={solved}
        className="sr-only"
      />

      <div className="mb-4 flex items-center justify-between">
        <p className="type-meta">
          {filledCount} / {letterCount} letters
        </p>
        <button
          type="button"
          onClick={useHint}
          disabled={solved || hintsLeft <= 0}
          className="flex items-center gap-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Lightbulb size={13} />
          Hint &minus;{hintsLeft}
        </button>
      </div>

      <div onClick={focusInput} className="flex cursor-text flex-wrap gap-x-3 gap-y-3">
        {words.map((word, wi) => (
          <div key={wi} className="flex flex-wrap gap-1">
            {word.split("").map((ch, ci) => {
              const flatIndex = wordIndices[wi][ci];
              const Icon = LETTER_ICONS[ch];
              const isFilled = filled[flatIndex];
              const isCursor = flatIndex === cursor;
              const isWrong = wrongIndex === flatIndex;
              return (
                <motion.div
                  key={ci}
                  animate={isWrong ? { x: [0, -4, 4, -4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md border text-[15px] font-semibold transition-colors",
                    isFilled
                      ? "border-primary-300 bg-primary-tint text-primary-tint-text"
                      : isCursor
                        ? "border-primary-400 bg-surface text-ink-soft"
                        : "border-hairline bg-surface-muted text-ink-soft",
                  )}
                >
                  {isFilled ? ch : Icon ? <Icon size={15} /> : ch}
                </motion.div>
              );
            })}
          </div>
        ))}
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
          <p className="type-meta">Type on your keyboard to fill it in.</p>
        )}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
        >
          <SkipForward size={12} />
          {solved ? "Next quote" : "Skip"}
        </button>
      </div>
    </div>
  );
}

export function CryptogramGame() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  function next() {
    setQuoteIndex((i) => (i + 1) % QUOTES.length);
  }

  return <CryptogramPuzzle key={quoteIndex} quote={QUOTES[quoteIndex]} onNext={next} />;
}
