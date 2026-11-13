import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, firstArg, type RecordedCall } from "./helpers/fake-supabase";
import { TOKEN_AMOUNT_PAISE } from "@/config/site";
import { resetRateLimits } from "@/lib/store/rate-limit";
import { purchasePayload, readFbAttrib } from "@/lib/store/meta-capi";
import type { PreorderRow } from "@/lib/store/db";

/** The OpenAI references on a new order (F6, D069). A separate file from the route's own frozen test, mocking the
 *  route's neighbours the same way. They go into the existing `fb_attrib` JSONB under `oai_` keys: no new column. */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};

const storeEnv = vi.hoisted(() => vi.fn());
const createRazorpayOrder = vi.hoisted(() => vi.fn());
vi.mock("@/lib/store/env", () => ({ storeEnv, storeReady: () => Boolean(storeEnv()) }));
vi.mock("@/lib/store/razorpay", () => ({ createRazorpayOrder }));
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));

const { POST } = await import("@/app/api/preorder/create-order/route");

const goodBody = {
  parentName: "Priya Menon",
  phone: "+91 90000 00001",
  email: "parent@example.com",
  childAge: "3",
  accepted: true,
};

const URL_ = "https://store.kheelona.com/api/preorder/create-order";
const headers = (cookie?: string) => ({
  "content-type": "application/json",
  "x-forwarded-for": "1.2.3.4",
  "user-agent": "TestAgent/1.0",
  ...(cookie ? { cookie } : {}),
});
const post = (cookie?: string) =>
  POST(new Request(URL_, { method: "POST", headers: headers(cookie), body: JSON.stringify(goodBody) }));
const storedAttrib = () => firstArg(calls, "preorders", "insert")?.fb_attrib as Record<string, string> | null;

beforeEach(() => {
  vi.clearAllMocks();
  resetRateLimits();
  calls = [];
  results = {
    "preorders.insert": { data: { id: 1, order_ref: "KH-A2B3-C4D5" }, error: null },
    "preorders.update": { data: null, error: null },
  };
  storeEnv.mockReturnValue(fakeEnv);
  createRazorpayOrder.mockResolvedValue({ id: "order_abc", amount: TOKEN_AMOUNT_PAISE, currency: "INR", status: "created" });
});

describe("create-order stores the OpenAI references in fb_attrib", () => {
  it("keeps our kh_oppref and OpenAI's __obref beside Meta's attribution", async () => {
    expect((await post("kh_oppref=f6_test_ref; __obref=3f2a9c1e-77aa-4b1d-9c10-0123456789ab; _fbp=fb.1.123.456")).status).toBe(200);
    expect(storedAttrib()).toMatchObject({
      oai_oppref: "f6_test_ref",
      oai_obref: "3f2a9c1e-77aa-4b1d-9c10-0123456789ab",
      fbp: "fb.1.123.456",
      ua: "TestAgent/1.0",
    });
  });

  it("falls back to OpenAI's own __oppref when our cookie is absent", async () => {
    await post("__oppref=native_ref");
    expect(storedAttrib()?.oai_oppref).toBe("native_ref");
  });

  it("stores nothing for a malformed reference", async () => {
    await post("kh_oppref=bad%20value; __obref=bad_value!");
    const attrib = storedAttrib();
    expect(attrib ?? {}).not.toHaveProperty("oai_oppref");
    expect(attrib ?? {}).not.toHaveProperty("oai_obref");
  });

  it("changes nothing for a buyer with no OpenAI cookie: fb_attrib is exactly what Meta's reader returns", async () => {
    await post("_fbp=fb.1.123.456");
    const same = readFbAttrib(new Request(URL_, { method: "POST", headers: headers("_fbp=fb.1.123.456") }));
    expect(storedAttrib()).toEqual(same);
    expect(Object.keys(storedAttrib() ?? {}).some((k) => k.startsWith("oai_"))).toBe(false);
  });

  it("stores only the OpenAI references when Meta had nothing, so the column is null only when both are empty", async () => {
    const response = await POST(
      new Request(URL_, {
        method: "POST",
        headers: { "content-type": "application/json", cookie: "kh_oppref=abc" },
        body: JSON.stringify(goodBody),
      }),
    );
    expect(response.status).toBe(200);
    expect(storedAttrib()).toMatchObject({ oai_oppref: "abc" });
  });

  it("the client body cannot supply them: an `oai_oppref` in the JSON is ignored", async () => {
    const response = await POST(
      new Request(URL_, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ ...goodBody, oai_oppref: "forged", fb_attrib: { oai_oppref: "forged" } }),
      }),
    );
    expect(response.status).toBe(200);
    expect(storedAttrib() ?? {}).not.toHaveProperty("oai_oppref");
  });
});

describe("Meta's purchase payload ignores the OpenAI keys", () => {
  const order = (fb_attrib: Record<string, string> | null) =>
    ({
      id: 1,
      order_ref: "KH-A2B3-C4D5",
      tier: "launch",
      amount_paise: 49_900,
      status: "paid",
      parent_name: "Priya Menon",
      phone: "+919000000001",
      email: "parent@example.com",
      child_age: "3",
      wa_consent: true,
      terms_accepted_at: null,
      address: null,
      rzp_order_id: "order_x",
      rzp_payment_id: "pay_x",
      balance_status: "due",
      utm: null,
      fb_attrib,
      created_at: "2026-11-14T09:50:00.000Z",
      paid_at: "2026-11-14T10:00:00.000Z",
    }) as unknown as PreorderRow;

  it("builds the same body with oai_ keys present as without", () => {
    const meta = { fbp: "fb.1.123.456", ip: "203.0.113.9", ua: "UA" };
    const withOai = purchasePayload(order({ ...meta, oai_oppref: "f6_test_ref", oai_obref: "3f2a-77" }), "TOKEN");
    const without = purchasePayload(order(meta), "TOKEN");
    expect(withOai).toEqual(without);
    expect(JSON.stringify(withOai)).not.toMatch(/oai_|f6_test_ref|3f2a-77/);
  });
});
