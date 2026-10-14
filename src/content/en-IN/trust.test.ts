import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { refundPage } from "./legal/refund";
import { shippingPage } from "./legal/shipping";
import { termsPage } from "./legal/terms";
import { SAFETY_FACTS, TRUST_COMPACT, TRUST_FULL, trustItems, type TrustId } from "./trust";

/* Trust items (architecture §6.1, strategy §3.2; task 2.1 acceptance 2): each a short promise
 * linked to its terms, once, with the rows the copy pages compose (home.md "CTA block": the
 * compact micro-line and the full four-item row). Checked item by item against the approved
 * mockups: label, page and icon. Since task 7.1a (CMO built-page review C, m8) each link opens the
 * part of its terms page that keeps the promise, where the mockup links the page's top: the page is
 * the mockup's, the part one its legal module prints (checked below). */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const offer = buildOffer("token");

/** A mockup link as the site path it stands for (mockup/build.mjs: file names stand for the meta urls). */
const sitePath = (href: string) => `/${href.replace(/\.html/, "").replace(/^home$/, "").replace(/^meet-kheelu/, "products/kheelu")}`;

/** The DS icon an inline mockup icon draws, read back from its path data. */
function iconOf(svg: Element | null): IconName | undefined {
  const d = Array.from(svg?.querySelectorAll("path") ?? []).map((p) => p.getAttribute("d")).join("");
  return (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d);
}

type Row = { label: string; href: string; icon: IconName | undefined };
const rowOf = (list: Element): Row[] =>
  Array.from(list.querySelectorAll("li a")).map((a) => ({
    label: norm(a.textContent).replace(/ \(opens in a new tab\)$/, ""),
    href: sitePath(a.getAttribute("href") ?? ""),
    icon: iconOf(a.querySelector("svg")),
  }));
/** An item's page, without the part it opens (the mockup links pages). */
const pageOf = (href: string) => href.split("#")[0];
const rowFor = (ids: readonly TrustId[]): Row[] =>
  ids.map((id) => ({ label: toPlainText(trustItems[id].label, offer), href: pageOf(trustItems[id].href), icon: trustItems[id].icon as IconName }));

/** The parts each terms page prints, by path: the ids of its legal module's sections (LegalTemplate renders each as the
 *  section's or its heading's id). */
const PARTS: Readonly<Record<string, readonly string[]>> = {
  "/refund": refundPage.parts.map((part) => part.id),
  "/shipping": shippingPage.parts.map((part) => part.id),
  "/terms": termsPage.parts.map((part) => part.id),
};

describe("trust items", () => {
  it("are keyed by their own stable kebab-case id", () => {
    for (const [key, item] of Object.entries(trustItems)) {
      expect(item.id).toBe(key);
      expect(key).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("link only to the site's own terms pages, by path", () => {
    for (const item of Object.values(trustItems)) expect(["/refund", "/shipping", "/terms"]).toContain(pageOf(item.href));
  });

  /* Task 7.1a (CMO built-page review C, m8; refund.md shared request 2): the warranty is /refund's third section, about
     four phone screens down, so the bare page made a parent hunt for the promise just tapped. */
  it("each open the part of its terms page that keeps the promise, and that part is on the page", () => {
    expect(Object.fromEntries(Object.values(trustItems).map((item) => [item.id, item.href]))).toEqual({
      "deliveries-start": "/shipping#when",
      "returns-7-days": "/refund#returns",
      "warranty-6-months": "/refund#faulty",
      "payment-methods": "/terms#payment",
      "delivery-included": "/shipping#where",
    });
    for (const item of Object.values(trustItems)) {
      const [page, part] = item.href.split("#");
      expect(PARTS[page], `${item.id}: ${page} prints a part "${part}"`).toContain(part);
    }
  });

  it("use design-system icons only", () => {
    for (const item of [...Object.values(trustItems), ...SAFETY_FACTS]) expect(Object.keys(ICON_PATHS)).toContain(item.icon);
  });
});

describe("the rows, as the approved mockups print them", () => {
  const home = doc("home");
  const homeRows = Array.from(home.querySelectorAll("ul.kh-trustline.mk-trust"));

  it("the compact micro-line beside every inline CTA (Home hero, fold 2, fold 6)", () => {
    expect(homeRows.length).toBeGreaterThanOrEqual(4);
    for (const row of homeRows.slice(0, 3)) expect(rowOf(row)).toEqual(rowFor(TRUST_COMPACT));
  });

  it("the full four-item row at the close (Home fold 9)", () => {
    expect(rowOf(homeRows[3])).toEqual(rowFor(TRUST_FULL));
  });

  it("the same rows on the store page, whose links open in a new tab (store.html)", () => {
    const rows = Array.from(doc("store").querySelectorAll("ul.kh-trustline.mk-trust"));
    expect(rowOf(rows[0])).toEqual(rowFor(TRUST_COMPACT));
    expect(rowOf(rows[1])).toEqual(rowFor(TRUST_FULL));
  });

  it("the compact line on every other page's close", () => {
    for (const slug of ["safety", "ai-toys-for-kids-in-india", "stories", "team", "contact", "404"]) {
      const row = doc(slug).querySelector("ul.kh-trustline.mk-trust");
      expect(rowOf(row!), slug).toEqual(rowFor(TRUST_COMPACT));
    }
  });

  it("the product page's five-item close row: same labels and links; its delivery-included icon differs (reported)", () => {
    const row = rowOf(doc("meet-kheelu").querySelector("ul.mk-close-trust")!);
    const expected = rowFor(["deliveries-start", ...TRUST_FULL]);
    expect(row.map(({ label, href }) => ({ label, href }))).toEqual(expected.map(({ label, href }) => ({ label, href })));
    /* The mockup draws map-pin there and package on Home and the store; the content keeps one icon
       per item (Home's) and the difference is reported to the main session (task 2.1 report). */
    expect(row.filter((r, i) => r.icon !== expected[i].icon)).toEqual([
      { label: "Delivery included anywhere in India", href: "/shipping", icon: "map-pin" },
    ]);
  });

  it("the safety facts line under the safety folds (Home fold 6, product fold 6)", () => {
    for (const slug of ["home", "meet-kheelu"]) {
      const items = Array.from(doc(slug).querySelectorAll(".mk-facts li")).map((li) => ({
        icon: iconOf(li.querySelector("svg")),
        text: norm(li.textContent),
      }));
      expect(items, slug).toEqual(SAFETY_FACTS.map((f) => ({ icon: f.icon, text: toPlainText(f.text) })));
    }
  });
});
