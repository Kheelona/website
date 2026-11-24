/**
 * The words of the "your payment is still open" notice on the store form (D070 / B2, K-172). A words-only module, like
 * preorder-form.ts: the form is a client island, so this ships to the browser and imports nothing.
 *
 * The founder's rule (24 Nov 2026): change no visible copy unless the flow cannot work without it. The notice only
 * appears to a parent who comes back to the store tab with a payment still unpaid, and it needs a sentence and two
 * choices, which no existing store string offers. No promise, no claim, no extra helper line. A parent who has paid is
 * taken straight to the confirmation page with no text at all.
 */
export const payRecoveryCopy = {
  notice: "Your payment is still open.",
  continue: "Continue paying",
  startAgain: "Start again",
} as const;
