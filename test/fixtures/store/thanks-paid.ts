import { TOKEN_AMOUNT_PAISE } from "@/config/site";
import type { PreorderRow } from "@/lib/store/db";

/* The /thanks paid-state composition's order (task 4.8 item 3; wiki/qa/deviations.md V5): the state the approved mockup
 * shows (mockup/store-confirmation.html), a token order paid at the pre-order price with no address yet, placed after
 * 10 October so the delivery row is the D023 line. Sample data only: no real order is ever placed (ADR-013). Read by the
 * story (src/layouts/StoreShell/StoreShell.stories.tsx `ThanksPaid`), by its test against the route's own render of
 * this order, and by test/e2e/thanks-paid.spec.ts, which writes the same order number and email into the mockup's two
 * sample slots. Never shipped. */

type PaidOrder = Pick<PreorderRow, "order_ref" | "tier" | "amount_paise" | "status" | "email" | "address" | "created_at">;

export const THANKS_PAID: { readonly order: Readonly<PaidOrder>; readonly token: string } = {
  order: {
    order_ref: "KH-A2B3-C4D5",
    /* The token tier's id as the order row stores it (lib/store/tiers.ts LAUNCH_TIER; that module reads the database
       client, so it is not imported into a story). */
    tier: "launch",
    amount_paise: TOKEN_AMOUNT_PAISE,
    status: "paid",
    email: "parent@example.com",
    address: null,
    created_at: "2026-10-12T10:23:45.123456+00:00",
  },
  /* What AddressForm posts back with the address; never printed. */
  token: "sample-signed-token",
};
