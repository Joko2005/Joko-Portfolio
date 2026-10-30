"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { INTRO_DONE, introFinished } from "@/components/shell/Intro";
import { ResumeLink, SocialButtons } from "@/components/ui";
import { site } from "@/content/site";

gsap.registerPlugin(useGSAP);

/**
 * The Overview's first screen, in reading order: who this is, what he does and how to reach him,
 * then the name as the one big thing. Everything a reviewer needs, nothing competing with it.
 */
export function Hero({ name, role, intro }: { name: string; role: string; intro: string }) {
  const root = useRef<HTMLElement>(null);
  const letters = name.toUpperCase().split("");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ paused: true });
      tl.set(q(".hero-char, .hero-fade"), { visibility: "visible" });
      if (reduce) {
        tl.from(q(".hero-char, .hero-fade"), { opacity: 0, duration: 0.4, ease: "power1.out" });
      } else {
        tl.from(q(".hero-char"), { yPercent: 105, duration: 0.9, ease: "expo.out", stagger: 0.06 })
          .from(q(".hero-fade"), { y: 24, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }, 0.2);
      }
      const play = () => tl.play();
      if (introFinished()) play();
      else window.addEventListener(INTRO_DONE, play, { once: true });
      return () => window.removeEventListener(INTRO_DONE, play);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="hero @container -mx-5 -mt-10 flex flex-col gap-8 overflow-hidden px-5 pb-4 pt-6 md:-ml-12 md:-mr-5 md:-mt-16 md:min-h-svh md:justify-between md:gap-10 md:pl-12 md:pr-5 md:pt-10 lg:-ml-16 lg:pl-16"
    >
      <div className="hero-fade flex items-center gap-4 md:gap-5">
        {/* A surface frame, so the dark studio backdrop doesn't dissolve into the dark page. */}
        {site.photo && (
          <span className="shrink-0 rounded-[1.25rem] bg-surface p-1">
            <Image
              src={site.photo}
              alt={`Portrait of ${site.brandName}`}
              width={176}
              height={176}
              sizes="88px"
              priority
              className="size-20 rounded-2xl object-cover object-[50%_30%] md:size-[5.5rem]"
            />
          </span>
        )}
        <div>
          {/* The sidebar names him from md; the phone bar only has the mark. */}
          <p className="font-display text-lg font-semibold leading-tight tracking-[-0.02em] md:hidden">{site.brandName}</p>
          <p className="mt-0.5 text-base font-medium leading-snug md:mt-0 md:text-lg">{role}</p>
          <p className="text-base leading-snug text-muted">{site.location}</p>
        </div>
      </div>

      <div className="order-2 flex flex-col gap-6 md:order-none md:mt-auto md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="hero-fade max-w-xl">
          <p className="font-display text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">I design it. I build it.</p>
          <p className="mt-3 max-w-md text-base leading-relaxed">{intro}</p>
        </div>
        {/* The first things a reviewer reaches for: the work, the résumé, and a way to get in touch. */}
        <div className="hero-fade hero-actions flex shrink-0 flex-wrap items-center gap-2">
          <a href="#work" className="btn btn-primary pressable">
            See the work
          </a>
          <ResumeLink className="btn pressable" />
          <SocialButtons className="ml-1" />
        </div>
      </div>

      {/* The monument. On a phone it follows the portrait; from md it closes the screen. */}
      <h1 id="hero-title" className="hero-name order-1 md:order-none">
        {/* Body size, so this hidden line doesn't stretch the heading's text box to the monument's width. */}
        <span className="sr-only text-base">
          {name}, {role}
        </span>
        <span aria-hidden className="block overflow-hidden">
          {letters.map((c, i) => (
            <span key={i} className="hero-char inline-block">
              {c}
            </span>
          ))}
        </span>
      </h1>
    </section>
  );
}
