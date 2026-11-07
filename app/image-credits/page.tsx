import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/editorial";
import { images } from "@/lib/content/images";

export const metadata: Metadata = { title: "Image credits" };

export default function ImageCreditsPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Image credits"
        title="What the pictures are."
        deck="The photographs in the design studies were generated for this edition. They are labeled on the page. They are not news pictures and not evidence of a place."
      />
      <div className="mt-10 space-y-8">
        {images.map((image) => (
          <article key={image.id} className="border-t border-[#e4e6ea] pt-6">
            <h2 className="text-xl font-medium">{image.label}</h2>
            <p className="mt-2 text-sm text-[#3f4651]">{image.src}</p>
            <p className="mt-3 max-w-3xl leading-relaxed">{image.credit}</p>
            <p className="mt-2 text-sm">License: {image.license}</p>
            <p className="mt-2 text-sm text-[#3f4651]">Placement: {image.placements.join("; ")}. The on-image label is required.</p>
            <p className="mt-2 text-sm text-[#3f4651]">Alt text: {image.alt}</p>
          </article>
        ))}
      </div>
      <section className="mt-12 max-w-3xl border-t border-[#e4e6ea] pt-8">
        <h2 className="text-xl font-medium">Type</h2>
        <p className="mt-3 leading-relaxed">
          Headlines use Barlow Condensed. Text uses Barlow. Both are the Barlow family, copyright 2017 The Barlow Project Authors, licensed under the SIL Open Font License 1.1. The license text is in licenses/barlow-OFL.txt. next/font downloads the files at build time. The fonts are not sold separately.
        </p>
        <p className="mt-3 leading-relaxed">
          The map coastline is not a photograph. It is Natural Earth land data, public domain. Credit is also on the atlas and in Sources.
        </p>
        <p className="mt-3 leading-relaxed">Charts are drawn in the page from code. They are not image files.</p>
      </section>
    </Container>
  );
}
