/** Stand-in for an image until the real asset is added. Replace with next/image. */
export function Placeholder({
  label,
  ratio = "16 / 10",
  className = "",
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      style={{ aspectRatio: ratio }}
      className={`flex items-center justify-center bg-surface p-4 text-center text-sm text-muted ${className}`}
    >
      {label}
    </div>
  );
}
