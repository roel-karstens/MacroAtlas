import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageIntro } from "@/components/editorial";
import { articlesForTopic } from "@/lib/content/articles";
import { topics } from "@/lib/content/topics";

export const metadata: Metadata = { title: "Topics" };

export default function TopicsPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Topics"
        title="Open files."
        deck="Energy is the oil chain. Rates is one yield and a calculator. Digital infrastructure names units and cited anchors. Food separates a world commodity price from the grocery bill. Materials and currencies are not links."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <article key={topic.id} className="border border-[#e4e6ea] p-6">
            <p className="text-sm text-[#3f4651]">{topic.kicker}</p>
            <h2 className="mt-2 font-display text-5xl leading-none font-semibold">
              <Link href={`/topics/${topic.id}`} className="underline-offset-4 hover:underline">
                {topic.title}
              </Link>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#3f4651]">{topic.deck}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {articlesForTopic(topic.id).map((article) => (
                <li key={article.id}>
                  <Link href={`/topics/${topic.id}/${article.slug}`} className="underline underline-offset-4">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Container>
  );
}
