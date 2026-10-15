/* The GSTIN and the support number against the frozen mockups (task Q2.3; D063 items 2-3, confirmed by D064 item 11).
 *
 * mockup/ keeps its Gate A markup (D046). Since D063 the website prints no GSTIN (the receipts and invoices keep it), and
 * the number shows only on /contact and the legal pages, where the E-Commerce Rules want a customer-care number
 * (r.4(2)(d); legal-requirements ECOM-01, ECOM-02): every help line, the footer's and the store footer's contact lines,
 * the store footer's grievance line, Home's and the guides' lines keep WhatsApp (and the email) and lose the number and
 * the call link. One table of the approved markup the ruling changes, in three uses:
 *
 * - `withSellerFacts(element)`: a clone of a mockup element as the build now prints it, for the unit tests that hold a
 *   section, a page or the chrome to its mockup (applied after a page's other accepted changes);
 * - `withSellerFactsHtml(html)`: the same on a built mockup file, for the counts and the text pass;
 * - `sellerFactsText(slug)` and `sellerFactsHidden(slug)`: the text pass's sentences and the visual pass's hidden
 *   blocks, for deviations.ts.
 *
 * Node-only but for `withSellerFacts` (which needs the DOM the unit tests run in), so Playwright loads it. The
 * deviations.md row is the main session's; until then the rows here name the decision.
 */
import type { Page } from "@playwright/test";
import { CONTACT_EMAIL, GSTIN, SUPPORT_WHATSAPP_DISPLAY, SUPPORT_WHATSAPP_HREF } from "@/config/site";
import type { TextDeviation, VisualHide } from "./deviations";
import { decodeEntities, type MockupSlug } from "./mockup-text";
import { normaliseText, sentenceDiff, sentences } from "./parity";
import { readRepoFile } from "./repo";

export const SELLER_FACTS_APPROVED =
  "D063 items 2-3 (founder, 2026-10-15), confirmed by D064 item 11; task Q2.3; its deviations.md row is the main session's";
const REASON = "the GSTIN off the website and the number only on /contact and the legal pages (D063 items 2-3)";

const WA = SUPPORT_WHATSAPP_HREF;
const TEL = `tel:${SUPPORT_WHATSAPP_DISPLAY.replace(/\s/g, "")}`;
const SHOWN = SUPPORT_WHATSAPP_DISPLAY;
const MAILTO = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;
const WHATSAPP = `<a href="${WA}">WhatsApp</a>`;
/** Markup as a literal pattern. */
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** The help lines' call link, as every mockup marks it. */
const CALL = `<a href="${TEL}" class="mk-nowrap">call ${SHOWN}</a>`;
/** The number as a link of its own (the footers, the grievance and team lines). */
const NUMBER = `<a href="${TEL}" class="mk-nowrap">${SHOWN}</a>`;

export type SellerFactsRuleName =
  | "guide's contact line"
  | "help line"
  | "store header's help line"
  | "setup's contact line"
  | "team's answer"
  | "GSTIN line"
  | "footer's contact line"
  | "store footer's seller lines"
  | "store footer's grievance line"
  | "legal seller sentence";

export interface SellerFactsRule {
  readonly name: SellerFactsRuleName;
  /** The approved markup (a global pattern where white space around it varies). */
  readonly from: string | RegExp;
  /** The build's markup in its place. */
  readonly to: string;
  /** Only inside the marketing footer's legal row: the same line on /contact's seller card keeps the number. */
  readonly footerOnly?: true;
}

/** The two guides' contact line in words, as their copy pages print it and as the posts now say it (seller.ts
 *  `support.reach`): for the tests that hold a guide to its copy page. */
export const GUIDE_CONTACT_LINE = {
  mockup: `WhatsApp or call ${SHOWN}.`,
  build: `WhatsApp or email ${CONTACT_EMAIL}.`,
} as const;

/** In order: a line that holds another rule's markup comes before it. */
export const SELLER_FACTS_RULES: readonly SellerFactsRule[] = [
  /* The safe-AI-toy guide's last line: "WhatsApp or email" (seller.ts `support.reach`), as the post says it. */
  {
    name: "guide's contact line",
    from: `you can ask us anything: ${WHATSAPP} or ${CALL}.`,
    to: `you can ask us anything: ${WHATSAPP} or email ${MAILTO}.`,
  },
  /* Every "Questions?" line, the product FAQ's, the store's "Rather talk to a person?" and /thanks's help fold:
     seller.ts `help.contact`. Not the product page's consumer care declaration (`<span class="mk-care">`), which keeps
     the number since task Q2.10: the Legal Metrology (Packaged Commodities) Rules ask for a consumer-care number. */
  { name: "help line", from: new RegExp(`(?<!<span class="mk-care">)${escaped(`${WHATSAPP} or ${CALL}`)}`, "g"), to: `<a href="${WA}">WhatsApp us</a>` },
  { name: "store header's help line", from: `${WHATSAPP} or <a href="${TEL}">call</a>`, to: `<a href="${WA}">WhatsApp us</a>` },
  {
    name: "setup's contact line",
    from: `${WHATSAPP} or <a href="${TEL}">call us on <span class="mk-nowrap">${SHOWN}</span></a>, or email ${MAILTO}.`,
    to: `${WHATSAPP} or email ${MAILTO}.`,
  },
  {
    name: "team's answer",
    from: `You can reach the team on ${WHATSAPP} or by phone at ${NUMBER}, or at ${MAILTO}.`,
    to: `You can reach the team on ${WHATSAPP} or at ${MAILTO}.`,
  },
  /* The footer's line and /contact's seller card's, each a span of its own. */
  { name: "GSTIN line", from: new RegExp(`\\s*<span>GSTIN ${GSTIN}</span>`, "g"), to: "" },
  {
    name: "footer's contact line",
    from: `<span>${NUMBER} (WhatsApp or call) · ${MAILTO}</span>`,
    to: `<span>${WHATSAPP} · ${MAILTO}</span>`,
    footerOnly: true,
  },
  {
    name: "store footer's seller lines",
    from: `<br>GSTIN ${GSTIN}<br>${NUMBER} (WhatsApp or call) · ${MAILTO}`,
    to: `<br>${WHATSAPP} · ${MAILTO}`,
  },
  {
    name: "store footer's grievance line",
    from: `Grievance Officer: Aman Soni, Co-Founder and CTO, <a href="mailto:aman@kheelona.com">aman@kheelona.com</a>, ${NUMBER}.`,
    to: `Grievance Officer: Aman Soni, Co-Founder and CTO, <a href="mailto:aman@kheelona.com">aman@kheelona.com</a>.`,
  },
  /* Privacy's "Who we are:", terms' "Seller:", refund's and shipping's paragraph: the closing GSTIN sentence off. */
  { name: "legal seller sentence", from: `India. GSTIN ${GSTIN}.`, to: "India." },
];

/** How often each rule applies on each approved page (the built file, whole); a rule a page does not need is absent. */
export const SELLER_FACTS_COUNTS: Readonly<Record<MockupSlug, Partial<Record<SellerFactsRuleName, number>>>> = {
  home: { "help line": 2, "GSTIN line": 1, "footer's contact line": 1 },
  "meet-kheelu": { "help line": 4, "GSTIN line": 1, "footer's contact line": 1 },
  safety: { "help line": 1, "GSTIN line": 1, "footer's contact line": 1 },
  "ai-toys-for-kids-in-india": { "help line": 1, "GSTIN line": 1, "footer's contact line": 1 },
  stories: { "help line": 1, "GSTIN line": 1, "footer's contact line": 1 },
  "story-learning-toys-for-a-three-year-old": { "help line": 1, "GSTIN line": 1, "footer's contact line": 1 },
  "story-what-to-look-for-in-a-safe-ai-toy": { "guide's contact line": 1, "help line": 1, "GSTIN line": 1, "footer's contact line": 1 },
  "story-talking-toys-and-late-talkers": { "GSTIN line": 1, "footer's contact line": 1 },
  team: { "help line": 1, "team's answer": 1, "GSTIN line": 1, "footer's contact line": 1 },
  setup: { "setup's contact line": 1, "GSTIN line": 1, "footer's contact line": 1 },
  contact: { "GSTIN line": 2, "footer's contact line": 1 },
  "404": { "help line": 1, "GSTIN line": 1, "footer's contact line": 1 },
  privacy: { "help line": 1, "GSTIN line": 1, "footer's contact line": 1, "legal seller sentence": 1 },
  terms: { "help line": 1, "GSTIN line": 1, "footer's contact line": 1, "legal seller sentence": 1 },
  refund: { "GSTIN line": 1, "footer's contact line": 1, "legal seller sentence": 1 },
  shipping: { "GSTIN line": 1, "footer's contact line": 1, "legal seller sentence": 1 },
  store: { "help line": 1, "store header's help line": 1, "store footer's seller lines": 1, "store footer's grievance line": 1 },
  "store-confirmation": { "help line": 1, "store header's help line": 1, "store footer's seller lines": 1, "store footer's grievance line": 1 },
};

/** The marketing footer's legal row, where `footerOnly` rules apply. */
const FOOTER_ROW = ".kh-footer__legal";
const FOOTER_IN_FILE = /<footer class="kh-footer">[\s\S]*?<\/footer>/g;

function apply(html: string, rules: readonly SellerFactsRule[], counts?: Map<SellerFactsRuleName, number>): string {
  let out = html;
  for (const rule of rules) {
    const pattern = typeof rule.from === "string" ? new RegExp(rule.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g") : rule.from;
    const found = out.match(pattern)?.length ?? 0;
    if (found && counts) counts.set(rule.name, (counts.get(rule.name) ?? 0) + found);
    out = out.replace(pattern, () => rule.to);
  }
  return out;
}

const anywhere = SELLER_FACTS_RULES.filter((r) => !r.footerOnly);
const footerOnly = SELLER_FACTS_RULES.filter((r) => r.footerOnly);

function rule(html: string, counts?: Map<SellerFactsRuleName, number>): string {
  return apply(
    html.replace(FOOTER_IN_FILE, (footer) => apply(footer, footerOnly, counts)),
    anywhere,
    counts,
  );
}

/** A built mockup file as the build now prints it: every rule, every place. */
export function withSellerFactsHtml(html: string): string {
  return rule(html);
}

/** How often each rule applies to a built mockup file (absent when never). */
export function sellerFactsCounts(html: string): Partial<Record<SellerFactsRuleName, number>> {
  const counts = new Map<SellerFactsRuleName, number>();
  rule(html, counts);
  return Object.fromEntries(counts);
}

/** A clone of a mockup element as the build now prints it (the source is left as approved). For the unit tests: it
 *  needs the DOM they run in. */
export function withSellerFacts(source: Element): Element {
  const doc = source.ownerDocument;
  const clone = source.cloneNode(true) as Element;
  for (const row of [...(clone.matches(FOOTER_ROW) ? [clone] : []), ...clone.querySelectorAll(FOOTER_ROW)]) {
    row.innerHTML = apply(row.innerHTML, footerOnly);
  }
  const template = doc.createElement("template");
  template.innerHTML = apply(clone.outerHTML, anywhere);
  const ruled = template.content.firstElementChild;
  if (!ruled) throw new Error(`withSellerFacts: the ruled ${source.tagName.toLowerCase()} did not parse`);
  return doc.importNode(ruled, true);
}

/** The rules as plain data, for a page in the browser (Playwright passes no RegExp). */
const BROWSER_RULES = SELLER_FACTS_RULES.map((r) => ({
  from: typeof r.from === "string" ? r.from : null,
  pattern: typeof r.from === "string" ? null : r.from.source,
  to: r.to,
  footerOnly: r.footerOnly === true,
}));

/** Rules the approved mockup open in a browser page as the build now prints it, inside the elements `selectors` name
 *  (the chrome a spec compares, or a page's <main>), for the specs whose golden is the live mockup page (chrome.spec.ts,
 *  legal-template.spec.ts). The marketing footer's rules apply only inside its legal row, as everywhere else. */
export async function ruleMockupPage(page: Page, selectors: readonly string[]): Promise<void> {
  await page.evaluate(
    ({ rules, selectors, footerRow }) => {
      type Rule = (typeof rules)[number];
      const apply = (html: string, list: readonly Rule[]) =>
        list.reduce((out, r) => (r.pattern !== null ? out.replace(new RegExp(r.pattern, "g"), () => r.to) : out.split(r.from!).join(r.to)), html);
      for (const scope of Array.from(document.querySelectorAll(selectors.join(", ")))) {
        const rows = [...(scope.matches(footerRow) ? [scope] : []), ...Array.from(scope.querySelectorAll(footerRow))];
        for (const row of rows) row.innerHTML = apply(row.innerHTML, rules.filter((r) => r.footerOnly));
        const before = scope.innerHTML;
        const after = apply(before, rules.filter((r) => !r.footerOnly));
        if (after !== before) scope.innerHTML = after;
      }
    },
    { rules: BROWSER_RULES, selectors: [...selectors], footerRow: FOOTER_ROW },
  );
}

const mainOf = (html: string) => {
  const start = html.search(/<main\b/i);
  const end = html.search(/<\/main>/i);
  return start >= 0 && end > start ? html.slice(start, end + "</main>".length) : "";
};
/** The block elements that start a line of their own, as test/support/mockup-facts.ts `blockSentences` reads a page
 *  (the browser's innerText puts a break at each); an inline tag adds nothing, so "46483</a>," reads "46483,". */
const BLOCK_TAG =
  /<\/?(?:address|article|aside|blockquote|dd|div|dl|dt|figcaption|figure|footer|h[1-6]|header|li|nav|ol|p|section|table|tbody|td|th|thead|tr|ul)\b[^>]*>/gi;
const mainSentences = (html: string) =>
  sentences(
    normaliseText(
      decodeEntities(
        mainOf(html)
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/<(svg|script|style|template)\b[\s\S]*?<\/\1>/gi, "")
          .replace(BLOCK_TAG, "\n")
          .replace(/<[^>]+>/g, ""),
      ),
    ),
  );

/** The sentences of a page's <main> the ruling changes: the mockup's that go, and the build's in their place. */
export function sellerFactsSentences(slug: MockupSlug): { mockup: string[]; build: string[] } {
  const html = readRepoFile(`mockup/${slug}.html`);
  const { missing, extra } = sentenceDiff(mainSentences(html), mainSentences(withSellerFactsHtml(html)));
  return { mockup: missing, build: extra };
}

const literal = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const oneOf = (lines: readonly string[]) => new RegExp(`^(?:${lines.map(literal).join("|")})$`);

/** The text pass's rule for one page, or none when the ruling changes nothing in its <main>. */
export function sellerFactsText(slug: MockupSlug): TextDeviation[] {
  const { mockup, build } = sellerFactsSentences(slug);
  if (mockup.length === 0 && build.length === 0) return [];
  return [{ mockup: oneOf(mockup), ...(build.length ? { build: oneOf(build) } : {}), reason: REASON, approvedBy: SELLER_FACTS_APPROVED }];
}

/** Each side's blocks whose height the ruling may change, by the rule that changes them (mockup, build). */
const HIDDEN_BY_RULE: Readonly<Partial<Record<SellerFactsRuleName, readonly [string, string]>>> = {
  "help line": [".mk-help", ".ks-help"],
  "store header's help line": [".mk-store-head__help", ".ks-store-head__help"],
  "setup's contact line": [".mk-setup-help", ".ks-setup-help"],
  "team's answer": [".mk-team-answer", ".ks-team-answer"],
  "footer's contact line": [FOOTER_ROW, FOOTER_ROW],
  "store footer's seller lines": [".mk-seller", ".ks-store-foot__seller"],
  "store footer's grievance line": [".mk-seller + p", ".ks-store-foot__seller + p"],
};
/** The blocks that are one page's alone, where a sentence came off (ids and attributes both sides share). */
const HIDDEN_BY_PAGE: Readonly<Partial<Record<MockupSlug, readonly string[]>>> = {
  contact: ['section[aria-labelledby="seller-title"]'],
  privacy: ["#contact"],
  terms: ["#contact"],
  refund: ['section[aria-labelledby="seller"]'],
  shipping: ['section[aria-labelledby="seller"]'],
};

/** The visual pass's hidden blocks for one page, on both sides: each block the ruling rewords or shortens, so every
 *  chunk below it lines up again (their words are the text pass's). */
export function sellerFactsHidden(slug: MockupSlug): VisualHide[] {
  const reason = `a block ${REASON.replace(/^the /, "the ruling of ")} rewords or shortens, compared by the text pass`;
  const hide = (side: VisualHide["side"], selector: string): VisualHide => ({ side, selector, reason, approvedBy: SELLER_FACTS_APPROVED });
  const rules = Object.keys(SELLER_FACTS_COUNTS[slug]) as SellerFactsRuleName[];
  const pairs = rules.flatMap((name) => (HIDDEN_BY_RULE[name] ? [HIDDEN_BY_RULE[name]] : []));
  return [
    ...pairs.flatMap(([mockup, build]) => [hide("mockup", mockup), hide("build", build)]),
    ...(HIDDEN_BY_PAGE[slug] ?? []).flatMap((selector) => [hide("mockup", selector), hide("build", selector)]),
  ];
}
