export type PlaygroundItem = { title: string; description: string; status: "In progress" | "Live"; href?: string };

export const playground: PlaygroundItem[] = [
  { title: "Mini game", description: "A small game you can finish in a minute.", status: "In progress" },
];

// Objects on the 3D design desk. Each one points at real work; keep the copy factual.
export type DeskObjectId = "laptop" | "phone" | "bag" | "sketchbook" | "swatches" | "mug";

export type DeskObject = {
  id: DeskObjectId;
  label: string;
  title: string;
  body: string;
  link?: { label: string; href: string };
};

export const deskObjects: DeskObject[] = [
  {
    id: "laptop",
    label: "Laptop",
    title: "Where the designs turn into code",
    body: "Next.js, React and TypeScript. This site was designed and built here.",
    link: { label: "See all projects", href: "/projects" },
  },
  {
    id: "phone",
    label: "Phone",
    title: "AVERA",
    body: "Forensic signature verification on Android, with a machine-learning model. A team thesis project.",
    link: { label: "Read about AVERA", href: "/projects#avera" },
  },
  {
    id: "bag",
    label: "Shopping bag",
    title: "CryoLipo",
    body: "A Shopify store theme I designed and built, custom sections included.",
    link: { label: "Read about CryoLipo", href: "/projects#cryolipo" },
  },
  {
    id: "sketchbook",
    label: "Sketchbook",
    title: "Graphics",
    body: "Pubmats and other graphic design work.",
    link: { label: "See the graphics", href: "/graphics" },
  },
  {
    id: "swatches",
    label: "Swatch fan",
    title: "This site's palette",
    body: "Black and white, plus one hue for each section. The color only shows up when you interact.",
  },
  {
    id: "mug",
    label: "Mug",
    title: "Coffee",
    body: "Not a project. Still essential.",
  },
];
