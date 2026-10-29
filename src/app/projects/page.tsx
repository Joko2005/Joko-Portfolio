import type { Metadata } from "next";
import { HashTarget } from "@/components/projects/HashTarget";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { PageHeader } from "@/components/ui";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <HashTarget />
      <PageHeader title="Projects" lead="Everything I've designed and built, with my role in each." count={projects.length} />

      <ul className="flex flex-col gap-28 md:gap-40">
        {projects.map((project) => (
          <li key={project.slug} id={project.slug} className="project-anchor scroll-mt-16">
            <ProjectRow project={project} />
          </li>
        ))}
      </ul>
    </>
  );
}
