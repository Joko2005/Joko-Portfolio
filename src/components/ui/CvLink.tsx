import { PiDownloadSimple } from "react-icons/pi";
import { site } from "@/content/site";

/** Downloads the one-page CV PDF. `className` sets the look (button, link, or the sidebar pill). */
export function CvLink({ className = "", label = "CV" }: { className?: string; label?: string }) {
  return (
    <a href={site.cv} download="Joko-Comia-CV.pdf" className={className}>
      <PiDownloadSimple aria-hidden className="size-4 shrink-0" />
      {label}
      <span className="sr-only"> (PDF)</span>
    </a>
  );
}
