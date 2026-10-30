import Link from "next/link";
import { realCertificates } from "@/content/certificates";
import { competitions, experience } from "@/content/experience";
import { getAllCertificates } from "@/lib/credly";

/**
 * The Overview's short look at the Profile pages: the latest roles as single lines, the placings in one
 * sentence, and the latest certificates (Credly and hand-added). Everything else stays on its own page.
 */
export async function ExperiencePreview() {
  const roles = experience.slice(0, 3);
  const certs = (await getAllCertificates(realCertificates)).slice(0, 3);

  return (
    <section aria-labelledby="experience-title" className="reveal pt-28 md:pt-48">
      <h2 id="experience-title" className="section-title" data-split="chars">
        Experience
      </h2>

      <ol className="mt-10 flex flex-col gap-2">
        {roles.map((e) => (
          <li key={e.org} data-reveal>
            <Link href="/experience" className="preview-row">
              <span className="text-base text-muted lg:col-span-3">
                {e.start} – {e.end || "Present"}
              </span>
              <span className="lg:col-span-6">
                <span className="block font-display text-xl font-semibold tracking-[-0.02em] md:text-2xl">{e.org}</span>
                <span className="mt-1 block text-base">{e.role}</span>
              </span>
              <span className="text-base text-muted lg:col-span-3 lg:text-right">{e.kind}</span>
            </Link>
          </li>
        ))}
      </ol>

      <div data-reveal className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <p className="text-lg leading-snug lg:col-span-9 lg:col-start-4">
          {competitions.map((c, i) => (
            <span key={c.event}>
              {i > 0 && " "}
              <span className="font-medium">
                {c.place} {c.field.replace(",", "")}
              </span>{" "}
              at {c.short}
              {i < competitions.length - 1 ? ";" : "."}
            </span>
          ))}
        </p>
        {certs.length > 0 && (
          <ul className="flex flex-col gap-1 text-base lg:col-span-9 lg:col-start-4">
            {certs.map((c) => (
              <li key={c.title}>
                {c.title} <span className="text-muted">{c.issuer}, {c.year}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="flex flex-wrap gap-x-6 gap-y-2 text-base lg:col-span-9 lg:col-start-4">
          <Link href="/experience" className="link">
            Full history
          </Link>
          <Link href="/certificates" className="link">
            Certificates
          </Link>
          <Link href="/stack" className="link">
            Stack
          </Link>
        </p>
      </div>
    </section>
  );
}
