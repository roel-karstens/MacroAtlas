import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { environmentBlockers, routeBlockers, senderRefusal, unconfiguredNewsletterResponse } from "@/lib/newsletter/status";
import {
  confirmSubscription,
  hashToken,
  requestSubscribe,
  unsubscribe,
  type Sender,
  type Subscriber,
  type SubscriberStore,
} from "@/lib/newsletter/service";

const configured = {
  RESEND_ENABLED: "true",
  RESEND_API_KEY: "test_key",
  RESEND_FROM: "Macro Atlas <news@example.com>",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "test_service_role",
  NODE_ENV: "test",
};

function memoryStore(): SubscriberStore & { all: Subscriber[] } {
  const all: Subscriber[] = [];
  return {
    all,
    getByEmail: (email) => all.find((item) => item.email === email),
    put: (subscriber) => {
      const index = all.findIndex((item) => item.email === subscriber.email);
      if (index === -1) all.push(subscriber);
      else all[index] = subscriber;
    },
    getByConfirmHash: (hash) => all.find((item) => item.confirmTokenHash === hash),
    getByUnsubscribeHash: (hash) => all.find((item) => item.unsubscribeTokenHash === hash),
  };
}

function deps(overrides?: { send?: Sender["send"] }) {
  const store = memoryStore();
  const sender: Sender = { send: overrides?.send ?? vi.fn(async () => ({ data: { id: "msg_1" }, error: null })) };
  return {
    store,
    sender,
    env: configured,
    limiter: { allow: () => true },
    newTokens: () => ({ confirm: "confirm-token", unsubscribe: "unsubscribe-token" }),
  };
}

describe("newsletter configuration", () => {
  it("stays unconfigured with an empty environment and does not describe a success", () => {
    const response = unconfiguredNewsletterResponse({});
    expect(response.status).toBe(503);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toMatch(/no email was sent/i);
    expect(response.body.reasons.join(" ")).toMatch(/RESEND_API_KEY/);
  });

  it("rejects puurwatt.nl even when every other variable is present", () => {
    const reasons = environmentBlockers({
      ...configured,
      RESEND_FROM: "Atlas <desk@puurwatt.nl>",
    });
    expect(reasons.join(" ")).toMatch(/puurwatt\.nl/);
    expect(senderRefusal({ ...configured, RESEND_FROM: "desk@puurwatt.nl", NODE_ENV: "production" })).toMatch(/puurwatt/);
  });

  it("refuses the real sender helper during tests", () => {
    expect(senderRefusal(configured)).toMatch(/test environment/);
  });

  it("keeps the HTTP route hard-disabled and the SDK wrapper explicit", () => {
    expect(routeBlockers(configured).join(" ")).toMatch(/does not connect a Resend client/);
    const route = readFileSync("app/api/newsletter/subscribe/route.ts", "utf8");
    const sender = readFileSync("lib/newsletter/resend-sender.ts", "utf8");
    expect(route).not.toMatch(/new Resend|emails\.send/);
    expect(sender).toContain("idempotencyKey");
    expect(sender).toContain("result.error");
    expect(sender).not.toMatch(/from:\s*["'][^"']*puurwatt\.nl/);
  });
});

describe("double opt-in state machine", () => {
  it("does not store or send when the environment is empty", async () => {
    const kit = deps();
    const result = await requestSubscribe(
      { email: "reader@example.com", consent: true, honeypot: "" },
      { ...kit, env: {} },
    );
    expect(result.code).toBe("unconfigured");
    expect(kit.sender.send).not.toHaveBeenCalled();
    expect(kit.store.all).toHaveLength(0);
  });

  it("leaves a new request pending and checks the provider error", async () => {
    const kit = deps();
    const result = await requestSubscribe(
      { email: "Reader@Example.com", consent: true, honeypot: "" },
      kit,
    );
    expect(result.ok).toBe(true);
    expect(result.status).toBe("pending");
    expect(result.message).toMatch(/not subscribed/i);
    expect(kit.store.all[0]?.status).toBe("pending");
    expect(kit.store.all[0]?.providerMessageId).toBe("msg_1");
    const sendMock = kit.sender.send as ReturnType<typeof vi.fn>;
    expect(sendMock.mock.calls[0]?.[0].idempotencyKey).toMatch(/^newsletter-confirm:/);
    expect(sendMock.mock.calls[0]?.[0].to).toBe("reader@example.com");

    const again = await requestSubscribe({ email: "reader@example.com", consent: true, honeypot: "" }, kit);
    expect(again.code).toBe("already_pending");
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("does not report success when the provider returns an error", async () => {
    const kit = deps({
      send: vi.fn(async () => ({ data: null, error: { message: "domain not verified", name: "validation_error" } })),
    });
    const result = await requestSubscribe({ email: "reader@example.com", consent: true, honeypot: "" }, kit);
    expect(result.ok).toBe(false);
    expect(result.code).toBe("provider_error");
    expect(result.message).not.toMatch(/subscribed/i);
    expect(kit.store.all[0]?.providerMessageId).toBeNull();
  });

  it("confirms only with the token and unsubscribes without sending mail", async () => {
    const kit = deps();
    await requestSubscribe({ email: "reader@example.com", consent: true, honeypot: "" }, kit);
    const confirmed = confirmSubscription("confirm-token", kit);
    expect(confirmed.status).toBe("confirmed");
    expect(kit.store.getByConfirmHash(hashToken("confirm-token"))?.status).toBe("confirmed");
    const removed = unsubscribe("unsubscribe-token", kit);
    expect(removed.status).toBe("unsubscribed");
    expect(kit.sender.send).toHaveBeenCalledTimes(1);
    expect(confirmSubscription("missing", kit).code).toBe("invalid_token");
  });

  it("ignores a honeypot and refuses missing consent without storing mail", async () => {
    const kit = deps();
    const trapped = await requestSubscribe(
      { email: "bot@example.com", consent: true, honeypot: "filled" },
      kit,
    );
    expect(trapped.code).toBe("ignored");
    const refused = await requestSubscribe(
      { email: "reader@example.com", consent: false, honeypot: "" },
      kit,
    );
    expect(refused.code).toBe("consent_required");
    expect(kit.store.all).toHaveLength(0);
    expect(kit.sender.send).not.toHaveBeenCalled();
  });
});
