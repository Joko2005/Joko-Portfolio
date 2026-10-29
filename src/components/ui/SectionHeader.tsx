import Link from "next/link";

/** Section title with an optional one-line description and a "see all" link on the right. */
export function SectionHeader({
  id,
  title,
  description,
  action,
}: {
  id: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="font-display text-xl font-semibold tracking-[-0.01em]">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="link shrink-0 text-sm">
          {action.label}
        </Link>
      )}
    </div>
  );
}
