import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PreorderRow } from "@/lib/store/db";

/* OpenAI's Conversions API call and the attribution that feeds it. The site environment is mocked so the
   production-only rule can be tested both ways; the network is `fetch`, stubbed per test. Every order here is
   fake (example.com, a +9190000000xx number). */

const env = vi.hoisted(() => ({ site: "production" as string }));
vi.mock("@/config/env", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/config/env")>();
  return {
    ...actual,
    get SITE_ENV() {
      return env.site;
    },
  };
});

const { openAiCapiPayload, readOpenAiAttrib, reportOrderToOpenAi, withOpenAiAttrib } = await import("./openai-capi");

const sha = (v: string) => createHash("sha256").update(v).digest("hex");
const PAID_AT = "2026-11-14T10:00:00.000Z";

function order(over: Partial<PreorderRow> = {}): PreorderRow {
  return {
    id: 1,
    order_ref: "KH-TEST-F6F6",
    tier: "launch",
    amount_paise: 49_900,
    status: "paid",
    parent_name: "  Priya  Nair ",
    phone: "+919000000001",
    email: "  Parent@Example.COM ",
    child_age: "4",
    wa_consent: true,
    terms_accepted_at: null,
    address: { line1: "1 Example Road", city: "Bengaluru" },
    rzp_order_id: "order_x",
    rzp_payment_id: "pay_x",
    balance_status: "due",
    utm: { utm_source: "openai_ads" },
    fb_attrib: {
      fbp: "fb.1.123.456",
      ip: "203.0.113.9",
      ua: "Mozilla/5.0 (Test)",
      oai_oppref: "f6_test_ref",
      oai_obref: "3f2a9c1e-77aa-4b1d-9c10-0123456789ab",
    },
    created_at: "2026-11-14T09:50:00.000Z",
    paid_at: PAID_AT,
    ...over,
  } as unknown as PreorderRow;
}

function req(cookie?: string) {
  return new Request("https://store.kheelona.com/api/preorder/create-order", {
    method: "POST",
    headers: cookie ? { cookie } : {},
  });
}

describe("readOpenAiAttrib", () => {
  it("reads our kh_oppref and OpenAI's __obref", () => {
    expect(readOpenAiAttrib(req("kh_oppref=abc_123; __obref=3f2a9c1e-77aa-4b1d-9c10-0123456789ab"))).toEqual({
      oai_oppref: "abc_123",
      oai_obref: "3f2a9c1e-77aa-4b1d-9c10-0123456789ab",
    });
  });

  it("prefers kh_oppref over OpenAI's own __oppref, and falls back to it", () => {
    expect(readOpenAiAttrib(req("__oppref=native; kh_oppref=ours"))).toEqual({ oai_oppref: "ours" });
    expect(readOpenAiAttrib(req("__oppref=native"))).toEqual({ oai_oppref: "native" });
  });

  it("decodes a percent-encoded value and then validates it", () => {
    expect(readOpenAiAttrib(req("kh_oppref=a%2Eb"))).toEqual({ oai_oppref: "a.b" });
    expect(readOpenAiAttrib(req("kh_oppref=a%20b"))).toBeNull(); // a space: refused, not trimmed
    expect(readOpenAiAttrib(req("kh_oppref=a%3Bb"))).toBeNull();
    expect(readOpenAiAttrib(req("kh_oppref=%E0%A4%A"))).toBeNull(); // malformed escape
  });

  it("refuses an over-long oppref and a malformed obref", () => {
    expect(readOpenAiAttrib(req(`kh_oppref=${"a".repeat(513)}`))).toBeNull();
    expect(readOpenAiAttrib(req("__obref=not_valid!"))).toBeNull();
    expect(readOpenAiAttrib(req(`__obref=${"a".repeat(65)}`))).toBeNull();
  });

  it("falls through an invalid kh_oppref to a valid __oppref", () => {
    expect(readOpenAiAttrib(req("kh_oppref=bad%20value; __oppref=good"))).toEqual({ oai_oppref: "good" });
  });

  it("is null with no cookie or none of ours", () => {
    expect(readOpenAiAttrib(req())).toBeNull();
    expect(readOpenAiAttrib(req("_fbp=fb.1.1.1; kh_utm=x"))).toBeNull();
  });
});

describe("withOpenAiAttrib", () => {
  it("merges the OpenAI keys into Meta's attribution without touching it", () => {
    const fb = { fbp: "fb.1.1.1", ip: "203.0.113.9", ua: "UA" };
    expect(withOpenAiAttrib(fb, req("kh_oppref=abc"))).toEqual({ ...fb, oai_oppref: "abc" });
  });

  it("returns Meta's attribution unchanged when there is no OpenAI signal", () => {
    const fb = { fbp: "fb.1.1.1" };
    expect(withOpenAiAttrib(fb, req("_fbp=x"))).toBe(fb);
    expect(withOpenAiAttrib(null, req())).toBeNull();
  });

  it("stores the OpenAI keys alone when Meta had nothing, so fb_attrib is null only when both are empty", () => {
    expect(withOpenAiAttrib(null, req("kh_oppref=abc"))).toEqual({ oai_oppref: "abc" });
  });
});

describe("openAiCapiPayload", () => {
  it("builds exactly the documented body: top-level, event, user and data keys", () => {
    const body = openAiCapiPayload(order());
    expect(Object.keys(body).sort()).toEqual(["events", "integration_source"]);
    expect(body.integration_source).toBe("kheelona-store");
    expect(body.events).toHaveLength(1);
    const [event] = body.events;
    expect(Object.keys(event).sort()).toEqual(
      ["action_source", "data", "id", "oppref", "source_url", "timestamp_ms", "type", "user"],
    );
    expect(Object.keys(event.user!).sort()).toEqual(["emails_sha256", "ip_address", "obref", "phone_numbers_sha256", "user_agent"]);
    expect(Object.keys(event.data).sort()).toEqual(["amount", "contents", "currency", "type"]);
  });

  it("uses the raw order reference as the event id, the paid time, the store URL and action_source web", () => {
    const [event] = openAiCapiPayload(order()).events;
    expect(event.id).toBe("KH-TEST-F6F6");
    expect(event.type).toBe("order_created");
    expect(event.timestamp_ms).toBe(Date.parse(PAID_AT));
    expect(event.source_url).toBe("https://store.kheelona.com");
    expect(event.action_source).toBe("web");
  });

  it("passes oppref through unmodified and the obref raw", () => {
    const [event] = openAiCapiPayload(order()).events;
    expect(event.oppref).toBe("f6_test_ref");
    expect(event.user?.obref).toBe("3f2a9c1e-77aa-4b1d-9c10-0123456789ab");
  });

  it("hashes the email trimmed and lowercased, and the phone as digits with the country code and no plus", () => {
    const [event] = openAiCapiPayload(order()).events;
    expect(event.user?.emails_sha256).toEqual([sha("parent@example.com")]);
    expect(event.user?.phone_numbers_sha256).toEqual([sha("919000000001")]);
    expect(JSON.stringify(event)).not.toContain("example.com");
    expect(JSON.stringify(event)).not.toContain("9000000001");
  });

  it("takes the IP address and user agent from the order's stored attribution", () => {
    const [event] = openAiCapiPayload(order()).events;
    expect(event.user?.ip_address).toBe("203.0.113.9");
    expect(event.user?.user_agent).toBe("Mozilla/5.0 (Test)");
  });

  it("reports the amount collected, in paise, with the reservation contents", () => {
    const [event] = openAiCapiPayload(order()).events;
    expect(event.data).toEqual({
      type: "contents",
      amount: 49_900,
      currency: "INR",
      contents: [{ id: "khelu-reservation", name: "Khelu reservation", quantity: 1, amount: 49_900, currency: "INR" }],
    });
  });

  it("never carries a name, an address, a child's age or Meta's identifiers", () => {
    const text = JSON.stringify(openAiCapiPayload(order()));
    for (const leak of ["Priya", "Nair", "Example Road", "Bengaluru", "child", "fb.1.123.456", "fbp"]) {
      expect(text, leak).not.toContain(leak);
    }
    expect(text).not.toContain('"4"');
  });

  it("omits every empty optional field instead of sending it empty", () => {
    const [event] = openAiCapiPayload(order({ fb_attrib: null, phone: "" })).events;
    expect(event).not.toHaveProperty("oppref");
    expect(event.user).toEqual({ emails_sha256: [sha("parent@example.com")] });
    const text = JSON.stringify(event);
    expect(text).not.toContain('""');
    expect(text).not.toContain("[]");
  });

  it("drops a phone that is not 8 to 15 digits", () => {
    expect(openAiCapiPayload(order({ phone: "12345" })).events[0].user).not.toHaveProperty("phone_numbers_sha256");
    expect(openAiCapiPayload(order({ phone: "+" + "9".repeat(16) })).events[0].user).not.toHaveProperty("phone_numbers_sha256");
    expect(openAiCapiPayload(order({ phone: "12345678" })).events[0].user?.phone_numbers_sha256).toEqual([sha("12345678")]);
  });

  it("ignores a stored reference that no longer validates", () => {
    const [event] = openAiCapiPayload(order({ fb_attrib: { oai_oppref: "bad value", oai_obref: "bad_value" } as never })).events;
    expect(event).not.toHaveProperty("oppref");
    expect(event.user).not.toHaveProperty("obref");
  });

  it("uses the clock when the order has no paid_at", () => {
    const [event] = openAiCapiPayload(order({ paid_at: null }), 1_700_000_000_000).events;
    expect(event.timestamp_ms).toBe(1_700_000_000_000);
  });

  it("reports a full payment and an unknown tier under their own contents", () => {
    expect(openAiCapiPayload(order({ tier: "full", amount_paise: 799_900 })).events[0].data.contents[0]).toMatchObject({
      id: "khelu-full-payment",
      amount: 799_900,
    });
    expect(openAiCapiPayload(order({ tier: "event" })).events[0].data.contents[0].id).toBe("khelu-event");
  });
});

describe("reportOrderToOpenAi", () => {
  const fetchMock = vi.fn();
  const KEY = "test-key-not-real";

  beforeEach(() => {
    env.site = "production";
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("OPENAI_ADS_CAPI_KEY", KEY);
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-14T10:05:00.000Z"));
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("posts the payload to the pixel's events endpoint with the bearer key and a timeout", async () => {
    await expect(reportOrderToOpenAi(order())).resolves.toBe("sent");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://bzr.openai.com/v1/events?pid=CtmHigpYxafJN3qgbj3xnv");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ authorization: `Bearer ${KEY}`, "content-type": "application/json" });
    expect(JSON.parse(init.body as string)).toEqual(openAiCapiPayload(order()));
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("sends nothing at all without the key: no fetch, one skipped line", async () => {
    vi.stubEnv("OPENAI_ADS_CAPI_KEY", "");
    await expect(reportOrderToOpenAi(order())).resolves.toBe("skipped");
    vi.stubEnv("OPENAI_ADS_CAPI_KEY", "   ");
    await expect(reportOrderToOpenAi(order())).resolves.toBe("skipped");
    vi.unstubAllEnvs();
    delete process.env.OPENAI_ADS_CAPI_KEY;
    await expect(reportOrderToOpenAi(order())).resolves.toBe("skipped");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/^\[openai-capi\] SKIPPED KH-TEST-F6F6/));
  });

  it("skips outside production, even with a key", async () => {
    for (const site of ["development", "preview", "beta"]) {
      env.site = site;
      await expect(reportOrderToOpenAi(order())).resolves.toBe("skipped");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips an order that carries no OpenAI click or browser reference", async () => {
    await expect(reportOrderToOpenAi(order({ fb_attrib: null }))).resolves.toBe("skipped");
    await expect(reportOrderToOpenAi(order({ fb_attrib: { fbp: "fb.1.1.1", ip: "203.0.113.9" } as never }))).resolves.toBe("skipped");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports an order that carries only an obref, or only an oppref", async () => {
    await reportOrderToOpenAi(order({ fb_attrib: { oai_obref: "3f2a9c1e-77aa" } as never }));
    await reportOrderToOpenAi(order({ fb_attrib: { oai_oppref: "abc" } as never }));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("skips an order paid more than 7 days ago, and sends one paid just under", async () => {
    await expect(reportOrderToOpenAi(order({ paid_at: "2026-11-07T10:04:00.000Z" }))).resolves.toBe("skipped");
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(reportOrderToOpenAi(order({ paid_at: "2026-11-07T10:06:00.000Z" }))).resolves.toBe("sent");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns failed on a 4xx or 5xx and logs the status and the start of OpenAI's answer, never the key", async () => {
    fetchMock.mockResolvedValue(new Response("x".repeat(1000), { status: 400 }));
    await expect(reportOrderToOpenAi(order())).resolves.toBe("failed");
    const line = (console.error as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0] as string;
    expect(line).toMatch(/^\[openai-capi\] REJECTED KH-TEST-F6F6: 400 x{400}$/);
    expect(line).not.toContain(KEY);
  });

  it("never throws: a rejecting fetch is failed, and the log holds neither the key nor a hash", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    await expect(reportOrderToOpenAi(order())).resolves.toBe("failed");
    const logged = JSON.stringify((console.error as unknown as { mock: { calls: unknown[][] } }).mock.calls);
    expect(logged).toContain("[openai-capi] FAILED KH-TEST-F6F6");
    expect(logged).not.toContain(KEY);
    expect(logged).not.toContain(sha("parent@example.com"));
  });

  it("never throws on a malformed order either", async () => {
    await expect(reportOrderToOpenAi({ order_ref: "KH-BAD" } as unknown as PreorderRow)).resolves.toMatch(/sent|skipped|failed/);
  });
});

describe("what the server module may read", () => {
  /* A source check, because the allow-list above proves what is sent today and this proves it cannot become a
     different list by a field being read for another reason. */
  const source = readFileSync(join(process.cwd(), "src/lib/ads/openai-capi.ts"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

  it("never reads the child's age, the address or the parent's name from an order", () => {
    expect(source).not.toMatch(/\bchild_age\b/);
    expect(source).not.toMatch(/\bparent_name\b/);
    expect(source).not.toMatch(/\.address\b|["']address["']|\baddress\s*:/); // `ip_address` is OpenAI's own key and is fine
  });
});
