// From Joko's CV. Newest first. Never add metrics or outcomes that didn't happen.

export type Experience = {
  role: string;
  org: string;
  kind: string;
  /** e.g. "Sep 2026" */
  start: string;
  /** Leave empty while it's ongoing; shown as "Present". */
  end: string;
  location: string;
  /** Outcome first: what was done and what came of it. */
  points: string[];
  skills: string[];
  href?: string;
};

export const experience: Experience[] = [
  {
    role: "UI/UX designer and front-end developer",
    org: "CryoLipo, a client's Shopify storefront",
    kind: "Freelance",
    start: "Sep 2026",
    end: "",
    location: "Remote",
    points: [
      "Designed the full interface and user flow of the storefront in Figma.",
      "Turned wireframes and high-fidelity mockups into reusable Shopify theme sections and responsive components in Liquid.",
      "Planned the site structure and visual hierarchy with a development partner.",
    ],
    skills: ["Figma", "Shopify", "Liquid"],
  },
  {
    role: "UI/UX designer and front-end developer",
    org: "AVERA capstone, LSPU San Pablo City",
    kind: "Team thesis",
    start: "Apr 2026",
    end: "",
    location: "San Pablo City, Laguna",
    points: [
      "Designed the admin and analyst flows in Figma: case lists and review states, filter sheets and statistics screens.",
      "Built the React Native mobile interface, including navigation, card layouts and bottom sheets.",
    ],
    skills: ["Figma", "React Native"],
  },
  {
    role: "UI/UX designer and front-end contributor",
    org: "Team software projects, LSPU San Pablo City",
    kind: "Coursework",
    start: "Jan 2021",
    end: "May 2025",
    location: "San Pablo City, Laguna",
    points: [
      "Designed and built interfaces for Statera, WorkHive and the ResQLine admin platform.",
      "Created dashboards, forms, navigation systems and responsive screens in Figma, then implemented them in HTML, CSS, JavaScript and React through GitHub workflows.",
    ],
    skills: ["Figma", "React", "JavaScript", "GitHub"],
  },
];

export type Activity = { title: string; org: string; when: string; detail?: string };

export const leadership: Activity[] = [
  {
    title: "Guest speaker, Figma workshop: Figma-nificent, One Frame at a Time",
    org: "Laguna State Polytechnic University",
    when: "Sep 2026",
    detail: "Taught interface design, layout principles and prototyping to college students.",
  },
  {
    title: "Design team leader, Software Development and Applications Committee",
    org: "San Pablo City, Laguna",
    when: "Aug 2024 – May 2026",
    detail: "Led the design team, assigned design tasks and produced posters and social media content in Figma and Canva.",
  },
  {
    title: "Guest speaker, Figma workshop: Front-First Back-Later",
    org: "Laguna State Polytechnic University",
    when: "Apr 2025",
    detail: "Taught interface design, layout principles and prototyping to college students.",
  },
  {
    title: "Class president",
    org: "Laguna State Polytechnic University",
    when: "Aug 2024 – May 2025",
  },
];

/** `short` names the event inside a sentence (the Overview preview). */
export type Competition = {
  place: string;
  field: string;
  event: string;
  short: string;
  host: string;
  when: string;
  detail: string;
};

export const competitions: Competition[] = [
  {
    place: "5th",
    field: "nationally, of 106 schools",
    event: "Design Competition, SIKAPtala 2026: The National CS & IT Competition",
    short: "SIKAPtala 2026",
    host: "CICS Student Government, De La Salle University Dasmariñas",
    when: "May 2026",
    detail: "Designed web interfaces for the theme Innovation Through Accessibility.",
  },
  {
    place: "Top 12",
    field: "finalists, of 48+ universities",
    event: "Batang Techno Hackathon, Team ALGORIZZMS",
    short: "the Batang Techno Hackathon",
    host: "CICS Student Council, Batangas State University Alangilan",
    when: "Apr 2026",
    detail:
      "My first hackathon. Built ResQLine as web developer and UI/UX designer: an AI disaster classifier and a live dispatcher map. Prepared the pitch deck and documentation with the team leader.",
  },
];

export const education = {
  school: "Laguna State Polytechnic University, San Pablo City Campus",
  degree: "BS Computer Science, Intelligent Systems",
  when: "Expected 2027",
  thesis:
    "AVERA: Assistive Android Application for Handwritten Signature Verification Using Siamese Neural Networks with Explainable AI",
  coursework: ["Web Development", "UI/UX Design", "Human-Computer Interaction", "Systems Analysis and Design"],
};
