import type { Metadata } from "next";
import { Container, PageIntro, TextLink } from "@/components/editorial";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="About"
        title="A research prototype, in English."
        deck="Macro Atlas is a provisional name for this edition. It is not a claim that a domain, a trademark, or a company has been cleared."
      />
      <div className="mt-10 max-w-3xl space-y-4 leading-relaxed">
        <p>
          The edition connects a physical oil chain in the Persian Gulf to scenarios you can calculate, and it does the same, more narrowly, for a government bond yield. Essays, the atlas, and the models share one set of identifiers.
        </p>
        <p>
          No analyst is named, because no personal credential is being offered. There is no client list, no assets under management, no track record, and no testimonial. Financial interests are not disclosed as positions because this prototype does not operate as an advisory book and does not invent one.
        </p>
        <p>
          Nothing on the site is investment advice or a promise of return. Paid access is not for sale here.
        </p>
        <p>
          Other languages are not published. There is no Spanish or Chinese edition, and the navigation does not pretend otherwise. Materials, food, and currencies are later subjects only in the sense that they are absent.
        </p>
        <p>
          The database project set aside for a later connection is Supabase project worlgpganiczzjwmapjk, in eu-west-1, named Macro Atlas. This running edition does not query it. Newsletter mail is not sent. Read the <TextLink href="/privacy">privacy note</TextLink> and the <TextLink href="/sources">sources</TextLink>.
        </p>
      </div>
    </Container>
  );
}
