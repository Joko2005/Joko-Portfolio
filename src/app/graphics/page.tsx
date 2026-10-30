import type { Metadata } from "next";
import { GraphicsGallery } from "@/components/graphics/GraphicsGallery";
import { PageHeader } from "@/components/ui";
import { graphics } from "@/content/graphics";

export const metadata: Metadata = { title: "Graphics" };

export default function GraphicsPage() {
  return (
    <>
      <PageHeader title="Graphics" lead="Pubmats, posters and other graphic design work." count={graphics.length} />
      <div className="reveal">
        <GraphicsGallery items={graphics} />
      </div>
    </>
  );
}
