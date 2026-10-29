"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger, useGSAP);

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

      if (fine) {
        Draggable.create(letters, {
          type: "x,y",
          bounds: el,
          inertia: !reduce,
          edgeResistance: 0.75,
          zIndexBoost: false,
          onPress() {
            lift(this.target);
            if (!reduce) gsap.to(this.target, { scale: 1.08, rotation: gsap.utils.random(-10, 10), duration: 0.2, ease: "power3.out" });
          },
          onRelease() {
            if (!reduce) gsap.to(this.target, { scale: 1, duration: 0.3, ease: "power3.out" });
          },
        });
      } else {
        for (const letter of letters) {
          letter.addEventListener("click", () => {
            lift(letter);
            if (reduce) return;
            gsap
              .timeline()
              .to(letter, { y: "-=40", rotation: gsap.utils.random(-14, 14), duration: 0.22, ease: "power2.out" })
              .to(letter, { y: "+=40", duration: 0.7, ease: "bounce.out" });
          });
        }
      }

      scatterRef.current = () => {
        const box = el.getBoundingClientRect();
        for (const letter of letters) {
          lift(letter);
          const r = letter.getBoundingClientRect();
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
        }
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
