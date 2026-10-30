"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { INTRO_DONE, introFinished } from "@/components/shell/Intro";
import { CvLink, SocialButtons } from "@/components/ui";
import { site } from "@/content/site";

gsap.registerPlugin(useGSAP);

// The results a reviewer looks for, from the CV. Each one opens the page that backs it up.
const proof = [
  { title: "5th of 106 schools", detail: "SIKAPtala 2026 national design competition" },
  { title: "Top 12 of 48+ universities", detail: "Batang Techno Hackathon, 2026" },
  { title: "Freelance since Sep 2026", detail: "CryoLipo, a client's Shopify storefront" },
  { title: "BS Computer Science", detail: "LSPU San Pablo City, expected 2027" },
];

/**
 * The Overview's first screen as a summary: who this is, what he does, how to reach him and what he has
 * to show for it, all in one view. The portrait sits beside the text, centred on it.
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
          .from(q(".hero-fade"), { y: 16, opacity: 0, duration: 0.6, ease: "expo.out", stagger: 0.06 }, 0.2);
      }
      const play = () => tl.play();
      if (introFinished()) play();
      else window.addEventListener(INTRO_DONE, play, { once: true });
      return () => window.removeEventListener(INTRO_DONE, play);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="-mt-10 flex flex-col gap-6 pt-2 md:-mt-16 md:min-h-svh md:gap-5 md:py-5">
      <div className="hero-grid md:flex-1">
        <h1 id="hero-title" className="hero-name">
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

        {/* A surface frame, so the dark studio backdrop doesn't dissolve into the dark page. */}
        {site.photo && (
          <div className="hero-photo hero-fade rounded-[1.75rem] bg-surface p-1">
            <Image
              src={site.photo}
              alt={`Portrait of ${site.brandName}`}
              width={1200}
              height={1600}
              sizes="(min-width: 48rem) 34rem, 7rem"
              priority
              className="size-full rounded-3xl object-cover"
            />
          </div>
        )}

        <div className="hero-role hero-fade">
          {/* The sidebar names him from md; the phone bar only has the mark. */}
          <p className="font-display text-lg font-semibold leading-tight tracking-[-0.02em] md:hidden">{site.brandName}</p>
          <p className="mt-0.5 text-base font-medium leading-snug md:mt-0 md:text-lg">{role}</p>
          <p className="text-base leading-snug text-muted md:text-lg">{site.location}</p>
        </div>

        <div className="hero-copy flex flex-col gap-5">
          <div className="hero-fade">
            <p className="font-display text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">I design it. I build it.</p>
            <p className="mt-2 max-w-[52ch] text-base leading-relaxed">{intro}</p>
            <p className="mt-2 text-base text-muted">Open to OJT placements and freelance projects.</p>
          </div>
          {/* The first things a reviewer reaches for: the work, the CV, and a way to get in touch. */}
          <div className="hero-fade hero-actions flex flex-wrap items-center gap-2">
            <a href="#work" className="btn btn-primary pressable">
              See the work
            </a>
            <CvLink className="btn pressable" />
            <SocialButtons className="ml-1" />
          </div>
        </div>
      </div>

      <ul className="hero-fade grid grid-cols-2 gap-2 lg:grid-cols-4">
        {proof.map((p) => (
          <li key={p.title}>
            <Link href="/experience" className="proof-tile">
              <span className="block font-display text-lg font-semibold leading-tight tracking-[-0.02em] md:text-xl">{p.title}</span>
              <span className="proof-detail mt-1 block text-sm leading-snug text-muted">{p.detail}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
