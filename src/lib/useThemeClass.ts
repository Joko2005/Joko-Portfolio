"use client";

import { useSyncExternalStore } from "react";

// Tracks the theme class next-themes puts on <html>, so tokens are read after it changes.
function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

/** "light" | "dark" on the client, null during server render. */
export function useThemeClass() {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light"),
    () => null,
  );
}

/** Reads a CSS custom property from <html>. Client only. */
export function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
