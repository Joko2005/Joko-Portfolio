/**
 * The JC mark (from JC-Logo.svg). Filled with currentColor, so it takes the text colour around it:
 * ink on the light theme, white on the dark one. Decorative by default; pass `label` when it stands alone.
 */
export function Logo({ className = "", label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 844 503"
      fill="currentColor"
      className={className}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path d="M133.663 301.743H0V418.598C0 465.012 37.6259 502.638 84.0398 502.638H335.359C372.932 502.638 403.391 472.179 403.391 434.606V20.6193C403.391 9.64307 394.549 0.715764 383.573 0.610733L319.752 0L236.112 0.800379V356.169C236.112 367.22 227.153 376.178 216.102 376.178H153.673C142.622 376.178 133.663 367.22 133.663 356.169V301.743Z" />
      <path d="M755.555 0.800293H413.792L554.66 148.87H657.108C668.159 148.87 677.118 157.829 677.118 168.88V209.699H839.595V84.8401C839.595 38.4262 801.969 0.800293 755.555 0.800293Z" />
      <path d="M840.794 324.557H676.501V356.455C676.501 367.506 667.543 376.464 656.492 376.464L573.191 376.464C562.14 376.464 553.181 367.506 553.181 356.455V149.671L477.422 149.671C442.059 149.671 413.392 178.338 413.392 213.701V434.606C413.392 472.179 443.851 502.638 481.424 502.638H756.754C803.168 502.638 840.794 465.012 840.794 418.598V324.557Z" />
    </svg>
  );
}
