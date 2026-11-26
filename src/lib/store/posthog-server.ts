import { PostHog } from "posthog-node";
import { POSTHOG_API_HOST, POSTHOG_KEY } from "@/config/site";
import { SITE_ENV } from "@/config/env";
import type { PreorderRow } from "./db";

/** The paid order, reported to PostHog BY THE SERVER (§8.40, 2026-09-20).
 *
 *  WHY THIS EXISTS. The browser already sends `purchase` from Razorpay's
 *  `onPaid` callback, and that callback is not guaranteed to run: a parent who
 *  pays and closes the tab, or whose network drops at the wrong second, never
 *  fires it. The authoritative paid signal is the webhook. So before this file,
 *  Supabase recorded the payment and `reportPurchaseToMeta` sent it onward,
 *  while PostHog and GA4 never heard about it — **Meta was the only tool that
 *  could not miss a sale**, and PostHog's revenue was under-counted by a rate
 *  nobody measured.
 *
 *  Same contract as `meta-capi.ts` beside it, deliberately: never throws,
 *  returns "sent" | "skipped" | "failed", and logs the success as well as the
 *  failure, because "sent" and "skipped" being equally silent is what made the
 *  Meta log useless the first time anyone asked it a question.
 *
 *  NO NEW SECRET. The `phc_` project key is a public client-side identifier that
 *  already ships in the page (§8.38-a); it authorises writing events into this
 *  project and nothing else. This avoids a founder-gated Vercel variable, and
 *  the Vercel trap where a variable only applies to deployments created after it
 *  changes.
 *
 *  NOT THROUGH `/ingest`. The reverse proxy exists so an ad blocker cannot drop
 *  a request in a BROWSER. There is no blocker here, and routing server traffic
 *  through our own edge would add a hop and a failure mode for nothing. */

/** 🔴 DELIBERATELY NOT `purchase`, and this is the load-bearing decision.
 *
 *  Sending the same name the browser sends would double-count revenue on every
 *  order where BOTH fire, unless PostHog de-duplicated them. Its only dedup key
 *  is the event `uuid`, which the installed SDK's own types require to be "a
 *  valid UUID" — our `KH-XXXX-XXXX` reference is not one, and minting a UUID
 *  that both sides could derive would be a second mechanism to get wrong.
 *
 *  A distinct name needs no dedup at all. It is additive, it can never inflate a
 *  number the founder reads, and the gap between the two counts is itself the
 *  useful measurement: it IS the client-event loss rate. Build dashboards on
 *  this one, because it is the one that cannot be missed. */
export const PURCHASE_CONFIRMED = "purchase_confirmed";

type Event = {
  distinctId: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: Date | undefined;
};

/** Pure, so the payload is testable without a network or a client. */
export function purchaseConfirmedEvent(order: PreorderRow): Event {
  return {
    /* Stitching (founder, 2026-09-20). The stored id is the browser's own
       anonymous device id, so this event lands in the same funnel as the form
       events rather than beside it. Falling back to the order reference keeps
       the sale rather than the stitch when there is no id: orders predating
       migration 0004 have none, and so does a visitor with PostHog blocked. */
    distinctId: order.ph_distinct_id ?? order.order_ref,
    event: PURCHASE_CONFIRMED,
    properties: {
      transaction_id: order.order_ref,
      currency: "INR",
      /* Rupees, matching the browser event and GA4. Paise here would make every
         revenue chart wrong by a factor of a hundred. */
      value: order.amount_paise / 100,
      tier: order.tier,
      /* So a reader can see at a glance which of the two purchase events this
         is, without knowing the history above. */
      source: "webhook",
      /* The campaign, read off the order row because the server has no session
         and no cookie to infer it from. Spread rather than nested so PostHog
         can break revenue down by campaign without a transform. */
      ...(order.utm ?? {}),
      /* Stitched, but still ANONYMOUS. Funnels key on distinct_id, so they work
         perfectly without a person profile; creating one would weld a billable
         identity to a parent, which the 2026-09-19 round declined on purpose. */
      $process_person_profile: false,
      ...(SITE_ENV !== "production" ? { env: SITE_ENV } : {}),
    },
    /* When the money actually arrived, not when the webhook happened to be
       processed. A retried webhook must not move the sale in time. */
    timestamp: order.paid_at ? new Date(order.paid_at) : undefined,
  };
}

/** A refund, reported BY THE SERVER beside the sale it undoes (D074, K-124, 2026-11-26).
 *
 *  WHY. The north star is paid AND not refunded, and the ad-spend-per-reservation
 *  ceiling has to be measured on reservations that stay. The webhook already
 *  knows (`refund.processed` -> `markRefunded`, which takes the order out of the
 *  dispatch queue), but until now PostHog never heard of it: every refund was a
 *  database row only. Same reasoning as `purchase_confirmed` above, and the same
 *  rules: the name is distinct (additive, can never inflate a revenue number),
 *  the server sends it (a browser is not there), and it is anonymous.
 *
 *  JOIN KEY. `transaction_id` is the order reference, and `distinctId` is the
 *  one `purchase_confirmed` used, so a refund lands on the sale it belongs to.
 *
 *  NO PERSONAL DATA. No name, phone, email, address, child age, payment id or
 *  refund id: the order reference is the only identifier, and it is the join. */
export const PURCHASE_REFUNDED = "purchase_refunded";

/** The columns of an order the refund event reads (the webhook's `markRefunded`
 *  selects exactly these, plus the ones it already used). */
export type RefundedOrder = Pick<PreorderRow, "order_ref" | "tier" | "utm" | "ph_distinct_id">;

/** What the gateway says came back: the amount of THIS refund, and whether it is
 *  less than the order's own amount. */
export type RefundDetail = { refundedPaise: number; partial: boolean };

/** Pure, so the payload is testable without a network or a client. */
export function purchaseRefundedEvent(order: RefundedOrder, refund: RefundDetail): Event {
  return {
    /* Same stitch as `purchase_confirmed`: the browser's own anonymous device id
       when the order has one, else the order reference. */
    distinctId: order.ph_distinct_id ?? order.order_ref,
    event: PURCHASE_REFUNDED,
    properties: {
      transaction_id: order.order_ref,
      currency: "INR",
      /* Rupees of THIS refund, as the purchase event reports rupees. A partial
         refund sends its own amount, never the order's. */
      value: refund.refundedPaise / 100,
      tier: order.tier,
      /* A refund covering the whole order is `false`; anything less is `true`
         and leaves the order's status for a human (markRefunded). */
      partial: refund.partial,
      source: "webhook",
      /* The order's campaign, flat, exactly as `purchase_confirmed` spreads it. */
      ...(order.utm ?? {}),
      $process_person_profile: false,
      ...(SITE_ENV !== "production" ? { env: SITE_ENV } : {}),
    },
    /* No timestamp: PostHog stamps the moment the webhook processes the refund,
       which is when Razorpay says it reached the customer's account. */
    timestamp: undefined,
  };
}

/** One event to PostHog, flushed before it returns. The paid and the refunded
 *  report both go through here, so neither can forget the flush or the contract:
 *  never throws, returns "sent" | "skipped" | "failed", logs all three. */
async function sendToPostHog(
  ref: string,
  build: () => Event,
  whenSkipped: string,
): Promise<"sent" | "skipped" | "failed"> {
  if (!POSTHOG_KEY) {
    console.warn(`[posthog] SKIPPED ${ref}: ${whenSkipped}`);
    return "skipped";
  }

  const client = new PostHog(POSTHOG_KEY, {
    host: POSTHOG_API_HOST,
    /* One event then straight out. The default batches at 20 and flushes on a
       5s timer, neither of which a request-scoped function lives long enough
       to see. */
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    const event = build();
    client.capture(event);
    /* 🔴 THE FLUSH IS THE WHOLE THING. posthog-node QUEUES; a serverless
       function returns long before any timer fires, and the event dies with it.
       The SDK's own comment on flush() says it is "concurrent so a serverless
       handler waits for one round trip". Capturing without awaiting this would
       reintroduce, one layer down, the exact silent loss this file exists to
       fix. */
    await client.flush();
    console.warn(`[posthog] SENT ${ref}: ${event.event}`);
    return "sent";
  } catch (error) {
    /* The payment path never fails because an analytics call did. */
    console.error(`[posthog] FAILED ${ref}: ${String(error)}`);
    return "failed";
  }
}

export async function reportPurchaseToPostHog(
  order: PreorderRow,
): Promise<"sent" | "skipped" | "failed"> {
  return sendToPostHog(
    order.order_ref,
    () => purchaseConfirmedEvent(order),
    "no project key, so only the browser event was sent",
  );
}

/** `purchase_refunded` (D074): called by `markRefunded` AFTER the status update,
 *  for a full refund and for a partial one. Same never-throw contract as above,
 *  so a PostHog failure can neither change the webhook's answer nor the order. A
 *  refund of no money is not a refund: nothing is sent for it. */
export async function reportRefundToPostHog(
  order: RefundedOrder,
  refund: RefundDetail,
): Promise<"sent" | "skipped" | "failed"> {
  if (!(refund.refundedPaise > 0)) {
    console.warn(`[posthog] SKIPPED ${order.order_ref}: the refund carried no positive amount`);
    return "skipped";
  }
  return sendToPostHog(
    order.order_ref,
    () => purchaseRefundedEvent(order, refund),
    "no project key, so no refund event was sent",
  );
}
