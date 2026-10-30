import Image from "next/image";
import Link from "next/link";
import { PiArrowUpRight } from "react-icons/pi";
import { Hero } from "@/components/overview/Hero";
import { PlayWords } from "@/components/overview/PlayWords";
import { WorkIndex } from "@/components/overview/WorkIndex";
import { SOCIALS } from "@/components/shell/socials";
import { site } from "@/content/site";
import { education } from "@/content/experience";
import { stack } from "@/content/stack";
import { work } from "@/content/work";

/** Square portrait floated into the paragraph like a drop capital; a monogram until site.photo is set. */
function DropPortrait() {
  const cls = "float-left mr-[0.5em] mt-[0.2em] size-[3.6em] rounded-2xl";
  if (site.photo) {
    return <Image data-split-ignore src={site.photo} alt={`Portrait of ${site.name}`} width={240} height={240} className={`${cls} object-cover`} />;
  }
  return (
    <span aria-hidden data-split-ignore className={`${cls} grid place-items-center bg-ink text-bg`}>
      <span className="font-display text-[1.3em] font-semibold leading-none">{site.name.charAt(0)}</span>
    </span>
  );
}

const facts: { term: string; detail: React.ReactNode }[] = [
  { term: "Does", detail: "UI/UX design and front-end development" },
  { term: "Studying", detail: `${education.degree}, ${education.when}` },
  {
    term: "Works with",
    detail: (
      <>
        {stack.flatMap((g) => g.items.filter((i) => i.featured).map((i) => i.name)).join(", ")}.{" "}
        <Link href="/stack" className="link">
          All tools
        </Link>
      </>
    ),
  },
  {
    term: "Elsewhere",
    detail: (
      <span className="flex flex-wrap gap-x-4 gap-y-1">
        {SOCIALS.filter((x) => x.external).map((x) => (
          <a key={x.id} href={x.href} target="_blank" rel="noopener noreferrer" className="link">
            {x.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </span>
    ),
  },
];

type ContactRow = { label: string; value: string; href?: string; external?: boolean };

const contactRows: ContactRow[] = [
  site.email
    ? { label: "Email", value: site.email, href: `mailto:${site.email}` }
    : { label: "Email", value: "[Add your email]" },
  { label: "GitHub", value: site.links.github.replace("https://", ""), href: site.links.github, external: true },
  ...(site.links.linkedin
    ? [{ label: "LinkedIn", value: "LinkedIn", href: site.links.linkedin, external: true }]
    : []),
];

const helloHref = site.email
  ? `mailto:${site.email}?subject=${encodeURIComponent("OJT placement")}`
  : site.links.github;

export default function OverviewPage() {
  return (
    <div className="flex flex-col">
      <Hero name={site.name} role={`${site.role}.`} intro={site.intro} />

      <section id="work" aria-labelledby="work-title" className="reveal scroll-mt-8 pt-24 md:pt-40">
        <h2 id="work-title" className="section-title" data-split="chars">
          Selected work
        </h2>
        <div className="mt-10">
          <WorkIndex items={work} />
        </div>
      </section>

      <section aria-labelledby="about-title" className="reveal pt-28 md:pt-48">
        <h2 id="about-title" className="section-title" data-split="chars">
          About
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9 lg:col-start-4 lg:row-start-1">
            <p className="about-text" data-split="words">
              <DropPortrait />
              <span className="text-ink">I&apos;m {site.name},</span> a UI/UX designer who builds what I design. I shape an
              interface first, then write the code behind it, with as much care for how the code is structured as for how
              the page looks. Recent work: AVERA, a team thesis app that checks signatures with machine learning, and
              CryoLipo, a Shopify theme I designed and built.
            </p>
            <p className="about-text mt-[1.2em] text-muted" data-reveal>
              I&apos;m looking for an OJT placement in UI/UX design or design engineering.
            </p>
          </div>
          <dl data-reveal className="grid content-start grid-cols-2 gap-x-6 gap-y-5 text-base sm:grid-cols-4 lg:col-span-3 lg:row-start-1 lg:grid-cols-1">
            {facts.map((f) => (
              <div key={f.term}>
                <dt className="text-muted">{f.term}</dt>
                <dd className="mt-1">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PlayWords />

      <section aria-labelledby="contact-title" className="reveal pt-28 md:pt-48">
        <h2 id="contact-title" className="section-title" data-split="chars">
          Contact
        </h2>
        <ul className="mt-10 flex flex-col gap-2">
          {contactRows.map((row) => (
            <li key={row.label} data-reveal>
              {row.href ? (
                <a
                  href={row.href}
                  {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${row.label}: ${row.value}`}
                  className="contact-row"
                >
                  <span className="contact-value">{row.value}</span>
                  {row.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              ) : (
                <div className="contact-row">
                  <span className="contact-value text-muted">{row.value}</span>
                </div>
              )}
            </li>
          ))}
          <li data-reveal>
            <a href={helloHref} className="contact-row contact-hello" data-cursor="Write">
              <span className="contact-value">Say hello</span>
              <span aria-hidden className="contact-arrow">
                <PiArrowUpRight />
              </span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
