import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, firstArg, type RecordedCall } from "./helpers/fake-supabase";
import { POSTHOG_KEY, TOKEN_AMOUNT_PAISE } from "@/config/site";
import { resetRateLimits } from "@/lib/store/rate-limit";
import { POSTHOG_PERSISTENCE_NAME } from "@/lib/tracking/beacon";
import { readPhSessionId, validPhSessionId } from "@/lib/tracking/ph-session-id";
import type { PreorderRow } from "@/lib/store/db";
import type { StoreEnv } from "@/lib/store/env";

/**
 * The PostHog session id on the order (D075, K-124b): create-order reads it on the SERVER from the visitor's own PostHog
 * cookie, stores it in `ph_session_id`, and the paid report sends it as `$session_id` on `purchase_confirmed`.
 *
 * The route's own test is frozen (a frozen folder takes no new test file), so this file mocks the route's neighbours the
 * same way it does. Nothing here can reach a real PostHog project: posthog-node is replaced by a recorder, and the
 * Razorpay webhook is never run.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
const captured: { distinctId: string; event: string; properties: Record<string, unknown>; timestamp?: Date }[] = [];

const storeEnv = vi.hoisted(() => vi.fn());
const createRazorpayOrder = vi.hoisted(() => vi.fn());
vi.mock("@/lib/store/env", () => ({ storeEnv, storeReady: () => Boolean(storeEnv()) }));
vi.mock("@/lib/store/razorpay", () => ({ createRazorpayOrder }));
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/email/send", () => ({ sendEmail: vi.fn() }));
vi.mock("@/lib/store/meta-capi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/store/meta-capi")>()),
  reportPurchaseToMeta: vi.fn(),
}));
vi.mock("@/lib/ads/openai-capi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/ads/openai-capi")>()),
  reportOrderToOpenAi: vi.fn(),
}));
vi.mock("posthog-node", () => ({
  PostHog: class {
    constructor(
      public key: string,
      public options: Record<string, unknown>,
    ) {}
    capture(message: (typeof captured)[number]) {
      captured.push(message);
    }
    async flush() {}
  },
}));

const { POST } = await import("@/app/api/preorder/create-order/route");
const { markPaid, notifyPaid } = await import("@/lib/store/fulfil");
const { purchaseConfirmedEvent } = await import("@/lib/store/posthog-server");

/** A PostHog session id as posthog-js 1.434 makes them: a UUIDv7. */
const SID = "0199a2f1-7c3e-7b4a-9c10-0123456789ab";
const URL_ = "https://store.kheelona.com/api/preorder/create-order";

/** The cookie posthog-js sets: percent-encoded JSON; `$sesid` is [last activity ms, session id, start ms]. */
const phCookie = (sesid: unknown, extra: Record<string, unknown> = {}) =>
  `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent(
    JSON.stringify({
      distinct_id: "0199a2f1-1111-7222-8333-444455556666",
      $sesid: sesid,
      $device_id: "0199a2f1-1111-7222-8333-444455556666",
      $user_state: "anonymous",
      ...extra,
    }),
  )}`;
const sesid = (id: unknown) => [1_764_000_000_000, id, 1_763_999_000_000];
const req = (cookie?: string) => new Request(URL_, { method: "POST", headers: cookie ? { cookie } : {} });

describe("readPhSessionId reads the session id out of the PostHog cookie, on the server", () => {
  it("names the cookie after the project key, as posthog-js does", () => {
    expect(POSTHOG_PERSISTENCE_NAME).toBe(`ph_${POSTHOG_KEY}_posthog`);
  });

  it("returns the id in position 1 of $sesid", () => {
    expect(readPhSessionId(req(phCookie(sesid(SID))))).toBe(SID);
  });

  it("finds it among the other cookies, with or without the space after the semicolon", () => {
    const own = phCookie(sesid(SID));
    expect(readPhSessionId(req(`_fbp=fb.1.123.456; kh_utm=%7B%7D; ${own}; _ga=GA1.1.1`))).toBe(SID);
    expect(readPhSessionId(req(`_fbp=fb.1.123.456;${own};_ga=GA1.1.1`))).toBe(SID);
  });

  it("takes any UUID shape (version and case), nothing else", () => {
    expect(readPhSessionId(req(phCookie(sesid("3f2a9c1e-77aa-4b1d-9c10-0123456789ab"))))).toBe("3f2a9c1e-77aa-4b1d-9c10-0123456789ab");
    expect(validPhSessionId(SID.toUpperCase())).toBe(SID.toUpperCase());
  });

  it.each<[string, string | undefined]>([
    ["no Cookie header at all", undefined],
    ["no PostHog cookie among the cookies", "_fbp=fb.1.123.456; kh_utm=%7B%7D"],
    ["another project's PostHog cookie", phCookie(sesid(SID)).replace(POSTHOG_KEY, "phc_someoneElsesProject")],
    ["an empty value", `${POSTHOG_PERSISTENCE_NAME}=`],
    ["a malformed percent escape", `${POSTHOG_PERSISTENCE_NAME}=%E0%A4%A`],
    ["truncated JSON", `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent('{"$sesid":[1,"' + SID)}`],
    ["JSON that is not JSON", `${POSTHOG_PERSISTENCE_NAME}=not-json`],
    ["a JSON array", `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent(JSON.stringify([sesid(SID)]))}`],
    ["a JSON string", `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent(JSON.stringify(SID))}`],
    ["JSON null", `${POSTHOG_PERSISTENCE_NAME}=null`],
    ["a cookie with no $sesid", phCookie(undefined)],
    ["$sesid that is a string", phCookie(SID)],
    ["$sesid that is an object", phCookie({ 1: SID })],
    ["$sesid too short to hold an id", phCookie([1_764_000_000_000])],
    ["an id that is a number", phCookie(sesid(1234567))],
    ["an id that is null", phCookie(sesid(null))],
    ["an id that is an object", phCookie(sesid({ id: SID }))],
    ["the session id in the wrong position", phCookie([SID, "x", 1])],
    ["an empty id", phCookie(sesid(""))],
    ["an id with a space around it", phCookie(sesid(` ${SID}`))],
    ["an id with a newline after it", phCookie(sesid(`${SID}\n`))],
    ["an id that is not a UUID", phCookie(sesid("session-1"))],
    ["an id of 36 characters that is not hex", phCookie(sesid("zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"))],
    ["an id without its dashes", phCookie(sesid(SID.replaceAll("-", "")))],
    ["a UUID followed by more", phCookie(sesid(`${SID}-0199a2f1-7c3e-7b4a-9c10-0123456789ab`))],
    ["an id over 64 characters", phCookie(sesid("a".repeat(65)))],
    ["an injection-shaped string", phCookie(sesid("'; drop table preorders; --"))],
    ["a cookie value over 4 KB", phCookie(sesid(SID), { padding: "x".repeat(5000) })],
  ])("reads as nothing for %s", (_label, cookie) => {
    expect(readPhSessionId(req(cookie))).toBeNull();
  });

  it("never throws, whatever the cookie holds", () => {
    for (const junk of ["%", "%%%", "=", ";;;", `${POSTHOG_PERSISTENCE_NAME}=%7B`, `${POSTHOG_PERSISTENCE_NAME}=%00`]) {
      expect(() => readPhSessionId(req(junk))).not.toThrow();
    }
  });

  it("validPhSessionId accepts a UUID of 36 characters and refuses a non-string", () => {
    expect(validPhSessionId(SID)).toBe(SID);
    expect(SID).toHaveLength(36);
    for (const bad of [null, undefined, 0, 1, true, {}, [], [SID]]) expect(validPhSessionId(bad)).toBeNull();
  });
});

const goodBody = {
  parentName: "Priya Menon",
  phone: "+91 90000 00001",
  email: "parent@example.com",
  childAge: "3",
  accepted: true,
};
const post = (cookie?: string, body: Record<string, unknown> = goodBody) =>
  POST(
    new Request(URL_, {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4", ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body),
    }),
  );
const inserted = () => firstArg(calls, "preorders", "insert")!;

beforeEach(() => {
  vi.clearAllMocks();
  resetRateLimits();
  calls = [];
  captured.length = 0;
  results = {
    "preorders.insert": { data: { id: 1, order_ref: "KH-A2B3-C4D5" }, error: null },
    "preorders.update": { data: null, error: null },
  };
  storeEnv.mockReturnValue(fakeEnv);
  createRazorpayOrder.mockResolvedValue({ id: "order_abc", amount: TOKEN_AMOUNT_PAISE, currency: "INR", status: "created" });
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("create-order stores the PostHog session id from the cookie (D075, criterion 2)", () => {
  it("stores the id in ph_session_id and still answers 200", async () => {
    const response = await post(phCookie(sesid(SID)));
    expect(response.status).toBe(200);
    expect(inserted().ph_session_id).toBe(SID);
  });

  it("stores null, and still takes the order, when there is no PostHog cookie", async () => {
    const response = await post();
    expect(response.status).toBe(200);
    expect(inserted().ph_session_id).toBeNull();
    expect(createRazorpayOrder).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["a malformed cookie", `${POSTHOG_PERSISTENCE_NAME}=%E0%A4%A`],
    ["a cookie that is not a PostHog one", `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent(JSON.stringify({ hello: "world" }))}`],
    ["a session id that is not a UUID", phCookie(sesid("x".repeat(36)))],
    ["an oversized session id", phCookie(sesid("a".repeat(200)))],
    ["an oversized cookie", phCookie(sesid(SID), { padding: "x".repeat(6000) })],
  ])("never refuses an order because of %s: it stores null", async (_label, cookie) => {
    const response = await post(cookie);
    expect(response.status).toBe(200);
    expect(inserted().ph_session_id).toBeNull();
    expect(createRazorpayOrder).toHaveBeenCalledTimes(1);
    expect(calls.some((c) => c.table === "preorders" && c.method === "insert")).toBe(true);
  });

  it("is read from the cookie only: a session id in the request body is ignored", async () => {
    await post(undefined, { ...goodBody, phSessionId: SID, ph_session_id: SID, sessionId: SID, $session_id: SID });
    expect(inserted().ph_session_id).toBeNull();
    // and a valid cookie beats a body that disagrees
    calls = [];
    await post(phCookie(sesid(SID)), { ...goodBody, ph_session_id: "3f2a9c1e-77aa-4b1d-9c10-0123456789ab" });
    expect(inserted().ph_session_id).toBe(SID);
  });

  it("adds exactly one column to the insert, and nothing about it to the answer", async () => {
    const response = await post(phCookie(sesid(SID)), { ...goodBody, phDistinctId: "0199a2f1-aaaa-7bbb-8ccc-1234567890ab" });
    expect(Object.keys(inserted()).sort()).toEqual(
      [
        "amount_paise",
        "balance_status",
        "child_age",
        "email",
        "fb_attrib",
        "order_ref",
        "parent_name",
        "ph_distinct_id",
        "ph_session_id",
        "phone",
        "terms_accepted_at",
        "tier",
        "utm",
        "wa_consent",
      ].sort(),
    );
    expect(inserted().ph_distinct_id).toBe("0199a2f1-aaaa-7bbb-8ccc-1234567890ab");
    expect(JSON.stringify(await response.json())).not.toContain(SID);
  });
});

/** An order as the webhook reads it back (`markPaid` selects every column). */
const paidRow = (over: Partial<PreorderRow> = {}): PreorderRow =>
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
    terms_accepted_at: "2026-11-26T08:00:00.000Z",
    address: null,
    rzp_order_id: "order_abc",
    rzp_payment_id: "pay_xyz",
    balance_status: "due",
    utm: { utm_source: "meta", utm_campaign: "2026-11-launch" },
    fb_attrib: null,
    ph_distinct_id: "0199a2f1-1111-7222-8333-444455556666",
    ph_session_id: SID,
    created_at: "2026-11-26T08:00:00.000Z",
    paid_at: "2026-11-26T08:01:00.000Z",
    ...over,
  }) as PreorderRow;

describe("the stored session id reaches purchase_confirmed as $session_id (D075, criterion 3)", () => {
  it("rides from the insert to the event: what create-order stored is what PostHog is sent", async () => {
    await post(phCookie(sesid(SID)));
    const stored = inserted().ph_session_id as string;
    expect(purchaseConfirmedEvent(paidRow({ ph_session_id: stored })).properties.$session_id).toBe(SID);
  });

  it("is read back by the webhook's markPaid with select('*'), so the column needs no change to fulfil.ts", async () => {
    results["preorders.update"] = { data: paidRow(), error: null };
    const result = await markPaid(fakeEnv as StoreEnv, { rzpOrderId: "order_abc", paymentId: "pay_xyz", paidPaise: 49_900 });
    expect(result).toMatchObject({ outcome: "paid", order: { ph_session_id: SID } });
    expect(calls.find((c) => c.method === "select")?.args[0]).toBe("*");
  });

  it("notifyPaid sends ONE purchase_confirmed carrying $session_id, and no other PostHog event", async () => {
    await notifyPaid(fakeEnv as StoreEnv, paidRow());
    expect(captured.map((e) => e.event)).toEqual(["purchase_confirmed"]);
    expect(captured[0].properties.$session_id).toBe(SID);
    expect(captured[0].distinctId).toBe("0199a2f1-1111-7222-8333-444455556666");
  });

  it("notifyPaid sends no $session_id for an order that has none (before migration 0005, or PostHog blocked)", async () => {
    for (const none of [null, undefined, ""]) {
      captured.length = 0;
      await notifyPaid(fakeEnv as StoreEnv, paidRow({ ph_session_id: none }));
      expect(captured).toHaveLength(1);
      expect(Object.keys(captured[0].properties)).not.toContain("$session_id");
    }
  });

  it("puts the session id nowhere else: not in Meta's or OpenAI's inputs, nor in the email", async () => {
    const { reportPurchaseToMeta } = await import("@/lib/store/meta-capi");
    const { reportOrderToOpenAi } = await import("@/lib/ads/openai-capi");
    const { sendEmail } = await import("@/lib/email/send");
    await notifyPaid(fakeEnv as StoreEnv, paidRow());
    const { purchasePayload } = await import("@/lib/store/meta-capi");
    expect(JSON.stringify(purchasePayload(paidRow(), "TOKEN"))).not.toContain(SID);
    expect(vi.mocked(reportPurchaseToMeta)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(reportOrderToOpenAi)).toHaveBeenCalledTimes(1);
    for (const call of vi.mocked(sendEmail).mock.calls) expect(JSON.stringify(call[1])).not.toContain(SID);
  });
});
