import type { ImageRef, Meta } from "@/content/types";
import { DEFAULT_OG } from "../organization";
import { eventPage, type StorePanelCopy, type TierCheckoutContent } from "./event-page";

/**
 * The partner page, store.kheelona.com/ideabaaz (task 6.1; structure §5 row "(no mockup)"; wiki/site/checkout.md
 * "Variants"). The Ideabaaz Startup Fest exclusive ended on 31 August 2026 (its tier's own expiry, read from the
 * database): the ended state is the page every late QR scan meets, in the live page's words, under the fest's lockup
 * (B29). Its checkout, which serves any future partner tier, and its not-configured state are the event page's
 * (event-page.ts). No amount or date is typed here: both belong to the tier's row.
 */
export const partnerPage = {
  meta: {
    title: "Ideabaaz exclusive pre-order · Kheelona",
    description: "The Ideabaaz exclusive has ended. You can still pre-order Kheelu at the usual price.",
    og: DEFAULT_OG,
  },
  /* The fest lockup as on its launch posts: white lettering on its own black plate (a partner mark, never recoloured;
     public/ because printed QR material points at this page, assets.md). */
  logo: { src: "/partners/ideabaaz-startup-fest.png", width: 270, height: 148, alt: "Ideabaaz Startup Fest" },
  checkout: eventPage.checkout,
  /* Every not-for-sale state but a store without keys: the tier expired or closed by hand (`closed`), or its allocation
     gone (`full`); the two ways on are the event page's. */
  ended: {
    titleId: "store-title",
    title: "The Ideabaaz exclusive has ended.",
    action: eventPage.refused.action,
    help: eventPage.refused.help,
    full: "The Ideabaaz allocation has all gone. You can still pre-order Kheelu at the usual price.",
    closed: "This price was for the Ideabaaz Startup Fest window, which has closed. You can still pre-order Kheelu at the usual price.",
  },
  notConfigured: eventPage.notConfigured,
} as const satisfies {
  readonly meta: Meta;
  readonly logo: ImageRef;
  readonly checkout: TierCheckoutContent;
  readonly ended: StorePanelCopy & { readonly full: string; readonly closed: string };
  readonly notConfigured: StorePanelCopy;
};
