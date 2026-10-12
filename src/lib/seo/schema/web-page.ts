import type { SitePath } from "@/content/types";
import { absoluteUrl, ORGANIZATION_ID } from "../urls";
import { definedOnly, requireText } from "./shared";

/**
 * The AboutPage (/team) and ContactPage (/contact) nodes (architecture §9.2, ruling 2026-10-12),
 * as the live pages had them (team/page.tsx:120-131 and contact/page.tsx:69-79 at
 * archive/pre-reset-2026-10-10).
 *
 * Each page says what it is and points at the Organization node by `ORGANIZATION_ID`. The
 * Organization carries the founders, the number and the email, so these nodes never restate them:
 * there is no field for them, and the node is built field by field, so nothing else passes through.
 * The AboutPage's description is fold 2's answer on /team (team.md); the Organization's `memberOf`
 * stays proof-gated (D038).
 */
export interface WebPageFacts {
  readonly name: string;
  readonly description?: string;
  /** The page's own path. */
  readonly path: SitePath;
}

function webPageNode<Type extends "AboutPage" | "ContactPage">(type: Type, facts: WebPageFacts) {
  return definedOnly({
    "@type": type,
    name: requireText(facts.name, `${type} name`),
    url: absoluteUrl(facts.path),
    description: facts.description === undefined ? undefined : requireText(facts.description, `${type} description`),
    mainEntity: { "@id": ORGANIZATION_ID },
  });
}

export function aboutPageNode(facts: WebPageFacts) {
  return webPageNode("AboutPage", facts);
}

export function contactPageNode(facts: WebPageFacts) {
  return webPageNode("ContactPage", facts);
}

export type AboutPageNode = ReturnType<typeof aboutPageNode>;
export type ContactPageNode = ReturnType<typeof contactPageNode>;
