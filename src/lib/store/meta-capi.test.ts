import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { purchasePayload, readFbAttrib } from "./meta-capi";
import { purchaseEventId } from "@/lib/fbq";
import type { PreorderRow } from "./db";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

function order(over: Partial<PreorderRow> = {}): PreorderRow {
  return {
    id: 1,
    order_ref: "KH-KZYJ-PEHT",
    tier: "launch",
    amount_paise: 49_900,
    status: "paid",
    parent_name: "  Shweta  Sharma ",
    phone: "+919187546483",
    email: "  Parent@Example.COM ",
    child_age: "4",
    wa_consent: true,
    terms_accepted_at: null,
    address: null,
    rzp_order_id: "order_x",
    rzp_payment_id: "pay_x",
    balance_status: "due",
    utm: null,
    fb_attrib: { fbp: "fb.1.123.456", ip: "203.0.113.9", ua: "Mozilla/5.0" },
    created_at: "2026-09-02T00:00:00.000Z",
    paid_at: "2026-09-02T10:00:00.000Z",
    ...over,
  } as PreorderRow;
}

describe("purchasePayload", () => {
  /* The de-duplication contract. If this ever stops matching what the browser
     sends, every order is counted twice: once by the pixel, once by us. */
  it("uses the same event_id the browser sends", () => {
    const p = purchasePayload(order(), "TOKEN");
    expect(p.data[0].event_id).toBe(purchaseEventId("KH-KZYJ-PEHT"));
    expect(p.data[0].event_name).toBe("Purchase");
  });

  it("reports the amount collected, in rupees, matching the browser event", () => {
    const p = purchasePayload(order(), "TOKEN");
    expect(p.data[0].custom_data).toMatchObject({ currency: "INR", value: 499 });
  });

  /* Raw PII must never leave. Meta wants SHA-256 of a trimmed, lowercased
     value, and a phone as digits with no plus. */
  it("hashes the email, lowercased and trimmed", () => {
    const p = purchasePayload(order(), "TOKEN");
    const ud = p.data[0].user_data as Record<string, string>;
    expect(ud.em).toBe(sha("parent@example.com"));
  });

  it("hashes the phone as digits only, with no plus", () => {
    const ud = purchasePayload(order(), "TOKEN").data[0].user_data as Record<string, string>;
    expect(ud.ph).toBe(sha("919187546483"));
  });

  it("hashes only the FIRST name, because a full name matches worse", () => {
    const ud = purchasePayload(order(), "TOKEN").data[0].user_data as Record<string, string>;
    expect(ud.fn).toBe(sha("shweta"));
  });

  it("never carries a raw email, phone or name anywhere in the body", () => {
    const body = JSON.stringify(purchasePayload(order(), "TOKEN"));
    expect(body).not.toContain("parent@example.com");
    expect(body).not.toContain("Parent@Example.COM");
    expect(body).not.toContain("9187546483");
    expect(body.toLowerCase()).not.toContain("shweta");
  });

  it("passes the attribution signals through for match quality", () => {
    const ud = purchasePayload(order(), "TOKEN").data[0].user_data as Record<string, string>;
    expect(ud.fbp).toBe("fb.1.123.456");
    expect(ud.client_ip_address).toBe("203.0.113.9");
    expect(ud.client_user_agent).toBe("Mozilla/5.0");
  });

  /* Orders created before the column existed, and visitors with the pixel
     blocked, both legitimately have nothing. That must send a thinner event,
     never a broken one. */
  it("still builds a valid event when there is no attribution at all", () => {
    const ud = purchasePayload(order({ fb_attrib: null }), "TOKEN").data[0]
      .user_data as Record<string, string>;
    expect(ud.em).toBeTruthy();
    expect(ud.fbp).toBeUndefined();
    expect(ud.client_ip_address).toBeUndefined();
  });

  it("times the event to when the money moved, in seconds", () => {
    const p = purchasePayload(order(), "TOKEN");
    expect(p.data[0].event_time).toBe(Math.floor(Date.parse("2026-09-02T10:00:00.000Z") / 1000));
  });

  /* The test code diverts real conversions into Meta's test stream, where they
     do not count. It must be absent unless deliberately set. */
  it("omits test_event_code unless one is given", () => {
    expect(purchasePayload(order(), "TOKEN").test_event_code).toBeUndefined();
    expect(purchasePayload(order(), "TOKEN", "TEST123").test_event_code).toBe("TEST123");
  });
});

describe("readFbAttrib", () => {
  const req = (headers: Record<string, string>) =>
    new Request("https://store.kheelona.com/api/preorder/create-order", {
      method: "POST",
      headers,
    });

  it("reads the pixel cookies the browser already sends", () => {
    const attrib = readFbAttrib(
      req({ cookie: "_fbp=fb.1.999.888; _fbc=fb.1.999.CLICK; other=x", "user-agent": "UA/1" }),
    );
    expect(attrib).toMatchObject({ fbp: "fb.1.999.888", fbc: "fb.1.999.CLICK", ua: "UA/1" });
  });

  /* F-14: the client IP must come from the hardened extraction, never from the
     caller-suppliable first hop of x-forwarded-for. */
  it("takes the IP from x-real-ip, which the platform sets", () => {
    const attrib = readFbAttrib(req({ "x-real-ip": "203.0.113.7", cookie: "_fbp=a" }));
    expect(attrib?.ip).toBe("203.0.113.7");
  });

  it("returns null when there is nothing worth storing, so the column stays NULL", () => {
    expect(readFbAttrib(req({}))).toBeNull();
  });

  it("does not invent an fbc when the visitor did not arrive from an ad", () => {
    const attrib = readFbAttrib(req({ cookie: "_fbp=fb.1.1.1" }));
    expect(attrib?.fbc).toBeUndefined();
  });

  /* These go into our database and then into an outbound request body, and a
     cookie is whatever a browser chooses to send. */
  it("caps what a browser can push into the column", () => {
    const attrib = readFbAttrib(req({ cookie: `_fbp=${"x".repeat(5000)}` }));
    expect(attrib!.fbp!.length).toBeLessThanOrEqual(256);
  });
});
