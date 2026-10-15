import { createElement, type ReactNode } from "react";
import { AnswerSection } from "@/components/sections/AnswerSection/AnswerSection";
import type { AnswerSectionConfig } from "@/components/sections/AnswerSection/answer-section.types";
import { ArticleBody } from "@/components/sections/ArticleBody/ArticleBody";
import type { ArticleBodyConfig } from "@/components/sections/ArticleBody/article-body.types";
import { ArticleHead } from "@/components/sections/ArticleHead/ArticleHead";
import type { ArticleHeadConfig } from "@/components/sections/ArticleHead/article-head.types";
import { CardGrid } from "@/components/sections/CardGrid/CardGrid";
import type { CardGridConfig } from "@/components/sections/CardGrid/card-grid.types";
import { CloseSection } from "@/components/sections/CloseSection/CloseSection";
import type { CloseSectionConfig } from "@/components/sections/CloseSection/close-section.types";
import { CompareByCategory } from "@/components/sections/CompareByCategory/CompareByCategory";
import type { CompareByCategoryConfig } from "@/components/sections/CompareByCategory/compare-by-category.types";
import { CtaBlock } from "@/components/sections/CtaBlock/CtaBlock";
import type { CtaBlockConfig, SellingContext } from "@/components/sections/CtaBlock/cta-block.types";
import { EmptyStateSection } from "@/components/sections/EmptyStateSection/EmptyStateSection";
import type { EmptyStateSectionConfig } from "@/components/sections/EmptyStateSection/empty-state-section.types";
import { ExampleConversation } from "@/components/sections/ExampleConversation/ExampleConversation";
import type { ExampleConversationConfig } from "@/components/sections/ExampleConversation/example-conversation.types";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import type { FaqSectionConfig } from "@/components/sections/FaqSection/faq-section.types";
import { FeatureSplit } from "@/components/sections/FeatureSplit/FeatureSplit";
import type { FeatureSplitConfig } from "@/components/sections/FeatureSplit/feature-split.types";
import { FilmsStrip } from "@/components/sections/FilmsStrip/FilmsStrip";
import type { FilmsConfig } from "@/components/sections/FilmsStrip/films-strip.types";
import { FoundersSection } from "@/components/sections/FoundersSection/FoundersSection";
import type { FoundersSectionConfig } from "@/components/sections/FoundersSection/founders-section.types";
import { GrievanceBlock } from "@/components/sections/GrievanceBlock/GrievanceBlock";
import type { GrievanceBlockConfig } from "@/components/sections/GrievanceBlock/grievance-block.types";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import type { HeroSectionConfig } from "@/components/sections/HeroSection/hero-section.types";
import { ModesSection } from "@/components/sections/ModesSection/ModesSection";
import type { ModesSectionConfig } from "@/components/sections/ModesSection/modes-section.types";
import { OfferSection } from "@/components/sections/OfferSection/OfferSection";
import type { OfferSectionConfig } from "@/components/sections/OfferSection/offer-section.types";
import { ProductDetails } from "@/components/sections/ProductDetails/ProductDetails";
import type { ProductDetailsConfig } from "@/components/sections/ProductDetails/product-details.types";
import { RecognitionStrip } from "@/components/sections/RecognitionStrip/RecognitionStrip";
import type { RecognitionStripConfig } from "@/components/sections/RecognitionStrip/recognition-strip.types";
import { RelatedGuides } from "@/components/sections/RelatedGuides/RelatedGuides";
import type { RelatedGuidesConfig } from "@/components/sections/RelatedGuides/related-guides.types";
import { SellerBlock } from "@/components/sections/SellerBlock/SellerBlock";
import type { SellerBlockConfig } from "@/components/sections/SellerBlock/seller-block.types";
import { SourcesSection } from "@/components/sections/SourcesSection/SourcesSection";
import type { SourcesSectionConfig } from "@/components/sections/SourcesSection/sources-section.types";
import { StepsSection, StepsTip } from "@/components/sections/StepsSection/StepsSection";
import type { StepsSectionConfig } from "@/components/sections/StepsSection/steps-section.types";
import { TopicSection } from "@/components/sections/TopicSection/TopicSection";
import type { TopicSectionConfig } from "@/components/sections/TopicSection/topic-section.types";
import { TrustSection } from "@/components/sections/TrustSection/TrustSection";
import type { TrustSectionConfig } from "@/components/sections/TrustSection/trust-section.types";
import type { Copy } from "@/content/types";

/*
 * The section registry (task 4.1; architecture §5.4; structure §1, §4): every fold a page's content may list, as a
 * discriminated union on `kind`, and the one place that turns an entry into its section. A kind is its section's
 * folder in kebab case (the stem of its `name.types.ts`); `config` is that section's own typed configuration. The
 * registry adds what a section cannot know from content alone:
 * - the page's selling context ({...config, ...context}: the live offer, the one CTA label, the help line) for the
 *   selling sections, and the offer for every section that prints words through RichText;
 * - the slots, composed from content: a CTA block (CtaBlock, task 3.2) under a hero, after a films strip or last in
 *   a trust fold; setup's Wi-Fi tip after a ticks fold; the guide's inline sources inside the FAQ column; an
 *   article's answer before and sources after its body. Sections never import each other's selling parts (3.3).
 * Each slot is typed only where its section draws it, so content can never pass one that would be silently dropped.
 * `.ts`, not `.tsx`: the file the plan names; `createElement` stands in for JSX.
 */

/** What every fold of a page receives from the page (the selling sections' context, task 3.2). */
export type SectionContext = SellingContext;

/** A section's HowTo (architecture §9.2, /setup): its name and description; the steps are the section's own. */
export interface HowToCopy {
  readonly name: Copy;
  readonly description?: Copy;
}

type HeroWithCta = Extract<HeroSectionConfig, { readonly variant: "art" | "product" }>;
type TicksSplit = Extract<FeatureSplitConfig, { readonly variant: "ticks" }>;
type StoreFaq = Extract<FaqSectionConfig, { readonly variant: "store" }>;
type ArticleAnswer = Extract<AnswerSectionConfig, { readonly variant: "article" }>;

/** Each kind's entry, besides `kind`: the section's configuration and the slots the registry composes. */
export interface SectionEntries {
  /** The page's first fold and its one h1; `art` and `product` carry the CTA block under the heading. */
  "hero-section":
    | { readonly config: HeroWithCta; readonly cta?: CtaBlockConfig }
    | { readonly config: Exclude<HeroSectionConfig, HeroWithCta>; readonly cta?: never };
  /** The CTA block goes after the strip (Home fold 2). Either layout: the strip, or one film on its own (`single`, the
   *  product page's expert clip, task 8c.6). */
  "films-strip": { readonly config: FilmsConfig; readonly cta?: CtaBlockConfig };
  /** `ticks` takes setup's Wi-Fi tip after its checklist (setup.html fold 2). */
  "feature-split":
    | { readonly config: TicksSplit; readonly tip?: Copy }
    | { readonly config: Exclude<FeatureSplitConfig, TicksSplit>; readonly tip?: never };
  /** `faq`: the heading and its lead are an answer-first block of the page's FAQPage (Home fold 4). */
  "modes-section": { readonly config: ModesSectionConfig; readonly faq?: true };
  /** The CTA block goes last in the fold; `faq`: each titled item is a question of the page's FAQPage (/safety). */
  "trust-section": { readonly config: TrustSectionConfig; readonly cta?: CtaBlockConfig; readonly faq?: true };
  "compare-by-category": { readonly config: CompareByCategoryConfig };
  "card-grid": { readonly config: CardGridConfig };
  /** `howTo`: the page's HowTo, from these very steps (/setup). */
  "steps-section": { readonly config: StepsSectionConfig; readonly howTo?: HowToCopy };
  /** Its items are the page's FAQPage; `notes` (the guide's inline sources) sit inside the questions' column. */
  "faq-section":
    | { readonly config: Exclude<FaqSectionConfig, StoreFaq>; readonly notes?: SourcesSectionConfig }
    | { readonly config: StoreFaq; readonly notes?: never };
  "offer-section": { readonly config: OfferSectionConfig };
  "close-section": { readonly config: CloseSectionConfig };
  /** `sourceLabel`: the word a source marker reads before its number ("Source"). */
  "answer-section": { readonly config: AnswerSectionConfig; readonly sourceLabel?: string };
  "product-details": { readonly config: ProductDetailsConfig };
  "topic-section": { readonly config: TopicSectionConfig };
  "founders-section": { readonly config: FoundersSectionConfig };
  "recognition-strip": { readonly config: RecognitionStripConfig };
  "grievance-block": { readonly config: GrievanceBlockConfig };
  "seller-block": { readonly config: SellerBlockConfig };
  "empty-state-section": { readonly config: EmptyStateSectionConfig };
  "sources-section": { readonly config: SourcesSectionConfig };
  "article-head": { readonly config: ArticleHeadConfig };
  /** `answer` goes before the parts and `sources` after them, inside the reading column (story-*.html). */
  "article-body": {
    readonly config: ArticleBodyConfig;
    readonly answer?: ArticleAnswer;
    readonly sources?: SourcesSectionConfig;
    readonly sourceLabel?: string;
  };
  "related-guides": { readonly config: RelatedGuidesConfig };
  /** The labelled example of what asking back sounds like (task 8c.3; the product page, after its steps). */
  "example-conversation": { readonly config: ExampleConversationConfig };
}

export type SectionKind = keyof SectionEntries;

/** One fold of kind `K` as a page's content lists it. */
export type SectionEntryOf<K extends SectionKind> = { [P in K]: { readonly kind: P } & SectionEntries[P] }[K];

/** Any fold a page's content may list: the discriminated union of every kind. */
export type SectionEntry = SectionEntryOf<SectionKind>;

type Renderer<K extends SectionKind> = (entry: SectionEntryOf<K>, context: SectionContext) => ReactNode;

/** A CTA block from its content, with the page's selling context. */
function ctaBlock(config: CtaBlockConfig | undefined, context: SectionContext): ReactNode {
  return config === undefined ? undefined : createElement(CtaBlock, { ...config, ...context });
}

const REGISTRY: { readonly [K in SectionKind]: Renderer<K> } = {
  "hero-section": (e, ctx) => createElement(HeroSection, { ...e.config, offer: ctx.offer, cta: ctaBlock(e.cta, ctx) }),
  "films-strip": (e, ctx) => createElement(FilmsStrip, { ...e.config, offer: ctx.offer, after: ctaBlock(e.cta, ctx) }),
  "feature-split": (e, ctx) =>
    createElement(FeatureSplit, {
      ...e.config,
      offer: ctx.offer,
      after: e.tip === undefined ? undefined : createElement(StepsTip, { text: e.tip, offer: ctx.offer }),
    }),
  "modes-section": (e, ctx) => createElement(ModesSection, { ...e.config, offer: ctx.offer }),
  "trust-section": (e, ctx) => createElement(TrustSection, { ...e.config, offer: ctx.offer, cta: ctaBlock(e.cta, ctx) }),
  "compare-by-category": (e, ctx) => createElement(CompareByCategory, { ...e.config, offer: ctx.offer }),
  "card-grid": (e, ctx) => createElement(CardGrid, { ...e.config, offer: ctx.offer }),
  "steps-section": (e, ctx) => createElement(StepsSection, { ...e.config, offer: ctx.offer }),
  "faq-section": (e, ctx) =>
    createElement(FaqSection, {
      ...e.config,
      offer: ctx.offer,
      notes: e.notes === undefined ? undefined : createElement(SourcesSection, e.notes),
    }),
  "offer-section": (e, ctx) => createElement(OfferSection, { ...e.config, ...ctx }),
  "close-section": (e, ctx) => createElement(CloseSection, { ...e.config, ...ctx }),
  "answer-section": (e, ctx) => createElement(AnswerSection, { ...e.config, offer: ctx.offer, sourceLabel: e.sourceLabel }),
  "product-details": (e, ctx) => createElement(ProductDetails, { ...e.config, offer: ctx.offer }),
  "topic-section": (e) => createElement(TopicSection, e.config),
  "founders-section": (e) => createElement(FoundersSection, e.config),
  "recognition-strip": (e) => createElement(RecognitionStrip, e.config),
  "grievance-block": (e) => createElement(GrievanceBlock, e.config),
  "seller-block": (e) => createElement(SellerBlock, e.config),
  "empty-state-section": (e) => createElement(EmptyStateSection, e.config),
  "sources-section": (e) => createElement(SourcesSection, e.config),
  "article-head": (e) => createElement(ArticleHead, e.config),
  "article-body": (e, ctx) =>
    createElement(ArticleBody, {
      ...e.config,
      offer: ctx.offer,
      sourceLabel: e.sourceLabel,
      before: e.answer === undefined ? undefined : createElement(AnswerSection, { ...e.answer, offer: ctx.offer, sourceLabel: e.sourceLabel }),
      after: e.sources === undefined ? undefined : createElement(SourcesSection, e.sources),
    }),
  "related-guides": (e) => createElement(RelatedGuides, e.config),
  "example-conversation": (e, ctx) => createElement(ExampleConversation, { ...e.config, offer: ctx.offer }),
};

/** Every kind, in the registry's order. */
export const SECTION_KINDS = Object.keys(REGISTRY) as readonly SectionKind[];

/** The kinds whose section holds the page's one h1: a page lists exactly one of them, first (PageTemplate). */
export const PAGE_HEADING_KINDS: ReadonlySet<SectionKind> = new Set<SectionKind>(["hero-section", "empty-state-section", "article-head"]);

/** One fold, rendered by its section with the page's context. */
export function renderSection<K extends SectionKind>(entry: SectionEntryOf<K>, context: SectionContext): ReactNode {
  const render: Renderer<K> = REGISTRY[entry.kind];
  return render(entry, context);
}
