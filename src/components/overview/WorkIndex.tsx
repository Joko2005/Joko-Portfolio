"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { WorkItem, WorkTone } from "@/content/work";

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
 * `compact` drops the title for layouts where the name is set right under the still.
 */
function WorkStill({ item, className = "", compact = false }: { item: WorkItem; className?: string; compact?: boolean }) {
  if (item.image) {
    return (
      <Image src={item.image} alt={`${item.title} screenshot`} fill sizes="(min-width: 1024px) 26vw, 100vw" className={`object-cover ${className}`} />
    );
  }
  return (
    <div role="img" aria-label={`${item.title} title card`} className={`flex flex-col justify-end p-6 ${FIELD[item.tone]} ${className}`}>
      <span>
        {!compact && (
          <span className="mb-3 block font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
            {item.title}
          </span>
        )}
        <span className="block max-w-[24ch] text-base leading-snug">{item.summary}</span>
      </span>
    </div>
  );
}

function Row({ item, active, onActivate }: { item: WorkItem; active: boolean; onActivate: () => void }) {
  const inner = (
    <>
      <span className={`work-name ${active ? "text-ink" : "text-muted"}`}>{item.title}</span>
      <span className="text-base text-muted">{item.kind}</span>
    </>
  );
  const props = {
    className: "work-row group flex flex-col gap-1 pb-6 pt-1",
    "data-cursor": "View",
    onPointerEnter: onActivate,
    onFocus: onActivate,
  };
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" {...props}>
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={item.href} {...props}>
      {inner}
    </Link>
  );
}

/** Big names as the index; a sticky frame beside them shows the one under the cursor or focus. */
export function WorkIndex({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:gap-8">
      {/* Desktop: names on the left, one sticky still on the right. */}
      <ul className="hidden lg:col-span-7 lg:block">
        {items.map((item) => (
          <li key={item.id} data-reveal>
            <Row item={item} active={item.id === active} onActivate={() => setActive(item.id)} />
          </li>
        ))}
      </ul>
      <div className="hidden lg:col-span-5 lg:block" data-reveal>
        <div className="sticky top-[15vh] aspect-4/5 overflow-hidden rounded-3xl">
          {items.map((item) => (
            <div
              key={item.id}
              aria-hidden={item.id !== active}
              className={`work-still absolute inset-0 ${item.id === active ? "is-active" : ""}`}
            >
              <WorkStill item={item} className="absolute inset-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Phone and tablet: each name follows its own still. */}
      <ul className="flex flex-col gap-10 lg:hidden">
        {items.map((item) => (
          <li key={item.id} data-reveal>
            <div className="relative aspect-16/10 overflow-hidden rounded-3xl">
              <WorkStill item={item} compact className="absolute inset-0" />
            </div>
            <Row item={item} active onActivate={() => {}} />
          </li>
        ))}
      </ul>
    </div>
  );
}
