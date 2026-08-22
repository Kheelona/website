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

type RazorpayInstance = { open: () => void; on?: (event: string, cb: () => void) => void };

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
};

export async function startCheckout(input: StartCheckoutInput): Promise<boolean> {
  const ready = await loadCheckout();
  if (!ready || !window.Razorpay) return false;

  const checkout = new window.Razorpay({
    key: input.keyId,
    order_id: input.razorpayOrderId,
    amount: input.amountPaise,
    currency: "INR",
    name: "Kheelona",
    description: `Lumi pre-order ${input.orderRef}`,
    prefill: input.prefill,
    notes: { order_ref: input.orderRef },
    /* Brand orange. The label inside Razorpay's own UI is theirs, so the V4
       ink-on-orange law does not reach in there; this only tints their header. */
    theme: { color: "#EF762F" },
    handler: input.onPaid,
    modal: { ondismiss: input.onDismiss },
  });

  checkout.open();
  return true;
}
