import type { IconType } from "react-icons";
import { PiBriefcase, PiCertificate, PiCube, PiStack, PiFolderSimple, PiHouseSimple, PiPaintBrushBroad } from "react-icons/pi";

export type SectionId = "overview" | "projects" | "experience" | "graphics" | "certificates" | "stack" | "playground";

export type NavGroup = "Work" | "Profile" | "Play";

export const NAV: readonly { id: SectionId; label: string; href: string; group: NavGroup; icon: IconType }[] = [
  { id: "overview", label: "Overview", href: "/", group: "Work", icon: PiHouseSimple },
  { id: "projects", label: "Projects", href: "/projects", group: "Work", icon: PiFolderSimple },
  { id: "graphics", label: "Graphics", href: "/graphics", group: "Work", icon: PiPaintBrushBroad },
  { id: "experience", label: "Experience", href: "/experience", group: "Profile", icon: PiBriefcase },
  { id: "stack", label: "Stack", href: "/stack", group: "Profile", icon: PiStack },
  { id: "certificates", label: "Certificates", href: "/certificates", group: "Profile", icon: PiCertificate },
  { id: "playground", label: "Playground", href: "/playground", group: "Play", icon: PiCube },
];

export const NAV_GROUPS: readonly NavGroup[] = ["Work", "Profile", "Play"];

export function sectionFromPath(pathname: string): SectionId {
  const match = NAV.find((item) => item.href !== "/" && pathname.startsWith(item.href));
  return match ? match.id : "overview";
}
