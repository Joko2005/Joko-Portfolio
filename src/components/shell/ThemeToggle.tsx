"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { PiMoon, PiSun } from "react-icons/pi";
import { switchTheme } from "@/lib/themeTransition";

const subscribe = () => () => {};

const OPTIONS = [
  { value: "light", label: "Light", Icon: PiSun },
  { value: "dark", label: "Dark", Icon: PiMoon },
] as const;

/** Light / Dark as two pressed-state buttons on a pill, the same control as the hero's Design / Build switch. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // false on the server and during hydration, true afterwards.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div role="group" aria-label="Theme" className="switch switch-compact w-full">
      {OPTIONS.map(({ value, label, Icon }) => {
        const pressed = mounted && resolvedTheme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={pressed}
            onClick={(e) => {
              if (pressed) return;
              const box = e.currentTarget.getBoundingClientRect();
              switchTheme(value, setTheme, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
            }}
            className="pressable"
          >
            <Icon aria-hidden className="size-4 shrink-0" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
