"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { WorkItem, WorkTone } from "@/content/work";

gsap.registerPlugin(useGSAP);

// Field and text colour for each drawn preview. Hue fields take the page ground as text,
// which reads on the saturated light-theme hues and on the pale dark-theme ones.
const FIELD: Record<WorkTone, string> = {
  ink: "bg-ink text-bg",
  overview: "bg-[var(--c-overview)] text-bg",
  projects: "bg-[var(--c-projects)] text-bg",
  graphics: "bg-[var(--c-graphics)] text-bg",
  playground: "bg-[var(--c-playground)] text-bg",
  surface: "bg-surface text-ink",
};

/**
 * A still for the work: its screenshot when one exists, otherwise its title card drawn in its colour.
 * `compact` drops the card's words, for thumbnails too small to hold them.
 */
export function WorkStill({ item, className = "", compact = false }: { item: WorkItem; className?: string; compact?: boolean }) {
  if (item.image) {
    const alt = `${item.title} screenshot`;
    const sizes = compact ? "6rem" : "(min-width: 1024px) 40vw, 100vw";
    if (item.imageDark) {
      return (
        <>
          <Image src={item.image} alt={alt} fill sizes={sizes} className={`object-cover dark:hidden ${className}`} />
          <Image src={item.imageDark} alt={alt} fill sizes={sizes} className={`hidden object-cover dark:block ${className}`} />
        </>
      );
    }
    return <Image src={item.image} alt={alt} fill sizes={sizes} className={`object-cover ${className}`} />;
  }
  return (
    <div role="img" aria-label={`${item.title} title card`} className={`flex flex-col justify-end p-6 ${FIELD[item.tone]} ${className}`}>
      {!compact && (
        <span>
          <span className="mb-3 block font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
            {item.title}
          </span>
          <span className="block max-w-[24ch] text-base leading-snug">{item.summary}</span>
        </span>
      )}
    </div>
  );
}

/**
 * Big names as the index, in about one screen. From lg one still sits beside them: it travels to the row
 * under the pointer or focus and wipes to that project, in the direction the pointer moved.
 * Phones have no hover, so each row carries its own thumbnail instead.
 */
export function WorkIndex({ items }: { items: WorkItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(items[0]?.id);
  const activeIndex = useRef(0);
  const topLayer = useRef(1);
  const travel = useRef<((y: number) => void) | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scrollTrigger = { trigger: root.current, start: "top 80%", once: true };
      if (reduce) {
        gsap.from(q(".work-line, .work-frame"), { opacity: 0, duration: 0.4, scrollTrigger });
        return;
      }
      travel.current = gsap.quickTo(q(".work-frame")[0], "y", { duration: 0.7, ease: "expo.out" });
      gsap.from(q(".work-line-inner"), { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.05, scrollTrigger });
      gsap.from(q(".work-line-meta"), { opacity: 0, duration: 0.6, delay: 0.3, stagger: 0.05, scrollTrigger });
      gsap.fromTo(
        q(".work-frame"),
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.out", clearProps: "clipPath", scrollTrigger },
      );
    },
    { scope: root },
  );

  const activate = (item: WorkItem, index: number, row: HTMLElement) => {
    if (item.id === active) return;
    setActive(item.id);
    const from = index > activeIndex.current ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
    activeIndex.current = index;

    const still = root.current?.querySelector<HTMLElement>(`[data-still="${item.id}"]`);
    if (!still) return;
    still.style.zIndex = String(++topLayer.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(still, { opacity: 0 }, { opacity: 1, duration: 0.2, overwrite: true });
      return;
    }
    gsap.fromTo(still, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.out", overwrite: true });
    gsap.fromTo(still.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 0.9, ease: "expo.out", overwrite: true });

    // Centre the still on the row, kept within the list's height.
    const list = root.current!.querySelector("ul")!.getBoundingClientRect();
    const frame = root.current!.querySelector(".work-frame")!.getBoundingClientRect();
    const box = row.getBoundingClientRect();
    travel.current?.(gsap.utils.clamp(0, list.height - frame.height, box.top - list.top + box.height / 2 - frame.height / 2));
  };

  return (
    <div ref={root} className="grid gap-8 lg:grid-cols-12 lg:gap-8">
      <ul className="flex flex-col gap-4 lg:col-span-6 lg:gap-0 xl:col-span-7">
        {items.map((item, i) => {
          const inner = (
            <>
              <span className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl lg:hidden">
                <WorkStill item={item} compact className="absolute inset-0" />
              </span>
              <span className="min-w-0 flex-1 xl:flex xl:items-baseline xl:gap-5">
                <span className="work-line-mask block overflow-hidden pb-[0.12em] pr-[0.08em] xl:shrink-0">
                  <span className="work-line-name work-line-inner block">{item.title}</span>
                </span>
                <span className="work-line-meta block text-base text-muted">{item.kind}</span>
              </span>
            </>
          );
          const props = {
            className: `work-line ${item.id === active ? "is-active" : ""}`,
            "data-cursor": "View",
            onPointerEnter: (e: React.PointerEvent<HTMLElement>) => activate(item, i, e.currentTarget),
            onFocus: (e: React.FocusEvent<HTMLElement>) => activate(item, i, e.currentTarget),
          };
          return (
            <li key={item.id}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" {...props}>
                  {inner}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link href={item.href} {...props}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div aria-hidden className="relative hidden lg:col-span-6 lg:block xl:col-span-5">
        <div className="work-frame absolute inset-x-0 top-0 aspect-video overflow-hidden rounded-3xl bg-surface">
          {items.map((item, i) => (
            <div key={item.id} data-still={item.id} className="absolute inset-0 overflow-hidden" style={{ zIndex: i === 0 ? 1 : 0 }}>
              <div className="absolute inset-0">
                <WorkStill item={item} className="absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
