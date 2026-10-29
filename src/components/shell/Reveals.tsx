"use client";

import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Section entrances: in every `.reveal` section, the heading rises first, then each
 * `[data-reveal]` part, 70ms apart, once, as the section enters. Content is only hidden
 * by the tween itself, so it stays visible if scripts fail. Reduced motion fades only.
 */
export function Reveals() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      for (const section of gsap.utils.toArray<HTMLElement>(".reveal")) {
        const parts = [section.querySelector("h2"), ...section.querySelectorAll("[data-reveal]")].filter(Boolean);
        gsap.from(parts, {
          opacity: 0,
          y: reduce ? 0 : 24,
          duration: reduce ? 0.4 : 0.8,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });
      }
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
