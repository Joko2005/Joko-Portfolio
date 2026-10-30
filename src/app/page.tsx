import Link from "next/link";
import { PiArrowUpRight } from "react-icons/pi";
import { ExperiencePreview } from "@/components/overview/ExperiencePreview";
import { Hero } from "@/components/overview/Hero";
import { PlayWords } from "@/components/overview/PlayWords";
import { WorkIndex } from "@/components/overview/WorkIndex";
import { site } from "@/content/site";
import { work } from "@/content/work";

const contactRows = [
  ...(site.email ? [{ label: "Email", value: site.email, href: `mailto:${site.email}`, external: false }] : []),
  { label: "GitHub", value: site.links.github.replace("https://", ""), href: site.links.github, external: true },
  { label: "LinkedIn", value: "LinkedIn", href: site.links.linkedin, external: true },
];

const helloHref = site.email
  ? `mailto:${site.email}?subject=${encodeURIComponent("OJT placement")}`
  : site.links.github;

// The Experience preview lists the latest Credly badges; re-read them once a day.
export const revalidate = 86400;

export default function OverviewPage() {
  return (
    <div className="flex flex-col">
      <Hero name={site.name} role={site.role} intro={site.intro} />

      <section id="work" aria-labelledby="work-title" className="reveal scroll-mt-8 pt-16 md:pt-24">
        <div className="section-head">
          <h2 id="work-title" className="section-title" data-split="chars">
            Selected work
          </h2>
          <p className="flex gap-6 text-base">
            <Link href="/projects" className="link">
              All projects
            </Link>
            <Link href="/graphics" className="link">
              Graphics
            </Link>
          </p>
        </div>
        <div className="mt-6 md:mt-8">
          {/* Graphics and the Playground have their own ways in. */}
          <WorkIndex items={work.filter((w) => w.id !== "playground" && w.id !== "graphics")} />
        </div>
      </section>

      <ExperiencePreview />

      <PlayWords />

      <section aria-labelledby="contact-title" className="reveal pt-24 md:pt-32">
        <h2 id="contact-title" className="section-title" data-split="chars">
          Contact
        </h2>
        <ul className="mt-6 flex flex-col gap-2 md:mt-8">
          {contactRows.map((row) => (
            <li key={row.label} data-reveal>
              <a
                href={row.href}
                {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={`${row.label}: ${row.value}`}
                className="contact-row"
              >
                <span className="contact-value">{row.value}</span>
                {row.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
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
