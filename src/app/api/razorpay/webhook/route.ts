import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { verifyWebhookSignature } from "@/lib/store/razorpay";
import { markPaid, notifyPaid, markRefunded, markFailed, alertNotPayable } from "@/lib/store/fulfil";
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
/** A refund that has actually reached the customer's account. `refund.created`
 *  is only the instruction, so acting on it would clear an order before the money
 *  has moved. */
const REFUND_EVENTS = new Set(["refund.processed"]);
const FAILED_EVENTS = new Set(["payment.failed"]);

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
    .insert({
      id: eventId,
      event_type: event.event,
      order_ref: rzpOrderId,
      /* A SUMMARY, not the whole event (F-05). This used to store the delivery
         verbatim and keep it forever, which meant a second copy of the payer's
         email, phone and card metadata accumulating in our database for every
         payment, none of which idempotency or reconciliation needs. Razorpay
         keeps the full event on their side; what we need is enough to match a
         row to a payment afterwards. */
      payload: summarise(event),
    });

  if (claimError) {
    // 23505 is unique_violation: we have already handled this delivery.
    if (claimError.code === "23505") return json(200, { ok: true, note: "already handled" });
    console.error("[webhook] could not claim the event", claimError);
    return json(500, { ok: false });
  }

  try {
    /* A refund takes the order OUT of the dispatch queue. Until this existed the
       queue (status='paid') still contained people who had cancelled and been
       repaid, and the only thing preventing a shipment to them was somebody
       remembering to run an UPDATE by hand (§8.25-ee). */
    if (REFUND_EVENTS.has(event.event)) {
      const refund = event.payload?.refund?.entity;
      if (!refund?.payment_id) return json(200, { ok: true, note: "refund without a payment id" });
      const outcome = await markRefunded(env, {
        paymentId: refund.payment_id,
        refundedPaise: refund.amount ?? 0,
      });
      return json(200, { ok: true, note: outcome });
    }

    if (FAILED_EVENTS.has(event.event)) {
      const failedOrderId = event.payload?.payment?.entity?.order_id;
      if (failedOrderId) await markFailed(env, failedOrderId);
      return json(200, { ok: true, note: "failed" });
    }

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
      /* What the gateway says it actually captured, so an order cannot be
         marked paid by less than its own amount (F-06). Absent on events that
         carry no payment entity, and then the check simply does not apply. */
      paidPaise:
        event.payload?.payment?.entity?.amount ?? event.payload?.order?.entity?.amount_paid ?? null,
      /* Our own reference, which we set as the Razorpay order's receipt and in
         its notes. It is the fallback that rescues a payment whose gateway order
         id never made it onto our row. */
      orderRef:
        event.payload?.order?.entity?.notes?.order_ref ??
        event.payload?.order?.entity?.receipt ??
        event.payload?.payment?.entity?.notes?.order_ref ??
        null,
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
    if (result.outcome === "not-payable") {
      /* Money for an order somebody already took out of the queue. 200, not
         500: a retry delivers the same event against the same refused row
         forever, and a 5xx would make Razorpay hammer us and churn the claim
         row. But a log line is not a signal on its own (§8.30-q), and this is
         real money against a refunded or cancelled order, so it also raises an
         internal alert. Never notifyPaid, which would mail the CUSTOMER a
         receipt for an order we are refusing. */
      console.error(
        `[webhook] refused to resurrect ${rzpOrderId}: the order is '${result.status}'`,
      );
      await alertNotPayable(env, rzpOrderId, result.status);
    }
    if (result.outcome === "short-paid") {
      /* 200, not 500: a retry would deliver the same short amount forever. The
         order stays unpaid and out of the dispatch queue, which is the truth,
         and markPaid has already said so loudly in the log (F-06). */
      console.error("[webhook] refused a short payment on", rzpOrderId);
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
    payment?: {
      entity?: { id?: string; order_id?: string; amount?: number; notes?: { order_ref?: string } };
    };
    order?: {
      entity?: {
        id?: string;
        receipt?: string;
        amount_paid?: number;
        notes?: { order_ref?: string };
      };
    };
    refund?: { entity?: { id?: string; payment_id?: string; amount?: number } };
  };
};

/** The order id sits in a different place depending on the event. The kind of
 *  detail a webhook handler gets wrong once and then never again. */
function extractOrderId(event: RazorpayWebhook): string | null {
  return event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id ?? null;
}

/** What is worth keeping from a delivery, and nothing else (F-05).
 *
 *  Ids and amounts, so a row can be reconciled against the gateway months
 *  later. Deliberately NOT the payer's email or phone, which we already hold on
 *  the order itself, and NOT the card block, which we have no use for at all.
 *  An allow-list rather than a deny-list, so a new field Razorpay adds one day
 *  does not quietly start being stored. */
function summarise(event: RazorpayWebhook): Record<string, unknown> {
  const payment = event.payload?.payment?.entity;
  const order = event.payload?.order?.entity;
  const refund = event.payload?.refund?.entity;

  const summary: Record<string, unknown> = { event: event.event };
  if (payment) {
    summary.payment = { id: payment.id, order_id: payment.order_id, amount: payment.amount };
  }
  if (order) {
    summary.order = { id: order.id, receipt: order.receipt, amount_paid: order.amount_paid };
  }
  if (refund) {
    summary.refund = { id: refund.id, payment_id: refund.payment_id, amount: refund.amount };
  }
  return summary;
}
