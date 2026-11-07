import Link from "next/link";
import { Container, Figure, InkLink } from "@/components/editorial";
import { ObservedChart } from "@/components/observed-chart";
import { ScenarioFan } from "@/components/scenario-fan";
import { StaticLine } from "@/components/static-line";
import { articles } from "@/lib/content/articles";
import { imageById } from "@/lib/content/images";
import { brentSeries, formatPeriod, latestObservation, yieldSeries } from "@/lib/data/series";

const cards = [
  "the-hormuz-question",
  "from-barrel-to-margin",
  "when-yields-move",
  "the-physical-digital-chain",
].map((slug) => articles.find((article) => article.slug === slug)!);

export default function HomePage() {
  const hero = imageById("hero-harbor");
  const brentLatest = latestObservation(brentSeries);
  const yieldLatest = latestObservation(yieldSeries);
  if (!hero) return null;

  return (
    <>
      <Container className="grid items-end gap-10 py-12 md:grid-cols-2 md:py-16">
        <div>
          <p className="text-sm text-[#3f4651]">November 2026 edition</p>
          <h1 className="mt-5 font-display text-[3.3rem] leading-[0.9] font-semibold tracking-[-0.03em] text-balance md:text-[5.15rem]">
            Understand the shift.
            <br />
            Test the opportunity.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#3f4651]">
            Independent macro research. Transparent scenarios.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <InkLink href="/topics/energy">Explore the research</InkLink>
            <Link href="/topics/energy/the-hormuz-question" className="text-sm underline underline-offset-4">
              Read the Hormuz question
            </Link>
          </div>
        </div>
        <Figure image={hero} priority />
      </Container>

      <div className="border-y border-[#e4e6ea]">
        <Container className="grid md:grid-cols-3">
          <Link href="/topics/energy" className="flex min-h-16 items-center border-[#e4e6ea] py-4 md:border-r md:pr-8">
            <span className="font-medium">Energy</span>
            <span className="ml-3 text-sm text-[#3f4651]">Oil, the Gulf, and a margin</span>
          </Link>
          <Link href="/topics/rates-inflation" className="flex min-h-16 items-center border-[#e4e6ea] py-4 md:border-r md:px-8">
            <span className="font-medium">Rates & inflation</span>
            <span className="ml-3 text-sm text-[#3f4651]">One bond yield, made explicit</span>
          </Link>
          <Link href="/topics/digital-infrastructure" className="flex min-h-16 items-center py-4 md:pl-8">
            <span className="font-medium">Digital infrastructure</span>
            <span className="ml-3 text-sm text-[#3f4651]">Definitions, no live series</span>
          </Link>
        </Container>
      </div>

      <Container className="py-14">
        <h2 className="font-display text-4xl font-semibold">Latest research</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3f4651]">
          Materials, food, and currencies are not published in this edition, so they are not listed here.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {cards.map((article) => {
            const image = article.imageId ? imageById(article.imageId) : undefined;
            return (
              <article key={article.id} className="flex flex-col border border-[#e4e6ea]">
                {image ? (
                  <Figure image={image} />
                ) : article.topicId === "rates-inflation" ? (
                  <div className="border-b border-[#e4e6ea] p-4">
                    <StaticLine
                      values={yieldSeries.points.map((point) => point.value)}
                      label="Euro area 10-year yield"
                      caption={`Observed, ${formatPeriod(yieldSeries.points[0].period)}–${formatPeriod(yieldLatest.period)}. ECB. Not a forecast.`}
                    />
                  </div>
                ) : (
                  <div className="border-b border-[#e4e6ea] p-4 text-sm leading-relaxed text-[#3f4651]">
                    No observed series is plotted for this essay. It names the units and the official pages, and it does not invent a current reading.
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-[#3f4651]">
                    {image ? image.label : article.topicId === "rates-inflation" ? "Observed series" : "No series plotted"}
                  </p>
                  <h3 className="mt-2 text-xl font-medium">
                    <Link href={`/topics/${article.topicId}/${article.slug}`} className="underline-offset-4 hover:underline">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3f4651]">{article.deck}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>

      <Container className="grid gap-12 border-t border-[#e4e6ea] py-14 lg:grid-cols-2">
        <ObservedChart
          title="Brent crude"
          unit="USD per barrel, nominal monthly average"
          points={brentSeries.points.map((point) => ({ period: point.period, value: point.value }))}
          digits={1}
          caption={`World Bank Pink Sheet, UK Brent 38° API. Workbook updated 3 November 2026, retrieved 7 November 2026. Latest month in this snapshot: ${formatPeriod(brentLatest.period)}, ${brentLatest.value}. Not a live spot price.`}
        />
        <ObservedChart
          title="Euro area 10-year yield"
          unit="Percent per annum"
          points={yieldSeries.points.map((point) => ({ period: point.period, value: point.value }))}
          digits={2}
          caption={`ECB series FM.M.U2.EUR.4F.BB.U2_10Y.YLD, government benchmark bond yield. Retrieved 7 November 2026. Latest month: ${formatPeriod(yieldLatest.period)}, ${yieldLatest.value.toFixed(3)}%. Not the policy rate and not live.`}
        />
      </Container>

      <Container className="pb-4">
        <div className="grid items-center gap-8 border border-[#e4e6ea] p-6 md:grid-cols-2 md:p-8">
          <div>
            <p className="text-sm text-[#3f4651]">Scenario lab</p>
            <h2 className="mt-2 font-display text-4xl leading-none font-semibold">Make the assumptions visible.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#3f4651]">
              The drawing has no scale. The calculators do. Oil returns a change in operating profit. Bonds return a duration sketch. Neither one is a forecast.
            </p>
            <div className="mt-6">
              <InkLink href="/models">Explore the models</InkLink>
            </div>
          </div>
          <ScenarioFan caption="Illustrative sketch. No numeric scale, no observed history, and not a forecast. Square marks Scenario A. Diamond marks Scenario B." />
        </div>
      </Container>
    </>
  );
}
