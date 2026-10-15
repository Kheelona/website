import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { grievanceOfficerLine } from "@/lib/content/seller-lines";
import { DEFAULT_OG } from "../organization";
import { WARRANTY_MONTHS } from "../policies";
import { seller } from "../seller";
import { TRUST_COMPACT, trustItems } from "../trust";

/**
 * The contact page, `/contact` (task 5.9): the approved mockup `mockup/pages/contact.html` (D046), word for word, in its
 * fold order (structure §5); meta as wiki/site/pages/contact.md words it. The H1 is the copy page's recommended option A.
 *
 * - Fold 1, the contact hero: the answer-first lead (46 words) and the three ways to reach a person as secondary
 *   buttons, never chilli (they are not pre-order actions) and never the app's blue; no icon on the call button (the DS
 *   has no phone icon, G-12). The lead links the grievance officer to fold 3 (`#grievance`).
 * - Fold 2, the five route cards on the band; the two WhatsApp links carry their own names.
 * - Fold 3, the grievance officer: D032's published line, verbatim, from the one value in seller.ts through the
 *   seller-lines helper (nothing held together, as privacy and terms print it); the section is `#grievance`, the
 *   footer's target.
 * - Fold 4, who you're buying from: the seller lines in the footer's order (the entity without the footer's "© 2026"),
 *   built from seller.ts. No GSTIN: the website prints none (D063 item 3, D064 item 11; task Q2.3). The contact line
 *   keeps the number, which shows only here and on the legal pages (D063 item 2; E-Commerce Rules r.4(2)(d)).
 * - Fold 5, the centred close: the page's one chilli button (`finale`), the price sentence from the live offer and the
 *   compact trust pair; no help line, because the whole page is the help line.
 *
 * Shared facts are read, never retyped: the number, email, WhatsApp and call links from seller.ts, the returns promise
 * from trust.ts, the warranty from policies.ts. No placeholders. No new tracking value: the contact buttons are not
 * counted (tracking inventory line 198; G10).
 */

const { phone, email, whatsapp, tel } = seller.support;

export const contactPage = {
  meta: {
    title: "Contact Kheelona: WhatsApp, call or email the team",
    description: `Contact Kheelona: WhatsApp or call ${phone}, or email ${email}. We are a small team in Bengaluru and answer our own messages.`,
    og: DEFAULT_OG,
  },
  sections: [
    /* Fold 1: every way to reach us, as text and as one-tap buttons, inside the first phone screen. */
    {
      kind: "hero-section",
      config: {
        variant: "contact",
        heading: {
          id: "hero-title",
          eyebrow: "Contact Kheelona",
          title: "Talk to the team {hand:behind Kheelu.}",
          lead: `To contact Kheelona, call or message us on WhatsApp at {nowrap:${phone}}, or email ${email}. Add your order number if you have one. We are a small team in Bengaluru, and we answer our own messages. For a formal complaint, see our [grievance officer](#grievance) below.`,
        },
        ways: [
          { label: "Message on WhatsApp", href: whatsapp, icon: "whatsapp-logo" },
          { label: `Call ${phone}`, href: tel },
          { label: `Email ${email}`, href: `mailto:${email}`, icon: "envelope-simple" },
        ],
      },
    },
    /* Fold 2: each kind of question sent to the place that answers it. */
    {
      kind: "card-grid",
      config: {
        variant: "routes",
        band: true,
        heading: { id: "routes-title", title: "Pick the route that {hand:fits.}" },
        items: [
          {
            tone: "sun",
            icon: "question",
            title: "Before you order",
            body: "What Kheelu does, what it costs and the questions parents ask are on the Meet Kheelu page.",
            links: [{ label: "Meet Kheelu", href: "/products/kheelu" }],
          },
          {
            tone: "blue",
            icon: "package",
            title: "About your order",
            body: "Message or call us with your order number. Until we dispatch it, you can change your address, or cancel for a full refund.",
            links: [{ label: "Message us on WhatsApp", href: whatsapp, ariaLabel: "Message us on WhatsApp about your order" }],
          },
          {
            tone: "chilli",
            icon: "users-three",
            title: "More than one Kheelu",
            body: "Each pre-order is for one Kheelu. For more, message us on WhatsApp.",
            links: [{ label: "Message us on WhatsApp", href: whatsapp, ariaLabel: "Message us on WhatsApp about more than one Kheelu" }],
          },
          {
            tone: "sun",
            icon: "arrow-counter-clockwise",
            title: "Returns, refunds and delivery",
            body: `${trustItems["returns-7-days"].label}, and a ${WARRANTY_MONTHS}-month warranty. Delivery is included anywhere in India.`,
            links: [
              { label: "Refunds and returns", href: "/refund" },
              { label: "Shipping", href: "/shipping" },
            ],
          },
          {
            tone: "blue",
            icon: "shield-check",
            title: "Safety and privacy",
            body: "When the microphone is on, where your child’s voice goes and what you can delete, in plain words.",
            links: [
              { label: "Safety", href: "/safety" },
              { label: "Privacy", href: "/privacy" },
            ],
          },
        ],
      },
    },
    /* Fold 3: the grievance officer and the response times, as the E-Commerce Rules require (D032); `#grievance`. */
    {
      kind: "grievance-block",
      config: {
        context: "contact",
        title: "Make a formal complaint.",
        intro: "If something has gone wrong and we haven’t put it right, you can complain formally to our grievance officer. Please include your order number.",
        line: grievanceOfficerLine(seller),
      },
    },
    /* Fold 4: the seller's legal identity, in the footer's order, with the number (D063 item 2). */
    {
      kind: "seller-block",
      config: {
        context: "contact",
        title: "Who you’re {hand:buying from.}",
        intro: "Kheelu is designed here in Bengaluru, by parents who use it at home, and made in India. This is also the company you’re buying from.",
        lines: { entity: seller.legalName, address: seller.addressLine, contact: seller.support.line },
      },
    },
    /* Fold 5: one calm next step; the sticky bar steps aside while this button is on screen. */
    {
      kind: "close-section",
      config: {
        variant: "center",
        /* "Pre-order", as every selling close is labelled (task Q2.15; the consistency review's CON-6). */
        heading: { eyebrow: "Pre-order", title: "Ready when {hand:you are.}" },
        cta: {
          cta: "finale",
          trust: TRUST_COMPACT.map((id) => trustItems[id]),
          secondary: { label: "See how Kheelu works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" },
        },
      },
    },
  ],
  /* As the live page had it (architecture §9.2): named by the eyebrow, pointing at the Organization, which carries the
   * number and the email. */
  schema: [{ kind: "contact-page", name: "Contact Kheelona" }],
} as const satisfies PageContent;
