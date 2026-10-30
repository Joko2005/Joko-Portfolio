import Link from "next/link";
import { Chip } from "@/components/ui";
import { realCertificates } from "@/content/certificates";
import { experience } from "@/content/experience";
import { stack } from "@/content/stack";
import { getAllCertificates } from "@/lib/credly";

/**
 * The Overview's short look at the Profile pages: the latest roles as single lines, then the latest
 * certificates (Credly and hand-added) and the main tools. Everything else stays on its own page.
 */
export async function ExperiencePreview() {
  const roles = experience.slice(0, 3);
  const certs = (await getAllCertificates(realCertificates)).slice(0, 3);
  const tools = stack.flatMap((g) => g.items.filter((i) => i.featured).map((i) => i.name));

  return (
    <section aria-labelledby="experience-title" className="reveal pt-24 md:pt-32">
      <div className="section-head">
        <h2 id="experience-title" className="section-title" data-split="chars">
          Experience
        </h2>
        <Link href="/experience" className="link">
          Full history
        </Link>
      </div>

      <ol className="mt-6 flex flex-col gap-2 md:mt-8">
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

      <div data-reveal className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-5">
        {certs.length > 0 && (
          <div>
            <div className="section-head">
              <h3 className="font-display text-xl font-semibold tracking-[-0.02em] md:text-2xl">Certificates</h3>
              <Link href="/certificates" className="link">
                All certificates
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-base">
              {certs.map((c) => (
                <li key={c.title}>
                  {c.title} <span className="text-muted">{c.issuer}, {c.year}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <div className="section-head">
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em] md:text-2xl">Stack</h3>
            <Link href="/stack" className="link">
              All tools
            </Link>
          </div>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {tools.map((t) => (
              <li key={t}>
                <Chip>{t}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
