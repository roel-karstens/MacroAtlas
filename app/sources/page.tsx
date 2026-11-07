import { Container, PageIntro } from "@/components/editorial";
import { sources } from "@/lib/content/sources";
import { codeLicense } from "@/lib/content/rights";
import { pageMetadata } from "@/lib/content/seo";

export const metadata = pageMetadata({
  title: "Sources",
  description: "Retrieval dates and rights notes for every series this edition uses or deliberately leaves out.",
  path: "/sources",
});

export default function SourcesPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Sources"
        title="Every number has a retrieval date."
        deck="Rights that were not settled are written as unsettled. The site does not call a market feed."
      />
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#3f4651]">{codeLicense.note}</p>
      <div className="mt-10 space-y-8">
        {sources.map((source) => (
          <article key={source.id} id={source.id} className="scroll-mt-24 border-t border-[#e4e6ea] pt-6">
            <h2 className="text-2xl font-medium">{source.title}</h2>
            <p className="mt-1 text-sm text-[#3f4651]">
              {source.publisher} · retrieved {source.retrieved}
            </p>
            <p className="mt-3 max-w-3xl leading-relaxed">{source.usedFor}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#3f4651]">{source.rights}</p>
            <p className="mt-3 text-sm">
              <a className="underline underline-offset-4 break-all" href={source.url}>
                {source.url}
              </a>
            </p>
          </article>
        ))}
      </div>
    </Container>
  );
}
