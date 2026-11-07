import { AtlasMap } from "@/components/atlas-map";
import { CropAtlas } from "@/components/crop-atlas";
import { Container, PageIntro, TextLink } from "@/components/editorial";
import { pageMetadata } from "@/lib/content/seo";

export const metadata = pageMetadata({
  title: "Atlas",
  description:
    "Two maps: FAOSTAT crops (wheat, maize, sunflower seed and oil) and a schematic of Persian Gulf oil places. No live traffic and no capacities.",
  path: "/atlas",
});

export default function AtlasPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Atlas"
        title="Two maps. Neither one is live."
        deck="Crop tonnes, then the Gulf oil places. Shares are of reported countries. The Gulf drawing has no capacities, flows, or ship tracks."
      />
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <li><a className="underline underline-offset-4" href="#crops">Crop map</a></li>
        <li><a className="underline underline-offset-4" href="#gulf">Gulf oil places</a></li>
      </ul>
      <section id="crops" className="mt-12 scroll-mt-24 border-t border-[#d9d3c6] pt-8">
        <h2 className="font-display text-4xl font-semibold">Where the crops are reported</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-[#3f4651]">
          Wheat, maize, sunflower seed, and crude sunflower oil. Production is not export quantity, and seed is not oil. The world frame is an overview: use a regional frame or the country list when you need a precise country. <TextLink href="/topics/food-agriculture/where-wheat-comes-from">The wheat question</TextLink> compares 2021 and 2024 exports.
        </p>
        <CropAtlas />
      </section>
      <section id="gulf" className="mt-16 scroll-mt-24 border-t border-[#d9d3c6] pt-8">
        <h2 className="font-display text-4xl font-semibold">What is on the Gulf map</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-[#3f4651]">
          Terminals, pipeline endpoints, and the Hormuz passage. Pan, zoom, filter, and select. Reset restores the view, the filters, and clears the selected place. Capacities and flows are not stated.
        </p>
        <div className="mt-6">
          <AtlasMap />
        </div>
      </section>
    </Container>
  );
}
