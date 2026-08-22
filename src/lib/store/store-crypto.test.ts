import { describe, expect, it } from "vitest";
import { sign, verify, signAddressToken, verifyAddressToken } from "./signing";
import { verifyCheckoutSignature, verifyWebhookSignature } from "./razorpay";
import { newOrderRef, isOrderRef, ORDER_REF_PATTERN } from "./order-ref";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The signature checks, against FIXED vectors.
 *
 * Every vector below was computed independently (node -e, openssl-equivalent)
 * and pasted in, rather than recomputed by the same helper the test is checking.
 * That is the whole point: a test that calls createHmac to check createHmac
 * passes just as happily after someone switches the algorithm to sha1, drops the
 * purpose label, or compares with ===. These strings pin the wire format.
 *
 * This is the only file in the repo where a wrong answer means either taking
 * money we should not have, or believing a payment that never happened.
 */

const KEY_SECRET = "secret_test";
const WEBHOOK_SECRET = "whsec";
const SIGNING_SECRET = "s3cret";

describe("Razorpay checkout signature", () => {
  const valid =
    "5969652efa33294ace354be10cd6e420dbc924649053a11bcb32d4594e64fa2b";

  it("accepts the signature Razorpay computes for order|payment", () => {
    expect(
      verifyCheckoutSignature(KEY_SECRET, {
        orderId: "order_abc",
        paymentId: "pay_xyz",
        signature: valid,
      }),
    ).toBe(true);
  });

  it("rejects a signature for a DIFFERENT payment against the same order", () => {
    expect(
      verifyCheckoutSignature(KEY_SECRET, {
        orderId: "order_abc",
        paymentId: "pay_other",
        signature: valid,
      }),
    ).toBe(false);
  });

  it("rejects the wrong key, a truncated signature, and rubbish", () => {
    const base = { orderId: "order_abc", paymentId: "pay_xyz" };
    expect(verifyCheckoutSignature("other_secret", { ...base, signature: valid })).toBe(false);
    expect(verifyCheckoutSignature(KEY_SECRET, { ...base, signature: valid.slice(0, 32) })).toBe(false);
    expect(verifyCheckoutSignature(KEY_SECRET, { ...base, signature: "zzzz" })).toBe(false);
    expect(verifyCheckoutSignature(KEY_SECRET, { ...base, signature: "" })).toBe(false);
  });
});

describe("Razorpay webhook signature", () => {
  const rawBody = String.raw`{"event":"order.paid"}`;
  const valid = "9aa6d3ae7b4d73320d26267695c2750a28e729ccc215f97d6e3bae31a2465370";

  it("accepts the header for the exact raw body", () => {
    expect(verifyWebhookSignature(WEBHOOK_SECRET, rawBody, valid)).toBe(true);
  });

  /* The classic mistake: parse the JSON, re-stringify it, verify that. The
     bytes change, the HMAC stops matching, and the 2am fix is to stop
     checking. This test is here to make that failure visible in daylight. */
  it("rejects a body that differs by one byte, which is why handlers must use the raw text", () => {
    // a trailing space, exactly what a re-serialise or a trim can introduce
    expect(verifyWebhookSignature(WEBHOOK_SECRET, `${rawBody} `, valid)).toBe(false);
    // and a re-serialised body with different key spacing
    expect(
      verifyWebhookSignature(WEBHOOK_SECRET, String.raw`{"event": "order.paid"}`, valid),
    ).toBe(false);
  });

  it("rejects a tampered payload and a missing header", () => {
    expect(
      verifyWebhookSignature(WEBHOOK_SECRET, String.raw`{"event":"order.failed"}`, valid),
    ).toBe(false);
    expect(verifyWebhookSignature(WEBHOOK_SECRET, rawBody, null)).toBe(false);
  });
});

describe("our own signed links", () => {
  it("signs an event id to a known short digest", () => {
    expect(sign(SIGNING_SECRET, "event-link", "blr-aug")).toBe("ieW9NcWgHmASN60o");
  });

  /* Key separation, tested rather than trusted: the same secret and the same
     payload must produce a different signature per purpose, so an event link
     can never be replayed as an address token. */
  it("gives the same payload a different signature per purpose", () => {
    expect(sign(SIGNING_SECRET, "address-token", "blr-aug")).toBe("jnPMw8GCijhg_TLt");
    expect(sign(SIGNING_SECRET, "event-link", "blr-aug")).not.toBe(
      sign(SIGNING_SECRET, "address-token", "blr-aug"),
    );
    expect(
      verify(SIGNING_SECRET, "event-link", "blr-aug", sign(SIGNING_SECRET, "address-token", "blr-aug")),
    ).toBe(false);
  });

  it("refuses a signature minted for a different event", () => {
    const forBlr = sign(SIGNING_SECRET, "event-link", "blr-aug");
    expect(verify(SIGNING_SECRET, "event-link", "blr-aug", forBlr)).toBe(true);
    expect(verify(SIGNING_SECRET, "event-link", "del-sep", forBlr)).toBe(false);
  });
});

/* The CLI that prints event links re-implements sign() outside the app, because
   it runs as a plain node script with no bundler. Three details have to match or
   every printed QR code is worthless: the purpose label, base64url, and the
   16-character truncation. A structural check is worth more here than nothing,
   and the real proof is the recorded vector above: running
   `STORE_SIGNING_SECRET=s3cret npm run event-link -- blr-aug` prints exactly
   ieW9NcWgHmASN60o. */
describe("the event-link CLI stays in step with the server", () => {
  it("signs with the same label, encoding and length", () => {
    const cli = readFileSync(join(process.cwd(), "tools/store/event-link.mjs"), "utf8");
    expect(cli).toContain("`event-link:${tierId}`");
    expect(cli).toContain('digest("base64url")');
    expect(cli).toContain(".slice(0, 16)");
  });
});

describe("address tokens", () => {
  const now = Date.UTC(2026, 7, 22);
  const later = now + 1000;
  const token = signAddressToken(SIGNING_SECRET, "KH-A2B3-C4D5", now + 60_000);

  it("lets the right order edit itself while the link is fresh", () => {
    expect(verifyAddressToken(SIGNING_SECRET, "KH-A2B3-C4D5", token, later)).toBe(true);
  });

  it("refuses another family's order reference", () => {
    expect(verifyAddressToken(SIGNING_SECRET, "KH-Z9Y8-X7W6", token, later)).toBe(false);
  });

  it("refuses an expired link, and an expiry edited to buy more time", () => {
    expect(verifyAddressToken(SIGNING_SECRET, "KH-A2B3-C4D5", token, now + 120_000)).toBe(false);
    const [, mac] = token.split(".");
    const extended = `${now + 999_000}.${mac}`;
    expect(verifyAddressToken(SIGNING_SECRET, "KH-A2B3-C4D5", extended, later)).toBe(false);
  });

  it("refuses a malformed token instead of throwing", () => {
    for (const bad of ["", ".", "abc", "123.", `${now + 60_000}.`]) {
      expect(verifyAddressToken(SIGNING_SECRET, "KH-A2B3-C4D5", bad, later)).toBe(false);
    }
  });
});

describe("order references", () => {
  it("matches its own pattern, every time", () => {
    for (let i = 0; i < 200; i += 1) expect(newOrderRef()).toMatch(ORDER_REF_PATTERN);
  });

  /* The alphabet exists so a parent can read the reference over WhatsApp
     without us asking "was that a one or an I". If a confusable character
     appears, that promise is broken. */
  it("never emits a character people misread", () => {
    const refs = Array.from({ length: 300 }, () => newOrderRef()).join("");
    expect(refs).not.toMatch(/[01OILU]/);
  });

  it("collides rarely enough to rely on the unique constraint as a backstop", () => {
    const seen = new Set(Array.from({ length: 2000 }, () => newOrderRef()));
    expect(seen.size).toBe(2000);
  });

  it("recognises only its own shape", () => {
    expect(isOrderRef("KH-A2B3-C4D5")).toBe(true);
    for (const bad of ["KH-A2B3C4D5", "kh-a2b3-c4d5", "KH-A2B3-C4D", "KH-O0I1-C4D5", 42, null]) {
      expect(isOrderRef(bad)).toBe(false);
    }
  });
});

/* Go-live ergonomics, guarded: /api/health must name what is missing so
   switching the store on is one request rather than a redeploy loop. Names
   only, and never a value: the names are already public in .env.example. */
describe("missingStoreEnv", () => {
  const KEYS = [
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STORE_SIGNING_SECRET",
  ] as const;

  it("names every required variable when nothing is set", async () => {
    const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
    for (const k of KEYS) delete process.env[k];
    const { missingStoreEnv } = await import("./env");
    expect(missingStoreEnv().sort()).toEqual([...KEYS].sort());
    for (const [k, v] of Object.entries(saved)) if (v !== undefined) process.env[k] = v;
  });

  it("names only the one that is actually absent, and treats DUMMY as absent", async () => {
    const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
    for (const k of KEYS) process.env[k] = "real-looking-value";
    process.env.STORE_SIGNING_SECRET = "DUMMY";
    const { missingStoreEnv } = await import("./env");
    expect(missingStoreEnv()).toEqual(["STORE_SIGNING_SECRET"]);
    for (const k of KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });
});
