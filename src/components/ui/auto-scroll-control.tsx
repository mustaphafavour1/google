"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const SPEEDS = [0.5, 1, 1.5, 2] as const;
const BASE_PX_PER_SECOND = 36;

export function AutoScrollControl() {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const frameRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    function tick(ts: number) {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      window.scrollBy(0, BASE_PX_PER_SECOND * speed * dt);

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

  return (
    <div>
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
    </div>
  );
}
