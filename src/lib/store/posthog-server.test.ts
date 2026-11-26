import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { PreorderRow } from "./db";

const captured: unknown[] = [];
const flushes = { count: 0 };
const shouldFlushThrow = { value: false };

/* posthog-node opens a real HTTP client, so it is mocked — but the mock records
   what the module ACTUALLY passed it, so these assert behaviour rather than
   restating the source (the §8.38 lesson: a source grep counts occurrences and
   passes while one of them sits in the wrong function). */
vi.mock("posthog-node", () => ({
  PostHog: class {
    constructor(
      public key: string,
      public options: Record<string, unknown>,
    ) {}
    capture(message: unknown) {
      captured.push(message);
    }
    async flush() {
      flushes.count += 1;
      if (shouldFlushThrow.value) throw new Error("network down");
    }
  },
}));

const {
  purchaseConfirmedEvent,
  reportPurchaseToPostHog,
  PURCHASE_CONFIRMED,
  purchaseRefundedEvent,
  reportRefundToPostHog,
  PURCHASE_REFUNDED,
} = await import("./posthog-server");
const { POSTHOG_API_HOST } = await import("@/config/site");

function order(over: Partial<PreorderRow> = {}): PreorderRow {
  return {
    id: 1,
    order_ref: "KH-KZYJ-PEHT",
    tier: "launch",
    amount_paise: 49_900,
    status: "paid",
    parent_name: "Shweta Sharma",
    phone: "+919187546483",
    email: "parent@example.com",
    child_age: "4",
    wa_consent: true,
    terms_accepted_at: null,
    address: null,
    rzp_order_id: "order_x",
    rzp_payment_id: "pay_x",
    balance_status: "due",
    utm: null,
    fb_attrib: null,
    ph_distinct_id: null,
    created_at: "2026-09-20T00:00:00.000Z",
    paid_at: "2026-09-20T10:00:00.000Z",
    ...over,
  } as PreorderRow;
}

beforeEach(() => {
  captured.length = 0;
  flushes.count = 0;
  shouldFlushThrow.value = false;
});
afterEach(() => vi.restoreAllMocks());

describe("purchaseConfirmedEvent", () => {
  /* 🔴 THE NAME IS NOT `purchase`, AND THAT IS THE DESIGN.
     The browser already sends `purchase`. Sending the same name from here would
     double-count revenue unless PostHog de-duplicated, and its only dedup key is
     `uuid`, which the installed SDK documents as "must be a valid UUID" — our
     order reference is not one. A distinct name needs no dedup at all and can
     never inflate a number the founder reads. */
  it("is named distinctly from the browser's purchase event", () => {
    expect(PURCHASE_CONFIRMED).toBe("purchase_confirmed");
    expect(PURCHASE_CONFIRMED).not.toBe("purchase");
    expect(purchaseConfirmedEvent(order()).event).toBe("purchase_confirmed");
  });

  it("reports rupees, not paise, exactly as the browser event does", () => {
    expect(purchaseConfirmedEvent(order()).properties.value).toBe(499);
    expect(purchaseConfirmedEvent(order({ amount_paise: 799_900 })).properties.value).toBe(7999);
  });

  it("carries the order reference, the tier and the currency", () => {
    const { properties } = purchaseConfirmedEvent(order());
    expect(properties.transaction_id).toBe("KH-KZYJ-PEHT");
    expect(properties.tier).toBe("launch");
    expect(properties.currency).toBe("INR");
  });

  /* So a reader can tell at a glance why this one cannot be missed. */
  it("says it came from the webhook", () => {
    expect(purchaseConfirmedEvent(order()).properties.source).toBe("webhook");
  });

  /* THE WHOLE POINT OF THE ROUND. The server has no session and no cookie, so
     if the campaign is not read off the order row it is lost entirely. */
  it("spreads the campaign from the order row", () => {
    const { properties } = purchaseConfirmedEvent(
      order({ utm: { utm_source: "meta", utm_medium: "paid-social", utm_campaign: "2026-09-launch" } }),
    );
    expect(properties.utm_source).toBe("meta");
    expect(properties.utm_medium).toBe("paid-social");
    expect(properties.utm_campaign).toBe("2026-09-launch");
  });

  it("omits campaign keys rather than sending empty ones when there is no campaign", () => {
    const { properties } = purchaseConfirmedEvent(order({ utm: null }));
    expect("utm_source" in properties).toBe(false);
  });

  /* Stitching (founder, 2026-09-20). The stored id is the browser's own
     anonymous device id, so this event joins the same person's funnel. */
  it("uses the stored device id so the event joins the browsing session", () => {
    expect(purchaseConfirmedEvent(order({ ph_distinct_id: "0199-abc" })).distinctId).toBe("0199-abc");
  });

  /* An order from before the column existed, or a visitor with PostHog blocked,
     must still produce an event. Losing the sale to protect the funnel would
     invert the entire purpose. */
  it("falls back to the order reference when no device id was captured", () => {
    expect(purchaseConfirmedEvent(order({ ph_distinct_id: null })).distinctId).toBe("KH-KZYJ-PEHT");
  });

  /* Stitched but still ANONYMOUS: funnels key on distinct_id, so they work
     without a person profile. Creating one would attach a billable identity to
     a parent, which the 2026-09-19 round deliberately declined. */
  it("never creates a person profile", () => {
    expect(purchaseConfirmedEvent(order()).properties.$process_person_profile).toBe(false);
  });

  it("stamps the event with the time the money actually arrived", () => {
    expect(purchaseConfirmedEvent(order()).timestamp).toEqual(new Date("2026-09-20T10:00:00.000Z"));
  });
});

/* D075 (K-124b): the session the order was placed in, so PostHog attributes the sale to that visit's own entry referrer,
   landing path, click ids and UTMs. Only when the order stored one; the cases above build orders without the column and
   prove an absent value changes nothing. */
describe("purchaseConfirmedEvent carries $session_id when the order stored one (D075)", () => {
  const SID = "0199a2f1-7c3e-7b4a-9c10-0123456789ab";

  it("sends the stored session id as $session_id", () => {
    expect(purchaseConfirmedEvent(order({ ph_session_id: SID })).properties.$session_id).toBe(SID);
  });

  it("leaves the key out, rather than sending an empty one, when the order has none", () => {
    for (const none of [null, undefined, ""]) {
      expect(Object.keys(purchaseConfirmedEvent(order({ ph_session_id: none })).properties)).not.toContain("$session_id");
    }
    expect(Object.keys(purchaseConfirmedEvent(order()).properties)).not.toContain("$session_id");
  });

  it("changes nothing else in the payload: the same event with and without it differs by that one key", () => {
    const utm = { utm_source: "meta", utm_campaign: "2026-11-launch", placement: "feed" };
    const without = purchaseConfirmedEvent(order({ utm, ph_distinct_id: "0199-abc" }));
    const withId = purchaseConfirmedEvent(order({ utm, ph_distinct_id: "0199-abc", ph_session_id: SID }));
    const { $session_id, ...rest } = withId.properties;
    expect($session_id).toBe(SID);
    expect(rest).toEqual(without.properties);
    expect({ ...withId, properties: undefined }).toEqual({ ...without, properties: undefined });
  });

  it("is still anonymous and carries no personal data beside it", () => {
    const event = purchaseConfirmedEvent(order({ ph_session_id: SID }));
    expect(event.properties.$process_person_profile).toBe(false);
    const text = JSON.stringify(event);
    for (const personal of ["Shweta", "9187546483", "parent@example.com", "pay_x", "order_x"]) {
      expect(text, personal).not.toContain(personal);
    }
  });

  it("a campaign key cannot overwrite it", () => {
    const hostile = { $session_id: "forged" } as unknown as Record<string, string>;
    expect(purchaseConfirmedEvent(order({ utm: hostile, ph_session_id: SID })).properties.$session_id).toBe(SID);
  });

  it("goes out through the real report, flushed, as the one event", async () => {
    await expect(reportPurchaseToPostHog(order({ ph_session_id: SID }))).resolves.toBe("sent");
    expect(captured).toHaveLength(1);
    expect(captured[0]).toMatchObject({ event: "purchase_confirmed", properties: { $session_id: SID } });
    expect(flushes.count).toBe(1);
  });
});

describe("reportPurchaseToPostHog", () => {
  it("sends the event and returns sent", async () => {
    await expect(reportPurchaseToPostHog(order())).resolves.toBe("sent");
    expect(captured).toHaveLength(1);
    expect((captured[0] as { event: string }).event).toBe("purchase_confirmed");
  });

  /* 🔴 THE SILENT-FAILURE GUARD. posthog-node queues and flushes on a 5s timer.
     A serverless function returns long before that, so an unflushed event is
     simply lost — the exact failure this round exists to remove, reintroduced
     one layer down. The SDK's own flush() comment says it exists "so a
     serverless handler waits for one round trip". */
  it("FLUSHES before returning, or the event dies with the function", async () => {
    await reportPurchaseToPostHog(order());
    expect(flushes.count, "no flush means the event never left the function").toBe(1);
  });

  /* The payment path never fails because an analytics call did. Same contract
     as reportPurchaseToMeta beside it. */
  it("returns failed rather than throwing when the network is down", async () => {
    shouldFlushThrow.value = true;
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(reportPurchaseToPostHog(order())).resolves.toBe("failed");
  });

  /* Never the browser proxy path: this runs on the server, where no ad blocker
     exists and /ingest would be a pointless extra hop through our own edge. */
  it("talks straight to PostHog, not through our own reverse proxy", () => {
    expect(POSTHOG_API_HOST).toBe("https://us.i.posthog.com");
  });
});

/** WHICH BUILD SOLD IT (D048, QA review N4).
 *
 *  `purchase_confirmed` is the conversion goal and the revenue source (D031),
 *  and beta's Razorpay TEST payments go through the same webhook into the same
 *  PostHog project. So every build that is not production stamps its name on
 *  the event: `beta` on beta, and a marker on preview and local runs too, so a
 *  sandbox order completed against a local server can never read as revenue.
 *  Production's payload stays exactly the tag's (proved in test/env.test.ts). */
describe("purchase_confirmed names the build that is not production", () => {
  async function serverModuleUnder(value: string | undefined) {
    vi.resetModules();
    vi.stubEnv("KH_SITE_ENV", value);
    return import("./posthog-server");
  }

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("adds no env property in production", async () => {
    const { purchaseConfirmedEvent: event } = await serverModuleUnder("production");
    expect("env" in event(order()).properties).toBe(false);
  });

  it.each(["beta", "preview", "development"])("stamps env=%s on that build", async (value) => {
    const { purchaseConfirmedEvent: event } = await serverModuleUnder(value);
    expect(event(order()).properties.env).toBe(value);
  });

  it("stamps env=development on a local run with nothing set", async () => {
    const { purchaseConfirmedEvent: event } = await serverModuleUnder(undefined);
    expect(event(order()).properties.env).toBe("development");
  });

  /* The campaign is spread from the order row, so the stamp must win over a
     stray `env` key there, or a tagged link could relabel a test sale. */
  it("keeps the stamp when the order's campaign carries an env key of its own", async () => {
    const { purchaseConfirmedEvent: event } = await serverModuleUnder("beta");
    const utm = { utm_source: "meta", env: "production" } as unknown as PreorderRow["utm"];
    expect(event(order({ utm })).properties.env).toBe("beta");
  });

  it("sends the stamped event from a beta build", async () => {
    const { reportPurchaseToPostHog: report } = await serverModuleUnder("beta");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(report(order())).resolves.toBe("sent");
    expect((captured.at(-1) as { properties: { env: string } }).properties.env).toBe("beta");
  });
});

/** `purchase_refunded` (D074, K-124): a refund, reported by the server beside the sale it undoes. The webhook path that
 *  sends it is proved in test/store-refund-event.test.ts; these are the pure builder and the reporter. */
describe("purchaseRefundedEvent", () => {
  const full = { refundedPaise: 49_900, partial: false };

  it("is named distinctly, and is not the paid event or the browser's purchase", () => {
    expect(PURCHASE_REFUNDED).toBe("purchase_refunded");
    expect(PURCHASE_REFUNDED).not.toBe(PURCHASE_CONFIRMED);
    expect(purchaseRefundedEvent(order(), full).event).toBe("purchase_refunded");
  });

  it("joins the sale it undoes: the order reference as transaction_id, and the same distinct id as purchase_confirmed", () => {
    for (const ph_distinct_id of ["0199-abc", null]) {
      const o = order({ ph_distinct_id });
      expect(purchaseRefundedEvent(o, full).distinctId).toBe(purchaseConfirmedEvent(o).distinctId);
      expect(purchaseRefundedEvent(o, full).properties.transaction_id).toBe("KH-KZYJ-PEHT");
    }
    expect(purchaseRefundedEvent(order({ ph_distinct_id: "0199-abc" }), full).distinctId).toBe("0199-abc");
    expect(purchaseRefundedEvent(order({ ph_distinct_id: null }), full).distinctId).toBe("KH-KZYJ-PEHT");
  });

  it("reports the rupees of THIS refund, not the order's amount, and says whether it is partial", () => {
    expect(purchaseRefundedEvent(order(), full).properties).toMatchObject({ value: 499, partial: false });
    expect(purchaseRefundedEvent(order(), { refundedPaise: 48_900, partial: true }).properties).toMatchObject({
      value: 489,
      partial: true,
    });
  });

  it("carries the currency, the tier and the webhook source", () => {
    expect(purchaseRefundedEvent(order(), full).properties).toMatchObject({
      currency: "INR",
      tier: "launch",
      source: "webhook",
    });
  });

  it("spreads the campaign flat as purchase_confirmed does, and sends none when there is none", () => {
    const utm = { utm_source: "meta", utm_medium: "paid-social", utm_campaign: "2026-11-launch", placement: "feed" };
    const { properties } = purchaseRefundedEvent(order({ utm }), full);
    expect(properties).toMatchObject(utm);
    expect("utm_source" in purchaseRefundedEvent(order({ utm: null }), full).properties).toBe(false);
  });

  it("never creates a person profile, and carries nothing personal from a full order row", () => {
    const { properties } = purchaseRefundedEvent(order(), full);
    expect(properties.$process_person_profile).toBe(false);
    const text = JSON.stringify(purchaseRefundedEvent(order(), full));
    for (const personal of ["Shweta", "9187546483", "parent@example.com", "pay_x", "order_x"]) {
      expect(text, personal).not.toContain(personal);
    }
  });

  /* D075 (K-124b): the session id belongs to the SALE. A refund days later carrying it would stretch the purchase's session
     in PostHog (a session lasts from its first event to its last), so purchase_refunded never has it, even for an order
     that stored one, and whatever the caller hands in. */
  it("never carries $session_id, even for an order that stored one (D075)", () => {
    const SID = "0199a2f1-7c3e-7b4a-9c10-0123456789ab";
    const stored = order({ ph_session_id: SID });
    expect(Object.keys(purchaseRefundedEvent(stored, full).properties)).not.toContain("$session_id");
    expect(JSON.stringify(purchaseRefundedEvent(stored, full))).not.toContain(SID);
    expect(Object.keys(purchaseRefundedEvent(stored, { refundedPaise: 100, partial: true }).properties)).not.toContain("$session_id");
    // the same payload as for an order with no session id
    expect(purchaseRefundedEvent(stored, full)).toEqual(purchaseRefundedEvent(order(), full));
  });

  it("has no timestamp, so PostHog stamps the moment the webhook processes the refund", () => {
    expect(purchaseRefundedEvent(order(), full).timestamp).toBeUndefined();
  });
});

describe("reportRefundToPostHog", () => {
  const full = { refundedPaise: 49_900, partial: false };

  it("sends the event, FLUSHES before returning, and returns sent", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(reportRefundToPostHog(order(), full)).resolves.toBe("sent");
    expect(captured).toHaveLength(1);
    expect((captured[0] as { event: string }).event).toBe("purchase_refunded");
    expect(flushes.count, "no flush means the event never left the function").toBe(1);
  });

  it("returns failed rather than throwing when the network is down", async () => {
    shouldFlushThrow.value = true;
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(reportRefundToPostHog(order(), full)).resolves.toBe("failed");
  });

  it.each([0, -1, Number.NaN])("sends nothing for a refund of %s paise", async (refundedPaise) => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(reportRefundToPostHog(order(), { refundedPaise, partial: true })).resolves.toBe("skipped");
    expect(captured).toHaveLength(0);
    expect(flushes.count).toBe(0);
  });

  it("sends nothing, and says so, when the build has no PostHog project key", async () => {
    vi.resetModules();
    vi.doMock("@/config/site", async (importOriginal) => ({
      ...(await importOriginal<typeof import("@/config/site")>()),
      POSTHOG_KEY: "",
    }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const { reportRefundToPostHog: report, reportPurchaseToPostHog: reportPaid } = await import("./posthog-server");
      await expect(report(order(), full)).resolves.toBe("skipped");
      /* The paid report still says what it always said when it has no key. */
      await expect(reportPaid(order())).resolves.toBe("skipped");
      expect(captured).toHaveLength(0);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("SKIPPED KH-KZYJ-PEHT: no project key, so no refund event was sent"));
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("SKIPPED KH-KZYJ-PEHT: no project key, so only the browser event was sent"),
      );
    } finally {
      vi.doUnmock("@/config/site");
      vi.resetModules();
    }
  });
});

describe("purchase_refunded names the build that is not production, as purchase_confirmed does", () => {
  async function serverModuleUnder(value: string | undefined) {
    vi.resetModules();
    vi.stubEnv("KH_SITE_ENV", value);
    return import("./posthog-server");
  }

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("adds no env property in production", async () => {
    const { purchaseRefundedEvent: event } = await serverModuleUnder("production");
    expect("env" in event(order(), { refundedPaise: 49_900, partial: false }).properties).toBe(false);
  });

  it.each(["beta", "preview", "development"])("stamps env=%s on that build", async (value) => {
    const { purchaseRefundedEvent: event } = await serverModuleUnder(value);
    expect(event(order(), { refundedPaise: 49_900, partial: false }).properties.env).toBe(value);
  });

  it("keeps the stamp when the order's campaign carries an env key of its own", async () => {
    const { purchaseRefundedEvent: event } = await serverModuleUnder("beta");
    const utm = { utm_source: "meta", env: "production" } as unknown as PreorderRow["utm"];
    expect(event(order({ utm }), { refundedPaise: 49_900, partial: false }).properties.env).toBe("beta");
  });
});
