import type { Metadata } from "next";
import { Chip, PageHeader, CvLink } from "@/components/ui";
import { competitions, education, experience, leadership } from "@/content/experience";

export const metadata: Metadata = { title: "Experience" };

/**
 * Work first (bands, newest first), then what came of competing, leading and teaching, then school.
 * Each section takes its own composition so the page doesn't read as one list repeated.
 */
export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        title="Experience"
        lead="Freelance, thesis and team work, plus the competitions, talks and roles around them."
        count={experience.length}
        action={<CvLink label="Download CV" className="btn btn-primary pressable" />}
      />

      <ol className="reveal flex flex-col gap-2" aria-label="Work">
        {experience.map((e) => (
          <li key={e.org} data-reveal className="exp-row">
            <p className="text-base text-muted lg:col-span-3">
              {e.start} – {e.end || "Present"}
            </p>
            <div className="lg:col-span-9">
              <h2 className="exp-role">{e.role}</h2>
              <p className="mt-2 text-lg">
                {e.href ? (
                  <a href={e.href} target="_blank" rel="noopener noreferrer" className="link">
                    {e.org}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  e.org
                )}
                <span className="text-muted">
                  , {e.kind}, {e.location}
                </span>
              </p>
              <ul className="mt-5 flex max-w-[62ch] list-disc flex-col gap-2 pl-5 text-base leading-relaxed marker:text-muted">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {e.skills.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {e.skills.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* The result is the headline: placing is what a reviewer scans for. */}
      <section aria-labelledby="competitions" className="reveal pt-28 md:pt-40">
        <h2 id="competitions" className="section-title" data-split="chars">
          Competitions
        </h2>
        <ul className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-8">
          {competitions.map((c) => (
            <li key={c.event} data-reveal>
              <p className="comp-result">{c.place}</p>
              <p className="mt-2 text-lg">{c.field}</p>
              <h3 className="mt-5 text-lg font-medium">{c.event}</h3>
              <p className="mt-1 text-base text-muted">
                {c.host}, {c.when}
              </p>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed">{c.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="leadership" className="reveal pt-28 md:pt-40">
        <h2 id="leadership" className="section-title" data-split="chars">
          Leadership and talks
        </h2>
        <ul className="mt-10 flex flex-col gap-8">
          {leadership.map((a) => (
            <li key={a.title} data-reveal className="grid gap-1 lg:grid-cols-12 lg:gap-8">
              <p className="text-base text-muted lg:col-span-3">{a.when}</p>
              <div className="lg:col-span-9">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em] md:text-2xl">{a.title}</h3>
                <p className="mt-1 text-base text-muted">{a.org}</p>
                {a.detail && <p className="mt-2 max-w-[62ch] text-base leading-relaxed">{a.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="education" className="reveal pt-28 md:pt-40">
        <h2 id="education" className="section-title" data-split="chars">
          Education
        </h2>
        <div data-reveal className="mt-10 grid gap-8 rounded-3xl bg-surface p-6 md:p-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-none tracking-[-0.03em]">
              {education.degree}
            </p>
            <p className="mt-3 text-lg">{education.school}</p>
            <p className="mt-8 max-w-[56ch] text-base leading-relaxed">
              <span className="font-medium">Thesis: </span>
              {education.thesis}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-6 lg:col-span-4">
            <p className="text-lg font-medium lg:text-right">{education.when}</p>
            <div>
              <p className="text-base text-muted">Relevant coursework</p>
              <p className="mt-1 text-base leading-relaxed">{education.coursework.join(", ")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
