/**
 * JSON-LD output (ADR-012, architecture §9.2): the two graphs a page carries and the escaping that
 * makes them safe inside `<script type="application/ld+json">`.
 *
 * The site shell emits `siteGraph()` (Organization and WebSite) exactly once per page; a page or
 * template emits `pageGraph()` with only its own nodes, built by `src/lib/seo/schema/*` from
 * content. A node that needs the publisher points at it by `@id`.
 */

/** Any schema.org node. The builders in `schema/` return narrower types. */
export interface SchemaNode {
  readonly "@type": string;
  readonly [property: string]: unknown;
}

export interface SchemaGraph {
  readonly "@context": "https://schema.org";
  readonly "@graph": readonly SchemaNode[];
}

const CONTEXT = "https://schema.org";

/** The two entities only the site graph may declare. */
const PUBLISHER_TYPES: readonly string[] = ["Organization", "WebSite"];

/** Who publishes the site: emitted once per page, by the site shell. */
export function siteGraph(
  organization: SchemaNode & { readonly "@type": "Organization" },
  website: SchemaNode & { readonly "@type": "WebSite" },
): SchemaGraph {
  return { "@context": CONTEXT, "@graph": [organization, website] };
}

/** A page's own nodes (Product, FAQPage, BreadcrumbList, BlogPosting, HowTo, AboutPage,
 *  ContactPage). Never the Organization or the WebSite: the shell already declared them, and a
 *  second copy under the same `@id` is the duplicate the live site once shipped on every page. */
export function pageGraph(...nodes: readonly SchemaNode[]): SchemaGraph {
  if (nodes.length === 0) throw new Error("pageGraph needs at least one node");
  const publisher = nodes.find((node) => PUBLISHER_TYPES.includes(node["@type"]));
  if (publisher) {
    throw new Error(`${publisher["@type"]} belongs to the site graph (siteGraph), not to a page graph`);
  }
  return { "@context": CONTEXT, "@graph": nodes };
}

/*
 * JSON-LD as text, safe to put inside a script element (the escaping of the legacy seo.ts, kept).
 * `</script>` in any value would close the element and turn the rest into markup, so `<`, `>` and
 * `&` leave as unicode escapes. A JSON parser reads an escape as the character it names, so the
 * data a crawler receives is unchanged. Escaping here, once, at the boundary, means no content
 * edit ever has to remember it.
 */
const SCRIPT_UNSAFE = /[<>&]/g;

const unicodeEscape = (character: string) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`;

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(SCRIPT_UNSAFE, unicodeEscape);
}
