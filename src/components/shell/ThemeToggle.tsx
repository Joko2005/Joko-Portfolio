"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { PiCircleHalfFill } from "react-icons/pi";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // false on the server and during hydration, true afterwards.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = resolvedTheme === "dark";
  const label = mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Switch theme"}
      className="pressable inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-ink"
    >
      <PiCircleHalfFill aria-hidden className="size-4" />
      <span>{label}</span>
    </button>
  );
}
