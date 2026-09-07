"use client";

import { useEffect, useRef } from "react";
import { readAloudPreference } from "@/lib/persistent-toggle";

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

// Undefined = not resolved yet (voice list may still be loading — retried
// on the next speak() call); null = resolved, no voice found to prefer.
let cachedVoice: SpeechSynthesisVoice | null | undefined;

// Common names for a browser/OS's female English voice, checked in order,
// so every utterance uses the same one voice instead of whatever the
// browser's own per-call default happens to resolve to.
const FEMALE_VOICE_NAMES = [
  "Samantha", // macOS / iOS Safari
  "Google US English", // Chrome — female by default
  "Google UK English Female",
  "Microsoft Zira", // Windows
  "Victoria",
  "Karen",
  "Moira",
];

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  for (const name of FEMALE_VOICE_NAMES) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return (cachedVoice = match);
  }
  const femaleNamed = voices.find((v) => /female/i.test(v.name));
  if (femaleNamed) return (cachedVoice = femaleNamed);

  const english = voices.find((v) => v.lang.startsWith("en"));
  return (cachedVoice = english ?? voices[0] ?? null);
}

function speak(text: string) {
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis is a non-essential enhancement — never block on it.
  }
}

/**
 * Headless, site-wide: reads hovered text (or an image's caption, via its
 * `alt`) aloud using the browser's own speech synthesis — no audio assets,
 * no external API. Mounted once in AppShell rather than inside
 * AccessibilityMenu, which renders twice (desktop + mobile headers).
 */
export function GlobalReadAloud() {
  const enabled = readAloudPreference.useValue();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

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
      window.speechSynthesis?.cancel();
    };
  }, [enabled]);

  return null;
}
