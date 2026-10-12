import { Fragment } from "react";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import type { Offer, SitePath } from "@/content/types";
import { jsonLd, pageGraph } from "@/lib/seo/jsonld";
import { PAGE_HEADING_KINDS, renderSection, type SectionContext } from "../sections-registry";
import { pageSchemaNodes } from "./page-schema";
import type { PageContent } from "./page-template.types";

export interface PageTemplateProps {
  /** The page's content module. */
  page: PageContent;
  /** The live offer (getOffer, ADR-005), for every price, amount and mode-dependent word. */
  offer: Offer;
  /** The page's own path: the url of its Product, HowTo, AboutPage or ContactPage node. */
  path: SitePath;
}

/** The page's one h1 section opens it, and it lists no second one (one h1 per page; the first fold never moves). */
function checkHeading(page: PageContent, path: SitePath): void {
  const [first] = page.sections;
  if (first === undefined || !PAGE_HEADING_KINDS.has(first.kind)) {
    throw new Error(`${path} must open with its h1 section (${[...PAGE_HEADING_KINDS].join(", ")}), not ${first?.kind ?? "nothing"}`);
  }
  const second = page.sections.slice(1).find((entry) => PAGE_HEADING_KINDS.has(entry.kind));
  if (second !== undefined) throw new Error(`${path} has one h1 section, the first; it also lists ${second.kind}`);
}

/**
 * The marketing page template (task 4.1; architecture §5.1, §5.4; structure §5): the page's folds, in its content's
 * order, each rendered by its section through the registry with the page's selling context (the live offer, the one
 * CTA label of content/en-IN/cta.ts, the help line of seller.ts), straight into the site shell's `<main>` as the
 * approved mockup puts them, then the page's own JSON-LD (FAQPage from the same items, and the nodes it declares).
 * A page route stays thin: load the content module and the offer, export `pageMeta`, render this. Server component.
 */
export function PageTemplate({ page, offer, path }: PageTemplateProps) {
  checkHeading(page, path);
  const context: SectionContext = { offer, ctaLabel: cta.preorder, help: seller.help };
  const nodes = pageSchemaNodes(page, offer, path);
  return (
    <>
      {page.sections.map((entry, i) => (
        <Fragment key={i}>{renderSection(entry, context)}</Fragment>
      ))}
      {nodes.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(pageGraph(...nodes)) }} />}
    </>
  );
}
