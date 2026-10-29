import type { Metadata } from "next";
import { HashTarget } from "@/components/projects/HashTarget";
import { ProjectSummary } from "@/components/projects/ProjectSummary";
import { ExternalLink } from "@/components/ui";
import { certificates } from "@/content/certificates";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <HashTarget />
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Projects</h1>
      <p className="mt-4 max-w-prose leading-relaxed text-muted">
        Everything I&apos;ve designed and built, with my role in each.
      </p>

      <ul className="mt-12 grid gap-16 md:grid-cols-2 md:gap-x-10">
        {projects.map((project) => (
          <li key={project.slug} id={project.slug} className="project-anchor scroll-mt-24">
            <ProjectSummary project={project} headingLevel="h2" />
          </li>
        ))}
      </ul>

      <section aria-labelledby="certificates" className="mt-20 border-t border-line pt-14">
        <h2 id="certificates" className="text-xl font-semibold">
          Certificates
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {certificates.map((c, i) => (
            <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-muted">
                  {c.issuer}, {c.year}
                </p>
              </div>
              <ExternalLink href={c.href}>View certificate</ExternalLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
