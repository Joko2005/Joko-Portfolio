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
    summary: "Android app that verifies handwritten signatures with Siamese neural networks and explains its decisions.",
    role: "UI/UX designer and front-end developer: admin and analyst flows in Figma, and the React Native interface",
    result: "Team thesis at LSPU San Pablo City, in progress since April 2026.",
    stack: ["React Native", "Figma", "Machine learning"],
    highlight: true,
    media: "AVERA app screenshot (1600 × 1000)",
    links: [{ label: "View on GitHub", href: "" }],
  },
  {
    slug: "cryolipo",
    title: "CryoLipo",
    kind: "Freelance Shopify storefront",
    summary: "A client's Shopify storefront, designed in Figma and built as reusable theme sections.",
    role: "UI/UX designer and front-end developer: the full interface and user flow, and the Liquid components",
    result: "In progress since September 2026, with a development partner.",
    stack: ["Figma", "Shopify", "Liquid"],
    highlight: true,
    media: "CryoLipo store screenshot (1600 × 1000)",
    links: [{ label: "Visit the store", href: "" }],
  },
  {
    slug: "resqline",
    title: "ResQLine",
    kind: "Hackathon project",
    summary: "An AI disaster classifier and a live dispatcher map, with an admin platform.",
    role: "Web developer and UI/UX designer; prepared the pitch deck and documentation with the team leader",
    result: "Top 12 finalists out of 48+ universities at the Batang Techno Hackathon, April 2026.",
    stack: ["Figma", "React"],
    highlight: false,
    media: "ResQLine screenshot (1600 × 1000)",
    links: [{ label: "View on GitHub", href: "" }],
  },
  {
    slug: "statera",
    title: "Statera",
    kind: "[Kind of project]",
    summary: "[One line on what Statera does]",
    role: "UI/UX designer and front-end contributor",
    result: "[One result]",
    stack: [],
    highlight: false,
    media: "Statera screenshot (1600 × 1000)",
    links: [{ label: "View on GitHub", href: "" }],
  },
  {
    slug: "workhive",
    title: "WorkHive",
    kind: "Team project, desktop app",
    summary: "A project management app for teams, individuals and business owners: assign tasks, track progress and talk in one place.",
    role: "UI/UX designer and front-end contributor",
    result: "Built as a team coursework project at LSPU San Pablo City.",
    stack: ["WinForms", "C#", "Figma"],
    highlight: false,
    media: "WorkHive screenshot (1600 × 1000)",
    links: [{ label: "View on GitHub", href: "" }],
  },
];

export const highlightedProjects = projects.filter((p) => p.highlight);
