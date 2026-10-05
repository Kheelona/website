/** Kheelu's safety facts, ONE source for Home's safety room and /safety
 *  (founder, 2026-10-04: "all pages in sync"). Before this file the two pages
 *  each kept their own four rules and their own voice path, worded differently,
 *  and /safety's "four basics" were not the same four as Home's.
 *
 *  Every fact here is published or founder-confirmed (2026-10-04): it listens
 *  only for its wake word (content doc v7 Appendix B), it connects only to
 *  Kheelona's own servers, in India, and it says it is a toy and never asks a
 *  child for a secret. Icons are the page's business, so they are keyed by
 *  `icon` rather than imported here. */
export type SafetyPoint = {
  icon: "mic" | "no-internet" | "log" | "toy";
  title: string;
  body: string;
};

export const SAFETY_POINTS: readonly SafetyPoint[] = [
  {
    icon: "mic",
    title: "It listens for one word",
    body: "Nothing is recorded or sent until your child says the wake word.",
  },
  {
    icon: "no-internet",
    title: "It cannot browse the internet",
    body: "It connects only to our own servers. No websites, no videos, no strangers.",
  },
  {
    icon: "log",
    title: "You can read every conversation",
    body: "Word for word, in the parent app. Delete anything with one tap.",
  },
  {
    icon: "toy",
    title: "It says it is a toy",
    body: "Kheelu tells your child it is a toy, and it never asks them to keep a secret from you.",
  },
];

/** Where a child's voice goes. Home shows the three stops; /safety shows each
 *  stop with its sentence. Same stops, same words, one list. */
export const VOICE_PATH: readonly { title: string; body: string }[] = [
  {
    title: "On the toy",
    body: "Kheelu hears the wake word, and the first safety checks happen on the toy itself, before anything travels anywhere.",
  },
  {
    title: "Our own servers, in India",
    body: "Open conversation uses your home WiFi and Kheelona's own servers in India. Nothing goes to another country to be processed.",
  },
  {
    title: "Your app",
    body: "The conversation appears in your app, word for word. It is never sold, and never used to sell your child anything.",
  },
];

/** The line under the voice path, on both pages. */
export const VOICE_PATH_NOTE = "Never sold. Story-mode stories and lessons play offline.";
