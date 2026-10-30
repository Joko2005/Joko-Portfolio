// From Joko's CV. Only tools Joko actually uses; `level` only where the CV states one.
// `featured` tools make the Overview's one-line summary; the Stack page shows them all.
export type StackItem = { name: string; level?: "Advanced" | "Basic"; featured?: boolean };
export type StackGroup = { id: string; label: string; items: StackItem[] };

export const stack: StackGroup[] = [
  {
    id: "design",
    label: "Design",
    items: [
      { name: "Figma", level: "Advanced", featured: true },
      { name: "Canva", level: "Advanced", featured: true },
      { name: "Prototyping" },
      { name: "Illustrator", level: "Basic" },
      { name: "Photoshop", level: "Basic" },
    ],
  },
  {
    id: "frontend",
    label: "Front-end",
    items: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "React", featured: true },
      { name: "React Native", featured: true },
      { name: "Next.js", featured: true },
      { name: "Shopify Liquid", featured: true },
    ],
  },
  {
    id: "tools",
    label: "Code and tools",
    items: [{ name: "Git and GitHub" }, { name: "Java" }, { name: "C#" }, { name: "C++" }],
  },
];

export const interests = ["User interface design", "E-commerce websites", "Educational technology", "Photography"];
