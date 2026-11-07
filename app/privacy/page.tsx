import { Container, PageIntro } from "@/components/editorial";
import { pageMetadata } from "@/lib/content/seo";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "What this Macro Atlas build stores: browser calculators only if you ask, no newsletter list, no analytics product in the site code.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Privacy"
        title="What this prototype stores."
        deck="This is a factual description of this build. It is not a claim of production GDPR compliance."
      />
      <div className="mt-10 max-w-3xl space-y-4 leading-relaxed">
        <p>There is no account and no payment. The essays and charts are public pages.</p>
        <p>
          The oil and bond calculators run in your browser. If you check “remember”, the assumptions are written to local storage on that device. You can clear them in the model, or in the browser. They are not sent to a server by this edition.
        </p>
        <p>
          The newsletter form is not open. This site does not ask for an email address, does not store one, and does not send mail. A future double opt-in would need a dedicated sender and a private consent table. Neither is connected. An unrelated sending domain is not used.
        </p>
        <p>
          This build does not query a database. No analytics product and no advertising pixel were added in the site code. Hosting logs, if a host keeps them, are outside this page.
        </p>
      </div>
    </Container>
  );
}
