import type { PaymentsLineConfig } from "@/components/sections/store/StorePaymentsLine/store-payments-line.types";

/**
 * D042's payments line (store.md fold 7; wiki/site/pages/store-confirmation.md, the store footer), as both approved
 * mockups print it in their shared store footer (mockup/store.html, mockup/store-confirmation.html). The store layout's
 * policy links are a frozen checkout contract, so the store page and /thanks print it as the last line of their main
 * instead (wiki/qa/deviations.md V1; tasks 5.15 and 4.8): written once here, read by `storePage.payments` and
 * `confirmation.payments`. The chargeback how-to lives on /refund under #chargeback.
 */
export const paymentsLine = {
  text: "No payment fees. Nothing recurring. Payments by Razorpay.",
  link: { label: "How to raise a chargeback with your bank", href: "/refund#chargeback" },
} as const satisfies PaymentsLineConfig;
