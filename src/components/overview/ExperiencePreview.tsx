import Image from "next/image";
import Link from "next/link";
import { realCertificates } from "@/content/certificates";
import { experience } from "@/content/experience";
import { stack } from "@/content/stack";
import { getAllCertificates } from "@/lib/credly";

/** A huge title that holds its place while the details pass beside it, with the way to see everything under it. */
function Ledger({ id, title, href, more, children }: { id: string; title: string; href: string; more: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="reveal grid gap-6 pt-24 md:pt-40 lg:grid-cols-12 lg:gap-8">
      <div className="lg:sticky lg:top-16 lg:col-span-6 lg:self-start">
        <h2 id={id} className="ledger-title" data-split="chars">
          {title}
        </h2>
        <Link href={href} className="link mt-3 inline-block text-base">
          {more}
        </Link>
      </div>
      <div className="lg:col-span-6">{children}</div>
    </section>
  );
}

/**
 * The Overview's short look at the Profile pages, only what a recruiter scans for: where and as what, how
 * recently, what's verified, and the main tools. Everything else stays on its own page.
 */
export async function ExperiencePreview() {
  const roles = experience.slice(0, 3);
  const certs = (await getAllCertificates(realCertificates)).slice(0, 3);
  const tools = stack
    .map((g) => ({ label: g.label, names: g.items.filter((i) => i.featured).map((i) => i.name) }))
    .filter((g) => g.names.length > 0);

  return (
    <>
      <Ledger id="experience-title" title="Experience" href="/experience" more="Full history">
        <ol className="flex flex-col gap-10">
          {roles.map((e) => (
            <li key={e.org} data-reveal>
              <p className="ledger-item">{e.short}</p>
              <p className="mt-2 text-base">{e.role}</p>
              <p className="text-base text-muted">
                {e.kind}, {e.start} – {e.end || "Present"}
              </p>
            </li>
          ))}
        </ol>
      </Ledger>

      {certs.length > 0 && (
        <Ledger id="certificates-title" title="Certificates" href="/certificates" more="All certificates">
          <ul className="flex flex-col gap-8">
            {certs.map((c) => (
              <li key={c.title} data-reveal>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5">
                  {c.image && <Image src={c.image} alt="" width={72} height={72} className="size-16 shrink-0 md:size-[4.5rem]" />}
                  <span className="min-w-0">
                    <span className="ledger-item block transition-colors duration-200 group-hover:text-accent">{c.title}</span>
                    <span className="mt-1 block text-base text-muted">
                      {c.issuer}, {c.year}
                    </span>
                  </span>
                  <span className="sr-only"> (verify, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Ledger>
      )}

      <Ledger id="stack-title" title="Stack" href="/stack" more="All tools">
        <dl className="flex flex-col gap-8">
          {tools.map((g) => (
            <div key={g.label} data-reveal>
              <dt className="text-base text-muted">{g.label}</dt>
              <dd className="ledger-item mt-1">{g.names.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Ledger>
    </>
  );
}
