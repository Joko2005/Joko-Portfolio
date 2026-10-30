import type { IconType } from "react-icons";
import { PiEnvelopeSimple, PiGithubLogo, PiLinkedinLogo } from "react-icons/pi";
import { site } from "@/content/site";

export type Social = { id: string; label: string; href: string; icon: IconType; external: boolean };

/** Every way to reach Joko, in the order a reviewer is likely to want them. Empty links are left out. */
export const SOCIALS: Social[] = [
  { id: "linkedin", label: "LinkedIn", href: site.links.linkedin, icon: PiLinkedinLogo, external: true },
  { id: "github", label: "GitHub", href: site.links.github, icon: PiGithubLogo, external: true },
  { id: "email", label: "Email", href: site.email ? `mailto:${site.email}` : "", icon: PiEnvelopeSimple, external: false },
].filter((s) => s.href);
