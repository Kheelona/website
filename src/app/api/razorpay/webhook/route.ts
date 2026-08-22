import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { verifyWebhookSignature } from "@/lib/store/razorpay";
import { markPaid, notifyPaid } from "@/lib/store/fulfil";
import { json } from "@/lib/store/http";

/** The Razorpay webhook: the guaranteed path to a paid order (§8.25-m).
 *
 *  The browser callback confirms fast; this confirms for certain. A browser can
 *  be closed, throttled or offline at the moment it matters, so the record of
 *  money must not depend on one.
 *
 *  Three properties, in this order:
 *
 *   1. VERIFIED. The signature is checked against the RAW body text, before the
 *      JSON is parsed, because re-serialising changes the bytes and breaks the
 *      HMAC. The tempting 2am fix for that is to stop checking.
 *   2. IDEMPOTENT, twice over. Claiming the event id in `webhook_events` stops
 *      repeated deliveries, and `markPaid` is idempotent by itself, which covers
 *      the case the claim cannot: the callback having already done the work.
 *   3. HONEST ABOUT FAILURE. If we claim an event and then fail, the claim is
 *      released and we answer 500 so Razorpay retries. A swallowed failure here
 *      is a paid order nobody ever hears about. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAID_EVENTS = new Set(["order.paid", "payment.captured"]);

export async function POST(request: Request) {
  const env = storeEnv();
  if (!env) {
    // 503, not 200: let Razorpay retry once the keys are in place.
    console.error("[webhook] arrived before the store was configured");
    return json(503, { ok: false });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(env.razorpayWebhookSecret, raw, signature)) {
    /* Never say more than this. An unsigned caller must not learn whether the
       secret, the body or the header was the problem. */
    console.warn("[webhook] rejected an unsigned or tampered request");
    return json(400, { ok: false });
  }

  const event = JSON.parse(raw) as RazorpayWebhook;
  const eventId = request.headers.get("x-razorpay-event-id") ?? event.id ?? null;
  if (!eventId) {
    console.error("[webhook] no event id to deduplicate on", event.event);
    return json(400, { ok: false });
  }

  const client = db(env);
  const rzpOrderId = extractOrderId(event);

  const { error: claimError } = await client
    .from("webhook_events")
    .insert({ id: eventId, event_type: event.event, order_ref: rzpOrderId, payload: event });

  if (claimError) {
    // 23505 is unique_violation: we have already handled this delivery.
    if (claimError.code === "23505") return json(200, { ok: true, note: "already handled" });
    console.error("[webhook] could not claim the event", claimError);
    return json(500, { ok: false });
  }

  try {
    if (!PAID_EVENTS.has(event.event)) {
      /* Recorded for the audit trail, acted on by nothing. Razorpay sends more
         event types than we subscribe to, and silence is correct. */
      return json(200, { ok: true, note: "ignored" });
    }
    if (!rzpOrderId) {
      console.error("[webhook] paid event carried no order id", eventId, event.event);
      return json(200, { ok: true, note: "no order id" });
    }

    const result = await markPaid(env, {
      rzpOrderId,
      paymentId: event.payload?.payment?.entity?.id ?? null,
    });

    if (result.outcome === "paid") {
      await notifyPaid(env, result.order);
      return json(200, { ok: true });
    }

    if (result.outcome === "unknown") {
      /* Money for an order we have no record of. Nothing to retry, everything
         to investigate: this is the one line in the store worth an alert. */
      console.error("[webhook] paid an order id we do not have", rzpOrderId);
    }
    return json(200, { ok: true, note: result.outcome });
  } catch (error) {
    /* Release the claim so the retry can do the work. Without this, one
       transient database error becomes a payment we never processed. */
    console.error("[webhook] processing failed, releasing the claim", error);
    await client.from("webhook_events").delete().eq("id", eventId);
    return json(500, { ok: false });
  }
}

type RazorpayWebhook = {
  id?: string;
  event: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
    order?: { entity?: { id?: string } };
  };
};

/** The order id sits in a different place depending on the event. The kind of
 *  detail a webhook handler gets wrong once and then never again. */
function extractOrderId(event: RazorpayWebhook): string | null {
  return event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id ?? null;
}
