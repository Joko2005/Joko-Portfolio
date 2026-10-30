// From Joko's CV. Only tools Joko actually uses; `level` only where the CV states one.
export type StackItem = { name: string; level?: "Advanced" | "Basic" };
export type StackGroup = { id: string; label: string; items: StackItem[] };

export const stack: StackGroup[] = [
  {
    id: "design",
    label: "Design",
    items: [
      { name: "Figma", level: "Advanced" },
      { name: "Canva", level: "Advanced" },
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
      { name: "React" },
      { name: "React Native" },
      { name: "Next.js" },
      { name: "Shopify Liquid" },
    ],
  },
  {
    id: "tools",
    label: "Code and tools",
    items: [{ name: "Git and GitHub" }, { name: "Java" }, { name: "C#" }, { name: "C++" }],
  },
];

export const interests = ["User interface design", "E-commerce websites", "Educational technology", "Photography"];
