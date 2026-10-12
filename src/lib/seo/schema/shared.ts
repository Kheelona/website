/**
 * Small pieces the schema builders share. Every builder in this folder is a pure function of the
 * data it is passed (task 2.7): no content import, no environment, no fetch. Facts come from the
 * content modules through the caller, so schema can only say what the page says (lessons §6).
 */

export type HttpsUrl = `https://${string}`;

/** ISO 3166-1 alpha-2 codes the site sells in. India only today; a new market adds its code. */
export type CountryCode = "IN";

const COUNTRY_NAMES: Readonly<Record<CountryCode, string>> = { IN: "India" };

/** A Country node, named as schema consumers read it. */
export function countryNode(code: CountryCode) {
  return { "@type": "Country", name: COUNTRY_NAMES[code] } as const;
}

/** A shallow copy without the keys whose value is undefined, so a fact the caller does not have is
 *  absent from the node rather than present and empty. */
export function definedOnly<T extends object>(node: T): T {
  return Object.fromEntries(Object.entries(node).filter(([, value]) => value !== undefined)) as T;
}

/** Profile links: https only, each once. */
export function profileLinks(links: readonly string[] | undefined, what: string): HttpsUrl[] | undefined {
  if (links === undefined) return undefined;
  const seen = new Set<string>();
  for (const link of links) {
    if (!link.startsWith("https://")) throw new Error(`${what}: "${link}" must be an https address`);
    if (seen.has(link)) throw new Error(`${what}: "${link}" is listed twice`);
    seen.add(link);
  }
  return [...links] as HttpsUrl[];
}

/** A stored calendar date (`2026-11-15`), checked to exist, never computed. */
export function calendarDate(value: string, what: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  const real = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  if (!real) throw new Error(`${what} "${value}" is not a calendar date (YYYY-MM-DD)`);
  return value;
}

/** Text a builder refuses to publish empty: an empty name or answer is a broken node. */
export function requireText(value: string, what: string): string {
  if (value.trim() === "") throw new Error(`${what} is empty`);
  return value;
}
