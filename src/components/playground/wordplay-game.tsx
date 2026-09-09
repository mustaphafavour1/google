"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Lightbulb, PartyPopper, RotateCcw, SkipForward } from "lucide-react";
import { playTone } from "@/lib/ui-sound";
import { cn } from "@/lib/utils";
import { ConfettiBurst } from "./confetti-burst";

type Question = { a: string; op: "+" | "-"; b: string; answer: string };

const QUESTIONS: Question[] = [
  { a: "COLOR", op: "+", b: "NUMBER", answer: "HEX" },
  { a: "SHAPE", op: "+", b: "COLOR", answer: "ICON" },
  { a: "TOUCH", op: "+", b: "SCREEN", answer: "MOBILE" },
  { a: "LAYOUT", op: "+", b: "COLOR", answer: "THEME" },
  { a: "WIRE", op: "+", b: "FRAME", answer: "WIREFRAME" },
  { a: "MOCK", op: "+", b: "UP", answer: "MOCKUP" },
  { a: "CLICK", op: "+", b: "DRAG", answer: "GESTURE" },
  { a: "WIDTH", op: "+", b: "HEIGHT", answer: "ASPECT" },
  { a: "CARD", op: "+", b: "SHADOW", answer: "ELEVATION" },
  { a: "BUTTON", op: "-", b: "BORDER", answer: "GHOST" },
  { a: "CODE", op: "-", b: "BUG", answer: "FEATURE" },
  { a: "WHITE", op: "+", b: "SPACE", answer: "WHITESPACE" },
  { a: "MOUSE", op: "+", b: "OVER", answer: "HOVER" },
  { a: "PIXEL", op: "+", b: "DENSITY", answer: "RETINA" },
  { a: "USER", op: "+", b: "JOURNEY", answer: "FLOW" },
];

const MAX_HINTS = 3;
const WORDPLAYZ_URL = "https://wordplayz.vercel.app/";

export function WordPlayGame() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = QUESTIONS[index];
  const hintsLeft = MAX_HINTS - hintsUsed;

  function focusInput() {
    inputRef.current?.focus();
  }

  function handleChange(raw: string) {
    if (solved) return;
    const cleaned = raw
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, q.answer.length);
    setGuess(cleaned);
    setWrong(false);
  }

  function submit() {
    if (solved || !guess) return;
    if (guess === q.answer) {
      setSolved(true);
      setSolvedCount((c) => c + 1);
      setCelebrateKey((k) => k + 1);
      playTone({ frequency: 440, toFrequency: 880, duration: 0.35 });
    } else {
      setWrong(true);
      playTone({ frequency: 160, duration: 0.15 });
      setTimeout(() => setWrong(false), 400);
    }
  }

  function useHint() {
    if (solved || hintsUsed >= MAX_HINTS || hintsUsed >= q.answer.length) return;
    const nextHints = hintsUsed + 1;
    setHintsUsed(nextHints);
    setGuess((prev) => {
      const revealed = q.answer.slice(0, nextHints);
      return prev.length > nextHints ? prev : revealed + prev.slice(nextHints);
    });
    focusInput();
  }

  function clear() {
    setGuess(hintsUsed > 0 ? q.answer.slice(0, hintsUsed) : "");
    setWrong(false);
    focusInput();
  }

  function next() {
    setIndex((i) => (i + 1) % QUESTIONS.length);
    setGuess("");
    setHintsUsed(0);
    setWrong(false);
    setSolved(false);
  }

  return (
    <div className="relative">
      <ConfettiBurst fireKey={celebrateKey} />
      <div className="flex items-center justify-between">
        <p className="type-meta">
          {solvedCount} / {QUESTIONS.length} solved
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

      <div onClick={focusInput} className="mt-6 flex cursor-text flex-col items-center gap-2 text-center">
        <p className="text-[26px] font-extrabold tracking-tight text-ink-em sm:text-[30px]">{q.a}</p>
        <span className="text-[18px] font-bold text-primary-500">{q.op}</span>
        <p className="text-[26px] font-extrabold tracking-tight text-ink-em sm:text-[30px]">{q.b}</p>
        <span className="text-[18px] font-bold text-primary-500">=</span>

        <motion.div animate={wrong ? { x: [0, -6, 6, -6, 0] } : {}} transition={{ duration: 0.3 }} className="flex gap-1.5">
          {Array.from(q.answer).map((_, i) => {
            const char = guess[i];
            const isHinted = i < hintsUsed;
            return (
              <div
                key={i}
                className={cn(
                  "flex h-10 w-8 items-end justify-center border-b-2 pb-0.5 text-[20px] font-bold uppercase",
                  solved
                    ? "border-success text-success"
                    : isHinted
                      ? "border-primary-300 text-primary-500"
                      : "border-ink-em text-ink-em",
                )}
              >
                {char ?? ""}
              </div>
            );
          })}
        </motion.div>

        <label htmlFor="wordplay-input" className="sr-only">
          Type your answer
        </label>
        <input
          id="wordplay-input"
          ref={inputRef}
          value={guess}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          disabled={solved}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          inputMode="text"
          className="sr-only"
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {solved ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-600"
          >
            <PartyPopper size={14} />
            Solved — Next
          </motion.button>
        ) : (
          <>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
            >
              <RotateCcw size={12} />
              Clear
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!guess}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={13} />
              Submit
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-[12.5px] font-medium text-ink-strong transition-colors hover:bg-surface-muted"
            >
              <SkipForward size={12} />
              Skip
            </button>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href={WORDPLAYZ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-soft transition-colors hover:text-primary-500"
        >
          Play the full WordPlay game
          <ArrowUpRight size={12} />
        </a>
      </div>
    </div>
  );
}
