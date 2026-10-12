import type { SectionEntry } from "../sections-registry";
import { ART, CTA_BLOCK } from "./__fixtures__/entries";

/* Type tests of the section registry (task 4.1), checked by `npm run typecheck` (tsconfig.guards.json): a slot is
 * typed only where its section draws it, so content can never pass one that would be dropped without a word. */

const heading = { id: "x-title", title: "A {hand:fold}" };

export const accepted: readonly SectionEntry[] = [
  { kind: "hero-section", config: { variant: "art", heading, art: ART }, cta: CTA_BLOCK },
  { kind: "hero-section", config: { variant: "answer", heading } },
  { kind: "feature-split", config: { variant: "ticks", heading, items: [] }, tip: "A tip." },
  { kind: "faq-section", config: { heading, items: [] }, notes: { variant: "inline", label: "Sources", sources: [] } },
  { kind: "trust-section", config: { variant: "never", heading, items: [] }, cta: CTA_BLOCK, faq: true },
];

// @ts-expect-error An answer hero has no CTA column: the block would never be drawn.
export const answerHeroWithCta: SectionEntry = { kind: "hero-section", config: { variant: "answer", heading }, cta: CTA_BLOCK };

// @ts-expect-error Only a ticks fold draws anything after its words.
export const quoteWithTip: SectionEntry = { kind: "feature-split", config: { variant: "quote", heading, copy: [], quote: { text: "Q", name: "N" } }, tip: "A tip." };

// @ts-expect-error The store's FAQ has no notes column.
export const storeFaqWithNotes: SectionEntry = { kind: "faq-section", config: { variant: "store", heading: { title: "Q", id: "q" }, items: [] }, notes: { variant: "inline", label: "Sources", sources: [] } };

// @ts-expect-error A kind is one of the registry's; an unknown kind does not compile.
export const unknownKind: SectionEntry = { kind: "carousel", config: {} };

// @ts-expect-error A kind takes its own section's config, not another's.
export const wrongConfig: SectionEntry = { kind: "close-section", config: { variant: "art", heading, art: ART } };

// @ts-expect-error The opt-in to the FAQPage is `true` or absent.
export const faqFalse: SectionEntry = { kind: "modes-section", config: { variant: "home", heading, photo: { image: ART.layers[0].image! }, modes: [], languages: { title: "L", items: [] } }, faq: false };
