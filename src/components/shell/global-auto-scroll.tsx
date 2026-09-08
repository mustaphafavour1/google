"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MonitorPlay, Pause, Play } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AUTO_SCROLL_SPEEDS,
  setAutoScrollActive,
  setAutoScrollPopoverOpen,
  setAutoScrollSpeed,
  useAutoScrollState,
} from "@/lib/auto-scroll-store";
import { readAloudPreference } from "@/lib/persistent-toggle";
import { collectNarratedItems } from "@/lib/narrated-tour";
import { speakAsync, cancelSpeech } from "@/lib/speech";
import { primaryNav, isNavItemActive } from "./nav-config";
import { cn } from "@/lib/utils";

const BASE_PX_PER_SECOND = 108;
// Gives PageTransition's slide + the new route's data fetch time to settle
// before resuming the scroll tick, so it doesn't measure a stale page height.
const SETTLE_MS = 650;
const BASE_ITEM_PAUSE_MS = 350;
// Most speech engines stay reasonably intelligible up to about 2.5x — past
// that it starts turning into noise, so the fastest tour speeds (3x, 5x)
// cap out here instead of climbing with them.
const MAX_SPEECH_RATE = 2.5;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A persistent, cross-page "site tour": scrolls the current page top to
 * bottom, then client-navigates to the next page in primaryNav order
 * (looping back to Home at the end) and resumes there. Lives in AppShell
 * so its state survives the route changes it triggers — a per-page
 * component would reset every time it navigates itself away.
 *
 * With read-aloud also on, this becomes a narrated tour: instead of a
 * smooth continuous scroll, it walks the page's headings/paragraphs/images
 * one at a time — scrolling each into view and speaking it (an image or
 * video is announced as "Showing image/video of <caption>") — before
 * moving to the next, so the visuals and narration play back in sync
 * instead of racing each other.
 */
export function GlobalAutoScroll() {
  const { active, speed, popoverOpen } = useAutoScrollState();
  const readAloudOn = readAloudPreference.useValue();
  const narrated = active && readAloudOn;
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

  // Plain continuous scroll — only while read-aloud is off. With it on, the
  // narrated walk below takes over so scrolling stays paced to speech.
  useEffect(() => {
    if (!active || narrated) return;

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
  }, [active, narrated, speed, pathname, router]);

  // Narrated walk — speaks through the page's content, item by item,
  // scrolling each into view as it's announced, then moves to the next
  // page exactly like the plain scroll does once it runs out.
  useEffect(() => {
    if (!narrated) return;
    let cancelled = false;
    const pauseMs = Math.max(120, BASE_ITEM_PAUSE_MS / speed);
    // Reading speed tracks the tour's own scroll speed so narration never
    // becomes the thing holding a fast tour back — at 1x it's the normal
    // rate, faster tours speak proportionally faster (capped for clarity).
    const speechRate = Math.min(MAX_SPEECH_RATE, speed);

    async function run() {
      await delay(SETTLE_MS);
      if (cancelled) return;

      const main = document.querySelector("main");
      if (!main) return;
      const items = collectNarratedItems(main);

      for (const item of items) {
        if (cancelled) return;
        item.el.scrollIntoView({ behavior: "smooth", block: "center" });
        await speakAsync(item.text, speechRate);
        if (cancelled) return;
        await delay(pauseMs);
      }
      if (cancelled) return;

      const currentIndex = primaryNav.findIndex((navItem) => isNavItemActive(pathname, navItem.href));
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % primaryNav.length;
      settlingRef.current = true;
      router.push(primaryNav[nextIndex].href);
    }

    run();
    return () => {
      cancelled = true;
      cancelSpeech();
    };
  }, [narrated, pathname, speed, router]);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAutoScrollActive(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Mobile has no Esc key — a double-tap anywhere is the equivalent panic
  // button while the tour is actually running.
  useEffect(() => {
    if (!active) return;
    let lastTap = 0;
    function onTouchEnd() {
      const now = Date.now();
      if (now - lastTap < 350) setAutoScrollActive(false);
      lastTap = now;
    }
    window.addEventListener("touchend", onTouchEnd);
    return () => window.removeEventListener("touchend", onTouchEnd);
  }, [active]);

  return (
    <Popover open={popoverOpen} onOpenChange={setAutoScrollPopoverOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>Site tour</TooltipContent>
      </Tooltip>
      <PopoverContent aria-label="Site tour auto-scroll">
        <p className="type-eyebrow mb-1">Site tour</p>
        <p className="mb-3 text-[11.5px] leading-snug text-ink-muted">
          Auto-scrolls this page, then moves on through the rest of the site, section by section.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoScrollActive(!active)}
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
            {AUTO_SCROLL_SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAutoScrollSpeed(s)}
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
        <p className="mt-2.5 text-[10px] leading-snug text-ink-faint">
          Turn on auto-scroll and read aloud together to watch through the entire portfolio like a movie.
        </p>
        <p className="mt-1 text-[10px] leading-snug text-ink-faint">Press Esc to stop anytime</p>
      </PopoverContent>
    </Popover>
  );
}
