// Tools Joko works with, grouped for the Overview's stack card.
// TODO: add your design tools (only ones you actually use).
export type StackGroup = { id: string; label: string; items: string[] };

export const stack: StackGroup[] = [
  { id: "design", label: "Design", items: ["[Your design tools]"] },
  { id: "frontend", label: "Front-end", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { id: "platforms", label: "Platforms", items: ["Shopify", "Liquid", "Android"] },
];
