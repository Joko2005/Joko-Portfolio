"use client";

import { useRef } from "react";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(InertiaPlugin, ScrollTrigger, useGSAP);

// Past the section's edge a letter moves at a quarter of the pointer's pace, so the edge reads as soft.
const EDGE_RESISTANCE = 0.25;
const resist = (v: number, min: number, max: number) =>
  v < min ? min + (v - min) * EDGE_RESISTANCE : v > max ? max + (v - max) * EDGE_RESISTANCE : v;

// Each line takes a section hue when its letters are moved: colour is the reward for touching it.
const LINES = [
  { words: "I DESIGN", hue: "var(--c-overview)" },
  { words: "I CODE", hue: "var(--c-projects)" },
  { words: "I BUILD", hue: "var(--c-playground)" },
] as const;

/**
 * "I design. I code. I build." set as three display rows whose letters can be picked up and thrown
 * (mouse) or tapped to hop (touch). Scatter throws them all; Put back springs them home.
 */
export function PlayWords() {
  const root = useRef<HTMLElement>(null);
  const scatterRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const el = root.current!;
      const letters = gsap.utils.toArray<HTMLElement>(".play-letter", el);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let z = 1;

      const lift = (letter: HTMLElement) => {
        letter.style.zIndex = String(++z);
        letter.style.color = letter.dataset.hue!;
      };

      // Entrance: the letters rise into place. No mask: once thrown, a letter may go anywhere in the section.
      gsap.from(letters, {
        yPercent: reduce ? 0 : 60,
        opacity: 0,
        duration: reduce ? 0.4 : 0.9,
        ease: "expo.out",
        stagger: 0.03,
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });

      const ac = new AbortController();
      const { signal } = ac;

      if (fine) {
        // One delegated listener and nothing measured up front (Draggable measured all 19 letters on mount,
        // which stalled the page for seconds). Layout is read once, on press, for the letter in hand.
        el.addEventListener(
          "pointerdown",
          (e) => {
            const letter = (e.target as HTMLElement).closest<HTMLElement>(".play-letter");
            if (!letter || e.button !== 0) return;
            e.preventDefault();
            letter.setPointerCapture(e.pointerId);

            gsap.killTweensOf(letter, "x,y");
            const box = el.getBoundingClientRect();
            const r = letter.getBoundingClientRect();
            const x0 = Number(gsap.getProperty(letter, "x"));
            const y0 = Number(gsap.getProperty(letter, "y"));
            const x = { min: x0 + box.left - r.left, max: x0 + box.right - r.right };
            const y = { min: y0 + box.top - r.top, max: y0 + box.bottom - r.bottom };
            const sx = e.clientX;
            const sy = e.clientY;
            const setX = gsap.quickSetter(letter, "x", "px");
            const setY = gsap.quickSetter(letter, "y", "px");

            lift(letter);
            if (!reduce) {
              InertiaPlugin.track(letter, "x,y");
              gsap.to(letter, { scale: 1.08, rotation: gsap.utils.random(-10, 10), duration: 0.2, ease: "power3.out" });
            }

            const move = (ev: PointerEvent) => {
              setX(resist(x0 + ev.clientX - sx, x.min, x.max));
              setY(resist(y0 + ev.clientY - sy, y.min, y.max));
            };
            const up = () => {
              letter.removeEventListener("pointermove", move);
              letter.removeEventListener("pointerup", up);
              letter.removeEventListener("pointercancel", up);
              if (reduce) {
                gsap.set(letter, { x: gsap.utils.clamp(x.min, x.max, Number(gsap.getProperty(letter, "x"))), y: gsap.utils.clamp(y.min, y.max, Number(gsap.getProperty(letter, "y"))) });
                return;
              }
              // The throw carries the release velocity and settles inside the section.
              gsap.to(letter, {
                inertia: { x: { min: x.min, max: x.max }, y: { min: y.min, max: y.max } },
                scale: 1,
                onComplete: () => InertiaPlugin.untrack(letter),
              });
            };
            letter.addEventListener("pointermove", move, { signal });
            letter.addEventListener("pointerup", up, { signal });
            letter.addEventListener("pointercancel", up, { signal });
          },
          { signal },
        );
      } else {
        for (const letter of letters) {
          letter.addEventListener("click", () => {
            lift(letter);
            if (reduce) return;
            gsap
              .timeline()
              .to(letter, { y: "-=40", rotation: gsap.utils.random(-14, 14), duration: 0.22, ease: "power2.out" })
              .to(letter, { y: "+=40", duration: 0.7, ease: "bounce.out" });
          }, { signal });
        }
      }

      scatterRef.current = () => {
        // Read every position first, then write, so the page lays out once instead of once per letter.
        const box = el.getBoundingClientRect();
        const rects = letters.map((letter) => letter.getBoundingClientRect());
        letters.forEach((letter, i) => {
          const r = rects[i];
          lift(letter);
          const cur = { x: Number(gsap.getProperty(letter, "x")), y: Number(gsap.getProperty(letter, "y")) };
          // A random spot that keeps the letter inside the section.
          const x = cur.x + gsap.utils.random(box.left - r.left, box.right - r.right);
          const y = cur.y + gsap.utils.random(box.top - r.top, box.bottom - r.bottom);
          gsap.to(letter, {
            x,
            y,
            rotation: gsap.utils.random(-25, 25),
            duration: reduce ? 0 : gsap.utils.random(0.7, 1.1),
            ease: "expo.out",
          });
        });
      };

      resetRef.current = () => {
        gsap.to(letters, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: reduce ? 0 : 0.9,
          ease: "elastic.out(1, 0.6)",
          stagger: { each: 0.025, from: "random" },
          onComplete() {
            for (const letter of letters) letter.style.removeProperty("color");
          },
        });
      };

      return () => ac.abort();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="play-title" className="play-words relative pt-28 md:pt-48">
      <h2 id="play-title" className="@container">
        <span className="sr-only">I design. I code. I build.</span>
        {LINES.map((line) => (
          <span key={line.words} aria-hidden className="play-line">
            {line.words.split("").map((c, i) =>
              c === " " ? (
                <span key={i} className="play-space" />
              ) : (
                <span key={i} className="play-letter" data-hue={line.hue} data-grab>
                  {c}
                </span>
              ),
            )}
          </span>
        ))}
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-base text-muted">
          <span className="play-hint-fine">Grab a letter and throw it.</span>
          <span className="play-hint-touch">Tap a letter.</span>
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => scatterRef.current()} className="btn pressable">
            Scatter
          </button>
          <button type="button" onClick={() => resetRef.current()} className="btn btn-primary pressable">
            Put back
          </button>
        </div>
      </div>
    </section>
  );
}
