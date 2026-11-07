import { Container, PageIntro, TextLink } from "@/components/editorial";
import { pageMetadata } from "@/lib/content/seo";

export const metadata = pageMetadata({
  title: "About",
  description: "Macro Atlas is an English research prototype: dated explainers on oil, wheat, computing and bond yields. Not investment advice.",
  path: "/about",
});

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
          Macro Atlas explains how oil, wheat and computing depend on wells, fields, factories and ports, and how a yield you type moves a bond price. Food is a dossier: eight FAO index months in a table, Eurostat shop-price charts, and a FAOSTAT crop map. Digital infrastructure charts cited electricity anchors and four inference-price endpoints, plus a token-mix calculator. It does not add a copied monthly market series. The Gulf places and the oil model share location identifiers. Crop countries use ISO codes. The Apache-2.0 license covers original code only. Third-party text, data, and the font have their own terms, listed in <TextLink href="/sources">Sources</TextLink>.
        </p>
        <p>
          No analyst is named, because no personal credential is being offered. There is no client list, no assets under management, no track record, and no testimonial. Financial interests are not disclosed as positions because this prototype does not operate as an advisory book and does not invent one.
        </p>
        <p>
          Nothing on the site is investment advice or a promise of return. Paid access is not for sale here.
        </p>
        <p>
          Other languages are not published. There is no Spanish or Chinese edition, and the navigation does not pretend otherwise. The FAO commodity index and the euro-area grocery index stay separate: a table and charts, not one cause. Materials and currencies are still absent.
        </p>
        <p>
          This running edition does not query a database and does not send newsletter mail. Read the <TextLink href="/privacy">privacy note</TextLink> and the <TextLink href="/sources">sources</TextLink>.
        </p>
      </div>
    </Container>
  );
}
