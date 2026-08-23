import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "../../../../test/helpers/fake-supabase";
import { resetRateLimits } from "@/lib/store/rate-limit";

/**
 * The health endpoint (§8.25-k, F-07).
 *
 * It exists because a paused Supabase project would otherwise be woken by a
 * parent's first pre-order, and because the one operational question worth
 * asking from a phone is which Razorpay mode is live. It is public, which is
 * fine, and it touches Postgres twice per call, which is why it is now
 * throttled: an anonymous caller should not be able to run our database bill up
 * with a loop, and the daily cron must never notice the limit.
 *
 * What it may never do is publish the paid-order COUNT (§8.26, founder: no
 * public counter). Only the mode.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
const storeEnv = vi.hoisted(() => vi.fn());
const missingStoreEnv = vi.hoisted(() => vi.fn(() => [] as string[]));

vi.mock("@/lib/store/env", async () => {
  const actual = await vi.importActual<typeof import("@/lib/store/env")>("@/lib/store/env");
  return { ...actual, storeEnv, missingStoreEnv };
});
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));

const { GET } = await import("./route");

function check(ip = "1.2.3.4") {
  return GET(
    new Request("https://store.kheelona.com/api/health", {
      headers: { "x-forwarded-for": ip },
    }),
  );
}

describe("GET /api/health", () => {
  beforeEach(() => {
    calls = [];
    results = { "preorders.select": { count: 12 } };
    resetRateLimits();
    storeEnv.mockReturnValue(fakeEnv);
    missingStoreEnv.mockReturnValue([]);
  });

  it("reports readiness, the offer mode and the gateway mode", async () => {
    const body = await (await check()).json();
    expect(body).toMatchObject({
      ok: true,
      store: "ready",
      preorder: "token",
      razorpay: "test",
      email: "missing",
    });
  });

  it("never publishes the paid-order count, only the mode", async () => {
    const body = await (await check()).json();
    expect(JSON.stringify(body)).not.toContain("12");
    expect(body).not.toHaveProperty("count");
    expect(body).not.toHaveProperty("sold");
  });

  it("names the missing variables when the store is not configured, never values", async () => {
    storeEnv.mockReturnValue(null);
    missingStoreEnv.mockReturnValue(["RAZORPAY_KEY_ID"]);
    const response = await check();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      store: "not-configured",
      missing: ["RAZORPAY_KEY_ID"],
    });
  });

  it("throttles a caller who loops on it, and each caller separately", async () => {
    /* Twenty is far above one refresh, one cron and one uptime checker, and far
       below a script counting our database for us. */
    for (let i = 0; i < 20; i += 1) {
      expect((await check("9.9.9.9")).status, `call ${i + 1}`).toBe(200);
    }
    expect((await check("9.9.9.9")).status).toBe(429);
    /* Somebody else's cron must not be caught by a stranger's loop. */
    expect((await check("5.5.5.5")).status).toBe(200);
  });

  it("stops touching the database once it is throttling", async () => {
    for (let i = 0; i < 20; i += 1) await check("8.8.8.8");
    const before = calls.length;
    await check("8.8.8.8");
    expect(calls.length).toBe(before);
  });
});
