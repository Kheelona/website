import { db, type PreorderRow } from "./db";
import { signAddressToken, ADDRESS_TOKEN_TTL_MS } from "./signing";
import { sendEmail } from "@/lib/email/send";
import { preorderAckEmail, internalAlertEmail } from "@/lib/email/templates";
import { STORE_URL } from "@/config/site";
import type { StoreEnv } from "./env";
import { reportPurchaseToMeta } from "./meta-capi";

/** Marking a pre-order paid, once (§8.25-p).
 *
 *  TWO PATHS REACH THIS, on purpose:
 *
 *   - the browser callback, whose signature we verify, because a parent who has
 *     just paid should see "confirmed" in the same second rather than watching a
 *     spinner wait for a queue they cannot see;
 *   - the webhook, which is the one that is guaranteed to arrive, because a
 *     browser can be closed, backgrounded or offline at the moment it matters.
 *
 *  Neither is trusted to be the only one, and neither may act twice. The
 *  idempotency is in the UPDATE itself: `.in("status", PAYABLE_STATUSES)` means
 *  the second path to arrive matches no row, gets `already`, and sends no second
 *  email. That is one atomic statement in Postgres rather than a read-then-write
 *  we would have to reason about under a race.
 *
 *  It was `.neq("status", "paid")` until 2026-09-02, and the allow-list that
 *  replaced it is not a tidy-up: a negation of `paid` also admits `refunded` and
 *  `cancelled`, so a webhook retry could put a refunded customer back in the
 *  dispatch queue (§8.30-s). See PAYABLE_STATUSES below. */

/** The only states an order may become paid FROM. Deliberately an allow-list.
 *
 *  It used to be `.neq("status", "paid")`, which reads as "not already paid" and
 *  is right about the case it was written for and wrong about two others:
 *  `refunded` and `cancelled` both satisfy it. So a webhook retry arriving after
 *  a refund would flip the row back to paid, put a refunded customer BACK IN THE
 *  DISPATCH QUEUE (`status='paid'` IS the queue, §8.25-ee), send them a second
 *  receipt and report a second Purchase to Meta. That is the same failure §8.25-ee
 *  closed, re-entered from the opposite direction: the refund handler shut the
 *  front door and this was the back one. `cancelled` is the worse half, because
 *  it is only ever set by hand, so a human's decision could be undone by a retry.
 *
 *  `failed` stays payable: a parent whose first attempt failed and who then pays
 *  is a normal, wanted flow. */
const PAYABLE_STATUSES = ["created", "failed"] as const;

export type MarkPaidResult =
  | { outcome: "paid"; order: PreorderRow }
  | { outcome: "already" }
  /** The gateway captured less than the order asked for. Not marked paid, and
   *  loud in the log, because there is no honest automatic answer (F-06). */
  | { outcome: "short-paid" }
  /** Real money arrived for an order that has been refunded or cancelled. Never
   *  resurrected, always shouted about: a human has to decide what happened. */
  | { outcome: "not-payable"; status: string }
  | { outcome: "unknown" };

export async function markPaid(
  env: StoreEnv,
  input: {
    rzpOrderId: string;
    paymentId: string | null;
    orderRef?: string | null;
    /** What the gateway says it captured, when the event carries it. Null from
     *  the browser callback, which is told nothing about amounts. */
    paidPaise?: number | null;
  },
): Promise<MarkPaidResult> {
  /* F-06. An order cannot be paid by less than its own amount. Today nothing
     can produce that: the amount is set server-side when the gateway order is
     created and Razorpay enforces it, and partial payments are not enabled. So
     this is insurance against that staying true by way of a dashboard setting
     nobody is watching, and it is one comparison. Expressed as a condition on
     the UPDATE so the statement stays atomic, which is what makes this function
     idempotent under a real race. */
  let update = db(env)
    .from("preorders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      rzp_payment_id: input.paymentId,
    })
    .eq("rzp_order_id", input.rzpOrderId)
    .in("status", PAYABLE_STATUSES);

  if (typeof input.paidPaise === "number") {
    update = update.lte("amount_paise", input.paidPaise);
  }

  const { data, error } = await update.select("*").maybeSingle();

  if (error) throw error;
  if (data) return { outcome: "paid", order: data as PreorderRow };

  /* No row updated means one of three very different things, and the difference
     matters: already paid (fine, the other path won), short paid (never, but if
     ever then a human decides), or no such order (worth shouting about, because
     it is money we cannot attribute). */
  const { data: existing } = await db(env)
    .from("preorders")
    .select("status, amount_paise")
    .eq("rzp_order_id", input.rzpOrderId)
    .maybeSingle();

  if (existing) {
    const row = existing as { status: string; amount_paise: number };

    /* ORDER MATTERS HERE, and getting it wrong is worse than the bug being
       fixed. `paid` is checked FIRST because it is the ordinary case: two paths
       reach markPaid for every successful order, and the second one lands here
       by design. If the not-payable check came first, `paid` is absent from
       PAYABLE_STATUSES, so every healthy order would log an error and return
       the alarm outcome — and the one case worth alarming about would be
       invisible inside a stream of false ones. */
    if (row.status === "paid") return { outcome: "already" };

    if (!(PAYABLE_STATUSES as readonly string[]).includes(row.status)) {
      console.error(
        `[fulfil] NOT PAYABLE: ${input.rzpOrderId} is '${row.status}' and real money arrived for it. NOT resurrected, nothing dispatched, no email sent. A human has to decide whether this is a refund that was reversed or a payment that should be returned.`,
      );
      return { outcome: "not-payable", status: row.status };
    }

    if (typeof input.paidPaise === "number" && input.paidPaise < row.amount_paise) {
      console.error(
        `[fulfil] SHORT PAYMENT on ${input.rzpOrderId}: captured ${input.paidPaise} of ${row.amount_paise} paise. NOT marked paid, and nothing dispatched. A human has to decide.`,
      );
      return { outcome: "short-paid" };
    }

    /* A race we have not modelled got here first. "already" is the conservative
       answer: no second email, and no claim about money we have not checked. */
    return { outcome: "already" };
  }

  /* ORPHAN RECOVERY. create-order writes our row, THEN creates the gateway order,
     THEN attaches its id. If that last update fails, a real payment arrives for an
     order id we have no row for, and the money is unattributable — the one failure
     in this flow with no clean recovery. But we also put our own reference in the
     Razorpay order as `receipt` and in `notes.order_ref`, and Razorpay hands it
     back in the webhook. So try that before giving up. */
  if (input.orderRef) {
    let recover = db(env)
      .from("preorders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        rzp_payment_id: input.paymentId,
        rzp_order_id: input.rzpOrderId,
      })
      .eq("order_ref", input.orderRef)
      .in("status", PAYABLE_STATUSES);

    /* The same amount guard as above: a recovered orphan is still an order that
       may not be paid by less than it asked for. */
    if (typeof input.paidPaise === "number") {
      recover = recover.lte("amount_paise", input.paidPaise);
    }

    const { data: byRef, error: refError } = await recover.select("*").maybeSingle();
    if (refError) throw refError;

    if (!byRef) {
      /* The UPDATE matched nothing, and with the allow-list that now has two
         very different meanings: no such reference, or a reference we know
         whose order is refunded or cancelled. Without this lookup the second
         case falls through to "unknown", and the webhook logs "paid an order id
         we do not have" about an order we very much do have — a log line that
         sends a human looking in the wrong place. */
      const { data: refRow } = await db(env)
        .from("preorders")
        .select("status")
        .eq("order_ref", input.orderRef)
        .maybeSingle();

      if (refRow) {
        const status = (refRow as { status: string }).status;
        if (status !== "paid" && !(PAYABLE_STATUSES as readonly string[]).includes(status)) {
          console.error(
            `[fulfil] NOT PAYABLE: ${input.orderRef} is '${status}' and real money arrived for it, matched by reference. NOT resurrected.`,
          );
          return { outcome: "not-payable", status };
        }
      }
    }

    if (byRef) {
      console.warn(
        `[fulfil] recovered ${input.orderRef} by its reference: the gateway order id was never attached to the row`,
      );
      return { outcome: "paid", order: byRef as PreorderRow };
    }
  }

  return { outcome: "unknown" };
}

/** Tell a human that real money arrived for an order somebody already took out
 *  of the queue (§8.30-s).
 *
 *  INTERNAL ONLY, and that is the whole care in this function. It must never
 *  reach the customer: they have been refunded or cancelled, and a receipt would
 *  tell them their order is live again. So it does not go near `notifyPaid`, and
 *  it sends to `env.alertEmail` and nowhere else.
 *
 *  It exists because the webhook answers 200 here on purpose — a retry would
 *  deliver the same event forever — and a 200 plus a log line is not a signal
 *  anybody sees. §8.30-q's own lesson was that a log answers "did it break", not
 *  "did anyone notice". This is money against a refunded order; somebody has to
 *  look.
 *
 *  Never throws, for the same reason as `notifyPaid`: the caller is a webhook. */
export async function alertNotPayable(
  env: StoreEnv,
  rzpOrderId: string,
  status: string,
): Promise<void> {
  try {
    await sendEmail(env, {
      to: env.alertEmail,
      subject: `Payment arrived for a ${status} order (${rzpOrderId})`,
      text: [
        `Razorpay reported a payment for gateway order ${rzpOrderId}, but our record for it is '${status}'.`,
        "",
        "Nothing was changed: the order was NOT marked paid, nothing was dispatched, and no email went to the customer.",
        "",
        "Somebody needs to decide whether this is a refund that was reversed, or a payment that should be returned.",
      ].join("\n"),
      html: `<p>Razorpay reported a payment for gateway order <strong>${rzpOrderId}</strong>, but our record for it is <strong>${status}</strong>.</p>
<p>Nothing was changed: the order was NOT marked paid, nothing was dispatched, and no email went to the customer.</p>
<p>Somebody needs to decide whether this is a refund that was reversed, or a payment that should be returned.</p>`,
    });
  } catch (error) {
    console.error(`[fulfil] could not send the not-payable alert for ${rzpOrderId}`, error);
  }
}

/** A refund landed. Take the order OUT of the dispatch queue (§8.25-ee).
 *
 *  Found by reading the code after the first real refund: the webhook acted only
 *  on paid events, so a refunded order kept `status = 'paid'` — and the dispatch
 *  queue IS `where status = 'paid'`. A parent who cancelled and got their money
 *  back would still be shipped a Lumi and then invoiced ₹4,500 for it. The only
 *  thing standing between that and a customer was someone remembering to run an
 *  UPDATE by hand, every time, forever.
 *
 *  PARTIAL REFUNDS ARE DELIBERATELY NOT TREATED AS CANCELLATIONS. The very first
 *  refund this store issued was ₹489 of ₹499, so this is not hypothetical: if any
 *  refund cleared the order, a ₹10 goodwill refund would silently cancel a live
 *  pre-order. Only a refund covering the full amount does that; anything less is
 *  logged loudly and left for a human, because there is no honest automatic
 *  answer to "they got some of it back". */
export async function markRefunded(
  env: StoreEnv,
  input: { paymentId: string; refundedPaise: number },
): Promise<"refunded" | "partial" | "unknown"> {
  const client = db(env);
  const { data: order } = await client
    .from("preorders")
    .select("order_ref, amount_paise, status")
    .eq("rzp_payment_id", input.paymentId)
    .maybeSingle();

  if (!order) {
    console.error("[refund] no order matches payment", input.paymentId);
    return "unknown";
  }

  if (input.refundedPaise < order.amount_paise) {
    console.warn(
      `[refund] PARTIAL refund on ${order.order_ref}: ${input.refundedPaise} of ${order.amount_paise} paise. Left as ${order.status} for a human to decide.`,
    );
    return "partial";
  }

  await client
    .from("preorders")
    .update({ status: "refunded" })
    .eq("order_ref", order.order_ref);

  console.warn(`[refund] ${order.order_ref} refunded in full and removed from the dispatch queue`);
  return "refunded";
}

/** A payment attempt failed. Worth recording: it separates "tried to pay us and
 *  the card was declined" from "filled the form and never came back", and those
 *  are two different follow-up conversations. Only ever moves a row that is still
 *  `created`, so it can never contradict a payment that actually succeeded. */
export async function markFailed(env: StoreEnv, rzpOrderId: string): Promise<void> {
  await db(env)
    .from("preorders")
    .update({ status: "failed" })
    .eq("rzp_order_id", rzpOrderId)
    .eq("status", "created");
}

/** The link that lets a parent add their address weeks later, from their inbox. */
export function addressUrlFor(env: StoreEnv, order: PreorderRow): string {
  const token = signAddressToken(
    env.signingSecret,
    order.order_ref,
    Date.now() + ADDRESS_TOKEN_TTL_MS,
  );
  return `${STORE_URL}/thanks?ref=${order.order_ref}&t=${token}`;
}

/** Everything that happens once, off the critical path, when an order becomes
 *  paid: both emails, and the server-side Purchase to Meta.
 *
 *  Never throws, never blocks the caller's success: by this point the money has
 *  moved and the row says so, and an email is a courtesy we can retry by hand. A
 *  500 here would make Razorpay retry a webhook for a payment that was recorded
 *  perfectly.
 *
 *  THE META REPORT LIVES HERE RATHER THAN AT THE CALL SITES, and that is the
 *  reason it is safe (§8.30-l). This function is reached from exactly two
 *  places, the webhook and the browser confirm route, and both reach it only
 *  behind `markPaid` returning "paid" — which is a single atomic UPDATE and so
 *  wins exactly once under the real race the launch already proved. So the
 *  server Purchase inherits the same exactly-once guarantee as the receipt
 *  email, for free, and it inherits this function's never-throw rule too.
 *  Reporting it from either call site instead would mean earning both again,
 *  twice, and forgetting one of them the day a third caller appears. */
export async function notifyPaid(env: StoreEnv, order: PreorderRow): Promise<void> {
  /* THE NEVER-THROW RULE IS THIS TRY, not the comment above it (2026-09-02).
     `allSettled` only covers the three async calls; the three lines before it
     run synchronously and unguarded, and §8.30-l leans on this function not
     throwing. Nothing reachable throws today, because the columns those
     templates read are `not null` in the schema, but that is a fact about the
     schema rather than a property of this function. */
  try {
    const ack = preorderAckEmail({
      order,
      addressUrl: order.address ? undefined : addressUrlFor(env, order),
    });
    const alert = internalAlertEmail(order);

    await Promise.allSettled([
      sendEmail(env, { ...ack, to: order.email }),
      sendEmail(env, { ...alert, to: env.alertEmail }),
      reportPurchaseToMeta(env, order),
    ]);
  } catch (error) {
    /* By here the money has moved and the row says so. Swallowing is correct:
       a throw would fail a webhook Razorpay then retries for a payment recorded
       perfectly. */
    console.error(`[fulfil] notifyPaid failed for ${order.order_ref}`, error);
  }
}
