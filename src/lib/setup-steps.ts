/** The four day-one steps, published on /setup and reused verbatim by the
 *  Home "How it works" band (R9) — one source of truth so the sequences can
 *  never drift apart. Steps stay generic until final specs land
 *  (TODO claims-specs: wake word, charger details). */
export const SETUP_STEPS = [
  { n: "01", title: "Unbox and charge.", body: "Lumi arrives ready. Plug in the charger and let it drink while you do the next step.", color: "text-orange-deep" },
  /* V6 axe fix: text-blue numerals fail 3:1 on washes (2.68 on cool, ~2.9 on
     white) — blue-ink is the numeral blue, same as /products/lumi and /team. */
  { n: "02", title: "Open the parent app.", body: "Set the languages you speak at home, pick the topics that are open, and set quiet hours. Five minutes, once.", color: "text-blue-ink" },
  { n: "03", title: "Teach the hello.", body: "Show your child how to wake Lumi up. One word, one friend, no manual required.", color: "text-blue-ink" },
  { n: "04", title: "Step back and listen.", body: "The first conversation belongs to them. You can read it later in the app, and smile.", color: "text-orange-ink" },
] as const;
