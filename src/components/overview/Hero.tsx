"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { INTRO_DONE, introFinished } from "@/components/shell/Intro";
import { cssVar, useThemeClass } from "@/lib/useThemeClass";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Drawn stand-in while three.js loads, and the whole object when WebGL is off. */
function ArrowSketch() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <svg viewBox="-10 -10 140 200" className="h-1/2 -rotate-12 text-ink" aria-hidden>
        <path
          d="M0 0 L0 162 L40 124 L66 182 L92 170 L66 113 L118 113 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const HeroObject = dynamic(() => import("./HeroObject"), { ssr: false, loading: () => <ArrowSketch /> });

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
 * True once the browser is idle after the page mounts. Starting WebGL (context, shaders, lighting) is the
 * heaviest thing on the page, so it waits until the navigation has painted; the sketch stands in until then.
 */
function useIdle() {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const done = () => setIdle(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(done, { timeout: 800 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(done, 200);
    return () => clearTimeout(id);
  }, []);
  return idle;
}

const STATEMENTS = { design: "I design it.", build: "I build it." } as const;

/**
 * The Overview hero. The name is the monument; a 3D cursor arrow sits on its letters.
 * Scrolling through the pinned hero (or the Design / Build switch) turns the arrow
 * from its outline (the design) into a solid object (the build).
 */
export function Hero({ name, role, intro }: { name: string; role: string; intro: string }) {
  const root = useRef<HTMLElement>(null);
  const [built, setBuilt] = useState(false);
  const [started, setStarted] = useState(false);
  const idle = useIdle();
  const reducedMotion = useReducedMotion();
  const theme = useThemeClass();
  const ink = theme ? cssVar("--ink") : "#000";
  const accent = theme ? cssVar("--c-overview") : "#1d4ed8";
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
        {/* Top row: what this is, and the live switch. */}
        <div className="relative z-20 order-0 flex flex-wrap items-start justify-between gap-4">
          <p className="hero-fade max-w-[26ch] text-base font-medium leading-snug md:text-lg">{role}</p>
          <div role="group" aria-label="Show the arrow as" className="hero-fade switch" data-built={built}>
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

        {/* The object, overlapping the name. */}
        <div className="pointer-events-auto absolute inset-x-0 top-[31%] z-0 mx-auto h-[44%] max-w-[44rem] md:left-auto md:right-0 md:top-[10%] md:mx-0 md:h-[62%] md:w-[52%] md:max-w-none">
          {idle ? (
            <HeroObject
              built={built}
              started={started}
              reducedMotion={reducedMotion}
              ink={ink}
              accent={accent}
              onSpin={() => setBuilt((b) => !b)}
            />
          ) : (
            <ArrowSketch />
          )}
        </div>

        {/* The statement and the action, just above the name from md. */}
        <div className="relative order-2 mt-auto">
          <div className="relative z-20 mb-2">
            <div className="hero-fade max-w-md">
              <p className="statement font-display text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl" data-built={built}>
                <span aria-hidden={built}>{STATEMENTS.design}</span>
                <span aria-hidden={!built}>{STATEMENTS.build}</span>
              </p>
              <p className="mt-3 hidden text-base leading-relaxed sm:block">{intro}</p>
            </div>
            <a href="#work" className="hero-fade btn btn-primary pressable mt-5">
              See the work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
