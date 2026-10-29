import type { Metadata } from "next";
import { PiArrowUpRight } from "react-icons/pi";
import { PageHeader } from "@/components/ui";
import { certificates } from "@/content/certificates";

export const metadata: Metadata = { title: "Certificates" };

export default function CertificatesPage() {
  return (
    <>
      <PageHeader title="Certificates" lead="Courses and trainings I've completed." count={certificates.length} />

      <ul className="reveal flex flex-col gap-2">
        {certificates.map((c, i) => {
          const body = (
            <>
              <span className="min-w-0">
                <span className="cert-title">{c.title}</span>
                <span className="mt-2 block text-base text-muted">
                  {c.issuer}, {c.year}
                </span>
              </span>
              {c.href ? (
                <span aria-hidden className="cert-arrow">
                  <PiArrowUpRight />
                </span>
              ) : (
                <span className="shrink-0 text-sm text-muted">[Add link]</span>
              )}
            </>
          );
          return (
            <li key={i} data-reveal>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="cert-row">
                  {body}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <div className="cert-row">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
