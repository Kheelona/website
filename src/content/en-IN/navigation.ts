import type { SitePath } from "@/content/types";

/**
 * Navigation (architecture §6.1; strategy §4.4): the main links shared by the laptop nav and the
 * phone drawer, the footer, the store's policy links and the chrome's own labels, as the approved
 * partials print them (mockup/partials/{nav,drawer,footer}.html, store.html). The routes these
 * point at, and which of them are in the nav and footer, are read by routes.ts from here.
 */

export interface NavLink {
  readonly label: string;
  readonly href: SitePath;
}

export interface FooterColumn {
  readonly id: "kheelu" | "read" | "help";
  readonly title: string;
  readonly links: readonly NavLink[];
}

export interface Navigation {
  readonly main: readonly NavLink[];
  readonly labels: {
    /** The nav landmark ("Main"). */
    readonly nav: string;
    /** The phone menu button. */
    readonly menu: string;
    /** The drawer dialog's name. */
    readonly drawer: string;
    readonly closeMenu: string;
    /** The nav logo, which links home. */
    readonly logoHome: string;
    /** The footer and store logos. */
    readonly logo: string;
    readonly skip: string;
    /** The store's policy links landmark. */
    readonly policies: string;
    /** The store header's logo link, which leaves the store for the marketing site (store.html fold 0). */
    readonly storeLogoLink: string;
    /** Read to screen readers after every store link that opens a new tab (store.html folds 1, 3 and 7). */
    readonly newTabNote: string;
  };
  readonly footer: {
    /** Under the logo; never the DS default, whose wake-word line is banned (claims §4.1). */
    readonly promise: string;
    readonly made: string;
    readonly columns: readonly FooterColumn[];
    /** The footer's last legal line: the grievance officer, on the contact page (D032). */
    readonly grievance: NavLink;
  };
  /** The store and confirmation pages' policy links (each opens in a new tab there). */
  readonly policies: readonly NavLink[];
}

export const navigation = {
  main: [
    { label: "Meet Kheelu", href: "/products/kheelu" },
    { label: "Safety", href: "/safety" },
    { label: "Stories", href: "/stories" },
    { label: "Team", href: "/team" },
  ],
  labels: {
    nav: "Main",
    menu: "Menu",
    drawer: "Menu",
    closeMenu: "Close menu",
    logoHome: "Kheelona, home",
    logo: "Kheelona",
    skip: "Skip to content",
    policies: "Policies",
    storeLogoLink: "Kheelona home",
    newTabNote: " (opens in a new tab)",
  },
  footer: {
    promise: "Press to talk. No open internet. You read every conversation.",
    made: "Designed by parents in Bengaluru. Made in India.",
    columns: [
      {
        id: "kheelu",
        title: "Kheelu",
        links: [
          { label: "Meet Kheelu", href: "/products/kheelu" },
          { label: "Safety", href: "/safety" },
          { label: "Setup", href: "/setup" },
        ],
      },
      {
        id: "read",
        title: "Read",
        links: [
          { label: "Stories", href: "/stories" },
          { label: "Choosing an AI toy", href: "/ai-toys-for-kids-in-india" },
          { label: "Team", href: "/team" },
        ],
      },
      {
        id: "help",
        title: "Help",
        links: [
          { label: "Contact", href: "/contact" },
          { label: "Shipping", href: "/shipping" },
          { label: "Refunds", href: "/refund" },
          { label: "Terms", href: "/terms" },
          { label: "Privacy", href: "/privacy" },
        ],
      },
    ],
    grievance: { label: "Grievance officer", href: "/contact" },
  },
  policies: [
    { label: "Pre-order terms", href: "/terms" },
    { label: "Refunds and cancellation", href: "/refund" },
    { label: "Shipping and delivery", href: "/shipping" },
    { label: "Privacy", href: "/privacy" },
    { label: "Contact", href: "/contact" },
  ],
} as const satisfies Navigation;
