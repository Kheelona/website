/* The approved mockup as text (task 1.1), for guards that must stay green on approved copy
 * (banned phrases, the content-integrity calibration). Node-only: no DOM, so Vitest and
 * Playwright can both use it. The Gate A review tool is removed first: the headline picker and its
 * options, the review pill, the store's review note and the hub's "Rewritten in the build" labels
 * were never copy (architecture §19).
 */
import { DELIVERY_TEXT } from "@/content/en-IN/delivery";
import { readRepoFile } from "./repo";

/** The 18 approved pages (D046), by file name in mockup/ (the review index is not a page). */
export const MOCKUP_SLUGS = [
  "home",
  "meet-kheelu",
  "safety",
  "ai-toys-for-kids-in-india",
  "stories",
  "story-learning-toys-for-a-three-year-old",
  "story-what-to-look-for-in-a-safe-ai-toy",
  "story-talking-toys-and-late-talkers",
  "team",
  "setup",
  "contact",
  "404",
  "privacy",
  "terms",
  "refund",
  "shipping",
  "store",
  "store-confirmation",
] as const;
export type MockupSlug = (typeof MOCKUP_SLUGS)[number];

/** Opening tags of the review tool's elements (CSS selector form in REVIEW_TOOL_SELECTOR). */
const REVIEW_TOOL_TAG = /<([a-z][a-z0-9]*)\b[^>]*(?:\bclass="[^"]*\b(?:mk-review-pill|mk-review-note|mk-later|mk-review)\b[^"]*"|\bid="mk-h1(?:-options)?")[^>]*>/gi;
export const REVIEW_TOOL_SELECTOR = ".mk-review-pill, .mk-review-note, .mk-later, .mk-review, #mk-h1, #mk-h1-options";

/** Removes every element whose opening tag matches, with its whole subtree. */
function removeElements(html: string, opening: RegExp): string {
  let out = html;
  for (;;) {
    opening.lastIndex = 0;
    const m = opening.exec(out);
    if (!m) return out;
    const tag = m[1].toLowerCase();
    const start = m.index;
    const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}\\s*>`, "gi");
    re.lastIndex = start;
    let depth = 0;
    let end = out.length;
    for (let t = re.exec(out); t; t = re.exec(out)) {
      if (t[0].startsWith("</")) depth--;
      else if (!t[0].endsWith("/>")) depth++;
      if (depth === 0) {
        end = re.lastIndex;
        break;
      }
    }
    out = out.slice(0, start) + " " + out.slice(end);
  }
}

const ENTITIES: Record<string, string> = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", hellip: "…", rarr: "→" };
export function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

/** Visible text of an HTML document's body: no head, scripts, styles, comments or review tool. */
export function htmlToText(html: string): string {
  let body = html.replace(/<head\b[\s\S]*?<\/head>/i, " ");
  body = body.replace(/<!--[\s\S]*?-->/g, " ");
  body = removeElements(body, REVIEW_TOOL_TAG);
  body = body.replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, " ");
  body = body.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|h[1-6]|div|section|dt|dd|summary|td|th|tr|header|footer|nav|figcaption|blockquote)>/gi, "\n");
  return decodeEntities(body.replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

/** The delivery line every frozen mockup prints (D046: they are never edited). The build prints `DELIVERY_TEXT` since the
 *  founder's decision of 2026-11-10 (D068, deviations.md V69), so each mockup comparison reads this line as that one. */
export const MOCKUP_DELIVERY = "Deliveries start mid-November";

/** D068's date fact applied to a mockup's text, as the page facts of D055 apply an approved phrase change to a clone: the
 *  mockup's delivery line, in either case ("deliveries start mid-November," in a sentence), reads the build's
 *  `DELIVERY_TEXT`. For the checks that must stay green on approved copy (the banned-phrases rule 3, the content-integrity
 *  calibration); the raw mockup text still carries the old line, and the guard stays red on it. */
export function withDeliveryDate(text: string): string {
  return text.replace(/\b([Dd])eliveries start mid-November\b/g, (_whole, first: string) => `${first}${DELIVERY_TEXT.slice(1)}`);
}

/** Title, meta description and visible text of one approved page (built file mockup/<slug>.html). */
export function approvedMockupText(slug: MockupSlug): string {
  const html = readRepoFile(`mockup/${slug}.html`);
  const title = decodeEntities(/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "");
  const description = decodeEntities(/<meta name="description" content="([^"]*)"/i.exec(html)?.[1] ?? "");
  return [title, description, htmlToText(html)].join("\n");
}
