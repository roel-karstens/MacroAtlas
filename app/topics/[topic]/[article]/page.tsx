import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChainMap } from "@/components/chain-map";
import { ElectricityCharts, InferenceCostChart, TokenMixCalculator } from "@/components/digital-charts";
import { CropAtlas } from "@/components/crop-atlas";
import { EurostatFoodCharts, FaoPriceChart } from "@/components/food-charts";
import { FoodChain } from "@/components/food-chain";
import { FoodComparison } from "@/components/food-comparison";
import { FoodLevelSketch } from "@/components/food-level-sketch";
import { Container, Figure, InkLink, TextLink } from "@/components/editorial";
import { ScenarioFan } from "@/components/scenario-fan";
import { articleBySlug, articles } from "@/lib/content/articles";
import { topicById } from "@/lib/content/topics";
import { imageById } from "@/lib/content/images";
import { modelById } from "@/lib/content/models";
import { sourceById } from "@/lib/content/sources";
import { wikipediaAdaptation } from "@/lib/content/rights";

export function generateStaticParams() {
  return articles.map((article) => ({ topic: article.topicId, article: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; article: string }>;
}): Promise<Metadata> {
  const { topic, article: slug } = await params;
  const article = articleBySlug(topic, slug);
  return { title: article?.title ?? "Research", description: article?.deck };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ topic: string; article: string }>;
}) {
  const { topic, article: slug } = await params;
  const article = articleBySlug(topic, slug);
  if (!article) notFound();
  const image = article.imageId ? imageById(article.imageId) : undefined;
  const model = article.modelId ? modelById(article.modelId) : undefined;

  return (
    <Container className="py-12">
      <p className="text-sm text-[#3f4651]">
        <TextLink href="/topics">Topics</TextLink>
        <span> / </span>
        <TextLink href={`/topics/${article.topicId}`}>{topicById(article.topicId)?.title ?? article.topicId}</TextLink>
      </p>
      <h1 className="mt-6 max-w-4xl font-display text-[3.2rem] leading-[0.92] font-semibold tracking-[-0.03em] md:text-7xl">
        {article.title}
      </h1>
      <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[#3f4651]">{article.deck}</p>
      <p className="mt-4 text-sm text-[#3f4651]">Published {article.published}. Macro Atlas editorial desk. No individual analyst credential is claimed.</p>
      {image ? (
        <div className="mt-8">
          <Figure image={image} priority />
        </div>
      ) : null}
      {article.id === "the-physical-digital-chain" ? (
        <div className="mt-8">
          <ChainMap />
        </div>
      ) : null}
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="space-y-10">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-[#e4e6ea] pt-6">
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <p className="font-display text-3xl font-semibold">{section.kicker}</p>
                <div>
                  <h2 className="text-2xl font-medium">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="mt-3 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  {article.id === "the-physical-digital-chain" && section.id === "data-centers" ? (
                    <div className="mt-6">
                      <ElectricityCharts />
                    </div>
                  ) : null}
                  {article.id === "the-physical-digital-chain" && section.id === "capabilities" ? (
                    <div className="mt-6">
                      <InferenceCostChart />
                      <TokenMixCalculator />
                    </div>
                  ) : null}
                  {article.id === "why-the-grocery-bill-lags" && section.id === "two-prices" ? (
                    <>
                      <FoodComparison />
                      <FaoPriceChart />
                      <EurostatFoodCharts />
                    </>
                  ) : null}
                  {article.id === "why-the-grocery-bill-lags" && section.id === "level" ? (
                    <FoodLevelSketch />
                  ) : null}
                  {article.id === "why-the-grocery-bill-lags" && section.id === "path" ? (
                    <>
                      <FoodChain />
                      <CropAtlas />
                    </>
                  ) : null}
                  {section.links ? (
                    <ul className="mt-4 space-y-2 text-sm">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <TextLink href={link.href}>{link.label}</TextLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
        </div>
        <aside className="border border-[#e4e6ea] bg-[#fafafa] p-5 lg:sticky lg:top-6">
          <h2 className="text-lg font-medium">
            {article.id === "the-hormuz-question" ? "The working hypothesis" : "Where to test it"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3f4651]">
            {article.id === "the-hormuz-question"
              ? "A disruption does not translate directly into a price forecast. The drawing below has no numbers. The model asks you to type a price."
              : article.id === "the-physical-digital-chain"
                ? "The charts cite stated electricity anchors and four separate inference-price endpoints. The token-mix box is arithmetic you type. Oil stays on the energy topic. A financing assumption stays on the bond sketch. Neither one is a chip count."
                : model?.summary}
          </p>
          {article.id === "the-hormuz-question" ? (
            <div className="mt-4">
              <ScenarioFan caption="Illustrative pathways — not observed Hormuz volumes, and not a price forecast." />
            </div>
          ) : null}
          {model ? (
            <div className="mt-5">
              <p className="text-sm leading-relaxed">{model.formula}</p>
              <div className="mt-4">
                <InkLink href={model.href}>
                  {article.id === "the-hormuz-question" ? "Explore the scenario" : "Open the model"}
                </InkLink>
              </div>
            </div>
          ) : null}
          {article.sourceIds.some((id) => id.startsWith("wikipedia-")) ? (
            <p className="mt-6 text-sm leading-relaxed text-[#3f4651]">
              Wikipedia contributors, retrieved 7 November 2026.{" "}
              <a className="underline underline-offset-4" href={wikipediaAdaptation.licenseUrl}>
                {wikipediaAdaptation.licenseName}
              </a>
              . {wikipediaAdaptation.changeNote}
            </p>
          ) : null}
          <h3 className="mt-6 text-sm font-medium">Sources in this essay</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {article.sourceIds.map((id) => {
              const source = sourceById(id);
              if (!source) return null;
              return (
                <li key={id}>
                  <Link href={`/sources#${id}`} className="underline underline-offset-4">
                    {source.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </Container>
  );
}
