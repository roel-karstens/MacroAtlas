import "server-only";
import { Resend } from "resend";
import { senderRefusal, type NewsletterEnv } from "@/lib/newsletter/status";
import type { SendInput, SendResult } from "@/lib/newsletter/service";

/**
 * Server-only Resend adapter.
 * emails.send returns { data, error }. A missing id is treated as failure.
 * The Idempotency-Key header is set from the second argument.
 * This module is not imported by the public routes in this build.
 */
export async function sendNewsletterConfirmation(input: SendInput, env: NewsletterEnv): Promise<SendResult> {
  const refusal = senderRefusal(env);
  if (refusal) return { data: null, error: { message: refusal, name: "refused" } };
  if (/puurwatt\.nl/i.test(input.from)) {
    return {
      data: null,
      error: { message: "puurwatt.nl is not an approved Macro Atlas sender.", name: "blocked_sender" },
    };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const result = await resend.emails.send(
    {
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
    },
    { idempotencyKey: input.idempotencyKey },
  );

  if (result.error) {
    return { data: null, error: { message: result.error.message, name: result.error.name } };
  }
  if (!result.data?.id) {
    return { data: null, error: { message: "Resend returned no message id.", name: "missing_id" } };
  }
  return { data: { id: result.data.id }, error: null };
}
