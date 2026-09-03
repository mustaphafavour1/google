"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MonitorPlay, Pause, Play } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { primaryNav, isNavItemActive } from "./nav-config";
import { cn } from "@/lib/utils";

const SPEEDS = [0.5, 1, 1.5, 2, 3] as const;
const BASE_PX_PER_SECOND = 108;
// Gives PageTransition's slide + the new route's data fetch time to settle
// before resuming the scroll tick, so it doesn't measure a stale page height.
const SETTLE_MS = 650;

/**
 * A persistent, cross-page "site tour": scrolls the current page top to
 * bottom, then client-navigates to the next page in primaryNav order
 * (looping back to Home at the end) and resumes there. Lives in AppShell
 * so its state survives the route changes it triggers — a per-page
 * component would reset every time it navigates itself away.
 */
export function GlobalAutoScroll() {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const pathname = usePathname();
  const router = useRouter();
  const frameRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const settlingRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    settlingRef.current = true;
    window.scrollTo({ top: 0, behavior: "instant" });
    lastTsRef.current = null;
    const id = setTimeout(() => {
      settlingRef.current = false;
    }, SETTLE_MS);
    return () => clearTimeout(id);
  }, [pathname, active]);

  useEffect(() => {
    if (!active) return;

    function tick(ts: number) {
      if (settlingRef.current) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      window.scrollTo({ top: window.scrollY + BASE_PX_PER_SECOND * speed * dt, behavior: "instant" });

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const currentIndex = primaryNav.findIndex((item) => isNavItemActive(pathname, item.href));
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % primaryNav.length;
        settlingRef.current = true;
        router.push(primaryNav[nextIndex].href);
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active, speed, pathname, router]);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Auto-scroll the whole site"
          aria-pressed={active}
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-surface/95 shadow-[0_4px_16px_rgb(35_25_15_/_0.08)] backdrop-blur transition-colors",
            active
              ? "border-primary-500 text-primary-500"
              : "border-border text-ink-soft hover:bg-surface-muted hover:text-ink-strong",
          )}
        >
          <MonitorPlay size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent aria-label="Site tour auto-scroll">
        <p className="type-eyebrow mb-1">Site tour</p>
        <p className="mb-3 text-[11.5px] leading-snug text-ink-muted">
          Auto-scrolls this page, then moves on through the rest of the site, section by section.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            aria-pressed={active}
            aria-label={active ? "Pause site tour" : "Start site tour"}
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
                  speed === s ? "bg-primary-500/10 text-primary-500" : "text-ink-muted hover:text-ink-strong",
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2.5 text-[10px] leading-snug text-ink-faint">Press Esc to stop anytime</p>
      </PopoverContent>
    </Popover>
  );
}
