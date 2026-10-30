"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const STORAGE_KEY = "intro-seen";
/** Fired on window when the intro has left (or was never shown), so the hero can start. */
export const INTRO_DONE = "intro:done";

/** True once the intro has finished or will not play in this session. */
export function introFinished() {
  const root = document.documentElement;
  return root.classList.contains("intro-seen") || root.dataset.introDone === "true";
}

function finish() {
  document.documentElement.dataset.introDone = "true";
  document.documentElement.classList.remove("is-loading");
  window.dispatchEvent(new Event(INTRO_DONE));
}

/**
 * First-visit loader, about two seconds, once per session, skippable.
 * The name is drawn as an outline (designed), then filled solid (built) while a counter
 * runs to 100; the panel then lifts away to reveal the page.
 */
export function Intro({ name }: { name: string }) {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const letters = name.toUpperCase().split("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Already seen (or reduced motion): CSS hid it before paint.
    if (document.documentElement.classList.contains("intro-seen")) {
      finish();
      return;
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    document.documentElement.classList.add("is-loading");

    const counter = { v: 0 };
    const tl = gsap.timeline({ paused: true, onComplete: () => setGone(true) });
    const q = gsap.utils.selector(root);

    tl.from(q(".intro-char"), { yPercent: 110, duration: 0.6, ease: "expo.out", stagger: 0.06 })
      .to(
        counter,
        {
          v: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = Math.round(counter.v);
            if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
            if (fillRef.current) fillRef.current.style.clipPath = `inset(0 ${100 - counter.v}% 0 0)`;
            if (statusRef.current) statusRef.current.textContent = v < 50 ? "Designing" : "Building";
          },
        },
        0.4,
      )
      .addLabel("exit")
      .to(q(".intro-word"), { yPercent: -40, duration: 0.8, ease: "expo.inOut" }, "exit")
      .to(root, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "exit")
      // Let the hero start as the panel clears the top half of the screen.
      .add(finish, "exit+=0.45");

    const skip = () => {
      if (tl.currentLabel() === "exit" || tl.time() >= tl.labels.exit) return;
      tl.seek("exit");
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });

    // Start once the display face is in, so the outline never draws in a fallback font.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) tl.play();
    });

    return () => {
      cancelled = true;
      tl.kill();
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="intro fixed inset-0 z-50 flex flex-col justify-between bg-ink p-5 text-bg md:p-8">
      <div className="flex items-start justify-between text-sm">
        <span aria-hidden>{name}, portfolio</span>
        <button type="button" className="pressable rounded-full bg-bg/10 px-4 py-2 text-bg">
          Skip intro
        </button>
      </div>

      <div aria-hidden className="intro-word relative">
        {/* Outline: the design. */}
        <div className="intro-type intro-outline overflow-hidden">
          {letters.map((c, i) => (
            <span key={i} className="intro-char inline-block">
              {c}
            </span>
          ))}
        </div>
        {/* Fill, revealed left to right: the build. */}
        <div ref={fillRef} className="intro-type absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0 100% 0 0)" }}>
          {letters.map((c, i) => (
            <span key={i} className="intro-char inline-block">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div aria-hidden className="flex items-end justify-between text-sm">
        <span ref={statusRef}>Designing</span>
        <span ref={countRef} className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none tabular-nums">
          000
        </span>
      </div>
    </div>
  );
}
