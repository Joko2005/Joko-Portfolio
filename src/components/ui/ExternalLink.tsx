/** External link; shows a visible reminder when the URL hasn't been added yet. */
export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href) {
    return <span className="text-sm text-muted">[Add link: {children}]</span>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
