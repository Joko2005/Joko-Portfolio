/** Small tag for a category, tool, or status. Not interactive. `strong` marks the leading chip in a set. */
export function Chip({
  children,
  strong = false,
  className = "",
}: {
  children: React.ReactNode;
  strong?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8125rem] ${
        strong ? "bg-ink text-bg" : "bg-surface text-ink"
      } ${className}`}
    >
      {children}
    </span>
  );
}
