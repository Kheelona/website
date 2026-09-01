import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "../../../../test/helpers/fake-supabase";
import type { StoreEnv } from "@/lib/store/env";

/**
 * /api/health is the one operational surface checkable from a phone, and it is
 * the first thing the resume protocol says to look at. What it must never do is
 * leak a value while reporting a state.
 *
 * The `capi` field exists because a missing Conversions API token and a working
 * one are indistinguishable from outside: the store behaves identically, and the
 * only other way to tell was to wait for a customer to buy something. That cost
 * two cycles in one week (2026-09-02), because a Vercel variable only applies to
 * deployments created after it changes.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
let env: StoreEnv | null = null;

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/env", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/store/env")>();
  return { ...actual, storeEnv: () => env };
});
vi.mock("@/lib/store/mode", () => ({ preorderMode: async () => "token" }));
vi.mock("@/lib/store/rate-limit", () => ({
  rateLimit: () => ({ allowed: true }),
  clientKey: () => "test",
}));

const { GET } = await import("./route");

const request = () => new Request("https://store.kheelona.com/api/health");

beforeEach(() => {
  calls = [];
  results = {};
});

describe("/api/health and the Conversions API token", () => {
  it("reports the token as configured, without ever printing it", async () => {
    const secret = "EAAsupersecrettokenvalue";
    env = { ...(fakeEnv as StoreEnv), metaCapiToken: secret };

    const response = await GET(request());
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(JSON.parse(text).capi).toBe("configured");
    // the whole point: a state, never the value
    expect(text).not.toContain(secret);
    expect(text).not.toContain("EAA");
  });

  it("reports it missing when it is absent, so a failed deploy is visible", async () => {
    env = { ...(fakeEnv as StoreEnv), metaCapiToken: null };

    const body = await (await GET(request())).json();
    expect(body.capi).toBe("missing");
    expect(body.ok).toBe(true); // the store is still healthy: CAPI is optional
  });

  /* Guarding the shape the runbook and the resume protocol read. */
  it("still answers the operational questions it always did", async () => {
    env = { ...(fakeEnv as StoreEnv), metaCapiToken: null };
    const body = await (await GET(request())).json();

    for (const key of ["ok", "store", "preorder", "razorpay", "email", "capi", "dbMs"]) {
      expect(body, `${key} is missing from /api/health`).toHaveProperty(key);
    }
  });
});
