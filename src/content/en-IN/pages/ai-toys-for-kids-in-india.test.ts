import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import type { ArtBoardRef, Copy } from "@/content/types";
import type { SectionEntry, SectionEntryOf, SectionKind } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { CLAIM_FIXES, COPY_FIXES, GUIDE_ANSWERS, GUIDE_PRICE_FAQ, SELLING_CLOSES } from "../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupRoute } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";
import { faqs } from "../faqs";
import { DEFAULT_OG } from "../organization";
import { product } from "../products/kheelu/product";
import { routeFor } from "../routes";
import { TRUST_COMPACT, trustItems } from "../trust";
import { aiToysPage } from "./ai-toys-for-kids-in-india";

/* The buyer's guide module, /ai-toys-for-kids-in-india (task 5.4; structure §5 row ai-toys-for-kids-in-india.html; the
 * guide's copy page). Its folds in the approved order, each fold's words, icons, alt texts, art layers and links equal
 * to the built mockup (mockup/ai-toys-for-kids-in-india.html, D046), the rules the copy page sets for this page (the
 * answer-first hero, H1 option B; no competitor named and no competitor price, B14; the FAQ fold as the page's FAQPage
 * with its two sources; no placeholder, no typed amount), and the shared content it reads by reference (faqs.ts,
 * trust.ts, the product's languages), never retyped. */

const token = buildOffer("token");
const full = buildOffer("full");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (copy: Copy) => toPlainText(copy, token);

const SLUG = "ai-toys-for-kids-in-india";
const mockup = new DOMParser().parseFromString(readRepoFile(`mockup/${SLUG}.html`), "text/html");
/* With task 7.1b's copy fix (V22) and task 8b.1's claim fixes (D058; deviations.md V31) applied: check 4, Kheelu's
   answers and the age answer in the live team's code-checked words; then the selling update's (task Q2.12; D065; the D2C
   plan v2 §6; SELLING_CLOSES): two of Kheelu's answers in the founder's words, the button after them with the price line
   and the trust line, and the price question without GST, the first 500 or the balance. */
const main = withFacts(withFacts(withFacts(mockup.querySelector("main")!, COPY_FIXES[SLUG].edits), CLAIM_FIXES[SLUG].edits), SELLING_CLOSES[SLUG].edits);
const fold = (labelledBy: string) => {
  const el = main.querySelector(`[aria-labelledby="${labelledBy}"]`);
  if (!el) throw new Error(`mockup/${SLUG}.html has no fold labelled by #${labelledBy}`);
  return el;
};

/** A mockup string as content: the Kalam accent, the marker underline and inline links as the rich-text syntax. */
function copyOf(el: Element): string {
  return [...el.childNodes]
    .map((n) => {
      if (n.nodeType === 3) return n.textContent ?? "";
      const e = n as Element;
      if (e.classList.contains("kh-hand")) return `{hand:${copyOf(e)}}`;
      if (e.classList.contains("kh-mark")) return `{mark:${copyOf(e)}}`;
      if (e.tagName === "A") return `[${copyOf(e)}](${mockupRoute(e.getAttribute("href") ?? "")})`;
      return copyOf(e);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/** A fold's heading as the mockup prints it, accents in the content syntax. */
const headingOf = (el: Element) => ({
  eyebrow: norm(el.querySelector(".kh-eyebrow")?.textContent) || undefined,
  title: copyOf(el.querySelector(".kh-heading__title")!),
  lead: norm(el.querySelector(".kh-heading__lead")?.textContent) || undefined,
  id: el.querySelector(".kh-heading__title")?.id,
});

/** A mockup icon (inlined SVG) as its DS name, read from its path data. */
function iconOf(svg: Element | null): IconName | undefined {
  const d = Array.from(svg?.querySelectorAll("path") ?? [])
    .map((p) => p.getAttribute("d"))
    .join("");
  return (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d);
}

/** A mockup art board's layers: position, size and tilt from the inline style, and whether it is a doodle file. */
function layersOf(board: Element) {
  return Array.from(board.querySelectorAll(".kh-art__layer")).map((el) => {
    const s = el.getAttribute("style") ?? "";
    const num = (prop: string) => {
      const m = new RegExp(`(?:^|;)\\s*${prop}:\\s*(-?[\\d.]+)%`).exec(s);
      return m ? Number(m[1]) : undefined;
    };
    const rotate = /rotate\((-?[\d.]+)deg\)/.exec(s);
    const file = /\/Doodles\/([a-z-]+)\.svg$/.exec(el.getAttribute("src") ?? "");
    return {
      left: num("left"),
      width: num("width"),
      top: num("top"),
      bottom: num("bottom"),
      rotate: rotate ? Number(rotate[1]) : undefined,
      kind: file ? `doodle:${file[1]}` : "image",
    };
  });
}
const layersIn = (art: ArtBoardRef) =>
  art.layers.map((l) => ({
    left: l.left,
    width: l.width,
    top: l.top,
    bottom: l.bottom,
    rotate: l.rotate,
    kind: l.doodle ? `doodle:${l.doodle.name}` : "image",
  }));

const sections: readonly SectionEntry[] = aiToysPage.sections;

/** One fold of the module, by kind and position among that kind. */
function entry<K extends SectionKind>(kind: K, nth = 0): SectionEntryOf<K> {
  const found = sections.filter((e) => e.kind === kind)[nth] as SectionEntryOf<K> | undefined;
  if (!found) throw new Error(`the guide lists no ${kind} #${nth}`);
  return found;
}
const variantOf = (e: SectionEntry) => ("variant" in e.config ? e.config.variant : undefined);

/** Every string anywhere in the module (deep), for the page-wide word rules. */
function strings(value: unknown, out: string[] = [], seen = new Set<unknown>()): string[] {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const v of Object.values(value)) strings(v, out, seen);
  }
  return out;
}

describe("the buyer's guide: its folds", () => {
  it("lists the approved folds in order (structure §5: hero answer, checks, meets, plush or robot, FAQ, close)", () => {
    expect(sections.map((e) => [e.kind, variantOf(e)])).toEqual([
      ["hero-section", "answer"],
      ["steps-section", "checks"],
      ["trust-section", "meets"],
      ["feature-split", "photo"],
      ["faq-section", "photo"],
      ["close-section", "guide"],
    ]);
  });

  it("names each fold as the mockup does, in the mockup's order", () => {
    const ids = sections.map((e) => (e.kind === "close-section" ? "close-title" : (e.config as { heading: { id?: string } }).heading.id));
    const labelled = Array.from(main.querySelectorAll("section[aria-labelledby]")).map((el) => el.getAttribute("aria-labelledby"));
    expect(ids).toEqual(["hero-title", "checks-title", "answers-title", "plush-title", "faq-title", "close-title"]);
    expect(labelled).toEqual(ids);
  });
});

describe("fold 1: the answer-first hero", () => {
  const hero = entry("hero-section");
  it("carries the approved H1 (option B, its Hand accent), the eyebrow and the 59-word lead, word for word", () => {
    if (hero.config.variant !== "answer") throw new Error("not an answer hero");
    const { heading } = hero.config;
    expect(heading.title).toBe("AI toys for kids in India: five checks {hand:before you buy.}");
    expect({ eyebrow: heading.eyebrow, title: heading.title, lead: plain(heading.lead!), id: heading.id }).toEqual(headingOf(fold("hero-title")));
    expect(plain(heading.lead!).split(/\s+/)).toHaveLength(59);
    expect(plain(heading.lead!)).toMatch(/\b3 to 7\b/);
  });

  it("has no CTA (the sticky bar shows from first paint) and places Myra's board as the mockup does, clamped on tablets", () => {
    if (hero.config.variant !== "answer" || hero.config.media?.kind !== "art") throw new Error("no hero art board");
    expect(hero.cta).toBeUndefined();
    const board = fold("hero-title").querySelector(".kh-art")!;
    const { art, clamp } = hero.config.media;
    expect(clamp).toBe(true);
    expect(board.classList.contains("mk-gd-hero-art")).toBe(true); // the 480 px tablet clamp (mapping row 8)
    expect(board.classList.contains(`kh-tone-${art.tone}`)).toBe(true);
    expect(art.label).toBe(board.getAttribute("aria-label"));
    expect(art.label).toBe("A little girl in a mustard floral frock beside Kheelu, the cream plush rabbit.");
    expect(layersIn(art)).toEqual(layersOf(board));
    expect(art.layers.every((l) => l.doodle !== undefined || l.image.alt === "")).toBe(true);
  });

  it("keeps the hero's question mark still (D049 pick 2: a hero never draws)", () => {
    if (hero.config.variant !== "answer" || hero.config.media?.kind !== "art") throw new Error("no hero art board");
    const doodles = hero.config.media.art.layers.filter((l) => l.doodle !== undefined);
    expect(doodles.map((l) => l.doodle!.name)).toEqual(["ink-question-mark"]);
    expect(doodles.every((l) => !l.doodle!.draw)).toBe(true);
  });
});

describe("fold 2: the five checks", () => {
  const checks = entry("steps-section");
  it("is on the band, under the heading with the Mark on “check”, as the mockup words it", () => {
    if (checks.config.variant !== "checks") throw new Error("not the checks fold");
    const { heading } = checks.config;
    expect(checks.config.band).toBe(true);
    expect(heading.title).toBe("Five things to {mark:check} before you buy an AI toy.");
    expect({ eyebrow: heading.eyebrow, title: heading.title, lead: heading.lead && plain(heading.lead), id: heading.id }).toEqual(
      headingOf(fold("checks-title")),
    );
  });

  it("lists the five checks in the mockup's order, word for word, each a neutral question (no brand)", () => {
    if (checks.config.variant !== "checks") throw new Error("not the checks fold");
    const printed = Array.from(fold("checks-title").querySelectorAll("ol.kh-steps > .kh-step")).map((li) => ({
      title: norm(li.querySelector(".kh-step__title")?.textContent),
      body: norm(li.querySelector(".kh-step__body")?.textContent),
    }));
    expect(checks.config.steps.map((s) => ({ title: plain(s.title), body: plain(s.body) }))).toEqual(printed);
    expect(printed).toHaveLength(5);
    expect(checks.config.steps.every((s) => s.tone === undefined)).toBe(true);
    expect(checks.config.steps.every((s) => plain(s.title).endsWith("?"))).toBe(true);
  });

  it("ends on the ghost link to the long-form article (internal, no tracking value)", () => {
    if (checks.config.variant !== "checks") throw new Error("not the checks fold");
    const link = fold("checks-title").querySelector(".kh-section__actions a")!;
    expect(link.classList.contains("kh-btn--ghost")).toBe(true);
    expect(link.hasAttribute("data-ph-capture-attribute-cta")).toBe(false);
    expect(checks.config.action).toEqual({ label: norm(link.textContent), href: mockupRoute(link.getAttribute("href")!) });
    expect(checks.config.action?.href).toBe("/stories/what-to-look-for-in-a-safe-ai-toy");
    expect(checks.howTo).toBeUndefined();
  });
});

describe("fold 3: how Kheelu meets each check", () => {
  const meets = entry("trust-section");
  const answersOf = () => {
    if (meets.config.variant !== "meets") throw new Error("not the meets fold");
    return meets.config;
  };

  it("answers the five checks in the same order, with the mockup's icons and words", () => {
    const config = answersOf();
    const el = fold("answers-title");
    expect(config.band).toBeFalsy();
    expect(config.heading.title).toBe("How Kheelu meets {hand:each check.}");
    expect({ eyebrow: config.heading.eyebrow, title: config.heading.title, lead: config.heading.lead && plain(config.heading.lead), id: config.heading.id }).toEqual(
      headingOf(el),
    );
    const printed = Array.from(el.querySelectorAll("ol.kh-trust > .kh-trust__item")).map((item) => ({
      icon: iconOf(item.querySelector(".kh-trust__icon svg")),
      title: norm(item.querySelector(".kh-trust__title")?.textContent),
      body: norm(item.querySelector(".kh-trust__body")?.textContent),
    }));
    expect(config.items.map((i) => ({ icon: i.icon, title: plain(i.title!), body: plain(i.body) }))).toEqual(printed);
    expect(meets.faq).toBeUndefined();
  });

  it("names the languages from the product facts (their count, names and the launch ceiling), never retyped", () => {
    const languages = plain(answersOf().items[4].body);
    const names = product.languages.map((l) => l.name);
    expect(languages).toBe(
      `Eight today: ${names.slice(0, -1).join(", ")} and ${names.at(-1)}, with up to ${product.languageCeiling} at launch. It can switch between them mid-sentence.`,
    );
    expect(names).toHaveLength(8);
    const source = readRepoFile(`src/content/en-IN/pages/${SLUG}.ts`);
    expect(source).not.toContain("Hindi, Bengali");
    expect(source).toMatch(/\bproduct\.languageCeiling\b/);
  });

  it("points to the safety page, then its secondary button with the shield (no tracking value)", () => {
    const config = answersOf();
    const el = fold("answers-title");
    expect(plain(config.pointer!)).toBe(norm(el.querySelector(".kh-body-l")?.textContent));
    const link = el.querySelector(".kh-section__actions a")!;
    expect(link.classList.contains("kh-btn--secondary")).toBe(true);
    expect(link.hasAttribute("data-ph-capture-attribute-cta")).toBe(false);
    expect(config.link).toEqual({ label: norm(link.textContent), href: mockupRoute(link.getAttribute("href")!), icon: iconOf(link.querySelector("svg")) });
    expect(config.link).toEqual({ label: "See the full safety facts", href: "/safety", icon: "shield-check" });
  });

  /* The selling update (task Q2.12; D065 items 7-8; the D2C plan v2 §6 fold 3): "Every conversation" in G26's words and
     "Open internet" ending on the line D065 confirms, never a one-tap delete or a place for the servers (D058). */
  it("says G26's delete-all-chats line and D065's not-knowing line in Kheelu's answers, word for word", () => {
    const items = answersOf().items.map((i) => ({ title: plain(i.title!), body: plain(i.body) }));
    expect(items.find((i) => i.title === "Every conversation")?.body).toBe(GUIDE_ANSWERS.conversation.build);
    expect(items.find((i) => i.title === "Open internet")?.body).toBe(GUIDE_ANSWERS.internet.claimFixed.replace(GUIDE_ANSWERS.internet.from, GUIDE_ANSWERS.internet.to));
    expect(items.find((i) => i.title === "Open internet")?.body).toMatch(/When it doesn’t know something, it says so instead of guessing\.$/);
    expect(items.map((i) => i.body).join(" ")).not.toMatch(/one tap|hides it on that phone|Deleting your account|in India/);
  });

  /* The page's first button, after Kheelu's answers (`guide-answers`, registered under D065): the same block as every
     close, the chilli button with its arrow (full width on phones), then the price line and the trust line, no help line
     (the plan's §6 fold 3; the close carries it). */
  it("ends on the pre-order button (`guide-answers`), the price line and the trust line, as the mockup with the plan's block", () => {
    expect(meets.cta).toEqual({ cta: "guide-answers", arrow: true, block: true, trust: TRUST_COMPACT.map((id) => trustItems[id]) });
    const buttons = fold("answers-title").querySelectorAll(".kh-btn--cta");
    expect(buttons).toHaveLength(1);
    expect(buttons[0].getAttribute("data-ph-capture-attribute-cta")).toBe("guide-answers");
    expect(buttons[0].classList.contains("kh-btn--block")).toBe(true);
  });
});

describe("fold 4: AI robot or AI plush?", () => {
  const plush = entry("feature-split");
  const splitOf = () => {
    if (plush.config.variant !== "photo" || plush.config.media?.kind !== "art") throw new Error("not the plush fold");
    return { ...plush.config, media: plush.config.media };
  };

  it("is on the band, its words in the wider column first, then the one measured paragraph", () => {
    const config = splitOf();
    const el = fold("plush-title");
    expect(config.band).toBe(true);
    expect(config.split).toBe("start");
    expect(config.heading.title).toBe("AI robot or {hand:AI plush?}");
    expect({ eyebrow: config.heading.eyebrow, title: config.heading.title, id: config.heading.id }).toEqual({
      eyebrow: headingOf(el).eyebrow,
      title: headingOf(el).title,
      id: headingOf(el).id,
    });
    expect(config.copy).toBeUndefined();
    expect(plain(config.text!)).toBe(norm(el.querySelector(".kh-body-l")?.textContent));
    expect(plain(config.text!)).toContain("Kheelu is a soft plush rabbit, not a robot");
  });

  it("shows Kheelu alone on the 4:3 plush board, whole and upright, with the copy page's alt", () => {
    const { media } = splitOf();
    const board = fold("plush-title").querySelector(".kh-art")!;
    expect(media.plush).toBe(true);
    expect(media.art.label).toBeUndefined();
    expect(board.hasAttribute("aria-label")).toBe(false);
    expect(board.classList.contains(`kh-tone-${media.art.tone}`)).toBe(true);
    expect(layersIn(media.art)).toEqual(layersOf(board));
    const alts = media.art.layers.map((l) => (l.doodle ? undefined : l.image.alt));
    expect(alts).toEqual(Array.from(board.querySelectorAll(".kh-art__layer")).map((img) => img.getAttribute("alt")));
    expect(alts[1]).toBe("Kheelu, the soft cream plush rabbit with rainbow ears and a speaker in its tummy.");
    expect(media.art.layers.every((l) => l.rotate === undefined)).toBe(true);
  });

  it("ends on the page's in-text product link: a ghost link, no tracking value", () => {
    const config = splitOf();
    const link = fold("plush-title").querySelector(".kh-section__actions a")!;
    expect(link.classList.contains("kh-btn--ghost")).toBe(true);
    expect(link.hasAttribute("data-ph-capture-attribute-cta")).toBe(false);
    expect(config.link).toEqual({ label: norm(link.textContent), href: mockupRoute(link.getAttribute("href")!) });
    expect(config.link).toEqual({ label: "See what Kheelu does", href: "/products/kheelu" });
  });
});

describe("fold 5: questions parents ask", () => {
  const faq = entry("faq-section");
  const faqOf = () => {
    if (faq.config.variant !== "photo") throw new Error("not the photo FAQ");
    return faq.config;
  };

  it("shows the guide's five answers from faqs.ts (never retyped), in the mockup's order, all closed, on the page cream", () => {
    const config = faqOf();
    const el = fold("faq-title");
    const listed = [faqs["what-is-an-ai-toy"], faqs["ai-toy-or-tablet"], faqs["ai-toy-age"], faqs.wifi, faqs["price-in-total"]];
    expect(config.items).toEqual(listed);
    config.items.forEach((item, i) => expect(item).toBe(listed[i]));
    expect(config.items.map((i) => plain(i.question))).toEqual(Array.from(el.querySelectorAll(".kh-faq__q")).map((q) => norm(q.textContent)));
    expect(config.firstOpen).toBeFalsy();
    expect(el.querySelector("details[open]")).toBeNull();
    expect(config.band).toBeFalsy();
    expect(config.more).toBeUndefined();
    expect(config.heading.title).toBe("Questions parents {hand:ask.}");
    expect({ eyebrow: config.heading.eyebrow, title: config.heading.title, id: config.heading.id }).toEqual({
      eyebrow: headingOf(el).eyebrow,
      title: headingOf(el).title,
      id: headingOf(el).id,
    });
  });

  /* The selling update (task Q2.12; D065 items 3-4; the D2C plan v2 §6 fold 5): Home's rewritten price answer takes the
     place of `how-much`, which carried "incl. GST", the first 500 and the balance; `how-much` stays in faqs.ts for
     /pricing.md, a machine file (task Q2.8). */
  it("asks the price question in the plan's words: the total, the refundable advance, no GST, no first 500, no balance", () => {
    const price = faqOf().items.at(-1)!;
    expect(price.id).toBe("price-in-total");
    expect(plain(price.question)).toBe(GUIDE_PRICE_FAQ.build.question);
    expect(plain(price.answer)).toBe(GUIDE_PRICE_FAQ.build.answer);
    for (const offer of [token, full]) expect(toPlainText(price.answer, offer)).not.toMatch(/incl\. GST|first 500|₹4,500|MRP/);
    expect(faqOf().items.map((i) => i.id)).not.toContain("how-much");
  });

  it("shows Ira's story photo at the DS 4:5, clamped (420 px on tablets, 360 px from 900 px), with the mockup's alt", () => {
    const { photo } = faqOf();
    expect(photo.clamp).toBe(true);
    expect(photo.variant).toBeUndefined();
    expect(photo.image.alt).toBe(fold("faq-title").querySelector("figure img")!.getAttribute("alt"));
    expect(photo.sizes).toBe("(min-width: 1024px) 360px, (min-width: 900px) calc((100vw - 80px) * 5 / 12), (min-width: 720px) 420px, calc(100vw - 32px)");
  });

  it("names its markers “Source” and lists the WHO and AAP sources inside the questions' column, as the mockup prints them", () => {
    expect(faqOf().sourceMarker).toBe("Source");
    expect(faq.notes).toBeDefined();
    const notes = faq.notes!;
    expect(notes.variant).toBe("inline");
    expect(notes.label).toBe("Sources");
    const printed = Array.from(fold("faq-title").querySelectorAll("[id^=src-]")).map((p) => ({
      text: norm(p.textContent),
      href: p.querySelector("a")!.getAttribute("href"),
    }));
    expect(notes.sources.map((s) => s.href)).toEqual(printed.map((p) => p.href));
    notes.sources.forEach((source, i) => expect(printed[i].text).toContain(norm(plain(source.citation))));
    const markers = Array.from(fold("faq-title").querySelectorAll("a[href^='#src-']")).map((a) => a.getAttribute("aria-label"));
    expect(markers).toEqual(["Source 1", "Source 2"]);
  });
});

describe("fold 6: the close", () => {
  const close = entry("close-section");
  const closeOf = () => {
    if (close.config.variant !== "guide") throw new Error("not the guide close");
    return close.config;
  };

  it("is the tinted Blue card with the one chilli button (finale, arrow, full width on phones), the trust pair and the help line", () => {
    const config = closeOf();
    const el = fold("close-title");
    expect(config.tone).toBe("blue");
    expect(el.querySelector(".kh-card")!.classList.contains(`kh-tone-${config.tone}`)).toBe(true);
    expect(config.cta).toEqual({ cta: "finale", arrow: true, block: true, trust: TRUST_COMPACT.map((id) => trustItems[id]), helpLine: true });
    expect(el.querySelector(".kh-btn--cta")!.getAttribute("data-ph-capture-attribute-cta")).toBe("finale");
    expect(config.heading.title).toBe("Five checks, answered. Now {hand:meet Kheelu.}");
    expect({ eyebrow: config.heading.eyebrow, title: config.heading.title, lead: plain(config.heading.lead!) }).toEqual({
      eyebrow: headingOf(el).eyebrow,
      title: headingOf(el).title,
      lead: headingOf(el).lead,
    });
  });

  it("places the art board's layers as the mockup does: the heart, Kabir, Kheelu tilted, the ink star (it draws)", () => {
    const { art } = closeOf();
    const board = fold("close-title").querySelector(".kh-art")!;
    expect(board.classList.contains(`kh-tone-${art.tone}`)).toBe(true);
    expect(art.label).toBe(board.getAttribute("aria-label"));
    expect(art.label).toBe("A boy in glasses and a rust T-shirt beside Kheelu, the cream plush rabbit.");
    expect(layersIn(art)).toEqual(layersOf(board));
    expect(art.layers.every((l) => l.doodle !== undefined || l.image.alt === "")).toBe(true);
  });
});

describe("the buyer's guide: page-wide rules", () => {
  /* The selling update (task Q2.12; D065 item 3; the D2C plan v2 §6, "The guide: title, meta, keywords"): the total
     still leads in token mode (D028, the machine-read rule), now "in total", without "incl. GST". */
  it("has the copy page's title and the plan's two descriptions, ₹4,999 in total leading the advance in token mode (D028), and the default share card", () => {
    expect(plain(aiToysPage.meta.title)).toBe("AI toys for kids in India: how to choose one · Kheelona");
    expect(toPlainText(aiToysPage.meta.description, token)).toBe(
      "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. ₹4,999 in total; reserve with a refundable ₹499.",
    );
    expect(toPlainText(aiToysPage.meta.description, full)).toBe(
      "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. ₹7,999 in total, delivered anywhere in India.",
    );
    for (const offer of [token, full]) expect(toPlainText(aiToysPage.meta.description, offer).length).toBeLessThanOrEqual(155);
    expect(aiToysPage.meta.og).toBe(DEFAULT_OG);
  });

  /* Every string the page prints, the shared FAQ answers it lists included (strings() walks into them), in both modes.
   * The names are the brief's list as test/e2e/content-integrity.spec.ts holds it, which checks the built route too. */
  it("names no competitor and no competitor price (B14; test plan §4.8), and none of the live page's retired lines", () => {
    const all = strings(aiToysPage)
      .flatMap((s) => [toPlainText(s, token), toPlainText(s, full)])
      .join("\n");
    expect(all).toContain("What is an AI toy?");
    expect(all).not.toMatch(
      /\b(?:Yoto|tonies|Toniebox|Lovevery|KiwiCo|Miko|PlayShifu|Smartivity|Skillmatics|boAt|Lenskart|Mamaearth|The Whole Truth|Wakefit|Allbirds|Warby Parker|Oura)\b/,
    );
    expect(all).not.toMatch(/14,000|maybe a dozen|wake-word|wake word|Internet access: None|no moving parts|toddler|tutor|lessons|best friend|adapts/i);
  });

  it("types no amount and no placeholder: every price is a token the offer fills", () => {
    const own = strings(aiToysPage).join("\n");
    expect(own).not.toMatch(/₹|\{ph:|\[PLACEHOLDER/);
  });

  /* Equal values cannot tell a read from a retyped copy, which would go stale the day the shared module changes; the
   * source can. The trust pair's delivery label is the {delivery} token, so only its typed labels are listed. */
  it("reads the shared words by reference: no FAQ question or answer, or trust label typed in its source", () => {
    const source = readRepoFile(`src/content/en-IN/pages/${SLUG}.ts`);
    const ids = ["what-is-an-ai-toy", "ai-toy-or-tablet", "ai-toy-age", "wifi", "price-in-total"] as const;
    /* The price question reads differently in each mode: both of its forms. */
    const forms = (copy: Copy): string[] => (typeof copy === "string" ? [copy] : [copy.token, copy.full]);
    const shared = [
      ...ids.flatMap((id) => [faqs[id].question, faqs[id].answer]).flatMap(forms),
      ...TRUST_COMPACT.map((id) => trustItems[id].label).filter((label) => !label.startsWith("{")),
    ];
    expect(shared.length).toBeGreaterThanOrEqual(13);
    for (const text of shared) expect(source, text).not.toContain(text);
  });

  it("links only planned routes of the site (internal links resolve)", () => {
    const hrefs = sections.flatMap((e) => {
      const c = e.config as { link?: { href: string }; action?: { href: string }; more?: { href: string } };
      return [c.link?.href, c.action?.href, c.more?.href].filter((h): h is string => h !== undefined);
    });
    const inText = strings(aiToysPage).flatMap((s) => [...s.matchAll(/\]\((\/[^)]*)\)/g)].map((m) => m[1]));
    const all = [...hrefs, ...inText];
    expect(all.length).toBeGreaterThanOrEqual(3);
    for (const href of all.filter((h) => h.startsWith("/"))) expect(routeFor(href.replace(/#.*$/, "")), href).toBeDefined();
  });
});
