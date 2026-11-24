/**
 * `preorder_payment_window_hidden`: the parent left the page while the Razorpay sheet was open (D070 / B7c, K-174;
 * wiki/site/tracking-inventory.md §17).
 *
 * The explicit close (× or Back in Razorpay) already reports: `preorder_dismissed`, fired from `modal.ondismiss`, is
 * wired and unchanged. What nothing reported is the parent who switches to a UPI app, locks the phone or closes the
 * in-app browser with the sheet open: the page is hidden, no `ondismiss` and no `pagehide` follow, and posthog-js only
 * flushes on `pagehide`, so an event queued then can be lost. This one goes out at once, by beacon (./beacon.ts).
 *
 * It is a signal, not a verdict. "The page was hidden with the sheet open" is also what a UPI payment looks like, so
 * the analyst reads it as: hidden, and no `purchase_confirmed` for the session within N minutes.
 *
 * Contract: from the moment `opened()` is called (Razorpay's sheet is up) until `close()` (paid, dismissed or the form
 * unmounted), the FIRST `visibilitychange` to `hidden` sends the event once, with `{ tier }` only (a name of a tier,
 * never anything a parent typed), and then stops listening. `close()` before `opened()` makes `opened()` a no-op, so a
 * sheet that is paid or dismissed before the call returns leaves no listener behind. PostHog only: not GA4, not Meta,
 * and not through the dispatcher.
 */
import { beaconCapture } from "./beacon";

export const PAYMENT_WINDOW_HIDDEN = "preorder_payment_window_hidden";

export interface PaymentWindowWatch {
  /** The sheet is open: start listening (once). */
  opened(): void;
  /** The sheet is over (paid, dismissed) or the form is gone: stop listening, for good. */
  close(): void;
}

export function watchPaymentWindow(tier: string): PaymentWindowWatch {
  let done = false;
  let stop: (() => void) | null = null;

  const close = () => {
    done = true;
    stop?.();
    stop = null;
  };

  return {
    opened() {
      if (done || stop || typeof document === "undefined") return;
      const onChange = () => {
        if (document.visibilityState !== "hidden") return;
        close();
        try {
          beaconCapture(PAYMENT_WINDOW_HIDDEN, { tier });
        } catch {
          /* measurement never touches a payment */
        }
      };
      document.addEventListener("visibilitychange", onChange);
      stop = () => document.removeEventListener("visibilitychange", onChange);
    },
    close,
  };
}
