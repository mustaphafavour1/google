"use client";

import { useSyncExternalStore } from "react";

/**
 * Small localStorage-backed boolean store. useSyncExternalStore (rather than
 * a mount effect + setState) avoids the cascading-render lint warning and
 * gives every subscriber a consistent SSR-safe snapshot.
 */
export function createPersistentToggle(key: string, defaultValue: boolean) {
  const listeners = new Set<() => void>();

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot() {
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : raw === "true";
  }

  function getServerSnapshot() {
    return defaultValue;
  }

  function set(next: boolean) {
    localStorage.setItem(key, String(next));
    listeners.forEach((listener) => listener());
  }

  function useValue() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }

  return { useValue, set };
}

export const soundPreference = createPersistentToggle("a11y-ui-sound-enabled", false);
export const captionsPreference = createPersistentToggle("a11y-video-captions-enabled", true);
export const privacyBannerDismissed = createPersistentToggle("privacy-banner-dismissed", false);
