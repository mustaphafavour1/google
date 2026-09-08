"use client";

import { useEffect, useRef } from "react";
import { readAloudPreference } from "@/lib/persistent-toggle";
import { useAutoScrollState } from "@/lib/auto-scroll-store";
import { speak, cancelSpeech } from "@/lib/speech";

const HOVER_DELAY_MS = 350;
const MAX_CHARS = 300;

/**
 * Reads only the exact hovered element's own (full-descendant) text — never
 * an ancestor's — so resting the pointer over a section's padding, where
 * the deepest element under it is a large wrapping container, stays silent
 * instead of reading that whole container's concatenated text. A long
 * "own text" match (clearly a container, not a focused leaf) is likewise
 * skipped rather than read as a truncated, mid-sentence fragment.
 */
function resolveSpeakableText(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  if (target.closest('[aria-hidden="true"]')) return null;

  const img = target.closest("img");
  if (img instanceof HTMLImageElement) return img.alt.trim() || null;

  const ownText = (target instanceof HTMLElement ? target.innerText : target.textContent)?.trim();
  if (ownText) return ownText.length <= MAX_CHARS ? ownText : null;

  let el: Element | null = target.parentElement;
  for (let hops = 0; el && hops < 3; hops++, el = el.parentElement) {
    if (el.getAttribute("aria-hidden") === "true") return null;
    const label = el.getAttribute("aria-label") ?? el.getAttribute("title");
    if (label?.trim()) return label.trim();
  }
  return null;
}

/**
 * Headless, site-wide: reads hovered text (or an image's caption, via its
 * `alt`) aloud using the browser's own speech synthesis — no audio assets,
 * no external API. Mounted once in AppShell rather than inside
 * AccessibilityMenu, which renders twice (desktop + mobile headers).
 *
 * Sits out entirely while the narrated site tour owns speech (auto-scroll
 * + read-aloud both on — see GlobalAutoScroll) so the two never talk over
 * each other: a stray mouseover mid-tour would otherwise cancel whatever
 * the tour was in the middle of saying.
 */
export function GlobalReadAloud() {
  const enabled = readAloudPreference.useValue();
  const { active: autoScrollActive } = useAutoScrollState();
  const hoverModeEnabled = enabled && !autoScrollActive;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hoverModeEnabled) return;

    function stop() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    function onOver(e: MouseEvent) {
      const target = e.target;
      stop();
      timerRef.current = setTimeout(() => {
        const text = resolveSpeakableText(target);
        if (!text || text === lastSpokenRef.current) return;
        lastSpokenRef.current = text;
        speak(text);
      }, HOVER_DELAY_MS);
    }

    function onFocus(e: FocusEvent) {
      stop();
      const text = resolveSpeakableText(e.target);
      if (!text || text === lastSpokenRef.current) return;
      lastSpokenRef.current = text;
      speak(text);
    }

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", stop);
    document.addEventListener("focusin", onFocus);
    return () => {
      stop();
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", stop);
      document.removeEventListener("focusin", onFocus);
      cancelSpeech();
    };
  }, [hoverModeEnabled]);

  return null;
}
