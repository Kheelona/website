import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GSTIN, SUPPORT_WHATSAPP_DISPLAY } from "@/config/site";
import { routes } from "@/content/en-IN/routes";
import { freshBuiltPages } from "../e2e/support/page-checks";

/* seller-facts-on-pages (task Q2.3; D063 items 2-3, confirmed by D064 item 11; task Q2.10).
 *
 * The website prints no GSTIN (the receipt emails and invoices keep it, src/config/site.ts), and the support number only
 * on /contact and the legal pages, where the E-Commerce Rules want a customer-care number (r.4(2)(d); legal-requirements
 * ECOM-01, ECOM-02). Every other page keeps WhatsApp and the email. Read on the whole HTML of a page: the visible text,
 * the links, the JSON-LD and the RSC payload alike, so a number in a `tel:` link or a `taxID` is caught as surely as a
 * printed one. Runs here on the prerendered pages of the last `next build` when it is newer than src/ (task Q2.3 built
 * once; the main session's batch build runs it again); the store's pages render at request time and are checked there.
 *
 * One row outside those pages (task Q2.10, the main session's statutory ruling): the product page's Legal Metrology
 * declaration "Consumer care", which the Packaged Commodities Rules ask to carry a consumer-care number. On that page the
 * number may show in that row and in the page's own data (the RSC payload) as that row's one mirror, and nowhere else.
 */

/** The pages that show the number. */
export const NUMBER_PAGES: readonly string[] = ["/contact", ...routes.filter((r) => r.kind === "legal").map((r) => r.path)];

const NUMBER_SHOWN = SUPPORT_WHATSAPP_DISPLAY;
const NUMBER_DIALLED = `+${SUPPORT_WHATSAPP_DISPLAY.replace(/\D/g, "")}`;

/** The one declaration row, by page, that may carry the number outside NUMBER_PAGES (task Q2.10): its term. */
export const DECLARED_NUMBER: Readonly<Record<string, string>> = { "/products/kheelu": "Consumer care" };

const literal = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** The number as shown, as dialled, and a call link (a word of its own: "hotel:" is not one), each with how a leak of it
 *  reads. */
const NUMBER_FORMS = [
  { pattern: new RegExp(literal(NUMBER_SHOWN), "g"), says: `the number ${NUMBER_SHOWN}` },
  { pattern: new RegExp(literal(NUMBER_DIALLED), "g"), says: `the number ${NUMBER_DIALLED}` },
  { pattern: /\btel:/g, says: "a call link (tel:)" },
] as const;
const count = (text: string, pattern: RegExp) => text.match(pattern)?.length ?? 0;
/** A definition-list row as the pages print one (DefinitionList): its term, then its value. */
const declarationRows = (html: string, term: string) => html.match(new RegExp(`<div><dt>${term}</dt><dd>[\\s\\S]*?</dd></div>`, "g")) ?? [];
/** The page's RSC payload, the scripts Next writes the rendered tree into. */
const PAYLOAD = /<script>self\.__next_f\.push\([\s\S]*?\)<\/script>/g;

/** The number in any form, anywhere in `html`. */
function numberLeaks(route: string, html: string): string[] {
  return NUMBER_FORMS.filter(({ pattern }) => count(html, pattern) > 0).map(({ says }) => `${route}: ${says}`);
}

/** The number on a page that declares it in one row: that row's, and the payload's one mirror of it, are allowed. */
function declarationLeaks(route: string, html: string, term: string): string[] {
  const rows = declarationRows(html, term);
  if (rows.length !== 1) return [`${route}: ${rows.length} "${term}" declaration rows, one allowed`, ...numberLeaks(route, html)];
  const rest = html.replace(rows[0], "");
  const payload = (rest.match(PAYLOAD) ?? []).join("");
  return [
    ...numberLeaks(route, rest.replace(PAYLOAD, "")),
    ...NUMBER_FORMS.filter(({ pattern }) => count(payload, pattern) > count(rows[0], pattern)).map(
      ({ says }) => `${route}: ${says} in the page's data beyond its "${term}" declaration`,
    ),
  ];
}

/** What a page's HTML prints of the seller facts it must not: the GSTIN anywhere; the number, as shown or as dialled, or
 *  any call link, outside NUMBER_PAGES, but for the one declaration row DECLARED_NUMBER names. The WhatsApp address
 *  (wa.me/<digits>) is not the number shown and stays. */
export function sellerFactLeaks(route: string, html: string): string[] {
  const leaks: string[] = [];
  if (html.includes(GSTIN)) leaks.push(`${route}: the GSTIN ${GSTIN}`);
  if (/\bGSTIN\b/.test(html)) leaks.push(`${route}: the word GSTIN`);
  if (!NUMBER_PAGES.includes(route)) {
    const term = DECLARED_NUMBER[route];
    leaks.push(...(term === undefined ? numberLeaks(route, html) : declarationLeaks(route, html, term)));
  }
  return leaks;
}

describe("seller-facts-on-pages detector", () => {
  const page = (body: string) => `<html><head><title>x</title></head><body><main>${body}</main></body></html>`;
  const whatsapp = '<a href="https://wa.me/919187546483">WhatsApp us</a>';

  it("is green on a selling page with WhatsApp and the email, and on /contact and a legal page with the number", () => {
    expect(sellerFactLeaks("/", page(`<p>Questions? ${whatsapp}</p><a href="mailto:hello@kheelona.com">hello@kheelona.com</a>`))).toEqual([]);
    const withNumber = page(`<a href="tel:+919187546483">${NUMBER_SHOWN}</a>`);
    for (const route of ["/contact", "/privacy", "/terms", "/refund", "/shipping"]) expect(sellerFactLeaks(route, withNumber), route).toEqual([]);
  });

  it("is red on the GSTIN anywhere, /contact and the legal pages included", () => {
    for (const route of ["/", "/contact", "/privacy"]) {
      expect(sellerFactLeaks(route, page(`<span>GSTIN ${GSTIN}</span>`)), route).toHaveLength(2);
    }
    expect(sellerFactLeaks("/", `<script type="application/ld+json">{"taxID":"${GSTIN}"}</script>`)).toEqual([`/: the GSTIN ${GSTIN}`]);
  });

  it("is red on the number, shown or dialled, and on any call link, outside /contact and the legal pages", () => {
    expect(sellerFactLeaks("/", page(`<p>Questions? ${whatsapp} or <a href="tel:+919187546483">call ${NUMBER_SHOWN}</a></p>`))).toEqual([
      `/: the number ${NUMBER_SHOWN}`,
      `/: the number ${NUMBER_DIALLED}`,
      "/: a call link (tel:)",
    ]);
    expect(sellerFactLeaks("/team", `<script type="application/ld+json">{"telephone":"${NUMBER_SHOWN}"}</script>`)).toEqual([`/team: the number ${NUMBER_SHOWN}`]);
    expect(sellerFactLeaks("/store", page('<a href="tel:+911234567890">call</a>'))).toEqual(["/store: a call link (tel:)"]);
    expect(sellerFactLeaks("/stories/a-guide", page("A hotel: no call link here."))).toEqual([]);
  });

  it("names exactly /contact and the four legal pages as the pages that show the number", () => {
    expect([...NUMBER_PAGES].sort()).toEqual(["/contact", "/privacy", "/refund", "/shipping", "/terms"]);
  });

  /* Task Q2.10 (the main session's statutory ruling): the Legal Metrology (Packaged Commodities) Rules ask the product
     page's declarations for a consumer-care number, so its "Consumer care" row carries it, and nothing else on that page
     does. The row's markup as the page prints it, and the RSC payload that mirrors it once. */
  describe("the product page's consumer care declaration (task Q2.10)", () => {
    const call = '<a href="tel:+919187546483" class="ks-nowrap">call +91 91875 46483</a>';
    const row = `<div><dt>Consumer care</dt><dd><span class="ks-care"><a href="https://wa.me/919187546483">WhatsApp</a> or ${call}</span><span class="ks-care"><a href="mailto:hello@kheelona.com">hello@kheelona.com</a></span></dd></div>`;
    const payload = (extra = "") =>
      `<script>self.__next_f.push([1,"[\\"$\\",\\"a\\",null,{\\"href\\":\\"tel:+919187546483\\",\\"children\\":\\"call +91 91875 46483\\"}]${extra}"])</script>`;
    const product = (body: string, data = payload()) => `${page(`${body}<dl>${row}</dl>`)}${data}`;

    it("names the one row and the one page", () => {
      expect(DECLARED_NUMBER).toEqual({ "/products/kheelu": "Consumer care" });
    });

    it("is green on the product page with the number in its consumer care row and the payload's one mirror of it", () => {
      expect(sellerFactLeaks("/products/kheelu", product(`<p>Questions? ${whatsapp}</p>`))).toEqual([]);
    });

    it("is red on the number anywhere else on that page: a help line, the JSON-LD, a second row", () => {
      expect(sellerFactLeaks("/products/kheelu", product(`<p>Questions? ${whatsapp} or ${call}</p>`))).toEqual([
        `/products/kheelu: the number ${NUMBER_SHOWN}`,
        `/products/kheelu: the number ${NUMBER_DIALLED}`,
        "/products/kheelu: a call link (tel:)",
      ]);
      expect(sellerFactLeaks("/products/kheelu", product(`<script type="application/ld+json">{"telephone":"${NUMBER_SHOWN}"}</script>`))).toEqual([
        `/products/kheelu: the number ${NUMBER_SHOWN}`,
      ]);
      expect(sellerFactLeaks("/products/kheelu", product(`<dl>${row}</dl>`))).toContain('/products/kheelu: 2 "Consumer care" declaration rows, one allowed');
    });

    it("is red on the number in the page's data beyond the row's one mirror", () => {
      expect(sellerFactLeaks("/products/kheelu", product("", payload(`,\\"tel:+919187546483\\"`)))).toEqual([
        `/products/kheelu: the number ${NUMBER_DIALLED} in the page's data beyond its "Consumer care" declaration`,
        `/products/kheelu: a call link (tel:) in the page's data beyond its "Consumer care" declaration`,
      ]);
    });

    it("allows the row on no other page", () => {
      expect(sellerFactLeaks("/", product(""))).toEqual([`/: the number ${NUMBER_SHOWN}`, `/: the number ${NUMBER_DIALLED}`, "/: a call link (tel:)"]);
    });
  });
});

const built = freshBuiltPages();

describe.skipIf(built === null)("seller-facts-on-pages: prerendered pages of the last build", () => {
  it("prints no GSTIN on any page, and the number only on /contact and the legal pages", () => {
    const pages = (built ?? []).map((p) => ({ ...p, html: readFileSync(p.file, "utf8") }));
    const leaks = pages.flatMap((p) => sellerFactLeaks(p.route, p.html));
    console.log(`[seller-facts-on-pages] ${pages.length} built page(s).`);
    expect(pages.length).toBeGreaterThan(0);
    expect(leaks, leaks.join("\n")).toEqual([]);
    /* Not vacuous: the pages that keep the number do show it. */
    for (const route of NUMBER_PAGES) {
      const html = pages.find((p) => p.route === route)?.html ?? "";
      expect(html.includes(NUMBER_SHOWN), `${route} shows the number`).toBe(true);
    }
  });
});

if (built === null) {
  console.log("[seller-facts-on-pages] no build newer than src/: the page check runs on the next `npm run build`.");
}
