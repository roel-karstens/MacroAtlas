import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/editorial";
import { sources } from "@/lib/content/sources";
import { getSupabasePublicStatus } from "@/lib/supabase/status";

export const metadata: Metadata = { title: "Sources" };

export default function SourcesPage() {
  const database = getSupabasePublicStatus();

  return (
    <Container className="py-12">
      <PageIntro
        kicker="Sources"
        title="Every number has a retrieval date."
        deck="The running site reads checked-in snapshots. It does not call a market feed. Rights that were not settled are written as unsettled."
      />
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#3f4651]">
        Supabase project {database.projectRef} is the only approved database target. Status: {database.remote.replaceAll("-", " ")}. {database.reasons.join(" ")}
      </p>
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
