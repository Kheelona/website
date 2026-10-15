import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { GSTIN, LEGAL_ENTITY, REGISTERED_ADDRESS_LINE } from "@/config/site";
import type { Copy } from "@/content/types";
import type { SectionEntry, SectionEntryOf, SectionKind } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { grievanceOfficerLine } from "@/lib/content/seller-lines";
import { buildOffer } from "@/lib/offer/offer";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { mockupRoute } from "../../../../test/support/mockup-compare";
import { DEFAULT_OG } from "../organization";
import { WARRANTY_MONTHS } from "../policies";
import { routeFor } from "../routes";
import { seller } from "../seller";
import { TRUST_COMPACT, trustItems } from "../trust";
import { contactPage } from "./contact";

/* The /contact page module (task 5.9; structure §5 row contact.html; wiki/site/pages/contact.md). Its folds in the
 * approved order, each fold's words, icons and links equal to the built mockup (mockup/contact.html, D046); the rules the
 * copy page sets for this page (D032's grievance line verbatim, the `#grievance` fragment the footer links to, the seller
 * lines character for character as the footer, three secondary contact buttons and one chilli button, no placeholder,
 * no typed amount, none of the retired lines); and the shared facts it reads by reference (seller.ts and its
 * seller-lines helper, trust.ts, policies.ts), never retyped: no GSTIN, number, email, address or entity in its source. */

const token = buildOffer("token");
const full = buildOffer("full");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (copy: Copy) => toPlainText(copy, token);

const mockup = new DOMParser().parseFromString(readRepoFile("mockup/contact.html"), "text/html");
const main = mockup.querySelector("main")!;
const fold = (labelledBy: string) => {
  const el = main.querySelector(`[aria-labelledby="${labelledBy}"]`);
  if (!el) throw new Error(`mockup/contact.html has no fold labelled by #${labelledBy}`);
  return el;
};

/** A mockup icon (inlined SVG) as its DS name, read from its path data. */
function iconOf(svg: Element | null): IconName | undefined {
  const d = Array.from(svg?.querySelectorAll("path") ?? [])
    .map((p) => p.getAttribute("d"))
    .join("");
  return d === "" ? undefined : (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d);
}

/** A fold's heading as the mockup prints it. */
const headingOf = (el: Element) => ({
  eyebrow: norm(el.querySelector(".kh-eyebrow")?.textContent) || undefined,
  title: norm(el.querySelector(".kh-heading__title")?.textContent),
  lead: norm(el.querySelector(".kh-heading__lead")?.textContent) || undefined,
  id: el.querySelector(".kh-heading__title")?.id,
});

const sections: readonly SectionEntry[] = contactPage.sections;

/** One fold of the module, by kind. */
function entry<K extends SectionKind>(kind: K): SectionEntryOf<K> {
  const found = sections.find((e) => e.kind === kind) as SectionEntryOf<K> | undefined;
  if (!found) throw new Error(`the contact page lists no ${kind}`);
  return found;
}
const variantOf = (e: SectionEntry) => ("variant" in e.config ? e.config.variant : "context" in e.config ? e.config.context : undefined);

/** Every string anywhere in the module (deep), for the page-wide word rules. */
function strings(value: unknown, out: string[] = [], seen = new Set<unknown>()): string[] {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const v of Object.values(value)) strings(v, out, seen);
  }
  return out;
}

describe("the contact page: its folds", () => {
  it("lists the approved folds in order (structure §5: hero, routes, grievance, seller, close)", () => {
    expect(sections.map((e) => [e.kind, variantOf(e)])).toEqual([
      ["hero-section", "contact"],
      ["card-grid", "routes"],
      ["grievance-block", "contact"],
      ["seller-block", "contact"],
      ["close-section", "center"],
    ]);
  });
});

describe("fold 1: every way to reach us", () => {
  const hero = entry("hero-section");
  const config = () => {
    if (hero.config.variant !== "contact") throw new Error("not the contact hero");
    return hero.config;
  };

  it("carries the approved H1 (option A, its Hand accent), the eyebrow and the lead, word for word", () => {
    const { heading } = config();
    expect(heading.title).toBe("Talk to the team {hand:behind Kheelu.}");
    expect({ eyebrow: heading.eyebrow, title: plain(heading.title!), lead: plain(heading.lead!), id: heading.id }).toEqual(headingOf(fold("hero-title")));
  });

  it("answers “how do I contact Kheelona?” first, in 40 to 60 words, its first words the search term (keyword map §5)", () => {
    const lead = plain(config().heading.lead!);
    expect(lead.startsWith("To contact Kheelona,")).toBe(true);
    const count = lead.split(/\s+/).length;
    expect(count).toBeGreaterThanOrEqual(40);
    expect(count).toBeLessThanOrEqual(60);
  });

  it("keeps the number on one line and links the grievance officer to the #grievance fold below", () => {
    const lead = config().heading.lead as string;
    expect(lead).toContain(`{nowrap:${seller.support.phone}}`);
    expect(lead).toContain("[grievance officer](#grievance)");
    expect(fold("hero-title").querySelector(".kh-heading__lead a")?.getAttribute("href")).toBe("#grievance");
  });

  it("offers the three ways as the mockup's buttons: words, address and DS icon (no phone icon in the DS, G-12)", () => {
    const buttons = Array.from(fold("hero-title").querySelectorAll("#hero-cta > a.kh-btn"));
    expect(buttons.every((b) => b.matches(".kh-btn--secondary.kh-btn--block"))).toBe(true);
    expect(config().ways).toEqual(
      buttons.map((b) => {
        const icon = iconOf(b.querySelector("svg"));
        return { label: norm(b.textContent), href: b.getAttribute("href"), ...(icon ? { icon } : {}) };
      }),
    );
    expect(config().ways.map((w) => w.href)).toEqual([seller.support.whatsapp, seller.support.tel, `mailto:${seller.support.email}`]);
  });
});

describe("fold 2: pick the route that fits", () => {
  const grid = entry("card-grid");

  it("is the band of five route cards, each with the mockup's tone, icon, words and links (their own names kept)", () => {
    const el = fold("routes-title");
    const { config } = grid;
    expect(config.band).toBe(true);
    expect(config.heading.title).toBe("Pick the route that {hand:fits.}");
    expect({ title: plain(config.heading.title), id: config.heading.id }).toEqual({ title: headingOf(el).title, id: headingOf(el).id });
    const cards = Array.from(el.querySelectorAll("article.kh-card")).map((card) => ({
      tone: [...card.classList].find((c) => c.startsWith("kh-tone-"))?.slice("kh-tone-".length),
      icon: iconOf(card.querySelector(".kh-card__icon svg")),
      title: norm(card.querySelector(".kh-card__title")?.textContent),
      body: norm(card.querySelector(".kh-card__body")?.textContent),
      links: Array.from(card.querySelectorAll("a.kh-card__link")).map((a) => ({
        label: norm(a.textContent),
        href: mockupRoute(a.getAttribute("href")!),
        ...(a.hasAttribute("aria-label") ? { ariaLabel: a.getAttribute("aria-label") } : {}),
      })),
    }));
    expect(cards).toHaveLength(5);
    expect(
      config.items.map((item) => ({ tone: item.tone, icon: item.icon, title: plain(item.title), body: plain(item.body!), links: item.links })),
    ).toEqual(cards);
  });

  it("gives the two WhatsApp links distinct names (copy page, fold 2) and the support line's own address", () => {
    const whatsapp = grid.config.items.flatMap((item) => item.links ?? []).filter((link) => link.href === seller.support.whatsapp);
    expect(whatsapp.map((link) => link.ariaLabel)).toEqual([
      "Message us on WhatsApp about your order",
      "Message us on WhatsApp about more than one Kheelu",
    ]);
  });

  it("reads the returns promise from trust.ts and the warranty from policies.ts (never retyped)", () => {
    const returns = grid.config.items[3];
    expect(returns.body).toBe(`${trustItems["returns-7-days"].label}, and a ${WARRANTY_MONTHS}-month warranty. Delivery is included anywhere in India.`);
  });
});

describe("fold 3: make a formal complaint (D032, verbatim)", () => {
  const grievance = entry("grievance-block");

  it("prints the mockup's heading and sentence, with no accent on a legal block", () => {
    if (grievance.config.context !== "contact") throw new Error("not the contact grievance fold");
    const el = fold("grievance-title");
    expect(grievance.config.title).toBe(headingOf(el).title);
    expect(grievance.config.title).not.toMatch(/\{hand:/);
    expect(plain(grievance.config.intro)).toBe(norm(el.querySelector(".ks-contact-text, .mk-contact-text")?.textContent));
  });

  it("is the one grievance value of seller.ts, as privacy and terms print it (the helper, nothing held together)", () => {
    const { line } = grievance.config;
    expect(line).toBe(seller.grievance.line);
    expect(line).toEqual(grievanceOfficerLine(seller));
    expect(`${plain(line.lead)} ${plain(line.text)}`).toBe(norm(fold("grievance-title").querySelector(".kh-card p")?.textContent));
    expect(plain(line.text)).toMatch(/within 48 hours .* within one month/);
    expect(plain(line.text)).not.toMatch(/\b(5|30) days\b/);
  });

  it("is the fold the footer's “Grievance officer” link and the hero lead land on (#grievance)", () => {
    expect(fold("grievance-title").id).toBe("grievance");
  });
});

describe("fold 4: who you're buying from", () => {
  const block = entry("seller-block");
  const lines = () => {
    if (block.config.context !== "contact") throw new Error("not the contact seller fold");
    return block.config.lines;
  };

  it("prints the mockup's heading (Hand on “buying from.”) and the origin sentence", () => {
    if (block.config.context !== "contact") throw new Error("not the contact seller fold");
    const el = fold("seller-title");
    expect(block.config.title).toBe("Who you’re {hand:buying from.}");
    expect(plain(block.config.title)).toBe(headingOf(el).title);
    expect(plain(block.config.intro)).toBe(norm(el.querySelector(".mk-contact-text")?.textContent));
  });

  /* No GSTIN on the website (D063 item 3); the contact line keeps the number, which /contact shows by the E-Commerce
     Rules (D063 item 2; task Q2.3). */
  it("builds the seller lines from seller.ts: the entity, the address and the contact line with the number", () => {
    expect(lines()).toEqual({ entity: seller.legalName, address: seller.addressLine, contact: seller.support.line });
  });

  it("prints them character for character as the mockup's address, its GSTIN line off, and its footer's entity and address", () => {
    const address = withSellerFacts(fold("seller-title").querySelector("address")!);
    const printed = [address.querySelector("strong"), ...address.querySelectorAll(":scope > span")].map((el) => norm(el?.textContent));
    const built = [lines().entity, lines().address, lines().contact].map(plain);
    expect(built).toEqual(printed);
    expect(norm(fold("seller-title").querySelector("address")?.textContent), "the approved card").toContain(`GSTIN ${GSTIN}`);
    const footer = Array.from(mockup.querySelectorAll(".kh-footer__legal > span"))
      .slice(0, 4)
      .map((el) => norm(el.textContent));
    expect([built[0], built[1], built[2]]).toEqual([footer[0].replace(/^© \d{4} /, ""), footer[2], footer[3]]);
  });
});

describe("fold 5: the close", () => {
  const close = entry("close-section");

  it("carries the one chilli button (finale), the compact trust pair and the ghost link; no help line (the page is one)", () => {
    if (close.config.variant !== "center") throw new Error("not the centred close");
    const { config } = close;
    expect(config.heading.title).toBe("Ready when {hand:you are.}");
    // Labelled as every selling close (task Q2.15; the consistency review's CON-6), where the mockup's has no eyebrow.
    expect(config.heading.eyebrow).toBe("Pre-order");
    expect(headingOf(fold("close-title")).eyebrow).toBeUndefined();
    expect(plain(config.heading.title)).toBe(headingOf(fold("close-title")).title);
    const link = fold("close-title").querySelector("a.kh-btn--ghost")!;
    expect(config.cta).toEqual({
      cta: "finale",
      trust: TRUST_COMPACT.map((id) => trustItems[id]),
      secondary: { label: norm(link.textContent), href: mockupRoute(link.getAttribute("href")!), variant: "ghost", iconEnd: iconOf(link.querySelector("svg")) },
    });
    expect(fold("close-title").querySelector(".kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("finale");
  });
});

describe("the contact page: page-wide rules", () => {
  it("has the copy page's title and description, and the default share card", () => {
    expect(plain(contactPage.meta.title)).toBe("Contact Kheelona: WhatsApp, call or email the team");
    expect(plain(contactPage.meta.description)).toBe(
      "Contact Kheelona: WhatsApp or call +91 91875 46483, or email hello@kheelona.com. We are a small team in Bengaluru and answer our own messages.",
    );
    expect(contactPage.meta.og).toBe(DEFAULT_OG);
  });

  it("declares the ContactPage node, named by the page's eyebrow (architecture §9.2; as live)", () => {
    expect(contactPage.schema).toEqual([{ kind: "contact-page", name: "Contact Kheelona" }]);
    expect(headingOf(fold("hero-title")).eyebrow).toBe("Contact Kheelona");
  });

  /* Equal values cannot tell a read from a retyped copy, which would go stale the day the shared module changes; the
   * source can (4.4's guard: no page hard-codes the GSTIN). */
  it("reads the seller's facts by reference: no GSTIN, entity, address, number, email or WhatsApp link typed in its source", () => {
    const source = readRepoFile("src/content/en-IN/pages/contact.ts");
    for (const fact of [GSTIN, LEGAL_ENTITY, REGISTERED_ADDRESS_LINE, seller.support.phone, seller.support.email, "wa.me", "tel:", "aman@", trustItems["returns-7-days"].label]) {
      expect(source, fact).not.toContain(fact);
    }
  });

  it("names no amount, no placeholder and none of the retired contact lines (copy page; D032, R9)", () => {
    const all = [...strings(contactPage), ...strings(contactPage).flatMap((s) => [toPlainText(s, token), toPlainText(s, full)])].join("\n");
    expect(all).not.toMatch(/₹|\{price:|\{ph:|\[PLACEHOLDER/);
    expect(all).not.toMatch(/messages, not calls|designed and built here|\b5 days\b|\b30 days\b|kheelona\.ai|Partners|retailers|investors|Kheelona India|Kheelona\+/i);
  });

  it("links only planned routes of the site (internal links resolve)", () => {
    const hrefs = strings(contactPage)
      .flatMap((s) => [...s.matchAll(/\]\((\/[^)]*)\)/g)].map((m) => m[1]))
      .concat(
        sections.flatMap((e) => {
          const c = e.config as { items?: { links?: { href: string }[] }[]; cta?: { secondary?: { href: string } } };
          return [...(c.items ?? []).flatMap((item) => (item.links ?? []).map((l) => l.href)), c.cta?.secondary?.href].filter((h): h is string => h !== undefined);
        }),
      );
    expect(hrefs.filter((h) => h.startsWith("/")).length).toBeGreaterThanOrEqual(6);
    for (const href of hrefs.filter((h) => h.startsWith("/"))) {
      expect(routeFor(href.replace(/#.*$/, "")), href).toBeDefined();
    }
  });
});
