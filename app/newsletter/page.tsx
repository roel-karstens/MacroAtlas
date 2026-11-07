import type { Metadata } from "next";
import { Container, PageIntro, TextLink } from "@/components/editorial";

export const metadata: Metadata = { title: "Newsletter" };

export default function NewsletterPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Newsletter"
        title="The list is not open."
        deck="Confirmation mail is not available. No address is collected, stored, or sent."
      />
      <div className="mt-10 max-w-3xl space-y-4 leading-relaxed">
        <p>
          A newsletter would need three things this edition does not have: a dedicated sending domain approved for Macro Atlas, an API key on the server, and a private database for consent. None of those is configured. The product stays off rather than showing a success message.
        </p>
        <p>
          A verified domain that belongs to a different site is not reused as the sender. No test message is sent from this build.
        </p>
        <p>
          When those pieces exist, the intended path is double opt-in: a request stays pending until a confirmation link is used, and unsubscribe does not require a further marketing message. That path is written and tested against a fake provider. It is not wired to the public routes. Those routes answer that the service is not configured.
        </p>
        <p>
          Until then, the research itself is the edition. Start with <TextLink href="/topics/energy/the-hormuz-question">the Hormuz question</TextLink> or the <TextLink href="/models">models</TextLink>.
        </p>
      </div>
    </Container>
  );
}
