import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv } from "./helpers/fake-supabase";
import type { StoreEnv } from "@/lib/store/env";

/** notifyPaid and the OpenAI Conversions API (F6, D069). A separate file from src/lib/store/fulfil.test.ts, which is
 *  frozen (literal-only patches), mocking the same neighbours the way that file does: the contract under test is that
 *  the OpenAI report is attempted once per paid order, beside the others, and that nothing it does can escape. */

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient({}, []) }));

const sendEmail = vi.hoisted(() => vi.fn());
const reportPurchaseToMeta = vi.hoisted(() => vi.fn());
const reportPurchaseToPostHog = vi.hoisted(() => vi.fn());
const reportOrderToOpenAi = vi.hoisted(() => vi.fn());
vi.mock("@/lib/email/send", () => ({ sendEmail }));
vi.mock("@/lib/store/meta-capi", () => ({ reportPurchaseToMeta }));
vi.mock("@/lib/store/posthog-server", () => ({ reportPurchaseToPostHog }));
vi.mock("@/lib/ads/openai-capi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ads/openai-capi")>();
  return { ...actual, reportOrderToOpenAi };
});

const { notifyPaid } = await import("@/lib/store/fulfil");
const actualCapi = await vi.importActual<typeof import("@/lib/ads/openai-capi")>("@/lib/ads/openai-capi");
const env = fakeEnv as StoreEnv;

const paidOrder = {
  order_ref: "KH-A2B3-C4D5",
  amount_paise: 49_900,
  status: "paid",
  email: "parent@example.com",
  parent_name: "Test Parent",
  tier: "launch",
  address: null,
  child_age: "4",
  phone: "+919000000001",
  fb_attrib: { oai_oppref: "f6_test_ref" },
  paid_at: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
  sendEmail.mockResolvedValue(undefined);
  reportPurchaseToMeta.mockResolvedValue("sent");
  reportPurchaseToPostHog.mockResolvedValue("sent");
  reportOrderToOpenAi.mockResolvedValue("sent");
});

describe("notifyPaid reports to OpenAI Ads", () => {
  it("attempts the OpenAI report exactly once, with the paid order", async () => {
    await notifyPaid(env, paidOrder as never);
    expect(reportOrderToOpenAi).toHaveBeenCalledTimes(1);
    expect(reportOrderToOpenAi).toHaveBeenCalledWith(paidOrder);
  });

  it("does not throw when the OpenAI report rejects, and still does everything else", async () => {
    reportOrderToOpenAi.mockRejectedValue(new Error("bzr.openai.com unreachable"));
    await expect(notifyPaid(env, paidOrder as never)).resolves.toBeUndefined();
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(reportPurchaseToMeta).toHaveBeenCalledTimes(1);
    expect(reportPurchaseToPostHog).toHaveBeenCalledTimes(1);
  });

  it("does not throw when the OpenAI report throws synchronously", async () => {
    reportOrderToOpenAi.mockImplementation(() => {
      throw new Error("sync failure");
    });
    await expect(notifyPaid(env, paidOrder as never)).resolves.toBeUndefined();
  });

  it("a failing neighbour does not stop the OpenAI report", async () => {
    reportPurchaseToMeta.mockRejectedValue(new Error("graph down"));
    sendEmail.mockRejectedValue(new Error("resend down"));
    await expect(notifyPaid(env, paidOrder as never)).resolves.toBeUndefined();
    expect(reportOrderToOpenAi).toHaveBeenCalledTimes(1);
  });
});

describe("notifyPaid with the real OpenAI reporter and no key", () => {
  it("makes no request to OpenAI at all", async () => {
    reportOrderToOpenAi.mockImplementation(actualCapi.reportOrderToOpenAi);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("OPENAI_ADS_CAPI_KEY", "");
    vi.spyOn(console, "info").mockImplementation(() => {});
    await expect(notifyPaid(env, paidOrder as never)).resolves.toBeUndefined();
    expect(reportOrderToOpenAi).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});
