export type PlaygroundItem = { title: string; description: string; status: "In progress" | "Live"; href?: string };

export const playground: PlaygroundItem[] = [
  { title: "3D piece", description: "An interactive 3D scene to play with.", status: "In progress" },
  { title: "Mini game", description: "A small game you can finish in a minute.", status: "In progress" },
];
