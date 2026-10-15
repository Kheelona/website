import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { DEFAULT_OG } from "../organization";
import { TRUST_COMPACT, trustItems } from "../trust";

/**
 * The 404 (task 5.10; structure §3.3, §5): the page every unmatched URL renders, from `src/app/not-found.tsx` inside
 * the site shell, with no buy bar (the mockup's meta says `"buybar": false`). Words as the approved mockup prints them
 * (mockup/pages/404.html), meta as the copy page gives it (wiki/site/pages/404.md, "At a glance"). No placeholders.
 *
 * - Fold 1, EmptyStateSection: the DS EmptyState the component map names for the 404, the page's one h1 (option A,
 *   "own it, say what to do", DS 01-writing.md:92) and the four ways on, each one tap target.
 * - Fold 2, the centred close: the page's one chilli button (`finale`), the price sentence (from the live offer), the
 *   compact trust line (deliveries, returns) and the help line (seller.ts, through the page's selling context).
 *
 * The route renders the title and description only: the page answers 404 and Next marks it noindex itself, so it has
 * no canonical and no share card of its own (`og` is the Meta shape's, the site's default card).
 */
export const notFoundPage = {
  meta: {
    title: "Page not found · Kheelona",
    description:
      "We can’t find that page. Meet Kheelu, the screen-free plush toy for ages 3 to 7, read our guides for parents, or talk to the team.",
    og: DEFAULT_OG,
  },
  sections: [
    {
      kind: "empty-state-section",
      config: {
        icon: "magnifying-glass",
        tone: "blue",
        eyebrow: "Page not found",
        title: "We can’t find that page.",
        lead: "The link may be old, or the address may have a typo. Where were you headed?",
        nav: {
          label: "Where to go next",
          links: [
            { icon: "house", tone: "sun", title: "Home", sub: "What Kheelu is, on one page.", href: "/" },
            { icon: "heart", tone: "chilli", title: "Meet Kheelu", sub: "The toy, its three modes and the price.", href: "/products/kheelu" },
            { icon: "book-open", tone: "blue", title: "Stories", sub: "Guides for parents of 3 to 7 year olds.", href: "/stories" },
            { icon: "chat-circle-dots", tone: "sun", title: "Contact", sub: "WhatsApp, call or email the team.", href: "/contact" },
          ],
        },
      },
    },
    {
      kind: "close-section",
      config: {
        variant: "center",
        /* "Pre-order", as every selling close is labelled (task Q2.15; the consistency review's CON-6). */
        heading: { eyebrow: "Pre-order", title: "Looking for {hand:Kheelu?}" },
        cta: { cta: "finale", trust: TRUST_COMPACT.map((id) => trustItems[id]), helpLine: true },
      },
    },
  ],
} as const satisfies PageContent;
