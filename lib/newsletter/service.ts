import { createHash } from "node:crypto";
import { environmentBlockers, type NewsletterEnv } from "@/lib/newsletter/status";

export type SendInput = {
  from: string;
  to: string;
  subject: string;
  text: string;
  idempotencyKey: string;
};

export type SendResult = {
  data: { id: string } | null;
  error: { message: string; name?: string } | null;
};

export type Sender = {
  send: (input: SendInput) => Promise<SendResult>;
};

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export type Subscriber = {
  email: string;
  status: SubscriberStatus;
  confirmTokenHash: string;
  unsubscribeTokenHash: string;
  providerMessageId: string | null;
  idempotencyKey: string;
  attempt: number;
};

export type SubscriberStore = {
  getByEmail: (email: string) => Subscriber | undefined;
  put: (subscriber: Subscriber) => void;
  getByConfirmHash: (hash: string) => Subscriber | undefined;
  getByUnsubscribeHash: (hash: string) => Subscriber | undefined;
};

export type RateLimiter = {
  allow: (key: string) => boolean;
};

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function idempotencyKeyFor(email: string, attempt: number) {
  return `newsletter-confirm:${hashToken(normalizeEmail(email))}:${attempt}`;
}

export type ServiceDeps = {
  env: NewsletterEnv;
  sender: Sender;
  store: SubscriberStore;
  limiter: RateLimiter;
  newTokens: () => { confirm: string; unsubscribe: string };
};

export type ServiceResult = {
  ok: boolean;
  code: string;
  message: string;
  status?: SubscriberStatus;
  providerMessage?: string;
};

function unconfigured(env: NewsletterEnv): ServiceResult {
  return {
    ok: false,
    code: "unconfigured",
    message: environmentBlockers(env).join(" ") || "Newsletter sending is not configured.",
  };
}

export async function requestSubscribe(
  input: { email: string; consent: boolean; honeypot: string; ipHash?: string },
  deps: ServiceDeps,
): Promise<ServiceResult> {
  if (input.honeypot.trim()) {
    return { ok: true, code: "ignored", message: "Ignored." };
  }
  const blockers = environmentBlockers(deps.env);
  if (blockers.length > 0) return unconfigured(deps.env);
  if (!input.consent) {
    return { ok: false, code: "consent_required", message: "Consent is required before a confirmation can be sent." };
  }
  const email = normalizeEmail(input.email);
  if (!EMAIL.test(email) || email.length > 254) {
    return { ok: false, code: "invalid_email", message: "Enter one email address." };
  }
  if (!deps.limiter.allow(`${hashToken(email)}:${input.ipHash ?? "no-ip"}`)) {
    return { ok: false, code: "rate_limited", message: "Too many attempts. Nothing was sent." };
  }

  const existing = deps.store.getByEmail(email);
  if (existing?.status === "confirmed") {
    return {
      ok: true,
      code: "already_confirmed",
      status: "confirmed",
      message: "This address is already confirmed. No new email was sent.",
    };
  }
  if (existing?.status === "pending" && existing.providerMessageId) {
    return {
      ok: true,
      code: "already_pending",
      status: "pending",
      message: "A confirmation is already pending. No second email was sent.",
    };
  }

  const attempt = existing ? existing.attempt + (existing.providerMessageId || existing.status === "unsubscribed" ? 1 : 0) : 1;
  const tokens = existing && existing.status === "pending" && !existing.providerMessageId
    ? { confirmHash: existing.confirmTokenHash, unsubscribeHash: existing.unsubscribeTokenHash, confirmToken: null as string | null }
    : null;
  const fresh = tokens ? null : deps.newTokens();
  const confirmToken = fresh?.confirm ?? "";
  const confirmTokenHash = tokens?.confirmHash ?? hashToken(fresh?.confirm ?? "");
  const unsubscribeTokenHash = tokens?.unsubscribeHash ?? hashToken(fresh?.unsubscribe ?? "");
  const idempotencyKey = existing && existing.status === "pending" && !existing.providerMessageId
    ? existing.idempotencyKey
    : idempotencyKeyFor(email, attempt);

  const from = deps.env.RESEND_FROM ?? "";
  const record: Subscriber = {
    email,
    status: "pending",
    confirmTokenHash,
    unsubscribeTokenHash,
    providerMessageId: null,
    idempotencyKey,
    attempt: existing && existing.status === "pending" && !existing.providerMessageId ? existing.attempt : attempt,
  };

  const sent = await deps.sender.send({
    from,
    to: email,
    subject: "Confirm your Macro Atlas newsletter request",
    text: fresh
      ? `Confirm this request before any mail is sent as a subscription. Confirmation token: ${confirmToken}`
      : "Confirm this request before any mail is sent as a subscription.",
    idempotencyKey,
  });

  if (sent.error || !sent.data?.id) {
    deps.store.put(record);
    return {
      ok: false,
      code: "provider_error",
      status: "pending",
      message: "The mail provider returned an error. The address is not confirmed and this is not a subscription.",
      providerMessage: sent.error?.message ?? "Resend returned no message id.",
    };
  }

  deps.store.put({ ...record, providerMessageId: sent.data.id });
  return {
    ok: true,
    code: "pending",
    status: "pending",
    message: "Confirmation is required. This address is not subscribed yet.",
  };
}

export function confirmSubscription(token: string, deps: Pick<ServiceDeps, "env" | "store">): ServiceResult {
  if (environmentBlockers(deps.env).length > 0) return unconfigured(deps.env);
  const found = deps.store.getByConfirmHash(hashToken(token));
  if (!found) return { ok: false, code: "invalid_token", message: "This confirmation link is not valid." };
  if (found.status === "unsubscribed") {
    return { ok: false, code: "unsubscribed", status: "unsubscribed", message: "This address is unsubscribed." };
  }
  deps.store.put({ ...found, status: "confirmed" });
  return { ok: true, code: "confirmed", status: "confirmed", message: "The address is confirmed." };
}

export function unsubscribe(token: string, deps: Pick<ServiceDeps, "env" | "store">): ServiceResult {
  if (environmentBlockers(deps.env).length > 0) return unconfigured(deps.env);
  const found = deps.store.getByUnsubscribeHash(hashToken(token));
  if (!found) return { ok: false, code: "invalid_token", message: "This unsubscribe link is not valid." };
  deps.store.put({ ...found, status: "unsubscribed" });
  return { ok: true, code: "unsubscribed", status: "unsubscribed", message: "The address is unsubscribed. No email was sent." };
}
