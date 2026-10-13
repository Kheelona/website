import type { InAppBrowserNoteContent } from "@/content/types";

/**
 * The store's in-app browser note (store.md fold 2; B12, G13): a parent inside the Instagram, Facebook or WhatsApp
 * browser is asked to open the store in Chrome or Safari before paying by UPI. Words as the approved mockup
 * (mockup/store.html fold 2); `ui/InAppBrowserNote` prints the store address after the body.
 *
 * Switched off (N7, architecture §16.3): it renders nothing until QA's real-device check (test plan §6.4) confirms
 * the payment problem in those browsers; then the main session sets `enabled: true`.
 */
export const inAppNote = {
  enabled: false,
  title: "Paying by UPI? Open this page in Chrome or Safari.",
  body: "Do it first, so you don’t type your details twice. Copy the link and paste it into Chrome or Safari:",
  copyLabel: "Copy link",
  copiedMessage: "Link copied.",
} satisfies InAppBrowserNoteContent;
