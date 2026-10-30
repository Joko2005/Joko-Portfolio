import { PiArrowUpRight } from "react-icons/pi";
import { WorkStill } from "@/components/overview/WorkIndex";
import { Chip } from "@/components/ui";
import type { Project } from "@/content/projects";
import { work } from "@/content/work";

/**
 * One project, outcome first: what it is and what came of it on the left, the still on the right.
 * Highlighted projects link out with a primary button; the rest keep a text link.
 */
export function ProjectRow({ project }: { project: Project }) {
  const item = work.find((w) => w.id === project.slug);
  const link = project.links[0];

  const still = item && (
    <div className="card-media relative aspect-16/10 overflow-hidden rounded-3xl">
      <WorkStill item={item} className="absolute inset-0" />
    </div>
  );

  return (
    <article className="reveal grid gap-8 lg:grid-cols-12 lg:gap-8">
      <div className="flex flex-col lg:col-span-5">
        <div data-reveal className="flex flex-wrap gap-1.5">
          <Chip strong>{project.kind}</Chip>
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
        <h2 className="work-name mt-5" data-split="chars">
          {project.title}
        </h2>
        <p data-reveal className="mt-4 max-w-[36ch] text-lg leading-snug">
          {project.summary}
        </p>
        <dl data-reveal className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-base">
          <dt className="text-muted">Role</dt>
          <dd>{project.role}</dd>
          <dt className="text-muted">Result</dt>
          <dd>{project.result}</dd>
        </dl>
        {link && (
          <div data-reveal className="mt-8">
            {link.href ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn pressable ${project.highlight ? "btn-primary" : ""}`}
              >
                {link.label}
                <PiArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="text-sm text-muted">[Add link: {link.label}]</span>
            )}
          </div>
        )}
      </div>

      <div data-reveal className="lg:col-span-7">
        {link?.href ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer" data-cursor="View" className="project-still block" tabIndex={-1} aria-hidden>
            {still}
          </a>
        ) : (
          still
        )}
      </div>
    </article>
  );
}
