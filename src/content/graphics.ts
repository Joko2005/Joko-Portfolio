// TODO: replace with your pubmats and other graphic design work.
export type Graphic = { title: string; kind: string };

export const graphics: Graphic[] = Array.from({ length: 6 }, () => ({
  title: "[Title]",
  kind: "Pubmat",
}));
