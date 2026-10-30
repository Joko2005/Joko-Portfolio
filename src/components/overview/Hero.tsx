"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { INTRO_DONE, introFinished } from "@/components/shell/Intro";
import { ResumeLink, SocialButtons } from "@/components/ui";
import { site } from "@/content/site";
import { cssVar, useThemeClass } from "@/lib/useThemeClass";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Drawn stand-in while three.js loads, and the whole mascot when WebGL is off: Folio as a blueprint. */
function FolioSketch() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <svg viewBox="-20 -10 240 300" className="h-[55%] text-ink" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M18 0 H120 L200 80 V232 Q200 250 182 250 H18 Q0 250 0 232 V18 Q0 0 18 0 Z" />
        <path d="M120 0 L160 0 L204 42 L200 80" />
        <path d="M0 150 Q-22 170 -14 200 M200 150 Q222 170 214 200 M58 250 V284 M142 250 V284" />
        <path d="M66 105 V125 M134 105 V125 M90 138 Q100 148 110 138" />
      </svg>
    </div>
  );
}

const HeroObject = dynamic(() => import("./HeroObject"), { ssr: false, loading: () => <FolioSketch /> });

const REDUCE = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

/**
 * True once the intro is over, the hero's letters have landed and the browser is idle. Starting WebGL
 * (context, shaders, lighting) is the heaviest thing on the page, so it never competes with an animation;
 * the sketch stands in until then.
 */
function useReadyFor3D() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer = 0;
    let idle = 0;
    const start = () => {
      timer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) idle = requestIdleCallback(() => setReady(true), { timeout: 800 });
        else setReady(true);
      }, 1100);
    };
    if (introFinished()) start();
    else window.addEventListener(INTRO_DONE, start, { once: true });
    return () => {
      window.removeEventListener(INTRO_DONE, start);
      clearTimeout(timer);
      if (idle) cancelIdleCallback(idle);
    };
  }, []);
  return ready;
}

const STATEMENTS = { design: "I design it.", build: "I build it." } as const;

/**
 * The Overview hero. The name is the monument; Folio, the 3D mascot, stands beside it.
 * Scrolling through the pinned hero (or the Design / Build switch) turns Folio
 * from a blueprint outline (the design) into a solid character (the build).
 */
export function Hero({ name, role, intro }: { name: string; role: string; intro: string }) {
  const root = useRef<HTMLElement>(null);
  const [built, setBuilt] = useState(false);
  const [started, setStarted] = useState(false);
  const ready3D = useReadyFor3D();
  const reducedMotion = useReducedMotion();
  const theme = useThemeClass();
  const ink = theme ? cssVar("--ink") : "#000";
  const letters = name.toUpperCase().split("");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia(REDUCE).matches;
      const tl = gsap.timeline({ paused: true });
      tl.set(q(".hero-char, .hero-fade"), { visibility: "visible" });
      if (reduce) {
        tl.from(q(".hero-char, .hero-fade"), { opacity: 0, duration: 0.4, ease: "power1.out" });
      } else {
        tl.from(q(".hero-char"), { yPercent: 105, duration: 0.9, ease: "expo.out", stagger: 0.06 })
          .from(q(".hero-fade"), { y: 24, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }, 0.2);
      }
      const play = () => {
        setStarted(true);
        tl.play();
      };
      if (introFinished()) play();
      else window.addEventListener(INTRO_DONE, play, { once: true });

      // Pinned story: the first half of the hold is the design, the second the build.
      let zone: boolean | null = null;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const next = self.progress > 0.5;
          if (next !== zone) {
            zone = next;
            setBuilt(next);
          }
        },
      });

      return () => window.removeEventListener(INTRO_DONE, play);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="hero relative -mx-5 -mt-10 h-[200svh] md:-mt-16 md:-ml-12 md:-mr-5 lg:-ml-16">
      <div className="@container sticky top-[var(--bar-h)] flex h-[calc(100svh-var(--bar-h))] flex-col md:top-0 md:h-svh justify-between overflow-hidden px-5 pb-4 pt-6 md:pl-12 md:pr-5 md:pt-10 lg:pl-16">
        {/* Top row: who this is, and the live switch. */}
        <div className="relative z-20 order-0 flex flex-wrap items-start justify-between gap-4">
          <div className="hero-fade flex items-center gap-4 md:gap-5">
            {/* A surface frame, so the dark studio backdrop doesn't dissolve into the dark page. */}
            {site.photo && (
              <span className="shrink-0 rounded-[1.25rem] bg-surface p-1 md:rounded-3xl">
                <Image
                  src={site.photo}
                  alt={`Portrait of ${site.brandName}`}
                  width={224}
                  height={224}
                  sizes="112px"
                  priority
                  className="size-20 rounded-2xl object-cover object-[50%_30%] md:size-28 md:rounded-[1.25rem]"
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
          <div role="group" aria-label="Show Folio as" className="hero-fade switch" data-built={built}>
            <button type="button" aria-pressed={!built} onClick={() => setBuilt(false)} data-magnetic>
              Design
            </button>
            <button type="button" aria-pressed={built} onClick={() => setBuilt(true)} data-magnetic>
              Build
            </button>
          </div>
        </div>

        {/* The monument. On a phone it sits right under the top row; from md it anchors the bottom. */}
        <h1 id="hero-title" className="hero-name relative z-20 order-1 mt-6 md:order-3 md:mt-0">
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

        {/* Folio, overlapping the name. */}
        <div className="pointer-events-auto absolute inset-x-0 top-[37%] z-0 mx-auto h-[38%] max-w-[44rem] md:left-auto md:right-0 md:top-[10%] md:mx-0 md:h-[62%] md:w-[52%] md:max-w-none">
          {ready3D ? (
            <HeroObject
              built={built}
              started={started}
              reducedMotion={reducedMotion}
              ink={ink}
            />
          ) : (
            <FolioSketch />
          )}
        </div>

        {/* The statement and the action, just above the name from md. The empty space around them lets clicks reach Folio. */}
        <div className="pointer-events-none relative order-2 mt-auto">
          <div className="relative z-20 mb-6 md:mb-8">
            <div className="hero-fade pointer-events-auto max-w-md">
              <p className="statement font-display text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl" data-built={built}>
                <span aria-hidden={built}>{STATEMENTS.design}</span>
                <span aria-hidden={!built}>{STATEMENTS.build}</span>
              </p>
              <p className="mt-3 hidden text-base leading-relaxed sm:block">{intro}</p>
            </div>
            {/* The first things a reviewer reaches for: the work, the résumé, and a way to get in touch. */}
            <div className="hero-fade hero-actions pointer-events-auto mt-5 flex w-fit max-w-full flex-wrap items-center gap-2">
              <a href="#work" className="btn btn-primary pressable">
                See the work
              </a>
              <ResumeLink className="btn pressable" />
              <SocialButtons className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
