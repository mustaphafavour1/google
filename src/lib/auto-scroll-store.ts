"use client";

import { useSyncExternalStore } from "react";

export const AUTO_SCROLL_SPEEDS = [0.5, 1, 1.5, 2, 3] as const;
export type AutoScrollSpeed = (typeof AUTO_SCROLL_SPEEDS)[number];

type AutoScrollState = { active: boolean; speed: AutoScrollSpeed };

/**
 * Session-only (not persisted) shared state for the global site-tour
 * auto-scroll, so more than one trigger — the floating utility bar's
 * popover and the hero's plain text link — can start/stop the same tour
 * instead of each keeping its own disconnected copy.
 */
let state: AutoScrollState = { active: false, speed: 1 };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useAutoScrollState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function setAutoScrollActive(active: boolean) {
  state = { ...state, active };
  emit();
}

export function setAutoScrollSpeed(speed: AutoScrollSpeed) {
  state = { ...state, speed };
  emit();
}

export function toggleAutoScroll() {
  setAutoScrollActive(!state.active);
}
