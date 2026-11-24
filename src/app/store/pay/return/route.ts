import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { verifyCheckoutSignature } from "@/lib/store/razorpay";
import { markPaid, notifyPaid } from "@/lib/store/fulfil";
import { signAddressToken, ADDRESS_TOKEN_TTL_MS } from "@/lib/store/signing";
import { rateLimit, clientKey } from "@/lib/store/rate-limit";
import { str } from "@/lib/store/http";
import { RZP_ORDER_ID, see } from "../_shared";

/** Where Razorpay sends a parent back to, when they paid in a browser that cannot call the in-page handler (D070 / B2,
 *  K-172; store.kheelona.com/pay/return).
 *
 *  An in-app browser (Instagram, LinkedIn, Facebook, WhatsApp, an Android WebView) may lose the store page while the
 *  parent is in their UPI app, and the in-page `handler` is not supported there at all. So PreorderForm asks Razorpay
 *  for its redirect flow (`callback_url` + `redirect: true`, src/features/preorder/lib/checkout.ts) and Razorpay POSTs the
 *  result here, as a form, after the page is gone: on success `razorpay_payment_id`, `razorpay_order_id` and
 *  `razorpay_signature`; on failure `error[code]`, `error[description]` and friends.
 *
 *  This does for a redirect what /api/preorder/confirm does for the handler: verify the same HMAC, `markPaid` (which
 *  is idempotent, so the webhook arriving first or second does nothing twice), `notifyPaid` only when this call is the
 *  one that marked it, and then send the parent to their confirmation page. The webhook stays the source of truth: if
 *  this request never lands, the order is paid anyway.
 *
 *  THE ONLY ANSWER IS A 303, never a page and never JSON: the visitor is a parent whose browser just came back from
 *  a bank. A relative Location so it lands on the host they are on. Anything that is not a verified payment goes to `/`,
 *  where the store page's own recovery (pay-recovery, `kh_preorder_pending`) says what state the order is in.
 *
 *  The address token is minted here and travels as `/thanks?ref=&t=`, which the proxy swaps for the `kh_order` cookie
 *  and a clean /thanks (F-01: no analytics tag ever sees the token). `kh_order` is SameSite=Lax, so it is accepted on
 *  this cross-site POST -> 303 -> GET chain. Never log a payment id, a signature or any personal data here. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Someone opened the address in a tab: there is nothing to show here. */
export function GET() {
  return see("/");
}

export async function POST(request: Request) {
  const env = storeEnv();
  if (!env) return see("/");

  if (!rateLimit(`pay-return:${clientKey(request)}`).allowed) return see("/");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return see("/");
  }

  const field = (name: string, max: number) => {
    const value = form.get(name);
    return typeof value === "string" ? str(value, max) : "";
  };
  const orderId = field("razorpay_order_id", 64);
  const paymentId = field("razorpay_payment_id", 64);
  const signature = field("razorpay_signature", 128);
  const loggable = RZP_ORDER_ID.test(orderId) ? orderId : "unknown";

  /* A payment that did not go through: Razorpay's own error fields. Free text is never read, let alone logged. */
  if ([...form.keys()].some((key) => key.startsWith("error["))) {
    console.warn("[pay-return] the payment did not complete", loggable);
    return see("/");
  }

  if (!orderId || !paymentId || !signature || !RZP_ORDER_ID.test(orderId)) {
    console.warn("[pay-return] missing fields", loggable);
    return see("/");
  }

  if (!verifyCheckoutSignature(env.razorpayKeySecret, { orderId, paymentId, signature })) {
    console.warn("[pay-return] rejected an invalid checkout signature", loggable);
    return see("/");
  }

  let orderRef: string | null = null;
  try {
    const result = await markPaid(env, { rzpOrderId: orderId, paymentId });
    if (result.outcome === "paid") {
      await notifyPaid(env, result.order);
      orderRef = result.order.order_ref;
    } else if (result.outcome === "already") {
      /* The webhook (or an earlier return) got there first: this order is paid, and its reference is on the row. */
      const { data } = await db(env).from("preorders").select("order_ref").eq("rzp_order_id", orderId).maybeSingle();
      orderRef = (data as { order_ref?: string } | null)?.order_ref ?? null;
    } else {
      console.warn(`[pay-return] ${orderId} is not payable here: ${result.outcome}`);
    }
  } catch (error) {
    /* The payment is real and Razorpay knows it, so the webhook will finish the job; the store page's recovery will find
       the order paid when it asks. */
    console.error("[pay-return] could not record a verified payment", orderId, error);
  }

  if (!orderRef) return see("/");

  const token = signAddressToken(env.signingSecret, orderRef, Date.now() + ADDRESS_TOKEN_TTL_MS);
  return see(`/thanks?ref=${encodeURIComponent(orderRef)}&t=${encodeURIComponent(token)}`);
}
