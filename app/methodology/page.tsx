import type { Metadata } from "next";
import { Container, PageIntro, TextLink } from "@/components/editorial";

export const metadata: Metadata = { title: "Methodology" };

export default function MethodologyPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Methodology"
        title="What is calculated, and what is only drawn."
        deck="This edition separates observed snapshots, schematic geography, and scenarios you type. It does not blend them into one chart and call the result live."
      />
      <div className="mt-10 max-w-3xl space-y-8 leading-relaxed">
        <section>
          <h2 className="text-2xl font-medium">Oil, operating profit</h2>
          <p className="mt-3">
            Change in operating profit = barrels per day × days × price change per barrel × pass-through × reporting-currency units per 1 USD − extra costs. Positive barrels are a net producer. Negative barrels are a net consumer. Pass-through is between 0 and 1. The price change is an assumption. Vessel counts do not set it. The result is not a share price.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Bonds</h2>
          <p className="mt-3">
            Duration price effect = − modified duration × Δy, with Δy in decimal. 100 basis points and 1 percentage point are both 0.01. Duration 7 and +100 basis points is a −7% price effect before carry and convexity. Convexity, when you turn it on, adds ½ × convexity × (Δy)². A convexity of 60 at that same shift adds 0.30 percentage points. Carry is the annual yield times the horizon in years, simple, not compounded. The total-return sketch subtracts costs entered in basis points of return. Twenty basis points is 0.002, not 0.20.
          </p>
          <p className="mt-3">
            The form asks for modified duration. It does not convert Macaulay duration. The starting yield is not the central-bank policy rate. Duration 8 and the same +100 basis points is a −8% price effect before carry and convexity. The ECB euro area 10-year series is not included.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Digital infrastructure</h2>
          <p className="mt-3">
            The chain drawing is a schematic. Dashed links are dependencies, not measured electricity or traffic. Data-center electricity uses only years stated by the IEA Energy and AI report, which states Licence CC BY 4.0, and by the LBNL-2001637 executive summary. The world chart is a Macro Atlas derivation of those stated anchors, not an IEA graphic. The IEA lift-off mark is a lower bound, labeled &gt;1,700 TWh, because the report says exceeding 1,700. The United States chart plots cited LBNL anchors and is not a copy of an LBNL figure or table. Inference prices use four endpoints stated in the Stanford 2025 AI Index, plotted separately. A dashed connector compares the two reported endpoints of one threshold. It is not a monthly price path, and it is not the report figure. MMLU at 64.8 and GPQA above 50% stay separate tests. The token-mix box is arithmetic you type, not a market. Input 1 and output 7 give 2.5. No year is filled in between reported marks.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Food</h2>
          <p className="mt-3">
            The food dossier keeps the FAO nominal commodity index on its own axis and Eurostat’s euro-area food index on another. Values from the FAO file are not rescaled. Eurostat’s annual rates are the published rates, not a formula rerun. A ratio between two Eurostat index months is labelled as ours. Inflation is a percent change. The price level is the index. A peak-date comparison is not a pass-through estimate. Read <TextLink href="/topics/food-agriculture/why-the-grocery-bill-lags">why the grocery bill lags</TextLink>.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Charts</h2>
          <p className="mt-3">
            Model curves are dashed. Electricity estimates and scenario anchors use different marks. Illustrative fans on the home page and on the Hormuz essay have no numeric scale and say so. Axes state units. A table is available on the interactive charts. No uncertainty band is drawn, because this edition does not estimate probabilities. The Pink Sheet Brent column and the ECB 10-year yield are not plotted.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Map</h2>
          <p className="mt-3">
            The atlas is an equirectangular schematic of a Gulf window. Land is Natural Earth 1:10m, public domain, clipped and simplified on 7 November 2026. Place coordinates come from Wikipedia pages retrieved that day and are place or port points, not surveyed berths. The Hormuz corridor and the Habshan–Fujairah line are schematic geometries. The East–West pipeline is described and not drawn. Cable is a reserved mode with no objects. No capacity, flow, or AIS track is published.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Stale on purpose</h2>
          <p className="mt-3">
            Brent and the euro area 10-year yield are omitted because their redistribution terms are not settled. Older commits may still contain those files. This edition does not. If a figure is not in <TextLink href="/sources">Sources</TextLink>, it is not a claim of this edition.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">What this is not</h2>
          <p className="mt-3">
            Not investment advice, not a personal recommendation, and not a forecast. No performance record is claimed because none is kept. Calculations that you save stay in your browser.
          </p>
        </section>
      </div>
    </Container>
  );
}
