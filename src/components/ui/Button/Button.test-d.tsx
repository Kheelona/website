/**
 * Type tests for Button (task 2.2 acceptance: a Chilli button refuses to compile without a CtaId).
 * `tsc --noEmit` checks this file (the `.test-d.tsx` suffix keeps it out of Vitest and inside the type
 * check): every line marked @ts-expect-error must be refused, or the type check fails.
 */
import { Button } from "./Button";

const STORE = "https://store.kheelona.com";

export const accepted = [
  <Button key="a" variant="cta" cta="hero" href={STORE} arrow>Pre-order Kheelu</Button>,
  <Button key="b" variant="cta" cta="sticky-bar" href={STORE}>Pre-order Kheelu</Button>,
  <Button key="c" variant="ghost" cta="hero-learn" href="/products/kheelu" iconEnd="arrow-right">See how it works</Button>,
  <Button key="d" variant="primary" type="submit" loading>Saving</Button>,
  <Button key="e">Cancel</Button>,
  <Button key="f" variant="ghost" cta="share-whatsapp" href="https://wa.me/?text=hi" target="_blank">Share</Button>,
];

export const refused = [
  // @ts-expect-error a Chilli button needs a CtaId
  <Button key="a" variant="cta" href={STORE}>Pre-order Kheelu</Button>,
  // @ts-expect-error not a registered CTA value
  <Button key="b" variant="cta" cta="hero-cta" href={STORE}>Pre-order Kheelu</Button>,
  // @ts-expect-error a reserved value (home-arc, A16) is never carried
  <Button key="c" variant="cta" cta="home-arc" href={STORE}>Pre-order Kheelu</Button>,
  // @ts-expect-error the nudging arrow belongs to Chilli buttons only
  <Button key="d" variant="ghost" href="/safety" arrow>Safety</Button>,
  // @ts-expect-error the arrow is the end icon; a second one is refused
  <Button key="e" variant="cta" cta="hero" href={STORE} arrow iconEnd="check">Pre-order Kheelu</Button>,
  // @ts-expect-error a link cannot be loading or submit
  <Button key="f" href="/safety" type="submit">Safety</Button>,
  // @ts-expect-error an icon must be one of the DS icons
  <Button key="g" icon="sparkle">Go</Button>,
  // @ts-expect-error only a link opens a tab (task 8c.5)
  <Button key="h" target="_blank">Go</Button>,
  // @ts-expect-error a new tab is the one target (task 8c.5)
  <Button key="i" href="https://wa.me/?text=hi" target="_self">Share</Button>,
];
