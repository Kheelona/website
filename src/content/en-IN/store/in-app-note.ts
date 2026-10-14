import type { InAppBrowserNoteContent } from "@/content/types";

/**
 * The store's in-app browser note (store.md fold 2; B12, G13): a parent inside the Instagram, Facebook or WhatsApp
 * browser is asked to open the store in Chrome or Safari before paying by UPI. Words as the approved mockup
 * (mockup/store.html fold 2); `ui/InAppBrowserNote` prints the store address after the body.
 *
 * Switched on in task 7.1c: the founder chose to show it now, on the PostHog audit's evidence (strategy §6 issue 2),
 * without the real-device check beta cannot run (D056 item 3, superseding N7's condition; deviation V4 retired). It
 * still shows only inside those three browsers: ui/InAppBrowserNote's client gate reads the user agent.
 */
export const inAppNote = {
  enabled: true,
  title: "Paying by UPI? Open this page in Chrome or Safari.",
  body: "Do it first, so you don’t type your details twice. Copy the link and paste it into Chrome or Safari:",
  copyLabel: "Copy link",
  copiedMessage: "Link copied.",
} satisfies InAppBrowserNoteContent;
