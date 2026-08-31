"use client";

type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };

function getAudioContext(): AudioContext | null {
  const Ctx = window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;
  return Ctx ? new Ctx() : null;
}

/** A short, synthesized UI tone — no audio asset needed. Silently no-ops if Web Audio is unavailable. */
export function playTone({
  frequency,
  toFrequency,
  duration = 0.18,
  gain = 0.06,
  type = "sine",
}: {
  frequency: number;
  toFrequency?: number;
  duration?: number;
  gain?: number;
  type?: OscillatorType;
}) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (toFrequency) {
      osc.frequency.exponentialRampToValueAtTime(toFrequency, ctx.currentTime + duration * 0.6);
    }
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close();
  } catch {
    // Sound is a non-essential enhancement — never block on it.
  }
}
