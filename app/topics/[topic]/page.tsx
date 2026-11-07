import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChainMap } from "@/components/chain-map";
import { ElectricityCharts, InferenceCostChart, TokenMixCalculator } from "@/components/digital-charts";
import { Container, Figure, PageIntro, TextLink } from "@/components/editorial";
import { imageById } from "@/lib/content/images";
import { articlesForTopic } from "@/lib/content/articles";
import { topicById, topics } from "@/lib/content/topics";
import { FoodNotes } from "@/components/food-notes";
import { FoodChain } from "@/components/food-chain";
import { SeriesNotice, brentUnavailable, yieldUnavailable } from "@/components/series-notice";

export function generateStaticParams() {
  return topics.map((topic) => ({ topic: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: id } = await params;
  const topic = topicById(id);
  return { title: topic?.title ?? "Topic" };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: id } = await params;
  const topic = topicById(id);
  if (!topic) notFound();
  const essays = articlesForTopic(topic.id);

  return (
    <Container className="py-12">
      <p className="text-sm text-[#3f4651]">
        <TextLink href="/topics">Topics</TextLink>
        <span> / {topic.title}</span>
      </p>
      <div className="mt-6">
        <PageIntro kicker={topic.kicker} title={topic.title} deck={topic.deck} />
      </div>
      {topic.id === "digital-infrastructure" && imageById("digital-hero") ? (
        <div className="mt-8">
          <Figure image={imageById("digital-hero")!} priority />
          <div className="mt-8">
            <ChainMap />
          </div>
        </div>
      ) : null}
      {!topic.sections.some((section) => section.id === "research") && essays.length > 0 ? (
        <ul className="mt-8 max-w-3xl space-y-3 border-t border-[#e4e6ea] pt-6">
          {essays.map((article) => (
            <li key={article.id}>
              <Link href={`/topics/${topic.id}/${article.slug}`} className="text-lg underline underline-offset-4">
                {article.title}
              </Link>
              <p className="mt-1 text-sm text-[#3f4651]">{article.deck}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-12 space-y-12">
        {topic.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-[#e4e6ea] pt-8">
            <p className="text-sm text-[#3f4651]">{section.kicker}</p>
            <h2 className="mt-2 max-w-3xl font-display text-4xl leading-none font-semibold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.id === "track" && topic.id === "energy" ? (
              <div className="mt-6 max-w-3xl">
                <SeriesNotice {...brentUnavailable} />
              </div>
            ) : null}
            {section.id === "track" && topic.id === "rates-inflation" ? (
              <div className="mt-6 max-w-3xl">
                <SeriesNotice {...yieldUnavailable} />
              </div>
            ) : null}
            {topic.id === "digital-infrastructure" && section.id === "data-centers" ? (
              <div className="mt-6 max-w-3xl">
                <ElectricityCharts />
              </div>
            ) : null}
            {topic.id === "food-agriculture" && section.id === "mechanisms" ? (
              <div className="mt-6">
                <FoodChain />
              </div>
            ) : null}
            {topic.id === "digital-infrastructure" && section.id === "capabilities" ? (
              <div className="mt-6 max-w-3xl">
                <InferenceCostChart />
                <TokenMixCalculator />
              </div>
            ) : null}
            {section.id === "research" ? (
              <ul className="mt-5 space-y-3">
                {essays.map((article) => (
                  <li key={article.id}>
                    <Link href={`/topics/${topic.id}/${article.slug}`} className="text-lg underline underline-offset-4">
                      {article.title}
                    </Link>
                    <p className="mt-1 max-w-2xl text-sm text-[#3f4651]">{article.deck}</p>
                  </li>
                ))}
              </ul>
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
          </section>
        ))}
      </div>
      {topic.id === "food-agriculture" ? <FoodNotes /> : null}
    </Container>
  );
}
