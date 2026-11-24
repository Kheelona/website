import { useCallback, useEffect, useState } from "react";
import { clearFormDraft } from "./form-draft";

/** The payment this tab started, kept in THIS tab so a parent who comes back to the store form is not left with a blank
 *  form and a second payment (D070 / B2, K-172).
 *
 *  A payment can end outside the page: an in-app browser sends the parent to Razorpay's own page or to a UPI app and the
 *  store page is gone, or reloaded, when they return. Written just before the payment window opens, it holds only
 *  what is needed to ask the server what became of that order: its reference and Razorpay's order id (neither is a
 *  credential), the tier and when it began. No address token, no amount, no name, phone or email. `sessionStorage`,
 *  so it dies with the tab; and it is cleared when the payment is paid or the window is closed, after two hours, and on
 *  the confirmation page. Every read and write is guarded: with storage blocked the form works exactly as before. */
export const PENDING_KEY = "kh_preorder_pending";
export const PENDING_TTL_MS = 2 * 60 * 60 * 1000;

export type PendingPayment = { v: 1; orderRef: string; rzpOrderId: string; tier: string; createdAt: number };

function tabStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function savePending(input: { orderRef: string; rzpOrderId: string; tier: string }): void {
  try {
    const entry: PendingPayment = { v: 1, ...input, createdAt: Date.now() };
    tabStorage()?.setItem(PENDING_KEY, JSON.stringify(entry));
  } catch {
    /* private mode, quota, blocked storage: the payment goes on, only the recovery is lost */
  }
}

export function clearPending(): void {
  try {
    tabStorage()?.removeItem(PENDING_KEY);
  } catch {
    /* it expires with the tab and in two hours */
  }
}

/** What the tab remembers, or null. An entry that cannot be read, has the wrong shape or is older than two hours (or
 *  dated in the future) is deleted rather than trusted. */
export function readPending(now = Date.now()): PendingPayment | null {
  const storage = tabStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(PENDING_KEY);
    if (raw === null) return null;
    const data = JSON.parse(raw) as Partial<PendingPayment> | null;
    const ok =
      data !== null &&
      typeof data === "object" &&
      data.v === 1 &&
      typeof data.orderRef === "string" &&
      typeof data.rzpOrderId === "string" &&
      typeof data.tier === "string" &&
      typeof data.createdAt === "number" &&
      now - data.createdAt >= 0 &&
      now - data.createdAt <= PENDING_TTL_MS;
    if (!ok) {
      storage.removeItem(PENDING_KEY);
      return null;
    }
    return data as PendingPayment;
  } catch {
    clearPending();
    return null;
  }
}

/** Both session keys, on the confirmation page: the payment is done, so neither the saved details nor the saved
 *  payment may ever be offered again in this tab. */
export function clearPaymentSession(): void {
  clearPending();
  clearFormDraft();
}

export type PayStatus =
  | { status: "paid" }
  | { status: "open"; keyId: string; amountPaise: number }
  | { status: "closed" };

/** Ask the server what became of an order (POST /pay/status, src/app/store/pay/status/route.ts). `paid` also sets the
 *  `kh_order` cookie on the answer, so /thanks can open. Null for anything that is not a clear answer (offline, rate
 *  limited, a server error): the caller then leaves everything as it was. */
export async function fetchPayStatus(entry: Pick<PendingPayment, "orderRef" | "rzpOrderId">): Promise<PayStatus | null> {
  try {
    const response = await fetch("/pay/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderRef: entry.orderRef, rzpOrderId: entry.rzpOrderId }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as Partial<PayStatus> & { keyId?: unknown; amountPaise?: unknown };
    if (data.status === "paid") return { status: "paid" };
    if (data.status === "closed") return { status: "closed" };
    if (data.status === "open" && typeof data.keyId === "string" && Number.isInteger(data.amountPaise)) {
      return { status: "open", keyId: data.keyId, amountPaise: data.amountPaise as number };
    }
    return null;
  } catch {
    return null;
  }
}

export type OpenPayment = { orderRef: string; rzpOrderId: string; keyId: string; amountPaise: number };

/** On mount (and when the browser restores this page from its back-forward cache): if this tab has a pending payment,
 *  ask the server. Paid goes to /thanks; still open becomes `open`, which the form offers as Continue paying or Start
 *  again; anything else clears the entry and shows nothing. An open order of another tier (a booth link opened in the
 *  same tab) is left alone. */
export function usePendingPayment(tier: string, onRestored: () => void) {
  const [open, setOpen] = useState<OpenPayment | null>(null);

  useEffect(() => {
    let live = true;
    const check = async () => {
      const entry = readPending();
      if (!entry) return;
      const answer = await fetchPayStatus(entry);
      if (!live || !answer) return;
      if (answer.status === "paid") {
        clearPending();
        // A full page load on purpose: /thanks is served by the store host's own rewrite and reads the cookie just set.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/thanks");
      } else if (answer.status === "open") {
        if (entry.tier === tier) setOpen({ orderRef: entry.orderRef, rzpOrderId: entry.rzpOrderId, keyId: answer.keyId, amountPaise: answer.amountPaise });
      } else {
        clearPending();
      }
    };
    void check();
    /* Back from Razorpay's page can restore this page exactly as it was left, with its button still saying "Opening the
       payment window". Put the form back to idle, then ask again. */
    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      onRestored();
      void check();
    };
    window.addEventListener("pageshow", onShow);
    return () => {
      live = false;
      window.removeEventListener("pageshow", onShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one check per mount; `onRestored` is a state setter's wrapper
  }, [tier]);

  const dismiss = useCallback(() => setOpen(null), []);
  const startAgain = useCallback(() => {
    clearPending();
    setOpen(null);
  }, []);
  return { open, dismiss, startAgain };
}

/** After a payment made in the page's own window, when the page has no address token (the resumed payment): confirm
 *  it, then ask the server for the confirmation page's cookie and go there. The webhook confirms too, so a few quiet
 *  tries are enough; if none says paid the parent still lands on /thanks, whose own "open your link again" state and
 *  the confirmation email cover it. */
export async function confirmThenGoToThanks(
  paid: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
  entry: Pick<PendingPayment, "orderRef" | "rzpOrderId">,
  wait: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
): Promise<void> {
  try {
    await fetch("/api/preorder/confirm", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId: paid.razorpay_order_id,
        razorpayPaymentId: paid.razorpay_payment_id,
        razorpaySignature: paid.razorpay_signature,
      }),
    });
  } catch {
    /* the webhook confirms it; the status check below finds out */
  }
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if ((await fetchPayStatus(entry))?.status === "paid") break;
    await wait(1500);
  }
  // A full page load on purpose, as above.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/thanks");
}
