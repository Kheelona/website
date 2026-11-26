import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "./helpers/fake-supabase";
import type { StoreEnv } from "@/lib/store/env";

/**
 * `purchase_refunded` (D074, K-124): the server tells PostHog about each refund the webhook applies.
 *
 * `markRefunded` runs for real here, against the fake Supabase client, and the REAL `posthog-server.ts` runs behind
 * it with only the network client (posthog-node) replaced by a recorder. So these prove what the webhook path sends,
 * not what a mock says it sends. The frozen `src/lib/store/fulfil.test.ts` mocks `./posthog-server` with only the purchase
 * report and so cannot assert any of this (and a frozen folder takes no new test file), which is why this file is here.
 *
 * Nothing in this file can reach a real PostHog project: posthog-node is mocked before any module that imports it.
 */

const calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown }> = {};
const captured: { distinctId: string; event: string; properties: Record<string, unknown>; timestamp?: Date }[] = [];
const flushes = { count: 0 };
const flushFails = { value: false };

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/email/send", () => ({ sendEmail: vi.fn() }));
vi.mock("@/lib/store/meta-capi", () => ({ reportPurchaseToMeta: vi.fn() }));
vi.mock("@/lib/ads/openai-capi", () => ({ reportOrderToOpenAi: vi.fn() }));
vi.mock("posthog-node", () => ({
  PostHog: class {
    constructor(
      public key: string,
      public options: Record<string, unknown>,
    ) {}
    capture(message: (typeof captured)[number]) {
      captured.push(message);
      /* The same recorder the UPDATE goes into, so the ORDER of the two is assertable. */
      calls.push({ table: "-", method: "posthog.capture", args: [message.event] });
    }
    async flush() {
      flushes.count += 1;
      if (flushFails.value) throw new Error("us.i.posthog.com unreachable");
    }
  },
}));

const env = fakeEnv as StoreEnv;

/** What `markRefunded`'s SELECT returns: the three columns it always read, and the three D074 added. */
const ORDER = {
  order_ref: "KH-A2B3-C4D5",
  amount_paise: 49_900,
  status: "paid",
  tier: "launch",
  utm: { utm_source: "meta", utm_medium: "paid-social", utm_campaign: "2026-11-launch", placement: "feed" },
  ph_distinct_id: "0199-device-abc",
};

/** A refund-shaped row with everything personal on it, to prove none of it reaches the event. */
const ORDER_WITH_PERSONAL_DATA = {
  ...ORDER,
  parent_name: "Shweta Sharma",
  phone: "+919187546483",
  email: "parent@example.com",
  child_age: "4",
  address: { line1: "10 MG Road", line2: "", city: "Bengaluru", state: "Karnataka", pincode: "560001" },
  rzp_payment_id: "pay_SECRET123",
};

async function load() {
  vi.resetModules();
  return (await import("@/lib/store/fulfil")).markRefunded;
}

beforeEach(() => {
  calls.length = 0;
  results = {};
  captured.length = 0;
  flushes.count = 0;
  flushFails.value = false;
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("markRefunded reports a full refund to PostHog (D074, criterion 1)", () => {
  it("sends ONE purchase_refunded with the exact payload, AFTER the status update", async () => {
    vi.stubEnv("KH_SITE_ENV", "production");
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };

    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 49_900 })).resolves.toBe("refunded");

    expect(captured).toHaveLength(1);
    expect(captured[0]).toEqual({
      distinctId: "0199-device-abc",
      event: "purchase_refunded",
      properties: {
        transaction_id: "KH-A2B3-C4D5",
        currency: "INR",
        value: 499,
        tier: "launch",
        partial: false,
        source: "webhook",
        utm_source: "meta",
        utm_medium: "paid-social",
        utm_campaign: "2026-11-launch",
        placement: "feed",
        $process_person_profile: false,
      },
      timestamp: undefined,
    });
    /* Production's payload has no `env` property at all. */
    expect("env" in captured[0].properties).toBe(false);

    const order = calls.map((c) => c.method);
    expect(order.indexOf("update"), "the status update ran").toBeGreaterThanOrEqual(0);
    expect(order.indexOf("posthog.capture"), "the event was captured after the update, not before").toBeGreaterThan(
      order.indexOf("update"),
    );
    expect(calls.find((c) => c.method === "update")?.args[0]).toMatchObject({ status: "refunded" });
    expect(flushes.count, "flushed before returning, or the event dies with the function").toBe(1);
  });

  it("reads the extra columns the event needs, and the ones it always read", async () => {
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };
    await markRefunded(env, { paymentId: "pay_1", refundedPaise: 49_900 });
    const select = calls.find((c) => c.method === "select");
    expect(String(select?.args[0]).split(",").map((c) => c.trim())).toEqual([
      "order_ref",
      "amount_paise",
      "status",
      "tier",
      "utm",
      "ph_distinct_id",
    ]);
  });

  it("falls back to the order reference as the distinct id when the order has none, and sends no campaign keys when it has none", async () => {
    const markRefunded = await load();
    results["preorders.select"] = { data: { ...ORDER, ph_distinct_id: null, utm: null } };
    await markRefunded(env, { paymentId: "pay_1", refundedPaise: 49_900 });
    expect(captured[0].distinctId).toBe("KH-A2B3-C4D5");
    expect("utm_source" in captured[0].properties).toBe(false);
  });

  it("a refund MORE than the order (cannot happen at Razorpay, but the rule is `at least`) is still a full refund", async () => {
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };
    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 50_000 })).resolves.toBe("refunded");
    expect(captured[0].properties).toMatchObject({ partial: false, value: 500 });
  });

  it("stamps env on a build that is not production, as purchase_confirmed does", async () => {
    vi.stubEnv("KH_SITE_ENV", "beta");
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };
    await markRefunded(env, { paymentId: "pay_1", refundedPaise: 49_900 });
    expect(captured[0].properties.env).toBe("beta");
  });
});

describe("markRefunded reports a partial refund (criterion 2)", () => {
  it("sends partial: true with the amount actually refunded, and leaves the status alone", async () => {
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };

    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 48_900 })).resolves.toBe("partial");

    expect(captured).toHaveLength(1);
    expect(captured[0].event).toBe("purchase_refunded");
    expect(captured[0].properties).toMatchObject({
      transaction_id: "KH-A2B3-C4D5",
      value: 489,
      partial: true,
      tier: "launch",
      currency: "INR",
      source: "webhook",
    });
    expect(calls.find((c) => c.method === "update"), "a partial refund never changes the status").toBeUndefined();
  });

  it("sends nothing for a refund of no money (the route passes 0 when the webhook has no amount)", async () => {
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };
    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 0 })).resolves.toBe("partial");
    expect(captured).toHaveLength(0);
    expect(flushes.count).toBe(0);
  });
});

describe("markRefunded sends nothing it should not (criteria 3 and 4)", () => {
  it("no order for the payment: no event, answer unchanged", async () => {
    const markRefunded = await load();
    results["preorders.select"] = { data: null };
    await expect(markRefunded(env, { paymentId: "pay_unknown", refundedPaise: 49_900 })).resolves.toBe("unknown");
    expect(captured).toHaveLength(0);
    expect(calls.find((c) => c.method === "update")).toBeUndefined();
  });

  it("carries no name, phone, email, address, child age, payment id or refund id, even from a fully populated order row", async () => {
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER_WITH_PERSONAL_DATA };
    await markRefunded(env, { paymentId: "pay_SECRET123", refundedPaise: 49_900 });
    const text = JSON.stringify(captured[0]);
    for (const personal of [
      "Shweta",
      "9187546483",
      "parent@example.com",
      "MG Road",
      "560001",
      "Bengaluru",
      "pay_SECRET123",
      "child_age",
      "parent_name",
      "rzp_payment_id",
    ]) {
      expect(text, personal).not.toContain(personal);
    }
    expect(Object.keys(captured[0].properties).sort()).toEqual(
      [
        "$process_person_profile",
        "currency",
        "env",
        "partial",
        "placement",
        "source",
        "tier",
        "transaction_id",
        "utm_campaign",
        "utm_medium",
        "utm_source",
        "value",
      ].sort(),
    );
  });
});

describe("a PostHog failure never changes the status update or the webhook's answer (criterion 3)", () => {
  it("the network is down: the order is still marked refunded, nothing throws, the failure is logged", async () => {
    flushFails.value = true;
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };

    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 49_900 })).resolves.toBe("refunded");

    expect(calls.find((c) => c.method === "update")?.args[0]).toMatchObject({ status: "refunded" });
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("[posthog] FAILED KH-A2B3-C4D5"));
  });

  it("the partial path survives a network failure too", async () => {
    flushFails.value = true;
    const markRefunded = await load();
    results["preorders.select"] = { data: ORDER };
    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 48_900 })).resolves.toBe("partial");
  });

  it("even a reporter that throws outright (not just a failed flush) cannot change the answer or the update", async () => {
    vi.resetModules();
    vi.doMock("@/lib/store/posthog-server", () => ({
      reportPurchaseToPostHog: vi.fn(),
      reportRefundToPostHog: vi.fn().mockRejectedValue(new Error("boom")),
    }));
    try {
      const { markRefunded } = await import("@/lib/store/fulfil");
      results["preorders.select"] = { data: ORDER };
      await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 49_900 })).resolves.toBe("refunded");
      expect(calls.find((c) => c.method === "update")?.args[0]).toMatchObject({ status: "refunded" });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("could not report KH-A2B3-C4D5 to PostHog"),
        expect.any(Error),
      );
    } finally {
      vi.doUnmock("@/lib/store/posthog-server");
    }
  });
});

describe("the refund event is its own thing (criterion 5)", () => {
  it("paying an order sends no purchase_refunded: the paid path reports only purchase_confirmed", async () => {
    vi.resetModules();
    const { reportPurchaseToPostHog } = await import("@/lib/store/posthog-server");
    await reportPurchaseToPostHog({
      ...(ORDER_WITH_PERSONAL_DATA as object),
      paid_at: "2026-11-26T10:00:00.000Z",
    } as never);
    expect(captured.map((e) => e.event)).toEqual(["purchase_confirmed"]);
  });
});
