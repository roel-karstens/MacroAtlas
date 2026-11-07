import Link from "next/link";
import { Container, Figure, InkLink } from "@/components/editorial";
import { ScenarioFan } from "@/components/scenario-fan";
import { articles } from "@/lib/content/articles";
import { imageById } from "@/lib/content/images";
import { SeriesNotice, brentUnavailable, yieldUnavailable } from "@/components/series-notice";

const cards = [
  "the-hormuz-question",
  "from-barrel-to-margin",
  "when-yields-move",
  "the-physical-digital-chain",
].map((slug) => articles.find((article) => article.slug === slug)!);

export default function HomePage() {
  const hero = imageById("hero-harbor");
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
        <Container className="grid md:grid-cols-2 xl:grid-cols-4">
          <Link href="/topics/energy" className="flex min-h-16 items-center border-[#e4e6ea] py-4 md:border-r md:pr-8">
            <span className="font-medium">Energy</span>
            <span className="ml-3 text-sm text-[#3f4651]">Oil, the Gulf, and a margin</span>
          </Link>
          <Link href="/topics/rates-inflation" className="flex min-h-16 items-center border-[#e4e6ea] py-4 md:border-r md:px-8">
            <span className="font-medium">Rates & inflation</span>
            <span className="ml-3 text-sm text-[#3f4651]">One bond yield, made explicit</span>
          </Link>
          <Link href="/topics/digital-infrastructure" className="flex min-h-16 items-center border-[#e4e6ea] py-4 md:border-r md:px-8">
            <span className="font-medium">Digital infrastructure</span>
            <span className="ml-3 text-sm text-[#3f4651]">Definitions, no live series</span>
          </Link>
          <Link href="/topics/food-agriculture" className="flex min-h-16 items-center py-4 md:pl-8">
            <span className="font-medium">Food & agriculture</span>
            <span className="ml-3 text-sm text-[#3f4651]">Cargo price, then the bill</span>
          </Link>
        </Container>
      </div>

      <Container className="py-14">
        <h2 className="font-display text-4xl font-semibold">Latest research</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3f4651]">
          Materials and currencies are not published. Food is. The essay does not plot an index.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {cards.map((article) => {
            const image = article.imageId ? imageById(article.imageId) : undefined;
            return (
              <article key={article.id} className="flex flex-col border border-[#e4e6ea]">
                {image ? (
                  <Figure image={image} />
                ) : article.topicId === "food-agriculture" ? (
                  <div className="border-b border-[#e4e6ea] p-4 text-sm leading-relaxed text-[#3f4651]">
                    A world commodity index and the euro-area shop price are different objects, drawn on separate axes.
                  </div>
                ) : article.topicId === "rates-inflation" ? (
                  <div className="border-b border-[#e4e6ea] p-4 text-sm leading-relaxed text-[#3f4651]">
                    The euro area 10-year yield series is not included. The recorded source is ECB/FINANCIAL PROVIDERS, and the third-party exception is not closed. No replacement yield is shown.
                  </div>
                ) : (
                  <div className="border-b border-[#e4e6ea] p-4 text-sm leading-relaxed text-[#3f4651]">
                    No observed series is plotted for this essay. It names the units and the official pages, and it does not invent a current reading.
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-[#3f4651]">
                    {image ? image.label : article.topicId === "food-agriculture" ? "Separate price objects" : "Series not included"}
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
        <SeriesNotice {...brentUnavailable} />
        <SeriesNotice {...yieldUnavailable} />
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
