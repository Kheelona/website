import { absoluteUrl, ORGANIZATION_ID, WEBSITE_ID } from "../urls";

/** The WebSite node (architecture §9.2): emitted once per page with the Organization, in
 *  `siteGraph()`, and published by it. */
export function websiteNode(facts: { readonly name: string; readonly inLanguage: string }) {
  return {
    "@type": "WebSite" as const,
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: facts.name,
    inLanguage: facts.inLanguage,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export type WebSiteNode = ReturnType<typeof websiteNode>;
