import { storeEnv } from "@/lib/store/env";
import { verifyCheckoutSignature } from "@/lib/store/razorpay";
import { markPaid, notifyPaid } from "@/lib/store/fulfil";
import { rateLimit, clientKey } from "@/lib/store/rate-limit";
import { json, str, NOT_CONFIGURED } from "@/lib/store/http";

/** The fast path: confirm from the browser, with the signature checked (§8.25-p).
 *
 *  Razorpay's checkout handler returns an order id, a payment id, and an HMAC of
 *  the two under our key secret. Only Razorpay can produce that, so verifying it
 *  lets us mark the order paid and send the acknowledgement in the same second
 *  the parent taps, instead of showing them a spinner while a webhook queue
 *  works through its retries.
 *
 *  This does NOT make the webhook optional. If the browser dies here the webhook
 *  still lands, and `markPaid` is idempotent, so whichever arrives second does
 *  nothing. Belt and braces, where the braces are the ones we can rely on. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const env = storeEnv();
  if (!env) return json(503, NOT_CONFIGURED);

  const limit = rateLimit(`confirm:${clientKey(request)}`);
  if (!limit.allowed) return json(429, { error: "too-many" });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json(400, { error: "bad-request" });

  const orderId = str(body.razorpayOrderId, 64);
  const paymentId = str(body.razorpayPaymentId, 64);
  const signature = str(body.razorpaySignature, 128);

  if (!orderId || !paymentId || !signature) return json(400, { error: "bad-request" });

  if (!verifyCheckoutSignature(env.razorpayKeySecret, { orderId, paymentId, signature })) {
    /* Not an error a real parent can cause: the browser got these three values
       from Razorpay itself. Anyone else is guessing. */
    console.warn("[confirm] rejected an invalid checkout signature", orderId);
    return json(403, { error: "bad-signature" });
  }

  try {
    const result = await markPaid(env, { rzpOrderId: orderId, paymentId });
    if (result.outcome === "paid") await notifyPaid(env, result.order);
    return json(200, { ok: true, outcome: result.outcome });
  } catch (error) {
    /* The payment is real and Razorpay knows it, so the webhook will finish the
       job. Tell the browser it worked, because it did. */
    console.error("[confirm] could not record a verified payment", error);
    return json(200, { ok: true, outcome: "pending" });
  }
}
