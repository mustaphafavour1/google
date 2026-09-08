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

let voicesReadyPromise: Promise<void> | null = null;

/**
 * Chrome (and others) load the voice list asynchronously — right after
 * page load, getVoices() often returns an empty array, and only populates
 * once the browser fires `voiceschanged`. Speaking before then leaves
 * `utterance.voice` unset, so the very first utterance plays in whatever
 * generic system default the browser falls back to (frequently a male
 * voice) before every later call correctly finds the female one — sounding
 * like the voice "switches" mid-tour. Waiting for this once, up front,
 * means even the first utterance already has the right voice picked.
 */
function waitForVoices(): Promise<void> {
  if (voicesReadyPromise) return voicesReadyPromise;
  voicesReadyPromise = new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve();
      return;
    }
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      window.speechSynthesis.removeEventListener("voiceschanged", finish);
      resolve();
    }
    window.speechSynthesis.addEventListener("voiceschanged", finish);
    // Some browsers never fire voiceschanged (or genuinely have no voices)
    // — don't block speech forever waiting for one that isn't coming.
    setTimeout(finish, 1000);
  });
  return voicesReadyPromise;
}

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

async function buildUtterance(text: string, rate: number): Promise<SpeechSynthesisUtterance> {
  await waitForVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  return utterance;
}

/** Fire-and-forget: cancels whatever's currently speaking and starts this. */
export async function speak(text: string, rate = 1) {
  try {
    const utterance = await buildUtterance(text, rate);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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
 *
 * `rate` lets a caller speed speech up alongside a faster pace elsewhere
 * (the narrated tour ties it to the site-tour's own scroll speed, so
 * reading never lags behind a fast tour) — 1 is the browser's normal rate.
 */
export async function speakAsync(text: string, rate = 1): Promise<void> {
  try {
    const utterance = await buildUtterance(text, rate);
    return await new Promise((resolve) => {
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
    });
  } catch {
    return;
  }
}

export function cancelSpeech() {
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
