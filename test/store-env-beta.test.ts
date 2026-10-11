import { afterEach, describe, expect, it, vi } from "vitest";
import type { PreorderRow } from "@/lib/store/db";

/**
 * Meta's server events never leave a beta build (D048, architecture §15.3).
 *
 * Beta takes Razorpay TEST payments, and each one goes through `markPaid` like a
 * real order. With a Conversions API token in reach, every test order would land
 * in the ad account as a Purchase and teach Meta's bidding a sale that never
 * happened. The founder's runbook keeps the token out of Preview; this is the
 * second, independent switch: on a beta build the token reads as absent, so the
 * existing "SKIPPED" path logs it and nothing is sent.
 *
 * Production, preview and local builds read the token exactly as before.
 */

const REQUIRED = {
  RAZORPAY_KEY_ID: "rzp_test_abc123",
  RAZORPAY_KEY_SECRET: "test-secret",
  RAZORPAY_WEBHOOK_SECRET: "webhook-secret",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role",
  STORE_SIGNING_SECRET: "signing-secret",
};

async function storeEnvUnder(siteEnv: string | undefined, extra: Record<string, string | undefined>) {
  vi.resetModules();
  vi.stubEnv("KH_SITE_ENV", siteEnv);
  for (const [name, value] of Object.entries({ ...REQUIRED, ...extra })) vi.stubEnv(name, value);
  return import("@/lib/store/env");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.restoreAllMocks();
});

const CAPI = { META_CAPI_TOKEN: "EAAtoken", META_CAPI_TEST_CODE: "TEST123" };

describe("the Conversions API token on each build", () => {
  it("reads as absent on beta, token and test code both", async () => {
    const { storeEnv } = await storeEnvUnder("beta", CAPI);
    const env = storeEnv();
    expect(env).not.toBeNull();
    expect(env!.metaCapiToken).toBeNull();
    expect(env!.metaCapiTestCode).toBeNull();
  });

  /* Only the CAPI switch moves. A beta build must still take a test payment,
     or the founder cannot review the checkout at all. */
  it("leaves every other value alone on beta, so the store still opens", async () => {
    const beta = (await storeEnvUnder("beta", CAPI)).storeEnv()!;
    const production = (await storeEnvUnder("production", CAPI)).storeEnv()!;
    expect({ ...beta, metaCapiToken: "x", metaCapiTestCode: "x" }).toEqual({
      ...production,
      metaCapiToken: "x",
      metaCapiTestCode: "x",
    });
    expect((await storeEnvUnder("beta", CAPI)).storeReady()).toBe(true);
  });

  it.each([undefined, "production", "preview", "development"])(
    "KH_SITE_ENV=%s reads the token and test code as before",
    async (siteEnv) => {
      const env = (await storeEnvUnder(siteEnv, CAPI)).storeEnv()!;
      expect(env.metaCapiToken).toBe("EAAtoken");
      expect(env.metaCapiTestCode).toBe("TEST123");
    },
  );

  it.each([undefined, "production"])("KH_SITE_ENV=%s still treats a placeholder as missing", async (siteEnv) => {
    const env = (await storeEnvUnder(siteEnv, { META_CAPI_TOKEN: "DUMMY", META_CAPI_TEST_CODE: "" })).storeEnv()!;
    expect(env.metaCapiToken).toBeNull();
    expect(env.metaCapiTestCode).toBeNull();
  });

  /* The whole point, end to end: the store's own CAPI reporter takes the beta
     env and logs SKIPPED instead of calling Meta. */
  it("makes the CAPI reporter skip on beta without calling Meta", async () => {
    const { storeEnv } = await storeEnvUnder("beta", CAPI);
    const { reportPurchaseToMeta } = await import("@/lib/store/meta-capi");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const order = { order_ref: "KH-BETA-TEST", amount_paise: 49_900 } as PreorderRow;
    await expect(reportPurchaseToMeta(storeEnv()!, order)).resolves.toBe("skipped");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toContain("SKIPPED");
    vi.unstubAllGlobals();
  });
});
