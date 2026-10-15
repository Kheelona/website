import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnswerSection } from "@/components/sections/AnswerSection/AnswerSection";
import { ArticleBody } from "@/components/sections/ArticleBody/ArticleBody";
import { ArticleHead } from "@/components/sections/ArticleHead/ArticleHead";
import { CardGrid } from "@/components/sections/CardGrid/CardGrid";
import { CloseSection } from "@/components/sections/CloseSection/CloseSection";
import { CompareByCategory } from "@/components/sections/CompareByCategory/CompareByCategory";
import { CtaBlock } from "@/components/sections/CtaBlock/CtaBlock";
import type { CtaBlockConfig } from "@/components/sections/CtaBlock/cta-block.types";
import { DayTimeline } from "@/components/sections/DayTimeline/DayTimeline";
import { EmptyStateSection } from "@/components/sections/EmptyStateSection/EmptyStateSection";
import { ExampleConversation } from "@/components/sections/ExampleConversation/ExampleConversation";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import { FeatureSplit } from "@/components/sections/FeatureSplit/FeatureSplit";
import { FilmsStrip } from "@/components/sections/FilmsStrip/FilmsStrip";
import { FoundersSection } from "@/components/sections/FoundersSection/FoundersSection";
import { GrievanceBlock } from "@/components/sections/GrievanceBlock/GrievanceBlock";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { LanguagesSection } from "@/components/sections/LanguagesSection/LanguagesSection";
import { ModesSection } from "@/components/sections/ModesSection/ModesSection";
import { OfferSection } from "@/components/sections/OfferSection/OfferSection";
import { ProductDetails } from "@/components/sections/ProductDetails/ProductDetails";
import { RecognitionStrip } from "@/components/sections/RecognitionStrip/RecognitionStrip";
import { RelatedGuides } from "@/components/sections/RelatedGuides/RelatedGuides";
import { SellerBlock } from "@/components/sections/SellerBlock/SellerBlock";
import { SourcesSection } from "@/components/sections/SourcesSection/SourcesSection";
import { StepsSection, StepsTip } from "@/components/sections/StepsSection/StepsSection";
import { StickyScroll } from "@/components/sections/StickyScroll/StickyScroll";
import { TopicSection } from "@/components/sections/TopicSection/TopicSection";
import { TrustSection } from "@/components/sections/TrustSection/TrustSection";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import type { Offer } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { PAGE_HEADING_KINDS, SECTION_KINDS, renderSection, type SectionContext, type SectionEntry, type SectionEntryOf, type SectionKind } from "../sections-registry";
import { ART, CTA_BLOCK, ENTRY_FIXTURES } from "./__fixtures__/entries";

/* The section registry (task 4.1; architecture §5.4; structure §1): every section kind a page's content may list,
 * mapped to its section component, with the slots the registry composes (the CTA block of a hero, films strip or
 * trust fold; setup's Wi-Fi tip; the guide's inline sources; an article's answer and sources) and the page's
 * selling context spread into every selling section ({...config, ...context}). */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");
const context = (offer: Offer = TOKEN): SectionContext => ({ offer, ctaLabel: cta.preorder, help: seller.help });
const markup = (node: ReturnType<typeof renderSection> | ReactElement) => renderToStaticMarkup(<>{node}</>);
const dom = (node: ReturnType<typeof renderSection>) => {
  const host = document.createElement("div");
  host.innerHTML = markup(node);
  return host;
};

/** "CtaBlock" → "cta-block": a kind is its section's folder in kebab case, as its name.types.ts file is. */
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** Each kind's section, rendered by hand: the independent statement of what the registry must map. */
const EXPECTED: { [K in SectionKind]: (entry: SectionEntryOf<K>, ctx: SectionContext) => ReactElement } = {
  "hero-section": (e, { offer }) => <HeroSection {...e.config} offer={offer} />,
  "films-strip": (e, { offer }) => <FilmsStrip {...e.config} offer={offer} />,
  "feature-split": (e, { offer }) => <FeatureSplit {...e.config} offer={offer} />,
  "modes-section": (e, { offer }) => <ModesSection {...e.config} offer={offer} />,
  "trust-section": (e, { offer }) => <TrustSection {...e.config} offer={offer} />,
  "compare-by-category": (e, { offer }) => <CompareByCategory {...e.config} offer={offer} />,
  "card-grid": (e, { offer }) => <CardGrid {...e.config} offer={offer} />,
  "steps-section": (e, { offer }) => <StepsSection {...e.config} offer={offer} />,
  "faq-section": (e, { offer }) => <FaqSection {...e.config} offer={offer} />,
  "offer-section": (e, ctx) => <OfferSection {...e.config} {...ctx} />,
  "close-section": (e, ctx) => <CloseSection {...e.config} {...ctx} />,
  "answer-section": (e, { offer }) => <AnswerSection {...e.config} offer={offer} />,
  "product-details": (e, { offer }) => <ProductDetails {...e.config} offer={offer} />,
  "topic-section": (e) => <TopicSection {...e.config} />,
  "founders-section": (e) => <FoundersSection {...e.config} />,
  "recognition-strip": (e) => <RecognitionStrip {...e.config} />,
  "languages-section": (e, { offer }) => <LanguagesSection {...e.config} offer={offer} />,
  "sticky-scroll": (e, { offer }) => <StickyScroll {...e.config} offer={offer} />,
  "day-timeline": (e, { offer }) => <DayTimeline {...e.config} offer={offer} />,
  "grievance-block": (e) => <GrievanceBlock {...e.config} />,
  "seller-block": (e) => <SellerBlock {...e.config} />,
  "empty-state-section": (e) => <EmptyStateSection {...e.config} />,
  "sources-section": (e) => <SourcesSection {...e.config} />,
  "article-head": (e) => <ArticleHead {...e.config} />,
  "article-body": (e, { offer }) => <ArticleBody {...e.config} offer={offer} />,
  "related-guides": (e) => <RelatedGuides {...e.config} />,
  "example-conversation": (e, { offer }) => <ExampleConversation {...e.config} offer={offer} />,
};

const expected = <K extends SectionKind>(entry: SectionEntryOf<K>, ctx: SectionContext) =>
  (EXPECTED[entry.kind] as (entry: SectionEntryOf<K>, ctx: SectionContext) => ReactElement)(entry, ctx);

describe("the section registry: one kind per section", () => {
  it("lists every section folder by its kebab-case name; CtaBlock is a slot the registry composes, not a fold", () => {
    const root = join(process.cwd(), "src/components/sections");
    const sections = readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(root, d.name, `${d.name}.tsx`)))
      .map((d) => kebab(d.name));
    expect(sections.length, "the sections folder was read").toBeGreaterThan(20);
    expect([...SECTION_KINDS].sort()).toEqual(sections.filter((kind) => kind !== "cta-block").sort());
  });

  it.each(SECTION_KINDS)("%s renders its own section, with the page's offer where it takes one", (kind) => {
    for (const offer of [TOKEN, FULL]) {
      const entry = ENTRY_FIXTURES[kind] as SectionEntry;
      expect(markup(renderSection(entry, context(offer)))).toBe(markup(expected(entry, context(offer))));
    }
  });

  it("names the kinds that hold a page's one h1, as their fixtures render it", () => {
    const withH1 = SECTION_KINDS.filter((kind) => dom(renderSection(ENTRY_FIXTURES[kind] as SectionEntry, context())).querySelectorAll("h1").length === 1);
    expect([...PAGE_HEADING_KINDS].sort()).toEqual(withH1.sort());
  });
});

describe("the section registry: slots", () => {
  const HERO_CTA: CtaBlockConfig = { cta: "hero", arrow: true, block: true, id: "hero-cta", priceId: "hero-price", layout: "stack", trust: CTA_BLOCK.trust, helpLine: true };
  const hero = {
    kind: "hero-section",
    config: { variant: "art", heading: { id: "hero-title", title: "A toy that {hand:asks back}" }, art: ART },
    cta: HERO_CTA,
  } as const satisfies SectionEntry;

  it("composes a hero's CTA block with the page's selling context, under the heading", () => {
    for (const offer of [TOKEN, FULL]) {
      const ctx = context(offer);
      expect(markup(renderSection(hero, ctx))).toBe(
        markup(<HeroSection {...hero.config} offer={offer} cta={<CtaBlock {...HERO_CTA} {...ctx} />} />),
      );
      const host = dom(renderSection(hero, ctx));
      const button = host.querySelector("a.kh-btn--cta")!;
      expect(button.textContent).toBe(cta.preorder);
      expect(button.getAttribute("data-ph-capture-attribute-cta")).toBe("hero");
      expect(button.id).toBe("hero-cta");
      expect(host.querySelector("#hero-price")?.textContent).toBe(toPlainText(offer.priceLine, offer));
      expect(host.querySelector("header.kh-heading")?.parentElement?.contains(button)).toBe(true);
    }
  });

  it("composes a films strip's CTA block after the strip", () => {
    const films = { ...ENTRY_FIXTURES["films-strip"], cta: { ...CTA_BLOCK, cta: "see-it-ask" } } as const satisfies SectionEntry;
    const ctx = context();
    expect(markup(renderSection(films, ctx))).toBe(markup(<FilmsStrip {...films.config} offer={TOKEN} after={<CtaBlock {...films.cta} {...ctx} />} />));
    const host = dom(renderSection(films, ctx));
    expect(host.querySelector(".kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("see-it-ask");
    expect(host.querySelector(".ks-films")?.compareDocumentPosition(host.querySelector(".kh-btn--cta")!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("composes a trust fold's CTA block last in the fold", () => {
    const trust = { ...ENTRY_FIXTURES["trust-section"], cta: { ...CTA_BLOCK, cta: "safety" } } as const satisfies SectionEntry;
    const ctx = context(FULL);
    expect(markup(renderSection(trust, ctx))).toBe(markup(<TrustSection {...trust.config} offer={FULL} cta={<CtaBlock {...trust.cta} {...ctx} />} />));
    expect(dom(renderSection(trust, ctx)).querySelector(".kh-btn--cta")?.textContent).toBe(cta.preorder);
  });

  /* Task Q2.9 (the D2C plan v2 §2 folds 3, 5 and 8): Home's "Why it matters", its points and its safety block each end
     on a CTA block, after their words. */
  it("composes a CTA block after an imagination fold's words, after the compact safety block and after a sticky scroll's line", () => {
    const ctx = context(TOKEN);
    const why = {
      kind: "feature-split",
      config: {
        variant: "imagination",
        heading: { id: "why-title", title: "Why it {hand:matters}" },
        text: "Talk helps.",
        card: { tone: "sun", icon: "chat-circle-dots", title: "Where Kheelu comes in", body: "It asks back." },
      },
      cta: { ...CTA_BLOCK, cta: "home-why" },
    } as const satisfies SectionEntry;
    expect(markup(renderSection(why, ctx))).toBe(markup(<FeatureSplit {...why.config} offer={TOKEN} after={<CtaBlock {...why.cta} {...ctx} />} />));
    const safe = {
      kind: "feature-split",
      config: {
        variant: "app-screens",
        placement: "compact",
        heading: { id: "safety-title", title: "Safety you can {hand:check.}" },
        items: [{ icon: "eye", body: "You read every conversation." }],
        screens: { images: [ART.layers[0].image!] },
      },
      cta: { ...CTA_BLOCK, cta: "safety" },
    } as const satisfies SectionEntry;
    const host = dom(renderSection(safe, ctx));
    expect(host.querySelector(".ks-safe-split ~ .kh-section__actions .kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("safety");
    const asks = { ...ENTRY_FIXTURES["sticky-scroll"], cta: { ...CTA_BLOCK, cta: "home-asks" } } as const satisfies SectionEntry;
    expect(markup(renderSection(asks, ctx))).toBe(markup(<StickyScroll {...asks.config} offer={TOKEN} cta={<CtaBlock {...asks.cta} {...ctx} />} />));
    expect(dom(renderSection(asks, ctx)).querySelector(".ks-sticky__main > .ks-sticky__points ~ .kh-section__actions .kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("home-asks");
  });

  /* Task Q2.10 (the D2C plan v2 §3 fold 6): the product page's sample chats end on their button, `product-ask`. */
  it("composes an example conversation's CTA block last in its column", () => {
    const example = { ...ENTRY_FIXTURES["example-conversation"], cta: { ...CTA_BLOCK, cta: "product-ask" } } as const satisfies SectionEntry;
    const ctx = context(TOKEN);
    expect(markup(renderSection(example, ctx))).toBe(markup(<ExampleConversation {...example.config} offer={TOKEN} cta={<CtaBlock {...example.cta} {...ctx} />} />));
    const host = dom(renderSection(example, ctx));
    expect(host.querySelector(".kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("product-ask");
    expect(host.querySelector(".ks-exchange__lines")?.compareDocumentPosition(host.querySelector(".kh-btn--cta")!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  /* Task Q2.17 (D066 item 3): the product page's comparison ends on its button, `product-compare`, after the table. */
  it("composes a comparison's CTA block right after the comparison", () => {
    const compare = { ...ENTRY_FIXTURES["compare-by-category"], cta: { ...CTA_BLOCK, cta: "product-compare", align: "center" } } as const satisfies SectionEntry;
    const ctx = context(TOKEN);
    expect(markup(renderSection(compare, ctx))).toBe(markup(<CompareByCategory {...compare.config} offer={TOKEN} cta={<CtaBlock {...compare.cta} {...ctx} />} />));
    const host = dom(renderSection(compare, ctx));
    expect(host.querySelector(".kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("product-compare");
    expect(host.querySelector(".kh-compare-wrap")?.nextElementSibling?.querySelector(".kh-btn--cta")).not.toBeNull();
  });

  it("puts setup's Wi-Fi tip after the checklist of a ticks fold", () => {
    const ticks = {
      kind: "feature-split",
      config: { variant: "ticks", heading: { id: "before-title", title: "Before you {hand:start}" }, items: [{ icon: "check", body: "Home Wi‑Fi." }] },
      tip: "Choose the {nowrap:2.4 GHz} network.",
    } as const satisfies SectionEntry;
    expect(markup(renderSection(ticks, context()))).toBe(
      markup(<FeatureSplit {...ticks.config} offer={TOKEN} after={<StepsTip text={ticks.tip} offer={TOKEN} />} />),
    );
    const host = dom(renderSection(ticks, context()));
    expect(host.querySelector(".kh-trust")?.nextElementSibling).toBe(host.querySelector("p.ks-setup-tip"));
  });

  it("puts the guide's inline sources inside the FAQ column", () => {
    const notes = ENTRY_FIXTURES["sources-section"].config;
    const faq = {
      kind: "faq-section",
      config: { ...ENTRY_FIXTURES["faq-section"].config, variant: "photo", photo: { image: ART.layers[0].image!, sizes: "100vw" } },
      notes,
    } as const satisfies SectionEntry;
    expect(markup(renderSection(faq, context()))).toBe(markup(<FaqSection {...faq.config} offer={TOKEN} notes={<SourcesSection {...notes} />} />));
    expect(dom(renderSection(faq, context())).querySelector(".ks-faq-photo__body .ks-gd-sources")).not.toBeNull();
  });

  it("gives an article body its answer before and its sources after, markers worded by the content", () => {
    const answer = { variant: "article", question: "What helps?", answer: "Talking with your child.[^1]" } as const;
    const sources = { variant: "article", label: "Sources", sources: [{ citation: "A study", href: "https://developingchild.harvard.edu/" }] } as const;
    const body = { ...ENTRY_FIXTURES["article-body"], answer, sources, sourceLabel: "Source" } as const satisfies SectionEntry;
    expect(markup(renderSection(body, context()))).toBe(
      markup(
        <ArticleBody
          {...body.config}
          offer={TOKEN}
          sourceLabel="Source"
          before={<AnswerSection {...answer} offer={TOKEN} sourceLabel="Source" />}
          after={<SourcesSection {...sources} />}
        />,
      ),
    );
  });

  it("words an answer's source markers by the content", () => {
    const entry = { kind: "answer-section", config: { variant: "article", question: "Why?", answer: "Because.[^1]" }, sourceLabel: "Source" } as const satisfies SectionEntry;
    expect(markup(renderSection(entry, context()))).toBe(markup(<AnswerSection {...entry.config} offer={TOKEN} sourceLabel="Source" />));
  });

  it("gives every selling section the page's offer, CTA label and help line", () => {
    const close = ENTRY_FIXTURES["close-section"];
    const host = dom(renderSection(close, context(FULL)));
    expect(host.querySelector(".kh-btn--cta")?.textContent).toBe(cta.preorder);
    expect(host.querySelector(".ks-price")?.textContent).toBe(toPlainText(FULL.priceLine, FULL));
    expect(host.querySelector(".ks-help")?.textContent).toContain("Questions?");
    const offer = dom(renderSection(ENTRY_FIXTURES["offer-section"], context()));
    expect(offer.querySelector(".kh-offer .kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("product-offer");
  });
});
