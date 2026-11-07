import Link from "next/link";
import { ChoroplethMap } from "@/components/choropleth-map";
import { Container } from "@/components/editorial";
import { sliceRows, countrySum } from "@/lib/data/crop-atlas";
import { wheatTradeFacts } from "@/lib/data/wheat-story";
import { pageMetadata } from "@/lib/content/seo";
import { formatNumber } from "@/lib/format";

export const metadata = pageMetadata({
  description:
    "Where do prices come from? Dated explainers on oil, wheat, computing and bond yields, with calculators you can check. Not investment advice.",
  path: "/",
});

const questions = [
  { kicker: "Food", href: "/topics/food-agriculture/why-the-grocery-bill-lags", label: "Why the grocery bill does not fall when world prices do" },
  { kicker: "Food", href: "/topics/food-agriculture/where-wheat-comes-from", label: "Where the world’s wheat comes from" },
  { kicker: "Energy", href: "/models/oil-exposure", label: "What a $20 oil move does to an operating profit" },
  { kicker: "Rates", href: "/models/bond-sensitivity", label: "What a 1-point yield rise does to a bond" },
  { kicker: "Digital", href: "/topics/digital-infrastructure/the-physical-digital-chain", label: "What physically limits computing: chips, power or networks" },
];

export default function HomePage() {
  const facts = wheatTradeFacts();
  const russia = facts.exporters[0];
  const ukraine = facts.exporters.find((row) => row.iso3 === "UKR")!;
  const rows = sliceRows("wheat", "export-quantity", 2024);

  return (
    <>
      <Container className="grid items-end gap-10 py-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:py-16">
        <div>
          <p className="text-sm font-medium tracking-wide text-[#8a5a12]">A guide to the physical economy</p>
          <h1 className="mt-4 font-display text-[3.4rem] leading-[0.9] font-semibold tracking-[-0.03em] text-balance md:text-7xl">
            Where do prices come from?
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#3f4651]">
            Oil, wheat and chips depend on wells, fields, factories and ports. Macro Atlas explains those connections — and shows how interest rates affect bond prices — with dated evidence and calculators you can check.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/topics" className="inline-flex min-h-11 items-center bg-[#15191f] px-4 text-sm text-[#f6f3ec]">
              Start with a question
            </Link>
            <Link href="/atlas" className="inline-flex min-h-11 items-center border border-[#15191f] px-4 text-sm">
              Open the atlas
            </Link>
          </div>
        </div>
        <aside className="border border-[#d9d3c6] bg-white p-5">
          <h2 className="text-xs font-medium tracking-wide text-[#8a5a12]">Questions answered here</h2>
          <ul className="mt-3 divide-y divide-[#d9d3c6]">
            {questions.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-11 items-baseline gap-3 py-2 text-sm leading-snug underline-offset-4 hover:underline">
                  <span className="w-16 shrink-0 text-[#8a5a12]">{item.kicker}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </Container>

      <Container className="pb-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-4xl font-semibold">Wheat exports, 2024</h2>
          <p className="text-sm text-[#3f4651]">From the atlas · four crops, plus Gulf oil terminals</p>
        </div>
        <p className="mt-3 max-w-3xl leading-relaxed">
          Six countries reported {formatNumber(facts.top6Share2024, 1)}% — about two thirds — of all reported wheat export tonnes in 2024. Russia’s share rose from {formatNumber(russia.share2021, 1)}% in 2021 to {formatNumber(russia.share2024, 1)}%; Ukraine’s went from {formatNumber(ukraine.share2021, 1)}% to {formatNumber(ukraine.share2024, 1)}%.
        </p>
        <figure className="mt-6 border border-[#d9d3c6] bg-white p-3 md:p-5">
          <ChoroplethMap
            rows={rows}
            total={countrySum(rows)}
            outlineIsos={["RUS", "UKR"]}
            label="Share of reported wheat export tonnes in 2024. Equirectangular Natural Earth map."
          />
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 text-[12px] leading-snug text-[#3f4651]">
            <ul className="flex max-w-3xl flex-wrap gap-x-3 gap-y-1">
              <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#d9e7f1]" /> under 1%</li>
              <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#9fc3de]" /> 1–3%</li>
              <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#4f8bb8]" /> 3–8%</li>
              <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#1f5582]" /> 8–15%</li>
              <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#0b2a4a]" /> 15% or more</li>
              <li className="flex items-center gap-1"><span className="inline-block size-3 bg-[#efece6]" /> no figure</li>
              <li className="flex items-center gap-1"><span className="inline-block size-3 border-2 border-[#c8461f] bg-white" /> Russia, Ukraine outlined</li>
            </ul>
            <Link href="/atlas#crops" className="inline-flex min-h-11 items-center text-sm font-medium text-[#15191f] underline underline-offset-4">
              Explore the atlas
            </Link>
          </div>
          <figcaption className="mt-3 text-[12px] leading-relaxed text-[#3f4651]">
            Source: FAOSTAT Trade (TCL), export quantity, calendar year 2024, share of the sum of reported exports (can include re-exports; not bilateral flows or import dependency). Licence CC BY 4.0. Ukraine’s 2021 and 2024 figures are not a like-for-like territory; this file does not state how occupied areas were treated. Snapshot retrieved 7 November 2026, not live. Map: Natural Earth 1:110m.
          </figcaption>
        </figure>
      </Container>

      <Container className="py-14">
        <h2 className="font-display text-4xl font-semibold">Start with a question</h2>
        <div className="mt-8 grid gap-px border border-[#d9d3c6] bg-[#d9d3c6] md:grid-cols-2">
          <QuestionCard
            kicker="Food · explainer"
            title="Why doesn’t my grocery bill fall when world food prices do?"
            figure="+33.6%"
            body="Euro-area food prices, Jan 2020 → Sep 2026 (Eurostat HICP, food). Annual food inflation in September 2026 is 1.1% — slower, not lower."
            href="/topics/food-agriculture/why-the-grocery-bill-lags"
            action="Read the answer"
          />
          <QuestionCard
            kicker="Energy · calculator"
            title="What does a $20 oil move do to a company’s profit?"
            figure="$18m"
            body="Illustrative producer: 10,000 barrels a day × 90 days × $20. Full pass-through, FX 1, no extra costs. Change every input yourself."
            href="/models/oil-exposure"
            action="Open the oil calculator"
          />
          <QuestionCard
            kicker="Rates · calculator"
            title="What does a 1-point rise in yields do to a bond?"
            figure="≈ −7%"
            body="Illustrative bond: modified duration 7, +100 basis points, before carry and convexity. An approximation, shown with its formula."
            href="/models/bond-sensitivity"
            action="Open the bond calculator"
          />
          <QuestionCard
            kicker="Energy · explainer and map"
            title="What is actually at stake at Hormuz?"
            body="Terminals, pipelines and the passage — who is exposed, and what would invalidate the story."
            href="/topics/energy/the-hormuz-question"
            action="Read"
          />
          <QuestionCard
            kicker="Digital · explainer"
            title="What physically limits AI: chips, power or networks?"
            body="Chips, power and networks constrain computing in different ways. Follow the chain and check the evidence."
            href="/topics/digital-infrastructure/the-physical-digital-chain"
            action="Read"
          />
        </div>
      </Container>

      <Container className="pb-8">
        <h2 className="font-display text-4xl font-semibold">How to read this site</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <p><span className="font-medium text-[#15191f]">Answer first.</span> Each page opens with a short answer, then the data and the chain behind it.</p>
          <p><span className="font-medium text-[#15191f]">Dated, not live.</span> Every chart names its source, release and unit. Figures are snapshots, not live feeds.</p>
          <p><span className="font-medium text-[#15191f]">Checkable.</span> Calculators show their formula and run in your browser. Nothing here is investment advice.</p>
        </div>
      </Container>
    </>
  );
}

function QuestionCard({
  kicker,
  title,
  figure,
  body,
  href,
  action,
}: {
  kicker: string;
  title: string;
  figure?: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <article className="flex flex-col bg-[#f6f3ec] p-6">
      <p className="text-xs font-medium tracking-wide text-[#8a5a12]">{kicker}</p>
      <h3 className="mt-2 text-xl font-medium leading-snug">
        <Link href={href} className="underline-offset-4 hover:underline">
          {title}
        </Link>
      </h3>
      {figure ? <p className="mt-3 font-display text-5xl font-semibold text-[#c8461f]">{figure}</p> : null}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#3f4651]">{body}</p>
      <Link href={href} className="mt-4 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">
        {action}
      </Link>
    </article>
  );
}
