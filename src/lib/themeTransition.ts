"use client";

import { flushSync } from "react-dom";

type Theme = "light" | "dark";

// The site's cursor arrow (same outline as the hero's sketch), and a point well inside it.
const ARROW: readonly [number, number][] = [
  [0, 0],
  [0, 162],
  [40, 124],
  [66, 182],
  [92, 170],
  [66, 113],
  [118, 113],
];
const CENTER: [number, number] = [33, 88];
// Middle of the tail. The arrow is pinned here at first, so it launches whole from the toggle.
const TAIL: [number, number] = [79, 176];
// Roughly the largest circle that fits inside the arrow around CENTER, in arrow units.
const INNER_RADIUS = 30;

const START_SCALE = 0.16; // a cursor-sized arrow at the toggle, never from nothing
const START_TURN = -28; // degrees; it rights itself as it grows
const DURATION = 950;
const STEPS = 36;

// --ease-in-out from globals.css, sampled in JS so scale and turn can share it.
function easeInOut(t: number) {
  // cubic-bezier(0.77, 0, 0.175, 1), solved for x by bisection.
  const bez = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (bez(0.77, 0.175, mid) < t) lo = mid;
    else hi = mid;
  }
  return bez(0, 1, (lo + hi) / 2);
}

/** The arrow at (x, y), pinned by `anchor` (arrow units), scaled and turned. */
function arrowPolygon(x: number, y: number, anchor: [number, number], scale: number, turnDeg: number) {
  const r = (turnDeg * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  const pts = ARROW.map(([px, py]) => {
    const dx = (px - anchor[0]) * scale;
    const dy = (py - anchor[1]) * scale;
    return `${(x + dx * cos - dy * sin).toFixed(1)}px ${(y + dx * sin + dy * cos).toFixed(1)}px`;
  });
  return `polygon(${pts.join(", ")})`;
}

function applyClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

/**
 * Switches the theme with the site's signature move: the new theme arrives through the cursor arrow,
 * which grows out of the point the visitor pressed until it covers the page.
 * Reduced motion gets a plain crossfade; browsers without view transitions switch instantly.
 */
export function switchTheme(next: Theme, setTheme: (t: Theme) => void, origin?: { x: number; y: number }) {
  const update = () => {
    // Paint the new theme now so the snapshot catches it; next-themes then persists it.
    applyClass(next);
    flushSync(() => setTheme(next));
  };

  if (typeof document === "undefined" || !("startViewTransition" in document)) {
    setTheme(next);
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  if (reduce) {
    root.classList.add("theme-fade");
    const t = document.startViewTransition(update);
    t.finished.finally(() => root.classList.remove("theme-fade"));
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  // Far enough that the arrow's inner circle clears the farthest corner.
  const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const endScale = (reach / INNER_RADIUS) * 1.05;
  // Aim the tip at the middle of the page, so an arrow born at a corner flies into view instead of off it.
  const tipAngle = Math.atan2(-CENTER[1], -CENTER[0]);
  const aim = origin ? ((Math.atan2(window.innerHeight / 2 - y, window.innerWidth / 2 - x) - tipAngle) * 180) / Math.PI : 0;

  root.classList.add("theme-arrow");
  const transition = document.startViewTransition(update);
  transition.ready
    .then(() => {
      const frames: Keyframe[] = [];
      for (let i = 0; i <= STEPS; i++) {
        const p = easeInOut(i / STEPS);
        // Exponential growth reads as a steady push instead of a slow start and a sudden flood.
        const scale = START_SCALE * (endScale / START_SCALE) ** p;
        // The pin slides from tail to centre, so the arrow flies out first and floods the page last.
        const anchor: [number, number] = [TAIL[0] + (CENTER[0] - TAIL[0]) * p, TAIL[1] + (CENTER[1] - TAIL[1]) * p];
        frames.push({ clipPath: arrowPolygon(x, y, anchor, scale, aim + START_TURN * (1 - p)), offset: i / STEPS });
      }
      root.animate(frames, { duration: DURATION, easing: "linear", pseudoElement: "::view-transition-new(root)" });
    })
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("theme-arrow"));
}
