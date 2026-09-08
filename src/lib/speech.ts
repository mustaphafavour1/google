"use client";

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

function buildUtterance(text: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  return utterance;
}

/** Fire-and-forget: cancels whatever's currently speaking and starts this. */
export function speak(text: string) {
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(buildUtterance(text));
  } catch {
    // Speech synthesis is a non-essential enhancement — never block on it.
  }
}

const MAX_UTTERANCE_MS = 15000;

/**
 * Speaks text and resolves once the utterance finishes — via `onend`,
 * `onerror` (e.g. a `cancelSpeech()` call interrupting it), or a safety
 * timeout, since some browsers can fail to ever fire `onend`. Unlike
 * `speak()`, does not cancel any in-flight utterance first — callers that
 * need one utterance at a time (the narrated tour) already await each call
 * before starting the next.
 */
export function speakAsync(text: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const utterance = buildUtterance(text);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
      setTimeout(finish, MAX_UTTERANCE_MS);
    } catch {
      resolve();
    }
  });
}

export function cancelSpeech() {
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
