import type { Metadata } from "next";
import { Container, TextLink } from "@/components/editorial";
import { BondModelPanel } from "@/components/bond-model-panel";

export const metadata: Metadata = {
  title: "Bond sensitivity",
  description: "Approximate the price effect of a bond yield move from duration, optional convexity, carry, and costs.",
};

export default function BondModelPage() {
  return (
    <Container className="py-12">
      <p className="text-sm text-[#3f4651]">
        <TextLink href="/models">Models</TextLink>
        <span> / Rates & inflation</span>
      </p>
      <h1 className="mt-5 max-w-3xl font-display text-[3.2rem] leading-[0.92] font-semibold tracking-[-0.03em] md:text-7xl">
        What if yields move?
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#3f4651]">
        Explore bond sensitivity. Make every assumption visible. The form starts at an illustrative 3 percent. It does not copy an official yield.
      </p>
      <div className="mt-10">
        <BondModelPanel />
      </div>
      <section className="mt-12 max-w-3xl border-t border-[#e4e6ea] pt-8">
        <h2 className="font-display text-4xl font-semibold">03 · Methodology and limits</h2>
        <p className="mt-4 leading-relaxed">
          Modified duration is a local approximation. Convexity uses the convention where a value of 60 and a 100 basis point move add 0.30 percentage points. Carry is annual yield times years, not a full horizon return. This is not the ECB policy rate, not a credit spread, and not investment advice. Read <TextLink href="/topics/rates-inflation/when-yields-move">When yields move</TextLink> and the <TextLink href="/methodology">methodology</TextLink>.
        </p>
      </section>
    </Container>
  );
}
