export type SectionId = "overview" | "projects" | "graphics" | "playground";

export const NAV: readonly { id: SectionId; label: string; href: string }[] = [
  { id: "overview", label: "Overview", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "graphics", label: "Graphics", href: "/graphics" },
  { id: "playground", label: "Playground", href: "/playground" },
];

export function sectionFromPath(pathname: string): SectionId {
  const match = NAV.find((item) => item.href !== "/" && pathname.startsWith(item.href));
  return match ? match.id : "overview";
}
