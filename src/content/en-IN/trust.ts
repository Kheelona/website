import type { IconText, TrustItem } from "@/content/types";
import { PAYMENT_METHODS, RETURN_DAYS, WARRANTY_MONTHS } from "./policies";

/**
 * The trust items (architecture §6.1; strategy §3.2): each a short promise linked to its terms,
 * defined once. Returns and warranty link to /refund, payment to /terms, delivery to /shipping
 * (home.md "CTA block", "Links and rendering"), each to the part of the page that keeps the promise
 * (task 7.1a; CMO built-page review C, m8; refund.md shared request 2): the warranty is /refund's
 * third section, about four phone screens down, so the bare page made a parent hunt for it. Each
 * fragment is an id the legal page prints from its own module (refund.ts, terms.ts, shipping.ts
 * `parts`; trust.test.ts holds them there). The approved mockup links the pages' tops. Numbers come
 * from policies.ts; the delivery line is the `{delivery}` token.
 */
export const trustItems = {
  "deliveries-start": { id: "deliveries-start", icon: "truck", label: "{delivery}", href: "/shipping#when" },
  "returns-7-days": {
    id: "returns-7-days",
    icon: "arrow-counter-clockwise",
    label: `${RETURN_DAYS}-day returns, no questions asked`,
    href: "/refund#returns",
  },
  "warranty-6-months": {
    id: "warranty-6-months",
    icon: "shield-check",
    label: `${WARRANTY_MONTHS}-month warranty`,
    href: "/refund#faulty",
  },
  "payment-methods": { id: "payment-methods", icon: "currency-inr", label: PAYMENT_METHODS, href: "/terms#payment" },
  "delivery-included": {
    id: "delivery-included",
    icon: "package",
    label: "Delivery included anywhere in India",
    href: "/shipping#where",
  },
} as const satisfies Readonly<Record<string, TrustItem>>;

export type TrustId = keyof typeof trustItems;

/** The compact micro-line beside the inline CTAs and on most closes: delivery and returns, the
 *  two items brief §9.1 puts next to every CTA (home.md "CTA block"). */
export const TRUST_COMPACT: readonly TrustId[] = ["deliveries-start", "returns-7-days"];

/** The full row at Home's close and on the store (home.md "CTA block"; CMO pass M14). */
export const TRUST_FULL: readonly TrustId[] = ["returns-7-days", "warranty-6-months", "payment-methods", "delivery-included"];

/** The three checkable facts under the safety folds of Home and the product page (not linked). */
export const SAFETY_FACTS: readonly IconText[] = [
  { icon: "eye-slash", text: "No camera" },
  { icon: "wifi-slash", text: "It can’t browse the internet" },
  { icon: "smiley", text: "It says it’s a toy, and never asks your child to keep a secret from you" },
];
