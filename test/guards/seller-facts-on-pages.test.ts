import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GSTIN, SUPPORT_WHATSAPP_DISPLAY } from "@/config/site";
import { routes } from "@/content/en-IN/routes";
import { freshBuiltPages } from "../e2e/support/page-checks";

/* seller-facts-on-pages (task Q2.3; D063 items 2-3, confirmed by D064 item 11).
 *
 * The website prints no GSTIN (the receipt emails and invoices keep it, src/config/site.ts), and the support number only
 * on /contact and the legal pages, where the E-Commerce Rules want a customer-care number (r.4(2)(d); legal-requirements
 * ECOM-01, ECOM-02). Every other page keeps WhatsApp and the email. Read on the whole HTML of a page: the visible text,
 * the links, the JSON-LD and the RSC payload alike, so a number in a `tel:` link or a `taxID` is caught as surely as a
 * printed one. Runs here on the prerendered pages of the last `next build` when it is newer than src/ (task Q2.3 built
 * once; the main session's batch build runs it again); the store's pages render at request time and are checked there.
 */

/** The pages that show the number. */
export const NUMBER_PAGES: readonly string[] = ["/contact", ...routes.filter((r) => r.kind === "legal").map((r) => r.path)];

const NUMBER_SHOWN = SUPPORT_WHATSAPP_DISPLAY;
const NUMBER_DIALLED = `+${SUPPORT_WHATSAPP_DISPLAY.replace(/\D/g, "")}`;

/** What a page's HTML prints of the seller facts it must not: the GSTIN anywhere; the number, as shown or as dialled, or
 *  any call link, outside NUMBER_PAGES. The WhatsApp address (wa.me/<digits>) is not the number shown and stays. */
export function sellerFactLeaks(route: string, html: string): string[] {
  const leaks: string[] = [];
  if (html.includes(GSTIN)) leaks.push(`${route}: the GSTIN ${GSTIN}`);
  if (/\bGSTIN\b/.test(html)) leaks.push(`${route}: the word GSTIN`);
  if (!NUMBER_PAGES.includes(route)) {
    if (html.includes(NUMBER_SHOWN)) leaks.push(`${route}: the number ${NUMBER_SHOWN}`);
    if (html.includes(NUMBER_DIALLED)) leaks.push(`${route}: the number ${NUMBER_DIALLED}`);
    if (/\btel:/.test(html)) leaks.push(`${route}: a call link (tel:)`);
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
