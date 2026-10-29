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
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${
        strong ? "border-ink/25 text-ink" : "border-line text-muted"
      } ${className}`}
    >
      {children}
    </span>
  );
}
