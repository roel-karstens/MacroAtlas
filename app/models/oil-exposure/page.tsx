import type { Metadata } from "next";
import { Container, TextLink } from "@/components/editorial";
import { OilModelPanel } from "@/components/oil-model-panel";

export const metadata: Metadata = {
  title: "Oil exposure",
  description: "Compute a change in operating profit from an unhedged oil position and a price scenario you choose.",
};

export default function OilModelPage() {
  return (
    <Container className="py-12">
      <p className="text-sm text-[#3f4651]">
        <TextLink href="/models">Models</TextLink>
        <span> / Energy</span>
      </p>
      <h1 className="mt-5 max-w-3xl font-display text-[3.2rem] leading-[0.92] font-semibold tracking-[-0.03em] md:text-7xl">
        What if the barrel moves?
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#3f4651]">
        Set the horizon, the price change, and the unhedged barrels. The result is a change in operating profit, not a share price. The defaults are an illustration: 10,000 barrels a day, 90 days, and +10 USD per barrel. Change only the price to +20 and, with full pass-through and books in dollars, the result is 18 million USD.
      </p>
      <div className="mt-10">
        <OilModelPanel />
      </div>
      <section className="mt-12 max-w-3xl border-t border-[#e4e6ea] pt-8">
        <h2 className="font-display text-4xl font-semibold">03 · What this leaves out</h2>
        <p className="mt-4 leading-relaxed">
          Taxes, royalties, volume responses, and basis beyond the pass-through factor are outside the identity. Hedges should already be removed from the barrel input. There is no network solver and no implied price from the atlas. See the <TextLink href="/methodology">methodology</TextLink> and the essay <TextLink href="/topics/energy/from-barrel-to-margin">From barrel to margin</TextLink>.
        </p>
      </section>
    </Container>
  );
}
