import { PREORDER_LABEL } from "@/config/site";
import type { IconRef, LinkRef } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";

/**
 * CTA copy (architecture §6.1, §8.3): the one label every chilli button carries (D041; owner
 * page wiki/brand/messaging.md, "CTA labels") and the secondary links, keyed by their registered
 * tracking value. Label, destination and icons as the approved mockups give them; the button's
 * look (ghost or secondary) is the page's choice.
 */

export interface SecondaryLink extends LinkRef {
  readonly cta: CtaId;
  /** An icon before the label. */
  readonly icon?: IconRef;
  /** An icon after the label. */
  readonly iconEnd?: IconRef;
}

export interface CtaCopy {
  /** "Pre-order Kheelu": the checkout's own constant, so the label exists once. */
  readonly preorder: string;
  readonly secondary: Readonly<Partial<Record<CtaId, SecondaryLink>>>;
}

export const cta = {
  preorder: PREORDER_LABEL,
  secondary: {
    "hero-learn": { label: "See how it works", href: "/products/kheelu", cta: "hero-learn", iconEnd: "arrow-right" },
    "see-it-ask-learn": {
      label: "See what else it does",
      href: "/products/kheelu",
      cta: "see-it-ask-learn",
      iconEnd: "arrow-right",
    },
    "safety-learn": { label: "See how we built safety in", href: "/safety", cta: "safety-learn", icon: "shield-check" },
    "compare-learn": {
      label: "How to choose an AI toy",
      href: "/ai-toys-for-kids-in-india",
      cta: "compare-learn",
      iconEnd: "arrow-right",
    },
    "faq-more": { label: "See all questions", href: "/products/kheelu#faq", cta: "faq-more", iconEnd: "arrow-right" },
    "product-safety-learn": {
      label: "See how we built safety in",
      href: "/safety",
      cta: "product-safety-learn",
      icon: "shield-check",
    },
    "refund-learn": { label: "Meet Kheelu", href: "/products/kheelu", cta: "refund-learn", iconEnd: "arrow-right" },
    "shipping-learn": { label: "Meet Kheelu", href: "/products/kheelu", cta: "shipping-learn", iconEnd: "arrow-right" },
  },
} as const satisfies CtaCopy;
