export type NewsletterEnv = Record<string, string | undefined>;

const BLOCKED_SENDER = /puurwatt\.nl/i;

export function environmentBlockers(env: NewsletterEnv) {
  const reasons: string[] = [];
  if (env.RESEND_ENABLED !== "true") {
    reasons.push("RESEND_ENABLED is not true, so sending stays off.");
  }
  if (!env.RESEND_API_KEY) {
    reasons.push("RESEND_API_KEY is not set.");
  }
  if (!env.RESEND_FROM) {
    reasons.push("RESEND_FROM is not set. A dedicated Macro Atlas sender is required.");
  } else if (BLOCKED_SENDER.test(env.RESEND_FROM)) {
    reasons.push(
      "RESEND_FROM uses puurwatt.nl. That domain belongs to an unrelated site and is not an approved Macro Atlas sender.",
    );
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    reasons.push("Subscriber consent storage is not configured.");
  }
  return reasons;
}

/** This build never attaches a provider or a database, even if env vars appear later. */
export function routeBlockers(env: NewsletterEnv = process.env) {
  return [
    ...environmentBlockers(env),
    "This build does not connect a Resend client or a subscriber store. No address is stored and no email is sent.",
  ];
}

export function unconfiguredNewsletterResponse(env: NewsletterEnv = process.env) {
  return {
    status: 503 as const,
    body: {
      ok: false as const,
      status: "unconfigured" as const,
      message: "Newsletter confirmation is not available. No address was stored and no email was sent.",
      reasons: routeBlockers(env),
    },
  };
}

export function senderRefusal(env: NewsletterEnv) {
  if (env.NODE_ENV === "test") {
    return "Refusing to send email from the test environment.";
  }
  const blockers = environmentBlockers(env);
  if (blockers.length > 0) return blockers[0];
  return null;
}
