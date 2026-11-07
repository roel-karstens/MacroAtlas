import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageIntro, TextLink } from "@/components/editorial";
import { ObservedChart } from "@/components/observed-chart";
import { articlesForTopic } from "@/lib/content/articles";
import { topicById, topics } from "@/lib/content/topics";
import { brentSeries, formatPeriod, latestObservation, yieldSeries } from "@/lib/data/series";

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
  const brentLatest = latestObservation(brentSeries);
  const yieldLatest = latestObservation(yieldSeries);

  return (
    <Container className="py-12">
      <p className="text-sm text-[#3f4651]">
        <TextLink href="/topics">Topics</TextLink>
        <span> / {topic.title}</span>
      </p>
      <div className="mt-6">
        <PageIntro kicker={topic.kicker} title={topic.title} deck={topic.deck} />
      </div>
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
                <ObservedChart
                  title="Brent crude"
                  unit="USD per barrel"
                  points={brentSeries.points.map((point) => ({ period: point.period, value: point.value }))}
                  digits={1}
                  caption={`Observed monthly average. World Bank Pink Sheet. Retrieved 7 November 2026. ${formatPeriod(brentSeries.points[0].period)} to ${formatPeriod(brentLatest.period)}. Latest value ${brentLatest.value}.`}
                />
              </div>
            ) : null}
            {section.id === "track" && topic.id === "rates-inflation" ? (
              <div className="mt-6 max-w-3xl">
                <ObservedChart
                  title="Euro area 10-year government benchmark yield"
                  unit="Percent per annum"
                  points={yieldSeries.points.map((point) => ({ period: point.period, value: point.value }))}
                  digits={2}
                  caption={`Observed. ECB FM.M.U2.EUR.4F.BB.U2_10Y.YLD. Retrieved 7 November 2026. ${formatPeriod(yieldSeries.points[0].period)} to ${formatPeriod(yieldLatest.period)}. Latest value ${yieldLatest.value.toFixed(4)}%. Not the policy rate.`}
                />
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
    </Container>
  );
}
