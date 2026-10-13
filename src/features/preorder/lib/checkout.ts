/** Razorpay Checkout, loaded only when someone actually pays (§8.25-q).
 *
 *  The script is ~100KB and it is fetched on the first submit, not on page load.
 *  Two reasons, and the second is the one that would have been a regression:
 *  nobody who bounces should pay for a payment library, and this site's LCP law
 *  is that the product image must stay the largest and earliest thing on the
 *  page. A third-party script in the initial payload competes with exactly that.
 *
 *  Everything here is browser-only. The amount is never sent from this file:
 *  it arrives from our own create-order response, which read it from our own
 *  tier table. */

import { track } from "@/lib/tracking/track";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: "INR";
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string | null };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
};

/** What Razorpay hands a `payment.failed` listener. Only `code` and `reason` are read (B11). */
type RazorpayFailure = { error?: { code?: unknown; reason?: unknown } } | undefined;

type RazorpayInstance = {
  open: () => void;
  on?: (event: "payment.failed", cb: (response: RazorpayFailure) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let loading: Promise<boolean> | null = null;

/** Load once per page, and share the promise: two fast taps must not append two
 *  script tags and open two checkouts. */
export function loadCheckout(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => {
      loading = null; // let a later attempt retry after a flaky network
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return loading;
}

export type StartCheckoutInput = {
  keyId: string;
  razorpayOrderId: string;
  amountPaise: number;
  orderRef: string;
  prefill: { name?: string; email?: string; contact?: string | null };
  onPaid: (response: RazorpayHandlerResponse) => void;
  onDismiss: () => void;
  /** For the two payment-window events only (B11); never sent to Razorpay. */
  tier: string;
};

/* B11 (task 6.2; architecture §8.2): two moments of the payment window, to GA4 and
   PostHog only, through the dispatcher (src/lib/tracking/track.ts; never Meta).
   Measurement never decides a payment: a tool that throws is ignored, so the
   window and what this function answers are exactly as before. */
function measure(send: () => void): void {
  try {
    send();
  } catch {
    /* the payment goes on whatever a measuring tool does */
  }
}

/** Razorpay's machine codes only ("BAD_REQUEST_ERROR", "payment_failed"), never
 *  its `description`, which is free text: anything else is sent as "unknown". */
function razorpayCode(value: unknown): string {
  return typeof value === "string" && /^[A-Za-z0-9_]{1,64}$/.test(value) ? value : "unknown";
}

export async function startCheckout(input: StartCheckoutInput): Promise<boolean> {
  const ready = await loadCheckout();
  if (!ready || !window.Razorpay) return false;

  const checkout = new window.Razorpay({
    key: input.keyId,
    order_id: input.razorpayOrderId,
    amount: input.amountPaise,
    currency: "INR",
    name: "Kheelona",
    description: `Kheelu pre-order ${input.orderRef}`,
    prefill: input.prefill,
    notes: { order_ref: input.orderRef },
    /* Brand orange. The label inside Razorpay's own UI is theirs, so the V4
       ink-on-orange law does not reach in there; this only tints their header. */
    theme: { color: "#EF762F" },
    handler: input.onPaid,
    modal: { ondismiss: input.onDismiss },
  });

  checkout.on?.("payment.failed", (response) =>
    measure(() =>
      track("preorder_payment_failed", {
        tier: input.tier,
        reason_code: razorpayCode(response?.error?.code),
        reason: razorpayCode(response?.error?.reason),
      }),
    ),
  );

  checkout.open();
  measure(() => track("preorder_payment_window_opened", { tier: input.tier }));
  return true;
}
