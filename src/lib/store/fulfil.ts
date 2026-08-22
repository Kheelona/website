import { db, type PreorderRow } from "./db";
import { signAddressToken, ADDRESS_TOKEN_TTL_MS } from "./signing";
import { sendEmail } from "@/lib/email/send";
import { preorderAckEmail, internalAlertEmail } from "@/lib/email/templates";
import { STORE_URL } from "@/config/site";
import type { StoreEnv } from "./env";

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
 *  idempotency is in the UPDATE itself: `.neq("status", "paid")` means the second
 *  path to arrive matches no row, gets `already`, and sends no second email. That
 *  is one atomic statement in Postgres rather than a read-then-write we would
 *  have to reason about under a race. */

export type MarkPaidResult =
  | { outcome: "paid"; order: PreorderRow }
  | { outcome: "already" }
  | { outcome: "unknown" };

export async function markPaid(
  env: StoreEnv,
  input: { rzpOrderId: string; paymentId: string | null },
): Promise<MarkPaidResult> {
  const { data, error } = await db(env)
    .from("preorders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      rzp_payment_id: input.paymentId,
    })
    .eq("rzp_order_id", input.rzpOrderId)
    .neq("status", "paid")
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (data) return { outcome: "paid", order: data as PreorderRow };

  /* No row updated means one of two very different things, and the difference
     matters: already paid (fine, the other path won) or no such order (worth
     shouting about, because it is money we cannot attribute). */
  const { count } = await db(env)
    .from("preorders")
    .select("id", { count: "exact", head: true })
    .eq("rzp_order_id", input.rzpOrderId);

  return (count ?? 0) > 0 ? { outcome: "already" } : { outcome: "unknown" };
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

/** Both emails. Never throws, never blocks the caller's success: by this point
 *  the money has moved and the row says so, and an email is a courtesy we can
 *  retry by hand. A 500 here would make Razorpay retry a webhook for a payment
 *  that was recorded perfectly. */
export async function notifyPaid(env: StoreEnv, order: PreorderRow): Promise<void> {
  const ack = preorderAckEmail({
    order,
    addressUrl: order.address ? undefined : addressUrlFor(env, order),
  });
  const alert = internalAlertEmail(order);

  await Promise.allSettled([
    sendEmail(env, { ...ack, to: order.email }),
    sendEmail(env, { ...alert, to: env.alertEmail }),
  ]);
}
