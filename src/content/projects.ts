// TODO: fill bracketed placeholders and empty hrefs before launch.
// Never add metrics or outcomes that didn't happen.

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  /** What kind of work this is, shown as the first chip. */
  kind: string;
  summary: string;
  role: string;
  result: string;
  stack: string[];
  highlight: boolean;
  media: string; // describes the placeholder until a real image is added
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "avera",
    title: "AVERA",
    kind: "Team thesis",
    summary: "Forensic signature-verification Android app with a machine-learning model.",
    role: "[Your role on the team]",
    result: "Completed as a team thesis project.",
    stack: ["Android", "Machine learning"],
    highlight: true,
    media: "AVERA app screenshot (1600 × 1000)",
    links: [{ label: "View on GitHub", href: "" }],
  },
  {
    slug: "cryolipo",
    title: "CryoLipo",
    kind: "Shopify theme",
    summary: "Shopify store theme, designed and built with custom sections.",
    role: "Design and front-end development",
    result: "[One result, e.g. the store is live]",
    stack: ["Shopify", "Liquid"],
    highlight: true,
    media: "CryoLipo store screenshot (1600 × 1000)",
    links: [{ label: "Visit the store", href: "" }],
  },
  {
    slug: "resqline",
    title: "ResQLine",
    kind: "[Kind of project]",
    summary: "[One line on what ResQLine does]",
    role: "[Your role]",
    result: "[One result]",
    stack: [],
    highlight: false,
    media: "ResQLine screenshot (1600 × 1000)",
    links: [{ label: "View on GitHub", href: "" }],
  },
  {
    slug: "statera",
    title: "Statera",
    kind: "[Kind of project]",
    summary: "[One line on what Statera does]",
    role: "[Your role]",
    result: "[One result]",
    stack: [],
    highlight: false,
    media: "Statera screenshot (1600 × 1000)",
    links: [{ label: "View on GitHub", href: "" }],
  },
];

export const highlightedProjects = projects.filter((p) => p.highlight);
