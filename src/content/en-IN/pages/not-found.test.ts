import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { CloseSectionConfig } from "@/components/sections/CloseSection/close-section.types";
import type { EmptyStateSectionConfig } from "@/components/sections/EmptyStateSection/empty-state-section.types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { PAGE_HEADING_KINDS } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { ROOT, readRepoFile } from "../../../../test/e2e/support/repo";
import { DEFAULT_OG } from "../organization";
import { routeFor } from "../routes";
import { TRUST_COMPACT } from "../trust";
import { notFoundPage } from "./not-found";

/* The 404's content (task 5.10; structure §3.3, §5: EmptyStateSection, then the centred close): every word as the
 * approved mockup (mockup/pages/404.html) prints it, its meta as the copy page (wiki/site/pages/404.md) gives it. The
 * route test (src/app/not-found.test.tsx) renders this module and compares it with the mockup element by element. */

/** The copy page's metadata rows ("Title (25 characters)", "Meta description (130 characters)"), each checked at the
 *  length the row states. */
function copyMeta(): { title: string; description: string } {
  const rows = readRepoFile("wiki/site/pages/404.md")
    .split("\n")
    .filter((l) => /^\|\s*(?:Title|Meta description) \(\d+ characters\)\s*\|/.test(l))
    .map((l) => {
      const [label, value] = l.split("|").slice(1, 3).map((c) => c.trim());
      expect(value.length, `404.md "${label}"`).toBe(Number(/\((\d+) characters\)/.exec(label)![1]));
      return { label, value };
    });
  const title = rows.find((r) => r.label.startsWith("Title"))?.value;
  const description = rows.find((r) => r.label.startsWith("Meta description"))?.value;
  expect(title, "404.md has a title row").toBeTruthy();
  expect(description, "404.md has a meta description row").toBeTruthy();
  return { title: title!, description: description! };
}

/** Copy pages type ASCII quotes; the content modules carry the typographic ones the pages print. */
const same = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

const [first, second, ...rest] = notFoundPage.sections;
const emptyState = (): EmptyStateSectionConfig => {
  if (first?.kind !== "empty-state-section") throw new Error(`the 404 opens with ${first?.kind}, not its empty state`);
  return first.config;
};
const close = (): CloseSectionConfig => {
  if (second?.kind !== "close-section") throw new Error(`the 404's second fold is ${second?.kind}, not its close`);
  return second.config;
};

describe("the 404's meta (404.md, At a glance)", () => {
  it("is word for word the copy page's title and meta description", () => {
    const copy = copyMeta();
    expect(same(toPlainText(notFoundPage.meta.title))).toBe(copy.title);
    expect(same(toPlainText(notFoundPage.meta.description))).toBe(copy.description);
  });

  it("fits the search result: title within 60 characters, description within 155, the brand once", () => {
    const title = toPlainText(notFoundPage.meta.title);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(toPlainText(notFoundPage.meta.description).length).toBeLessThanOrEqual(155);
    expect(title.split("Kheelona").length - 1).toBe(1);
  });

  it("reads the same in both offer modes and names no amount (the page is noindex and targets no query)", () => {
    for (const mode of ["token", "full"] as const) {
      expect(toPlainText(notFoundPage.meta.description, buildOffer(mode))).toBe(toPlainText(notFoundPage.meta.description));
    }
    expect(toPlainText(notFoundPage.meta.description)).not.toMatch(/₹|\d{3}/);
  });

  it("names the site's default share card, which exists", () => {
    expect(notFoundPage.meta.og).toEqual(DEFAULT_OG);
    expect(existsSync(join(ROOT, "public", notFoundPage.meta.og.image))).toBe(true);
  });
});

describe("the 404's folds (structure §5: EmptyStateSection, then CloseSection)", () => {
  it("is two folds: the empty state with the page's one h1, then the close", () => {
    expect(notFoundPage.sections.map((s) => s.kind)).toEqual(["empty-state-section", "close-section"]);
    expect(PAGE_HEADING_KINDS.has(notFoundPage.sections[0].kind)).toBe(true);
    expect(rest).toEqual([]);
  });

  it("fold 1 owns the miss and offers the four ways on, each to a page of the URL plan", () => {
    const config = emptyState();
    expect(config).toMatchObject({ icon: "magnifying-glass", tone: "blue", eyebrow: "Page not found", title: "We can’t find that page." });
    expect(config.lead).toBe("The link may be old, or the address may have a typo. Where were you headed?");
    expect(config.nav.label).toBe("Where to go next");
    expect(config.nav.links.map(({ title, href }) => [title, href])).toEqual([
      ["Home", "/"],
      ["Meet Kheelu", "/products/kheelu"],
      ["Stories", "/stories"],
      ["Contact", "/contact"],
    ]);
    for (const link of config.nav.links) expect(routeFor(link.href), link.href).toBeDefined();
  });

  it("fold 2 is the centred close: one chilli button (finale), the compact trust line and the help line", () => {
    const config = close();
    if (config.variant !== "center") throw new Error(`the 404 close is ${config.variant}, not center`);
    // No eyebrow, as the mockup's: the founder declined task Q2.15's "Pre-order" over it (CON-6; D066 item 4).
    expect(config.heading).toEqual({ title: "Looking for {hand:Kheelu?}" });
    expect(config.cta.cta).toBe("finale");
    expect(config.cta.trust.map((item) => item.id)).toEqual(TRUST_COMPACT);
    expect(config.cta.helpLine).toBe(true);
    expect(config.cta.secondary).toBeUndefined();
    expect(config.cta.arrow).toBeUndefined();
  });

  it("declares no structured data of its own (FAQPage, HowTo and the page nodes are not the 404's)", () => {
    const page: PageContent = notFoundPage;
    expect(page.schema).toBeUndefined();
  });
});
