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

const { purchaseConfirmedEvent, reportPurchaseToPostHog, PURCHASE_CONFIRMED } = await import(
  "./posthog-server"
);
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
