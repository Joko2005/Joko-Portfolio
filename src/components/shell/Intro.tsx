"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_MS = 650;
const FADE_MS = 200;
const STORAGE_KEY = "intro-seen";

/** First-visit intro: under 1s, skippable, once per browser session. */
export function Intro({ name }: { name: string }) {
  const [phase, setPhase] = useState<"show" | "leaving" | "gone">("show");
  const timers = useRef<number[]>([]);

  const dismiss = useCallback(() => {
    setPhase((p) => (p === "show" ? "leaving" : p));
    timers.current.push(window.setTimeout(() => setPhase("gone"), FADE_MS));
  }, []);

  useEffect(() => {
    // Already seen (or reduced motion): CSS hides it before paint.
    if (document.documentElement.classList.contains("intro-seen")) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    const pending = timers.current;
    pending.push(window.setTimeout(dismiss, HOLD_MS));
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    return () => {
      pending.forEach(clearTimeout);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [dismiss]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      data-leaving={phase === "leaving"}
      className="intro fixed inset-0 z-50 flex items-center justify-center bg-bg transition-opacity duration-200 ease-out data-[leaving=true]:opacity-0"
    >
      <span className="font-display text-[clamp(4rem,14vw,9rem)] font-semibold leading-none tracking-[-0.03em]">{name}</span>
    </div>
  );
}
