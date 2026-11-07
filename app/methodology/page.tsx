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
            The form asks for modified duration. It does not convert Macaulay duration. The starting yield is not the central-bank policy rate. The observed series is the ECB euro area 10-year government benchmark bond yield, monthly, percent per annum.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Digital infrastructure</h2>
          <p className="mt-3">
            The chain drawing is a schematic. Dashed links are dependencies, not measured electricity or traffic. Data-center electricity uses only years stated by the IEA report page and by the LBNL-2001637 executive summary. Inference prices use four endpoints stated in the Stanford 2025 AI Index for two separate thresholds. The token-mix box is arithmetic you type, not a market. No year is filled in between reported marks.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-medium">Charts</h2>
          <p className="mt-3">
            Solid lines are observed snapshots. Dashed lines are scenarios or model curves. Illustrative fans on the home page and on the Hormuz essay have no numeric scale and say so. Axes state units. A table is available on the interactive charts. No uncertainty band is drawn, because this edition does not estimate probabilities.
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
            Brent runs through October 2026 in a workbook marked updated on 3 November 2026, retrieved here on 7 November 2026. The yield series ends in October 2026, same retrieval day. Neither chart is live. If a figure is not in <TextLink href="/sources">Sources</TextLink>, it is not a claim of this edition.
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
