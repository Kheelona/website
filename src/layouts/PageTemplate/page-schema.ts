import { faqPlainItems } from "@/components/ui/FaqList/FaqList";
import type { Copy, FaqItem, Offer, SitePath } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import type { SchemaNode } from "@/lib/seo/jsonld";
import { faqPageNode } from "@/lib/seo/schema/faq-page";
import { howToNode } from "@/lib/seo/schema/how-to";
import { productNode } from "@/lib/seo/schema/product";
import { aboutPageNode, contactPageNode } from "@/lib/seo/schema/web-page";
import type { SectionEntry } from "../sections-registry";
import type { PageContent, PageSchema } from "./page-template.types";

/*
 * The page's own JSON-LD nodes (task 4.1; architecture §9.2), besides the Organization and WebSite the site shell
 * emits once. In this order: the nodes the content declares (Product, AboutPage, ContactPage), each HowTo, then one
 * FAQPage. The HowTo, the FAQPage and the AboutPage's description are read off the page's sections, so every answer
 * and step is the plain text of words the page shows in the live offer mode (the serialiser RichText's output matches;
 * jsonld-matches-page).
 */

const plain = (copy: Copy, offer: Offer) => toPlainText(copy, offer);
const plainOptional = (copy: Copy | undefined, offer: Offer) => (copy === undefined ? undefined : plain(copy, offer));

/** The AboutPage's description: the answer of the page's one answer-section fold (team.md fold 2: "feeds AboutPage
 *  JSON-LD"), so the node says what the page shows and is never written twice (task 4.5 item 5). */
function aboutDescription(page: PageContent, offer: Offer, path: SitePath): string {
  const folds = page.sections.flatMap((entry) => (entry.kind === "answer-section" ? [entry.config] : []));
  if (folds.length !== 1) {
    throw new Error(`${path}: an AboutPage is described by the page's one answer-section fold; found ${folds.length}`);
  }
  return plain(folds[0].answer, offer);
}

function declaredNode(schema: PageSchema, page: PageContent, offer: Offer, path: SitePath): SchemaNode {
  switch (schema.kind) {
    case "product": {
      const { description, offerDescription, ...facts } = schema.product;
      return productNode({ ...facts, path, description: plain(description, offer), offerDescription: plain(offerDescription, offer) }, offer);
    }
    case "about-page":
      return aboutPageNode({ name: plain(schema.name, offer), description: aboutDescription(page, offer, path), path });
    case "contact-page":
      return contactPageNode({ name: plain(schema.name, offer), description: plainOptional(schema.description, offer), path });
  }
}

/**
 * The answer-first blocks a fold adds to the page's FAQPage: a FAQ fold's items (not the store's: its page is
 * noindex and carries none, store.md); with `faq`, a trust fold's titled items (/safety fold 2) and a modes fold's
 * heading and lead (Home fold 4).
 */
function answersOf(entry: SectionEntry): readonly FaqItem[] {
  switch (entry.kind) {
    case "faq-section":
      return entry.config.variant === "store" ? [] : entry.config.items;
    case "trust-section": {
      if (!entry.faq) return [];
      const { heading, items } = entry.config;
      return items.map((item, i) => {
        if (item.title === undefined) {
          throw new Error(`Trust fold "${heading.id}": item ${i + 1} has no title, so it cannot be a question of the page's FAQPage`);
        }
        return { id: `${heading.id}-${i + 1}`, question: item.title, answer: item.body };
      });
    }
    case "modes-section": {
      if (!entry.faq) return [];
      const { heading } = entry.config;
      if (heading.lead === undefined) {
        throw new Error(`Modes fold "${heading.id}" has no lead, so its heading has no answer for the page's FAQPage`);
      }
      return [{ id: heading.id, question: heading.title, answer: heading.lead }];
    }
    default:
      return [];
  }
}

function howToOf(entry: SectionEntry, offer: Offer, path: SitePath): SchemaNode[] {
  if (entry.kind !== "steps-section" || entry.howTo === undefined) return [];
  const { config, howTo } = entry;
  return [
    howToNode({
      name: plain(howTo.name, offer),
      description: plainOptional(howTo.description, offer),
      path,
      steps: config.steps.map((step) => ({ name: plain(step.title, offer), text: plain(step.body, offer), anchor: config.id })),
    }),
  ];
}

/** Every node of the page's own graph; empty when it has none (then the template prints no script). */
export function pageSchemaNodes(page: PageContent, offer: Offer, path: SitePath): SchemaNode[] {
  const declared = (page.schema ?? []).map((schema) => declaredNode(schema, page, offer, path));
  const howTos = page.sections.flatMap((entry) => howToOf(entry, offer, path));
  const answers = page.sections.flatMap(answersOf);
  const faqPage = answers.length > 0 ? [faqPageNode(faqPlainItems(answers, offer))] : [];
  return [...declared, ...howTos, ...faqPage];
}
