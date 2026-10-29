// TODO: replace with your pubmats and other graphic design work.
// Set `image` to a /public path (1080 × 1350) once the file is there.
export type Graphic = { title: string; kind: string; image?: string };

export const graphics: Graphic[] = Array.from({ length: 6 }, () => ({
  title: "[Title]",
  kind: "Pubmat",
}));
