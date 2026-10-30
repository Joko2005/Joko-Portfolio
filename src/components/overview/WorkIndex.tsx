import Image from "next/image";
import Link from "next/link";
import { PiArrowUpRight } from "react-icons/pi";
import { highlightedProjects } from "@/content/projects";
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
export function WorkStill({ item, className = "", compact = false }: { item: WorkItem; className?: string; compact?: boolean }) {
  if (item.image) {
    const alt = `${item.title} screenshot`;
    const sizes = "(min-width: 1024px) 40vw, 100vw";
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

function Card({ item, large = false }: { item: WorkItem; large?: boolean }) {
  const inner = (
    <>
      <span className="work-card-still block">
        <span className="block">
          <WorkStill item={item} compact className="absolute inset-0" />
        </span>
      </span>
      <span className="mt-3 flex items-center gap-2">
        <span className={`font-display font-semibold tracking-[-0.03em] ${large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>{item.title}</span>
        <PiArrowUpRight aria-hidden className="work-card-arrow size-5 shrink-0" />
      </span>
      <span className="mt-0.5 block text-base text-muted">{item.kind}</span>
    </>
  );
  const props = { className: "work-card", "data-cursor": "View" };
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

/** The two highlights large, then everything else in a tighter grid, so a reviewer can scan it all at a glance. */
export function WorkIndex({ items }: { items: WorkItem[] }) {
  const isHighlight = (item: WorkItem) => highlightedProjects.some((p) => p.slug === item.id);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <ul className="grid gap-8 md:grid-cols-2 md:gap-5">
        {items.filter(isHighlight).map((item) => (
          <li key={item.id} data-reveal>
            <Card item={item} large />
          </li>
        ))}
      </ul>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-x-5 lg:grid-cols-3">
        {items
          .filter((item) => !isHighlight(item))
          .map((item) => (
            <li key={item.id} data-reveal>
              <Card item={item} />
            </li>
          ))}
      </ul>
    </div>
  );
}
