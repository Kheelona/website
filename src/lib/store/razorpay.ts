import { createHmac, timingSafeEqual } from "node:crypto";

/** Razorpay, over fetch (§8.25).
 *
 *  No SDK on purpose. We use two endpoints and two HMAC checks, all of which
 *  are a few lines each, and a payment path is the last place to add a
 *  dependency whose release notes nobody reads.
 *
 *  THE RULE THIS FILE EXISTS TO ENFORCE: the amount is decided here, on the
 *  server, from our own tier table. A client tells us WHICH tier it wants, never
 *  how much it costs. Everything else about a payment can be retried or
 *  corrected; a client-supplied price cannot be taken back once it is charged. */

const API = "https://api.razorpay.com/v1";

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
};

function authHeader(keyId: string, keySecret: string): string {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function createRazorpayOrder(
  env: { razorpayKeyId: string; razorpayKeySecret: string },
  input: { amountPaise: number; orderRef: string; notes?: Record<string, string> },
): Promise<RazorpayOrder> {
  if (!Number.isInteger(input.amountPaise) || input.amountPaise <= 0) {
    // A non-integer amount is a programming error, not a user error, and it
    // must never reach the gateway as a rounded-down rupee.
    throw new Error(`refusing to create an order for ${input.amountPaise} paise`);
  }

  const response = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      authorization: authHeader(env.razorpayKeyId, env.razorpayKeySecret),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: "INR",
      receipt: input.orderRef,
      notes: { order_ref: input.orderRef, ...input.notes },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`razorpay order create failed (${response.status}): ${body}`);
  }
  return (await response.json()) as RazorpayOrder;
}

/** Verify the signature Razorpay's own checkout handler returns in the browser.
 *  This is a belt on top of the webhook, not a replacement for it: it proves the
 *  redirect we are about to show is about a real payment, while the webhook is
 *  what actually marks the order paid. */
export function verifyCheckoutSignature(
  keySecret: string,
  input: { orderId: string; paymentId: string; signature: string },
): boolean {
  const expected = createHmac("sha256", keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  return safeEqualHex(expected, input.signature);
}

/** Verify the `x-razorpay-signature` header against the RAW request body.
 *
 *  Raw, byte for byte. Re-serialising the parsed JSON changes key order and
 *  whitespace, the HMAC no longer matches, and the tempting fix at 2am is to
 *  stop checking the signature. Route handlers must read `await request.text()`
 *  and pass that string here. */
export function verifyWebhookSignature(
  webhookSecret: string,
  rawBody: string,
  signature: string | null,
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

function safeEqualHex(expected: string, candidate: string): boolean {
  if (typeof candidate !== "string" || candidate.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(candidate, "hex"));
  } catch {
    // non-hex input reaches here; a malformed signature is simply invalid
    return false;
  }
}

/** The webhook events we act on. `order.paid` fires once the full amount of an
 *  order is captured, which is the moment a pre-order becomes real. */
export const PAID_EVENTS = ["order.paid", "payment.captured"] as const;
