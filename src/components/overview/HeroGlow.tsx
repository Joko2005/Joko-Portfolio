"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSpring } from "motion/react";

const SIZE = 420;
// Only on precise pointers, and never under reduced motion.
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * The shell's one signature detail: a soft blue/orange glow that follows the cursor
 * inside the hero only. Moved with transform (no repaint), springs for a slight trail.
 */
export function HeroGlow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
  const [visible, setVisible] = useState(false);

  const x = useSpring(0, { stiffness: 170, damping: 24, mass: 0.6 });
  const y = useSpring(0, { stiffness: 170, damping: 24, mass: 0.6 });

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const apply = () => {
      el.style.transform = `translate3d(${x.get() - SIZE / 2}px, ${y.get() - SIZE / 2}px, 0)`;
    };
    const offX = x.on("change", apply);
    const offY = y.on("change", apply);
    return () => {
      offX();
      offY();
    };
  }, [x, y, enabled]);

  function point(e: React.PointerEvent) {
    const rect = areaRef.current!.getBoundingClientRect();
    return { px: e.clientX - rect.left, py: e.clientY - rect.top };
  }

  return (
    <div
      ref={areaRef}
      className={`relative isolate overflow-hidden ${className}`}
      onPointerEnter={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const { px, py } = point(e);
        x.jump(px);
        y.jump(py);
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${px - SIZE / 2}px, ${py - SIZE / 2}px, 0)`;
        }
        setVisible(true);
      }}
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const { px, py } = point(e);
        x.set(px);
        y.set(py);
      }}
      onPointerLeave={() => setVisible(false)}
    >
      {enabled && (
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 -z-10 rounded-full transition-opacity duration-200 ease-out"
          style={{
            width: SIZE,
            height: SIZE,
            opacity: visible ? "var(--glow-opacity)" : 0,
            background:
              "radial-gradient(closest-side at 62% 62%, var(--c-projects), transparent), radial-gradient(closest-side, var(--c-overview), transparent)",
          }}
        />
      )}
      {children}
    </div>
  );
}
