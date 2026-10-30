import { PiDownloadSimple } from "react-icons/pi";
import { site } from "@/content/site";

/** Downloads the one-page résumé PDF. `className` sets the look (button, link, or the sidebar pill). */
export function ResumeLink({ className = "", label = "Résumé" }: { className?: string; label?: string }) {
  return (
    <a href={site.resume} download="Joko-Comia-Resume.pdf" className={className}>
      <PiDownloadSimple aria-hidden className="size-4 shrink-0" />
      {label}
      <span className="sr-only"> (PDF)</span>
    </a>
  );
}
