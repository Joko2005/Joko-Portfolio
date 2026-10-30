import type { Metadata } from "next";
import Image from "next/image";
import { PiArrowUpRight } from "react-icons/pi";
import { PageHeader } from "@/components/ui";
import { realCertificates } from "@/content/certificates";
import { getAllCertificates } from "@/lib/credly";

export const metadata: Metadata = { title: "Certificates" };

// Re-read Credly once a day, so a new badge shows up without a deploy.
export const revalidate = 86400;

export default async function CertificatesPage() {
  const certificates = await getAllCertificates(realCertificates);

  return (
    <>
      <PageHeader
        title="Certificates"
        lead="Courses and trainings I've completed, verified on Credly."
        count={certificates.length || undefined}
      />

      {certificates.length ? (
        <ul className="reveal flex flex-col gap-2">
          {certificates.map((c) => {
            const body = (
              <>
                <span className="flex min-w-0 items-center gap-5">
                  {c.image && (
                    <Image src={c.image} alt="" width={96} height={96} className="size-16 shrink-0 md:size-20" />
                  )}
                  <span className="min-w-0">
                    <span className="cert-title">{c.title}</span>
                    <span className="mt-2 block text-base text-muted">
                      {c.issuer}, {c.year}
                    </span>
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
              <li key={`${c.title}-${c.date ?? c.year}`} data-reveal>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="cert-row">
                    {body}
                    <span className="sr-only"> (verify, opens in a new tab)</span>
                  </a>
                ) : (
                  <div className="cert-row">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="reveal about-text text-muted">Certificates are loading from Credly. Check back shortly.</p>
      )}
    </>
  );
}
