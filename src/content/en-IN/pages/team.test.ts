import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import type { Copy, ImageRef } from "@/content/types";
import type { SectionEntry, SectionEntryOf, SectionKind } from "@/layouts/sections-registry";
import { isPlaceholder, placeholderText } from "@/lib/content/placeholder";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { CLAIM_FIXES, SELLING_CLOSES, TEAM_CLOSE_LEAD, TEAM_KEYS_LINE } from "../../../../test/e2e/support/deviations";
import { ROOT, readRepoBytes, readRepoFile, tagBytes } from "../../../../test/e2e/support/repo";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { withFacts } from "../../../../test/support/mockup-facts";
import { DEFAULT_OG, organization } from "../organization";
import { routeFor } from "../routes";
import { seller } from "../seller";
import { TRUST_COMPACT, trustItems } from "../trust";
import { teamPage } from "./team";

/* The /team page module (task 5.7; structure §5 row team.html; team copy page). Its folds in the approved order, each
 * fold's words, icons, alt texts and links equal to the built mockup (mockup/team.html, D046), except where the plan
 * changes them on purpose:
 *   - fold 1's lede is the CMO review's blocking fix M-T1 (cmo-review-pages-help-2026-10-11.md): the first screen says
 *     what Kheelu is, the age band and the page's search term;
 *   - the founder's answers of 2026-10-14 (D054 item 20, task 6.6; amends D038 for F11, G3, B24, B25): the three
 *     founders' background lines from the live bios, their live photos in place of the B24 placeholder, and the
 *     "Recognised by." strip as live (three marks from public/recognition/, Founders Inc as text), each word for word
 *     as the copy page (wiki/site/pages/team.md fold 3 and fold 5). The mockup shows a placeholder in each place: these
 *     are resolved placeholders.
 * Shared facts are read, never retyped: the founders from organization.ts, the support line from seller.ts, the trust
 * pair from trust.ts. */

const token = buildOffer("token");
const full = buildOffer("full");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (copy: Copy) => toPlainText(copy, token);

const mockup = new DOMParser().parseFromString(readRepoFile("mockup/team.html"), "text/html");
/* With task 8b.1's claim fixes applied (D058; deviations.md V30): Aman's job line and fold 4's keys line in the live team's
   code-checked words; then the selling update's (task Q2.12; D065 item 7; the D2C plan v2 §8; SELLING_CLOSES) in a pass of
   its own: the keys line in G26's words and the close's new lead; then D063 item 2: fold 2's answer and the close's help
   line without the number (task Q2.3). */
const main = withSellerFacts(withFacts(withFacts(mockup.querySelector("main")!, CLAIM_FIXES.team.edits), SELLING_CLOSES.team.edits));
const fold = (labelledBy: string) => {
  const el = main.querySelector(`[aria-labelledby="${labelledBy}"]`);
  if (!el) throw new Error(`mockup/team.html has no fold labelled by #${labelledBy}`);
  return el;
};

/** A mockup icon (inlined SVG) as its DS name, read from its path data. */
function iconOf(svg: Element | null): IconName | undefined {
  const d = Array.from(svg?.querySelectorAll("path") ?? [])
    .map((p) => p.getAttribute("d"))
    .join("");
  return (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d);
}

/** A fold's heading as the mockup prints it. */
const headingOf = (el: Element) => ({
  eyebrow: norm(el.querySelector(".kh-eyebrow")?.textContent) || undefined,
  title: norm(el.querySelector(".kh-heading__title")?.textContent),
  lead: norm(el.querySelector(".kh-heading__lead")?.textContent) || undefined,
  id: el.querySelector(".kh-heading__title")?.id,
});

/** An art-board layer's placement as the mockup's inline style gives it. */
function placement(el: Element) {
  const s = el.getAttribute("style") ?? "";
  const num = (prop: string) => {
    const m = new RegExp(`(?:^|;)\\s*${prop}:\\s*(-?[\\d.]+)%`).exec(s);
    return m ? Number(m[1]) : undefined;
  };
  const rotate = /rotate\((-?[\d.]+)deg\)/.exec(s);
  return { left: num("left"), width: num("width"), top: num("top"), bottom: num("bottom"), rotate: rotate ? Number(rotate[1]) : undefined };
}

const sections: readonly SectionEntry[] = teamPage.sections;

/** One fold of the module, by kind and position among that kind. */
function entry<K extends SectionKind>(kind: K, nth = 0): SectionEntryOf<K> {
  const found = sections.filter((e) => e.kind === kind)[nth] as SectionEntryOf<K> | undefined;
  if (!found) throw new Error(`the team page lists no ${kind} #${nth}`);
  return found;
}
const variantOf = (e: SectionEntry) => ("variant" in e.config ? e.config.variant : undefined);

/** Every string anywhere in the module (deep), for the page-wide word rules; an image's data URL is not a word. */
function strings(value: unknown, out: string[] = [], seen = new Set<unknown>()): string[] {
  if (typeof value === "string") {
    if (!value.startsWith("data:")) out.push(value);
  }
  else if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const v of Object.values(value)) strings(v, out, seen);
  }
  return out;
}

/** Every placeholder anywhere in the module (deep), data placeholders and inline tokens. */
function placeholdersIn(value: unknown, out: string[] = [], seen = new Set<unknown>()): string[] {
  if (isPlaceholder(value)) out.push(placeholderText(value));
  else if (typeof value === "string") for (const m of value.matchAll(/\{ph:[^}]*\}/g)) out.push(m[0]);
  else if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const v of Object.values(value)) placeholdersIn(v, out, seen);
  }
  return out;
}

const SOURCE = readRepoFile("src/content/en-IN/pages/team.ts");

describe("the team page: its folds", () => {
  it("lists the approved folds in order (structure §5: hero answer, who, founders, why, recognised, close)", () => {
    expect(sections.map((e) => [e.kind, variantOf(e)])).toEqual([
      ["hero-section", "answer"],
      ["answer-section", "team"],
      ["founders-section", undefined],
      ["feature-split", "quote"],
      ["recognition-strip", undefined],
      ["close-section", "center"],
    ]);
  });

  it("names each fold as the mockup does, in the mockup's order", () => {
    const ids = sections.map((e) => {
      const c = e.config as { heading?: { id?: string }; id?: string };
      if (e.kind === "close-section") return "close-title";
      if (e.kind === "founders-section") return c.id ?? "founders-title";
      if (e.kind === "recognition-strip") return c.id ?? "recognised-title";
      return c.heading?.id ?? c.id;
    });
    const labelled = Array.from(main.querySelectorAll("section[aria-labelledby]")).map((el) => el.getAttribute("aria-labelledby"));
    expect(ids).toEqual(labelled);
    expect(ids).toEqual(["hero-title", "who-title", "founders-title", "why-title", "recognised-title", "close-title"]);
  });
});

describe("fold 1: the hero, with the CMO's first-screen fix (M-T1)", () => {
  const hero = entry("hero-section");
  const config = () => {
    if (hero.config.variant !== "answer") throw new Error("not an answer hero");
    return hero.config;
  };

  it("carries the approved H1 (option A, the Hand on “parents”) and the eyebrow, word for word", () => {
    const { heading } = config();
    expect(heading.title).toBe("The {hand:parents} building Kheelu.");
    const approved = headingOf(fold("hero-title"));
    expect({ eyebrow: heading.eyebrow, title: plain(heading.title!), id: heading.id }).toEqual({
      eyebrow: approved.eyebrow,
      title: approved.title,
      id: approved.id,
    });
  });

  it("leads with the CMO's fix M-T1 verbatim, in place of the mockup's lede", () => {
    const lead = plain(config().heading.lead!);
    expect(lead).toBe(
      "Kheelona’s founders are parents in Bengaluru, building Kheelu: a screen-free plush toy that talks, for children aged 3 to 7. You’re trusting us near your child, so here is who we are.",
    );
    expect(headingOf(fold("hero-title")).lead).toBe(
      "Kheelu is designed by parents in Bengaluru. You’re trusting us near your child, so here is who we are.",
    );
  });

  it("says on the first screen what Kheelu is, the age band and the search term (M-T1; keyword map §4.1)", () => {
    const lead = plain(config().heading.lead!);
    expect(lead).toMatch(/\bscreen-free plush toy that talks\b/);
    expect(lead).toMatch(/\baged 3 to 7\b/);
    expect(lead).toMatch(/^Kheelona’s founders\b/);
  });

  it("has no CTA (strategy §3.3: the close and the sticky bar carry it)", () => {
    expect(hero.cta).toBeUndefined();
  });

  it("shows the product-only board as the mockup places it: the heart, Kheelu tilted, the spark lines (still)", () => {
    const { media } = config();
    if (media?.kind !== "art") throw new Error("no hero board");
    const board = fold("hero-title").querySelector(".kh-art")!;
    expect(media.stacked).toBe(true);
    expect(media.art.tone).toBe("sun");
    expect(board.classList.contains(`kh-tone-${media.art.tone}`)).toBe(true);
    expect(media.art.label).toBe(board.getAttribute("aria-label"));
    expect(media.art.label).toBe("Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.");
    const expected = Array.from(board.querySelectorAll(".kh-art__layer")).map(placement);
    expect(media.art.layers.map(({ left, width, top, bottom, rotate }) => ({ left, width, top, bottom, rotate }))).toEqual(expected);
    expect(media.art.layers.map((l) => (l.doodle ? `doodle:${l.doodle.name}` : "image"))).toEqual(["image", "image", "doodle:ink-spark-lines"]);
    expect(media.art.layers.every((l) => l.doodle !== undefined || l.image.alt === "")).toBe(true);
    expect(media.art.layers.some((l) => l.doodle?.draw)).toBe(false);
  });
});

describe("fold 2: who makes Kheelu? (the answer-first block)", () => {
  const who = entry("answer-section");

  /* "or by phone at +91 91875 46483," came off (D063 item 2; task Q2.3): 43 words, inside the answer-first 40-60. */
  it("is the team answer, its question and its words the mockup's, word for word, the number off", () => {
    const el = fold("who-title");
    expect(who.config.variant).toBe("team");
    expect(who.config.id ?? "who-title").toBe("who-title");
    expect(plain(who.config.question)).toBe(headingOf(el).title);
    const answer = plain(who.config.answer);
    expect(answer).toBe(norm(el.querySelector("p")?.textContent));
    expect(answer.split(/\s+/)).toHaveLength(43);
  });

  it("links WhatsApp and the email as the mockup does, from the seller's support line (D032), and no phone (D063)", () => {
    const hrefs = [...String(who.config.answer).matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
    const printed = Array.from(fold("who-title").querySelectorAll("p a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(printed);
    expect(hrefs).toEqual([seller.support.whatsapp, `mailto:${seller.support.email}`]);
    expect(String(who.config.answer)).not.toContain(seller.support.phone);
  });

  /* Equal values cannot tell a read from a retyped copy, which would go stale the day the shared module changes; the
   * source can. The meta description alone names the founders, as the copy page words it. */
  it("reads the company, the founders and the support line by reference, never retyped", () => {
    const fold2 = SOURCE.slice(SOURCE.indexOf('kind: "answer-section"'), SOURCE.indexOf('kind: "founders-section"'));
    expect(fold2).toContain("question:");
    for (const text of [seller.legalName, seller.support.email, ...organization.founders.map((f) => f.name)]) {
      expect(plain(who.config.answer)).toContain(text);
      expect(fold2, text).not.toContain(text);
      expect(SOURCE.replace(String(teamPage.meta.description), ""), text).not.toContain(text);
    }
  });
});

describe("fold 3: the Kheelona founders", () => {
  const founders = entry("founders-section");
  const el = () => fold("founders-title");
  const cards = () => Array.from(el().querySelectorAll("article.kh-card"));

  it("carries the H2 with the primary cluster and the Hand on “founders.”", () => {
    expect(founders.config.title).toBe("The Kheelona {hand:founders.}");
    expect(plain(founders.config.title)).toBe(headingOf(el()).title);
  });

  it("lists the three founders in organization.ts's order (Apoorva, Aman, Kashyap), each from its facts", () => {
    expect(founders.config.founders).toHaveLength(3);
    founders.config.founders.forEach((card, i) => {
      const facts = organization.founders[i];
      expect({ name: card.name, role: card.role, anchor: card.anchor, href: card.link.href }).toEqual({
        name: facts.name,
        role: facts.role,
        anchor: facts.anchor,
        href: facts.sameAs,
      });
    });
    expect(SOURCE).not.toMatch(/linkedin\.com|"Co-Founder and/);
  });

  it("prints each card's name, role, initials, words and link as the mockup does", () => {
    const printed = cards().map((card) => ({
      name: norm(card.querySelector(".kh-card__title")?.textContent),
      role: norm(card.querySelector(".mk-founder__role")?.textContent),
      initials: norm(card.querySelector(".kh-avatar")?.textContent),
      body: norm(card.querySelector(".kh-card__body")?.textContent),
      link: { label: norm(card.querySelector(".kh-card__link")?.textContent), href: card.querySelector(".kh-card__link")?.getAttribute("href") },
    }));
    expect(
      founders.config.founders.map((card) => ({
        name: card.name,
        role: card.role,
        initials: card.initials,
        body: toPlainText(card.body, token),
        link: { label: card.link.label, href: card.link.href },
      })),
    ).toEqual(printed);
  });

  /* D054 item 20 settles B24: the live site's photos, public/team/*.jpg, byte for byte the files at the tag; each a
   * site-path image at the file's real size (nothing shifts), with an empty alt: the founder's name is printed beside it
   * (DS Avatar README: alt="" next to a visible name; team.md fold 3). The mockup's placeholder line is the resolved
   * placeholder. */
  it("shows each founder's live photo at its real size, with an empty alt beside the visible name (D054 item 20; B24 settled)", async () => {
    expect(norm(cards()[0].querySelector(".mk-founder__photo")?.textContent)).toBe("[PLACEHOLDER B24: founder photo]");
    const expected: Record<string, { src: string; alt: string }> = {
      "Apoorva Sahu": { src: "/team/apoorva.jpg", alt: "" },
      "Aman Soni": { src: "/team/aman.jpg", alt: "" },
      "Kashyap C.R": { src: "/team/kashyap.jpg", alt: "" },
    };
    for (const card of founders.config.founders) {
      expect(isPlaceholder(card.photo), card.name).toBe(false);
      const photo = card.photo as ImageRef;
      if (!("width" in photo)) throw new Error(`${card.name}: the photo is not a site path`);
      expect({ src: photo.src, alt: photo.alt }).toEqual(expected[card.name]);
      const meta = await sharp(join(ROOT, "public", photo.src)).metadata();
      expect({ width: photo.width, height: photo.height }, photo.src).toEqual({ width: meta.width, height: meta.height });
      expect(readRepoBytes(`public${photo.src}`).equals(tagBytes(`public${photo.src}`)!), `${photo.src} is the live site's file`).toBe(true);
    }
  });

  /* D054 item 20 lifts D038's proof gate for these lines: each founder's background shows, from the live bio, word for
   * word as the copy page (team.md:127, 133, 139; "15" in numerals, DS 01-writing.md:23). The live bio's retired wording
   * ("the small language model we train ourselves", claims §4) stays out. */
  it("shows each founder's background line from the live bio, word for word as the copy page, with no gate", () => {
    expect(founders.config.founders.map((card) => [card.name, card.bio && toPlainText(card.bio.text, token), card.bio?.gated])).toEqual([
      ["Apoorva Sahu", "He is a Chartered Accountant with 15 years in finance and company-building. He was the first student at his family’s pre-school, in 1994.", undefined],
      ["Aman Soni", "He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name.", undefined],
      [
        "Kashyap C.R",
        "Over a decade in hardware, including years at Intel leading Thunderbolt 4 and 5 compliance, he took products from a blank page to certification.",
        undefined,
      ],
    ]);
    expect(strings(founders).join("\n")).not.toMatch(/language model|train ourselves|\{ph:/i);
  });
});

describe("fold 4: why we build Kheelu", () => {
  const why = entry("feature-split");
  const config = () => {
    if (why.config.variant !== "quote") throw new Error("not the quote fold");
    return why.config;
  };

  it("is the band with the Mark under “Why”, the three paragraphs and the subtitle line, word for word", () => {
    const el = fold("why-title");
    const c = config();
    expect(c.band).toBe(true);
    expect(c.heading.title).toBe("{mark:Why} we build Kheelu.");
    expect({ title: plain(c.heading.title), id: c.heading.id }).toEqual({ title: headingOf(el).title, id: headingOf(el).id });
    expect(c.copy.map(plain)).toEqual(Array.from(el.querySelectorAll(".mk-team-why p.kh-body-l")).map((p) => norm(p.textContent)));
    expect(plain(c.subtitle!)).toBe(norm(el.querySelector(".mk-team-why .kh-subtitle")?.textContent));
  });

  /* The selling update (task Q2.12; D065 item 7, G26; the D2C plan v2 §8 fold 4): "Delete all chats" there deletes them
     from our servers, never a one-tap delete and no place named (D058). */
  it("says the keys line in G26's words: read every conversation, and “Delete all chats” deletes them from our servers", () => {
    expect(plain(config().copy[2])).toBe(TEAM_KEYS_LINE.build);
    expect(config().copy.map(plain).join(" ")).not.toMatch(/deleting your account|one tap|in India/i);
  });

  it("quotes Apoorva verbatim beside the words, in the Sunshine tone, his role from organization.ts", () => {
    const el = fold("why-title");
    const { quote } = config();
    expect(plain(quote.text)).toBe(norm(el.querySelector(".kh-quote__text")?.textContent));
    expect(plain(quote.name)).toBe(norm(el.querySelector(".kh-quote__name")?.textContent));
    expect(plain(quote.role!)).toBe(norm(el.querySelector(".kh-quote__role")?.textContent));
    // The mockup's "AS" initials badge is his live photo in the build, alt empty beside his name (task 7.1a, CMO M10;
    // deviations.md V7): the same file as his founder card's.
    expect(norm(el.querySelector(".kh-quote__avatar")?.textContent)).toBe("AS");
    expect(quote.initials).toBeUndefined();
    expect(quote.photo).toEqual({ src: "/team/apoorva.jpg", width: 480, height: 480, alt: "" });
    expect(el.querySelector(".kh-quote")!.classList.contains(`kh-tone-${quote.tone}`)).toBe(true);
    expect({ name: quote.name, role: quote.role }).toEqual({ name: organization.founders[0].name, role: organization.founders[0].role });
  });

  it("closes with the secondary link to /safety and its shield (no tracking value)", () => {
    const link = fold("why-title").querySelector(".kh-section__actions a")!;
    expect(link.getAttribute("href")).toBe("safety.html");
    expect(config().link).toEqual({ label: norm(link.textContent), href: "/safety", icon: iconOf(link.querySelector("svg")) });
    expect(config().link?.icon).toBe("shield-check");
  });
});

describe("fold 5: recognised by, as the live strip (D054 item 20)", () => {
  const strip = entry("recognition-strip");

  it("keeps the DS label and the four programmes in the live strip's order, none gated", () => {
    expect(strip.config.title).toBe(headingOf(fold("recognised-title")).title);
    expect(strip.config.title).toBe("Recognised by.");
    expect(strip.config.items.map((i) => i.name)).toEqual(["NVIDIA Inception Program", "Karnataka Elevate", "nasscom startups", "Founders Inc"]);
    for (const item of strip.config.items) expect(item.gated, item.name).toBeUndefined();
  });

  /* The live marks, public/recognition/*.png (team.md fold 5): the NVIDIA and nasscom marks stand for their names, so
   * each carries the words on the mark as its alt; the Karnataka seal is decorative beside the words "Karnataka
   * Elevate" (empty alt, as live, and never "Government of Karnataka"); Founders Inc is text only. The NVIDIA alt is the
   * mark's own words, "NVIDIA Inception Program", which the en-IN spelling guard passes as that exact string (team.md
   * question 5; test/guards/banned-phrases.data.ts us-program). */
  it("shows the three live marks at their real sizes, with the copy page's alts, and Founders Inc as text", async () => {
    expect(strip.config.items.map((i) => (i.mark ? { name: i.name, src: i.mark.src, alt: i.mark.alt } : { name: i.name }))).toEqual([
      { name: "NVIDIA Inception Program", src: "/recognition/nvidia-inception.png", alt: "NVIDIA Inception Program" },
      { name: "Karnataka Elevate", src: "/recognition/karnataka-seal.png", alt: "" },
      { name: "nasscom startups", src: "/recognition/nasscom.png", alt: "nasscom startups" },
      { name: "Founders Inc" },
    ]);
    for (const { mark } of strip.config.items) {
      if (!mark) continue;
      if (!("width" in mark)) throw new Error(`${String(mark.src)} is not a site path`);
      const meta = await sharp(join(ROOT, "public", mark.src)).metadata();
      expect({ width: mark.width, height: mark.height }, mark.src).toEqual({ width: meta.width, height: meta.height });
      expect(readRepoBytes(`public${mark.src}`).equals(tagBytes(`public${mark.src}`)!), `${mark.src} is the live site's file`).toBe(true);
    }
  });

  it("names the programmes only: no relationship, no endorsement, no government (B26; DS 01-writing.md:70)", () => {
    const words = strings(strip).join("\n");
    expect(words).not.toMatch(/backed|funded|partner|investor|member of|endorse|approved|certified|Government/i);
  });
});

describe("fold 6: the close", () => {
  const close = entry("close-section");

  /* The selling update (task Q2.12; the D2C plan v2 §8 fold 6; D034, the footer's line): the close gains its lead; the
     button, the price line, the trust line (the risk-reversal line first, task Q2.8), the help line and the ghost link
     stay, as every close has them (CtaBlock). */
  it("is centred: the heading with the plan's lead, the one chilli button (finale), the trust line, the help line, then the ghost link to the product", () => {
    if (close.config.variant !== "center") throw new Error("not the centred close");
    const { config } = close;
    const el = fold("close-title");
    expect(config.heading.title).toBe("Bring Kheelu {hand:home.}");
    expect(plain(config.heading.title)).toBe(headingOf(el).title);
    expect(config.heading.eyebrow).toBeUndefined();
    expect(config.heading.lead).toBe(TEAM_CLOSE_LEAD);
    expect(plain(config.heading.lead!)).toBe(headingOf(el).lead);
    expect(TEAM_CLOSE_LEAD).toBe("Designed by parents in Bengaluru. Made in India.");
    const ghost = el.querySelectorAll(".kh-section__actions a")[1]!;
    expect(ghost.getAttribute("href")).toBe("meet-kheelu.html");
    expect(config.cta).toEqual({
      cta: "finale",
      trust: TRUST_COMPACT.map((id) => trustItems[id]),
      helpLine: true,
      secondary: { label: norm(ghost.textContent), href: "/products/kheelu", variant: "ghost", iconEnd: iconOf(ghost.querySelector("svg")) },
    });
    const button = el.querySelector(".kh-btn--cta")!;
    expect(button.getAttribute("data-ph-capture-attribute-cta")).toBe(config.cta.cta);
    expect(button.classList.contains("kh-btn--block")).toBe(false);
  });
});

describe("the team page: page-wide rules", () => {
  it("has the copy page's title and description and the default share card", () => {
    expect(plain(teamPage.meta.title)).toBe("Kheelona founders: the parents building Kheelu");
    expect(plain(teamPage.meta.description)).toBe(
      "Meet the Kheelona founders, Apoorva Sahu, Aman Soni and Kashyap C.R: parents in Bengaluru building Kheelu, a screen-free plush toy for ages 3 to 7.",
    );
    expect(teamPage.meta.og).toBe(DEFAULT_OG);
  });

  it("declares its AboutPage as the live page named it, described by fold 2's answer (architecture §9.2; 4.5 item 5)", () => {
    expect(teamPage.schema).toEqual([{ kind: "about-page", name: "The people who build Kheelona" }]);
  });

  it("names no amount, no retired or banned line, no advisor and no removed founder (copy page, fold 3 notes)", () => {
    const all = strings(teamPage).flatMap((s) => [toPlainText(s, token), toPlainText(s, full)]).join("\n");
    expect(strings(teamPage).join("\n")).not.toMatch(/₹|\{price:/);
    expect(all).not.toMatch(/toddler|advisor|\bRia\b|Magic Box|train ourselves|own the model|battery|safe to hug|backed by|on the device|Kheelona\+|Kheelona India/i);
  });

  it("carries no placeholder: the copy page lists none since task 6.6 (D054 item 20)", () => {
    expect(placeholdersIn(teamPage)).toEqual([]);
  });

  it("links only planned routes of the site (internal links resolve)", () => {
    const hrefs = strings(teamPage)
      .flatMap((s) => [...s.matchAll(/\]\((\/[^)]*)\)/g)].map((m) => m[1]))
      .concat(
        sections.flatMap((e) => {
          const c = e.config as { link?: { href: string }; cta?: { secondary?: { href: string } } };
          return [c.link?.href, c.cta?.secondary?.href].filter((h): h is string => h !== undefined);
        }),
      );
    expect(hrefs).toEqual(expect.arrayContaining(["/safety", "/products/kheelu"]));
    for (const href of hrefs.filter((h) => h.startsWith("/"))) {
      expect(routeFor(href.replace(/#.*$/, "")), href).toBeDefined();
    }
  });
});
