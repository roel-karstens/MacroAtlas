import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/editorial";

export const metadata: Metadata = { title: "Privacy" };

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
        <p>No analytics product was added. No advertising pixel was added.</p>
        <p>
          A Supabase project named Macro Atlas, ref worlgpganiczzjwmapjk, exists for a later connection. This build does not hold a publishable key and does not query that project. A service-role key is not part of the website.
        </p>
      </div>
    </Container>
  );
}
