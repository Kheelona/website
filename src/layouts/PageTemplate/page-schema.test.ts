import { describe, expect, it } from "vitest";
import { faqPlainItems } from "@/components/ui/FaqList/FaqList";
import { faqs } from "@/content/en-IN/faqs";
import { RETURN_DAYS, WARRANTY_MONTHS } from "@/content/en-IN/policies";
import type { FaqItem, Meta } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { aboutPageNode, contactPageNode } from "@/lib/seo/schema/web-page";
import { faqPageNode } from "@/lib/seo/schema/faq-page";
import { howToNode } from "@/lib/seo/schema/how-to";
import { productNode } from "@/lib/seo/schema/product";
import type { SectionEntry } from "../sections-registry";
import { ENTRY_FIXTURES } from "./__fixtures__/entries";
import { pageSchemaNodes } from "./page-schema";
import type { PageContent, ProductSchemaCopy } from "./page-template.types";

/* The page's own JSON-LD (task 4.1; architecture §9.2): the nodes besides the shell's Organization and WebSite. The
 * FAQPage and a HowTo are read off the page's own sections, so they are the very words it shows (FaqList's
 * `faqPlainItems`); a Product, AboutPage or ContactPage is declared by the page's content and built by the SEO
 * library's builders, the AboutPage described by the page's own answer-section fold. */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");
const META: Meta = { title: "A page", description: "A page.", og: { image: "/og.png", alt: "Kheelu" } };
const page = (sections: readonly SectionEntry[], schema?: PageContent["schema"]): PageContent => ({ meta: META, sections, schema });
const PATH = "/lp/spring";

const hero = ENTRY_FIXTURES["hero-section"];
const answer = ENTRY_FIXTURES["answer-section"];
const faqSection = ENTRY_FIXTURES["faq-section"];
const items: readonly FaqItem[] = [faqs["think-less"], faqs["what-ages"]];

describe("the page's FAQPage", () => {
  it("is the page's FAQ items, as their plain text in the live mode", () => {
    for (const offer of [TOKEN, FULL]) {
      expect(pageSchemaNodes(page([hero, faqSection]), offer, PATH)).toEqual([faqPageNode(faqPlainItems(items, offer))]);
    }
  });

  it("carries a price answer in the live mode's words", () => {
    const price = { kind: "faq-section", config: { heading: { id: "faq-title", title: "Price" }, items: [faqs["price-and-advance"]] } } as const satisfies SectionEntry;
    const [token] = pageSchemaNodes(page([price]), TOKEN, PATH);
    const [full] = pageSchemaNodes(page([price]), FULL, PATH);
    expect(JSON.stringify(token)).toContain(TOKEN.prices.headline);
    expect(JSON.stringify(full)).toContain(FULL.prices.full);
    expect(JSON.stringify(full)).not.toContain(TOKEN.prices.token);
  });

  it("is absent with no FAQ, and the page then has no nodes of its own", () => {
    expect(pageSchemaNodes(page([hero]), TOKEN, PATH)).toEqual([]);
  });

  it("joins every answer-first block the content opts in, in page order, into one FAQPage", () => {
    const modes = { ...ENTRY_FIXTURES["modes-section"], faq: true } as const satisfies SectionEntry;
    const trust = { ...ENTRY_FIXTURES["trust-section"], faq: true } as const satisfies SectionEntry;
    const nodes = pageSchemaNodes(page([hero, modes, trust, faqSection]), TOKEN, PATH);
    const expected: FaqItem[] = [
      { id: "what-title", question: modes.config.heading.title, answer: modes.config.heading.lead! },
      { id: "never-title-1", question: trust.config.items[0].title!, answer: trust.config.items[0].body },
      ...items,
    ];
    expect(nodes).toEqual([faqPageNode(faqPlainItems(expected, TOKEN))]);
    expect(nodes[0].mainEntity).toHaveLength(4);
  });

  it("leaves out the blocks the content does not opt in, and the store's FAQ (store.md: noindex, no FAQPage)", () => {
    const store = { kind: "faq-section", config: { variant: "store", heading: { id: "q", title: "Questions" }, items } } as const satisfies SectionEntry;
    expect(pageSchemaNodes(page([hero, ENTRY_FIXTURES["modes-section"], ENTRY_FIXTURES["trust-section"], store]), TOKEN, PATH)).toEqual([]);
  });

  it("refuses an opted-in trust item without a question, and a modes heading without its answer", () => {
    const untitled = {
      kind: "trust-section",
      config: { variant: "never", heading: { id: "never-title", title: "Never" }, items: [{ icon: "eye-slash", body: "No camera." }] },
      faq: true,
    } as const satisfies SectionEntry;
    expect(() => pageSchemaNodes(page([untitled]), TOKEN, PATH)).toThrow(/never-title.*item 1 has no title/);
    const modes = ENTRY_FIXTURES["modes-section"];
    const noLead = { ...modes, config: { ...modes.config, heading: { id: "what-title", title: "What is it?" } }, faq: true } as const satisfies SectionEntry;
    expect(() => pageSchemaNodes(page([noLead]), TOKEN, PATH)).toThrow(/what-title.*no lead/);
  });

  it("refuses the same question twice (the FAQPage builder's own rule)", () => {
    expect(() => pageSchemaNodes(page([faqSection, faqSection]), TOKEN, PATH)).toThrow(/listed twice/);
  });
});

describe("the page's HowTo", () => {
  it("is built from the very steps of the section that names it, each step linked to the section", () => {
    const steps = {
      kind: "steps-section",
      config: {
        variant: "four",
        id: "connect",
        heading: { title: "Set it up in {hand:four steps}" },
        steps: [
          { title: "Charge it", body: "Plug in the charger." },
          { title: "Get the app", body: "Install the parent app." },
          { title: "Connect", body: "Join your home Wi‑Fi." },
          { title: "Say hello", body: "Press the wake-up button." },
        ],
      },
      howTo: { name: "How to set up Kheelu", description: "Four steps." },
    } as const satisfies SectionEntry;
    expect(pageSchemaNodes(page([hero, steps]), TOKEN, "/setup")).toEqual([
      howToNode({
        name: "How to set up Kheelu",
        description: "Four steps.",
        path: "/setup",
        steps: steps.config.steps.map((s) => ({ name: s.title, text: s.body, anchor: "connect" })),
      }),
    ]);
  });

  it("is absent for steps the content does not name as a HowTo", () => {
    expect(pageSchemaNodes(page([hero, ENTRY_FIXTURES["steps-section"]]), TOKEN, PATH)).toEqual([]);
  });
});

describe("the nodes a page declares", () => {
  const product: ProductSchemaCopy = {
    id: "https://kheelona.com/products/spring#product",
    name: "Spring by Kheelona",
    brand: "Kheelona",
    description: "Spring is {price:headline} (incl. GST): a plush toy for ages 3 to 7.",
    images: ["/media/kheelu-front.jpg"],
    countryOfOrigin: "IN",
    audience: { minAge: 3, maxAge: 7 },
    offerDescription: { token: "{price:headline} in total (incl. GST).", full: "{price:full} (incl. GST)." },
    eligibleRegion: "IN",
    returnPolicy: { days: RETURN_DAYS, country: "IN", freeReturn: true, fullRefund: true },
    shipping: { destination: "IN", free: true },
    warrantyMonths: WARRANTY_MONTHS,
  };

  it("builds a Product with its Offer at the live mode's price, its url the page's own", () => {
    for (const offer of [TOKEN, FULL]) {
      const [node] = pageSchemaNodes(page([hero], [{ kind: "product", product }]), offer, "/products/spring");
      expect(node).toEqual(
        productNode(
          {
            ...product,
            path: "/products/spring",
            description: `Spring is ${offer.prices.headline} (incl. GST): a plush toy for ages 3 to 7.`,
            offerDescription: offer.mode === "token" ? `${offer.prices.headline} in total (incl. GST).` : `${offer.prices.full} (incl. GST).`,
          },
          offer,
        ),
      );
      expect((node.offers as { price: number }).price).toBe(offer.headlinePaise / 100);
    }
  });

  it("builds an AboutPage and a ContactPage from their words, pointing at the Organization", () => {
    const nodes = pageSchemaNodes(
      page([hero, answer], [
        { kind: "about-page", name: "About {hand:Kheelona}" },
        { kind: "contact-page", name: "Contact Kheelona", description: "Write to us." },
      ]),
      TOKEN,
      "/team",
    );
    expect(nodes).toEqual([
      aboutPageNode({ name: "About Kheelona", description: "Kheelona, a team in Bengaluru.", path: "/team" }),
      contactPageNode({ name: "Contact Kheelona", description: "Write to us.", path: "/team" }),
    ]);
  });

  /* Task 4.5 item 5 (architecture §9.2; team.md fold 2): the AboutPage says what the page's answer block says, so its
     description is read off the page's answer-section fold, never written twice. */
  it("describes the AboutPage with the page's own answer-section fold, in the live mode's words", () => {
    const priced = { kind: "answer-section", config: { variant: "team", question: "Who makes {hand:Kheelu?}", answer: faqs["price-and-advance"].answer } } as const satisfies SectionEntry;
    for (const offer of [TOKEN, FULL]) {
      const [node] = pageSchemaNodes(page([hero, priced], [{ kind: "about-page", name: "About Kheelona" }]), offer, "/team");
      expect(node).toEqual(aboutPageNode({ name: "About Kheelona", description: toPlainText(faqs["price-and-advance"].answer, offer), path: "/team" }));
    }
    // @ts-expect-error the AboutPage has no description of its own: it is the answer fold's
    const separate: PageContent["schema"] = [{ kind: "about-page", name: "About Kheelona", description: "Words of its own." }];
    expect(separate).toHaveLength(1);
  });

  it("refuses an AboutPage on a page without exactly one answer-section fold to describe it", () => {
    const about = [{ kind: "about-page", name: "About Kheelona" }] as const satisfies PageContent["schema"];
    expect(() => pageSchemaNodes(page([hero], about), TOKEN, "/team")).toThrow(/AboutPage.*one answer-section fold.*found 0/);
    expect(() => pageSchemaNodes(page([hero, answer, answer], about), TOKEN, "/team")).toThrow(/AboutPage.*one answer-section fold.*found 2/);
  });

  it("puts the declared nodes first, then the HowTo, then the FAQPage", () => {
    const steps = { ...ENTRY_FIXTURES["steps-section"], howTo: { name: "Check it" } } as const satisfies SectionEntry;
    const types = pageSchemaNodes(page([hero, faqSection, steps], [{ kind: "product", product }]), TOKEN, "/products/spring").map((n) => n["@type"]);
    expect(types).toEqual(["Product", "HowTo", "FAQPage"]);
  });
});
