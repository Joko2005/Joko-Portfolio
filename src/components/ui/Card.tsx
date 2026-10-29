import Link from "next/link";
import type { SectionId } from "@/components/shell/nav";

const base = "rounded-2xl border border-line bg-card";

/** Static container for a block of content. */
export function Card({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: { as?: "div" | "article" | "section"; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`${base} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Whole-card link. The border takes the card's own section hue on hover,
 * so a card that leads to Playground lights up amber, one to Projects orange.
 */
export function CardLink({
  href,
  section,
  external = false,
  className = "",
  children,
}: {
  href: string;
  section?: SectionId;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = `card-link group block ${base} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" data-section={section} className={cls}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} data-section={section} className={cls}>
      {children}
    </Link>
  );
}
