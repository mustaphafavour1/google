"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const SPEEDS = [0.5, 1, 1.5, 2] as const;
const BASE_PX_PER_SECOND = 108;

export function AutoScrollControl() {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const frameRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    function tick(ts: number) {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      window.scrollTo({ top: window.scrollY + BASE_PX_PER_SECOND * speed * dt, behavior: "instant" });

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(false);
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      lastTsRef.current = null;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, speed]);

  useEffect(() => {
    if (!active) return;

    function onClick(e: MouseEvent) {
      if (containerRef.current?.contains(e.target as Node)) return;
      setActive(false);
    }
    window.addEventListener("click", onClick, { capture: true });
    return () => window.removeEventListener("click", onClick, { capture: true });
  }, [active]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!e.shiftKey) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(false);
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={containerRef}>
      <p className="type-eyebrow mb-2.5">Auto-scroll</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActive((v) => !v)}
          aria-pressed={active}
          aria-label={active ? "Pause auto-scroll" : "Start auto-scroll"}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
            active
              ? "border-primary-500 bg-primary-500 text-white"
              : "border-hairline text-ink-soft hover:text-ink-strong",
          )}
        >
          {active ? <Pause size={11} /> : <Play size={11} fill="currentColor" />}
        </button>
        <div className="flex gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              className={cn(
                "rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors",
                speed === s
                  ? "bg-primary-500/10 text-primary-500"
                  : "text-ink-muted hover:text-ink-strong",
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-[10px] leading-snug text-ink-faint">
        Click anywhere to pause · Shift+↑ top · Shift+↓ end
      </p>
    </div>
  );
}
