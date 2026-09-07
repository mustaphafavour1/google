"use client";

import { useSyncExternalStore } from "react";

export const AUTO_SCROLL_SPEEDS = [0.5, 1, 1.5, 2, 3] as const;
export type AutoScrollSpeed = (typeof AUTO_SCROLL_SPEEDS)[number];

type AutoScrollState = { active: boolean; speed: AutoScrollSpeed; popoverOpen: boolean };

/**
 * Session-only (not persisted) shared state for the global site-tour
 * auto-scroll, so more than one trigger — the floating utility bar's
 * popover and the hero's plain text link — can start/stop the same tour
 * instead of each keeping its own disconnected copy. `popoverOpen` is
 * included so a trigger outside the popover itself (the hero link) can
 * open it too — showing what auto-scroll does and how to cancel it right
 * as the tour starts, not just when someone happens to click the icon.
 */
let state: AutoScrollState = { active: false, speed: 1, popoverOpen: false };
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

export function setAutoScrollPopoverOpen(popoverOpen: boolean) {
  state = { ...state, popoverOpen };
  emit();
}

/**
 * Starts the tour and, on desktop, opens the explainer popover in one step
 * — the popover lives anchored to the top-right icon that only exists in
 * the `lg:` floating utility bar, so opening it below that breakpoint
 * would render with nothing sensible to anchor to.
 */
export function startAutoScrollWithExplainer() {
  const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
  state = { ...state, active: true, popoverOpen: isDesktop };
  emit();
}
