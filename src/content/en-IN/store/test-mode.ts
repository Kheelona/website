/**
 * The one line the test store prints (D071 (K-182), T2): the strip at the very top of every store page on a beta
 * build, betastore.kheelona.com, which takes Razorpay Test Mode payments only. A words-only module with no imports,
 * read by `TestModeStrip` alone, a server component: it never ships to the browser, and the production build never
 * renders it.
 *
 * The founder's rule (24 Nov 2026): change no visible copy unless the flow cannot work without it. This is the only
 * new visible text of the test store, and it appears on the test host only. A test payment must never be mistaken for
 * a real one, and a real parent must never see it.
 */
export const testModeCopy = {
  strip: "TEST MODE: no real payments",
} as const;
