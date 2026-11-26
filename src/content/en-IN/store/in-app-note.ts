import type { InAppBrowserNoteContent } from "@/content/types";

/**
 * The store's in-app browser note (store.md fold 2; B12, G13): a parent inside the Instagram, Facebook or WhatsApp
 * browser is asked to open the store in Chrome or Safari before paying by UPI. Words as the approved mockup
 * (mockup/store.html fold 2); `ui/InAppBrowserNote` prints the store address after the body.
 *
 * Switched on in task 7.1c (D056 item 3, deviation V4 retired), and switched off again for every in-app browser in C2
 * (D073, 26 Nov 2026), after the founder's test payments in the Instagram and LinkedIn browsers passed: this one flag is
 * the whole change, and the words stay for a switch back. Switch it back on in the same release if B2 (the redirect
 * checkout in the in-app browsers) is ever reverted. While on, it showed only inside those three browsers:
 * ui/InAppBrowserNote's client gate reads the user agent.
 */
export const inAppNote = {
  enabled: false,
  title: "Paying by UPI? Open this page in Chrome or Safari.",
  body: "Do it first, so you don’t type your details twice. Copy the link and paste it into Chrome or Safari:",
  copyLabel: "Copy link",
  copiedMessage: "Link copied.",
} satisfies InAppBrowserNoteContent;
