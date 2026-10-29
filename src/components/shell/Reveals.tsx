"use client";

import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Scroll entrances, once per element:
 * - `.reveal` sections: the heading, then each `[data-reveal]` part, rise and fade 70ms apart.
 * - `[data-split="chars"]`: letters rise through their line, like the hero's JOKO.
 * - `[data-split="words"]`: words go from faint to full ink as the text scrolls through the view (reading pace).
 *   `[data-split-ignore]` children are left whole.
 * Content is only hidden by the tweens, so it stays readable if scripts fail. Reduced motion fades only.
 */
export function Reveals() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const splits: SplitText[] = [];

      for (const section of gsap.utils.toArray<HTMLElement>(".reveal")) {
        const heading = section.querySelector("h2:not([data-split])");
        const parts = [heading, ...section.querySelectorAll("[data-reveal]")].filter(Boolean);
        if (!parts.length) continue;
        gsap.from(parts, {
          opacity: 0,
          y: reduce ? 0 : 24,
          duration: reduce ? 0.4 : 0.8,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });
      }

      for (const el of gsap.utils.toArray<HTMLElement>('[data-split="chars"]')) {
        if (reduce) {
          gsap.from(el, { opacity: 0, duration: 0.4, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          continue;
        }
        let played = false;
        splits.push(
          SplitText.create(el, {
            type: "lines, chars",
            mask: "lines",
            autoSplit: true,
            // Re-split on resize and font load; once played, later splits just stay at rest.
            onSplit: (self) => {
              if (played) return;
              return gsap.from(self.chars, {
                yPercent: 110,
                duration: 0.9,
                ease: "expo.out",
                stagger: 0.022,
                scrollTrigger: { trigger: el, start: "top 85%", once: true, onEnter: () => (played = true) },
              });
            },
          }),
        );
      }

      for (const el of gsap.utils.toArray<HTMLElement>('[data-split="words"]')) {
        if (reduce) continue;
        splits.push(
          SplitText.create(el, {
            type: "words",
            ignore: "[data-split-ignore]",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.18 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.4 },
                },
              ),
          }),
        );
      }

      return () => splits.forEach((s) => s.revert());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
