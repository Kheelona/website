import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import type { Copy } from "@/content/types";
import type { SectionEntry, SectionEntryOf, SectionKind } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import {
  CLAIM_FIXES,
  COPY_FIXES,
  SAFETY_SELLING,
  SAFETY_SELLING_LAYOUT_HIDDEN,
  SAFETY_SELLING_LINES,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupFold } from "../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../test/support/mockup-facts";
import { faqs } from "../faqs";
import { DEFAULT_OG } from "../organization";
import { RETENTION_LINE, RETENTION_MONTHS } from "../policies";
import { routeFor } from "../routes";
import { TRUST_COMPACT, trustItems } from "../trust";
import { safetyPage } from "./safety";

/* The /safety page module (task 5.3; structure §5 row safety.html; safety copy page). Its folds in the approved order,
 * each fold's words, icons, alt texts and links equal to the built mockup (mockup/safety.html, D046), the rules the copy
 * page sets for this page (D020 order and fold 2 in the FAQPage; certification "applied for, not yet granted", no mark;
 * "safe" only inside the two questions parents type; no placeholder, no typed amount), and the shared content it reads
 * by reference (faqs.ts, policies.ts, trust.ts), never retyped. The mockup is read with task 7.1b's copy fixes (V19),
 * task 8b.1's claim fixes (V28; D058: the live team's code check) and task Q2.11's selling update (the D2C plan v2 §4:
 * a button after the four facts, G26's deletion line, the daily limit, every conversation word for word moved here from
 * the product page) applied (test/e2e/support/deviations.ts). */

const token = buildOffer("token");
const full = buildOffer("full");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (copy: Copy) => toPlainText(copy, token);

const mockup = new DOMParser().parseFromString(readRepoFile("mockup/safety.html"), "text/html");
const main = withFacts(
  withFacts(withFacts(mockup.querySelector("main")!, COPY_FIXES.safety.edits), CLAIM_FIXES.safety.edits),
  SAFETY_SELLING.edits,
);
const fold = (labelledBy: string) => {
  const el = main.querySelector(`[aria-labelledby="${labelledBy}"]`);
  if (!el) throw new Error(`mockup/safety.html has no fold labelled by #${labelledBy}`);
  return el;
};

/** A mockup icon (inlined SVG) as its DS name, read from its path data. */
function iconOf(svg: Element | null): IconName | undefined {
  const d = Array.from(svg?.querySelectorAll("path") ?? [])
    .map((p) => p.getAttribute("d"))
    .join("");
  return (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d);
}

/** A mockup trust list's items: icon, title and body. */
const trustOf = (list: Element) =>
  Array.from(list.querySelectorAll(":scope > .kh-trust__item")).map((item) => ({
    icon: iconOf(item.querySelector(".kh-trust__icon svg")),
    title: norm(item.querySelector(".kh-trust__title")?.textContent),
    body: norm(item.querySelector(".kh-trust__body")?.textContent),
  }));

/** A fold's heading as the mockup prints it. */
const headingOf = (el: Element) => ({
  eyebrow: norm(el.querySelector(".kh-eyebrow")?.textContent) || undefined,
  title: norm(el.querySelector(".kh-heading__title")?.textContent),
  lead: norm(el.querySelector(".kh-heading__lead")?.textContent) || undefined,
  id: el.querySelector(".kh-heading__title")?.id,
});

const sections: readonly SectionEntry[] = safetyPage.sections;

/** One fold of the module, by kind and position among that kind. */
function entry<K extends SectionKind>(kind: K, nth = 0): SectionEntryOf<K> {
  const found = sections.filter((e) => e.kind === kind)[nth] as SectionEntryOf<K> | undefined;
  if (!found) throw new Error(`the safety page lists no ${kind} #${nth}`);
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

describe("the safety page: its folds", () => {
  it("lists the folds in order (structure §5 and the D2C plan v2 §4: hero answer, facts, never, every conversation, controls, pair, FAQ, close)", () => {
    expect(sections.map((e) => [e.kind, variantOf(e)])).toEqual([
      ["hero-section", "answer"],
      ["trust-section", "facts"],
      ["trust-section", "never"],
      ["feature-split", "app-screens"],
      ["feature-split", "app-screens"],
      ["feature-split", "pair"],
      ["faq-section", "photo"],
      ["close-section", "split"],
    ]);
  });

  it("names each fold as the mockup does, in the mockup's order", () => {
    const ids = sections.map((e) => {
      const c = e.config as { heading?: { id?: string }; cards?: { heading: { id?: string } }[] };
      return e.kind === "close-section" ? "close-title" : (c.heading?.id ?? c.cards?.map((card) => card.heading.id).join(" "));
    });
    const labelled = Array.from(main.querySelectorAll("[aria-labelledby]"))
      .filter((el) => /^(SECTION|DIV)$/.test(el.tagName) || el.matches("section.kh-card"))
      .map((el) => el.getAttribute("aria-labelledby"));
    expect(ids).toEqual(["hero-title", "facts-title", "never-title", "app-title", "controls-title", "kept-title cert-title", "faq-title", "close-title"]);
    expect(labelled).toEqual(["hero-title", "facts-title", "never-title", "app-title", "controls-title", "kept-title", "cert-title", "faq-title", "close-title"]);
  });
});

describe("fold 1: the answer-first hero", () => {
  const hero = entry("hero-section");
  it("carries the approved H1 (option B, its Hand accent), the eyebrow and the 50-word lead, word for word", () => {
    if (hero.config.variant !== "answer") throw new Error("not an answer hero");
    const { heading } = hero.config;
    expect(heading.title).toBe("Are AI toys safe? Check ours, {hand:fact by fact.}");
    expect({ eyebrow: heading.eyebrow, title: plain(heading.title!), lead: plain(heading.lead!), id: heading.id }).toEqual(
      headingOf(fold("hero-title")),
    );
    expect(plain(heading.lead!)).toMatch(/\b3 to 7\b/);
  });

  it("shows the evening photo, wide and large, with the copy page's alt", () => {
    if (hero.config.variant !== "answer" || hero.config.media?.kind !== "photo") throw new Error("no hero photo");
    const { media } = hero.config;
    expect(media.variant).toBe("wide");
    expect(media.xl).toBe(true);
    expect(media.image.alt).toBe(fold("hero-title").querySelector("figure img")!.getAttribute("alt"));
    expect(media.image.alt).toBe("A girl and her mother on a sofa in the evening lamp light, with Kheelu between them.");
  });
});

describe("fold 2: the four facts (D020 order, in full)", () => {
  const facts = entry("trust-section", 0);
  it("is the #facts band, its four facts the mockup's, in the founder's order, with their icons", () => {
    if (facts.config.variant !== "facts") throw new Error("not the facts fold");
    const el = fold("facts-title");
    expect(facts.config.id).toBe(el.id);
    expect(facts.config.band).toBe(true);
    const { heading } = facts.config;
    expect({ eyebrow: heading.eyebrow, title: plain(heading.title), lead: heading.lead && plain(heading.lead), id: heading.id }).toEqual(headingOf(el));
    expect(heading.title).toBe("Is Kheelu safe for {hand:my child?}");
    expect(facts.config.items.map((i) => ({ icon: i.icon, title: plain(i.title!), body: plain(i.body) }))).toEqual(trustOf(el.querySelector("ol.kh-trust")!));
    expect(facts.config.items.map((i) => plain(i.title!))).toEqual([
      "Is Kheelu always listening?",
      "How does Kheelu understand and answer my child?",
      "Can I read every conversation?",
      "Do you sell my child’s data?",
    ]);
  });

  it("adds each fact to the page's FAQPage (wave-4 close; safety copy, fold 2)", () => {
    expect(facts.faq).toBe(true);
  });

  it("keeps D018's button-and-light answer and D020's providers line verbatim, training clause included", () => {
    if (facts.config.variant !== "facts") throw new Error("not the facts fold");
    const [listening, providers] = facts.config.items.map((i) => plain(i.body));
    expect(listening).toBe(
      "No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after a couple of minutes of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it’s listening.",
    );
    expect(providers).toContain("They don’t keep it, and they never use it to train their AI. Our contracts with them say so.");
  });

  it("shows the tummy unit beside the heading, with the mockup's alt", () => {
    if (facts.config.variant !== "facts") throw new Error("not the facts fold");
    expect(facts.config.photo.alt).toBe(fold("facts-title").querySelector("figure img")!.getAttribute("alt"));
  });

  /* G26 (D065 item 7): "Delete all chats" now deletes the chats from the servers, so the third fact says so in the plan's
     words (v2 §4 fold 2); never "one tap" (the guard's one-tap-delete). */
  it("answers the third fact with G26's line: “Delete all chats” in the app deletes them from our servers", () => {
    if (facts.config.variant !== "facts") throw new Error("not the facts fold");
    const third = plain(facts.config.items[2].body);
    expect(third).toBe(SAFETY_SELLING_LINES.readEvery.now);
    expect(third).toBe(
      "Yes, in the parent app, word for word, a few minutes after each one ends. “Delete all chats” in the app deletes them from our servers.",
    );
    expect(third).not.toMatch(/one tap|deleting your account/i);
  });

  /* The plan v2 §4 fold 2: a worried parent is most convinced here, so the button follows the facts, with the short price
     line and the trust line (task Q2.8's CtaBlock, as on Home), and no help line (closes and the store only, plan §1.1). */
  it("ends with the CTA block: the chilli button tracked `safety-facts`, full width on phones, then the price line and the trust line", () => {
    expect(facts.cta).toEqual({ cta: "safety-facts", block: true, trust: TRUST_COMPACT.map((id) => trustItems[id]) });
    const buttons = Array.from(fold("facts-title").querySelectorAll("[data-ph-capture-attribute-cta]"));
    expect(buttons.map((b) => b.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["safety-facts"]);
  });
});

describe("fold 3: what you won't find", () => {
  const never = entry("trust-section", 1);
  it("lists the six nevers with their icons, the Mark on “won’t”, and the guide link (no tracking value)", () => {
    if (never.config.variant !== "never") throw new Error("not the never fold");
    const el = fold("never-title");
    expect(never.config.heading.title).toBe("What you {mark:won’t} find in Kheelu.");
    expect(headingOf(el)).toMatchObject({ eyebrow: never.config.heading.eyebrow, title: plain(never.config.heading.title), id: never.config.heading.id });
    expect(never.config.items.map((i) => ({ icon: i.icon, title: plain(i.title!), body: plain(i.body) }))).toEqual(trustOf(el.querySelector("ul.kh-trust")!));
    expect(never.config.items).toHaveLength(6);
    expect(never.config.band).toBeFalsy();
    expect(never.faq).toBeUndefined();
    const link = el.querySelector(".kh-section__actions a")!;
    expect(never.config.link).toEqual({ label: norm(link.textContent), href: "/ai-toys-for-kids-in-india" });
    expect(link.getAttribute("href")).toBe("ai-toys-for-kids-in-india.html");
  });

  /* G28 (D065 item 5): the daily talk-time limit is true and live; the CMO's m6 words, since "No endless talking." could
     read as the unconfirmed per-conversation limit. Nobody is said to set it (plan v2 §1.4). */
  it("ends with the daily limit (the clock icon), in the CMO's m6 words, never saying who sets it", () => {
    if (never.config.variant !== "never") throw new Error("not the never fold");
    const last = never.config.items[5];
    expect({ icon: last.icon, title: plain(last.title!), body: plain(last.body) }).toEqual({
      icon: "clock",
      title: "No talking all day.",
      body: "Each Kheelu has a daily limit on how long it talks.",
    });
    expect({ title: plain(last.title!), body: plain(last.body) }).toEqual(SAFETY_SELLING_LINES.dailyLimit);
    expect(plain(last.body)).not.toMatch(/\byou\b|\bset|parent|conversation/i);
  });
});

describe("fold 4: every conversation, word for word (from the product page)", () => {
  const app = entry("feature-split", 0);
  const config = () => {
    if (app.config.variant !== "app-screens") throw new Error("not the app-screens fold");
    return app.config;
  };

  it("carries the product page's eyebrow, heading (its Hand accent) and lead, word for word, on the band", () => {
    const { heading, band } = config();
    expect({ eyebrow: heading.eyebrow, title: plain(heading.title), lead: heading.lead && plain(heading.lead), id: heading.id }).toEqual(
      headingOf(fold("app-title")),
    );
    expect(heading).toEqual({
      id: "app-title",
      eyebrow: SAFETY_SELLING_LINES.app.eyebrow,
      title: "Every conversation, {hand:word for word.}",
      lead: SAFETY_SELLING_LINES.app.lead,
    });
    expect(band).toBe(true);
  });

  it("shows the transcript and activity screens side by side (AppScreens `product`), with their alts and the app's caption", () => {
    const { placement, screens } = config();
    expect(placement).toBe("product");
    expect(screens.images.map((i) => i.alt)).toEqual(
      Array.from(fold("app-title").querySelectorAll(".kh-device img")).map((img) => img.getAttribute("alt")),
    );
    expect(screens.images.map((i) => i.alt)).toEqual([SAFETY_SELLING_LINES.app.transcriptAlt, SAFETY_SELLING_LINES.app.activityAlt]);
    expect(screens.images.map((i) => (typeof i.src === "string" ? i.src : i.src.src))).toEqual([
      expect.stringContaining("app-transcript"),
      expect.stringContaining("app-activity"),
    ]);
    expect(plain(screens.caption!)).toBe(norm(fold("app-title").querySelector("figcaption")?.textContent));
    expect(plain(screens.caption!)).toBe(SAFETY_SELLING_LINES.app.caption);
  });

  /* The plan v2 §4 fold 4's duplicates of this page: the product page's four safety items (fold 2 says them), its facts
     line (fold 3 says each), its "See what we keep" link (fold 6 is on this page) and the Kheelona+ note (selling copy,
     on the offer cards). */
  it("drops what the page already says: no Kheelona+ note, no skills, no list, no link, no fragment of its own", () => {
    const c = config();
    expect(c.note).toBeUndefined();
    expect(c.skills).toBeUndefined();
    expect(c.items).toBeUndefined();
    expect(c.link).toBeUndefined();
    expect(c.id).toBeUndefined();
    expect(fold("app-title").querySelector(".kh-section__actions")).toBeNull();
  });
});

describe("fold 5: the grown-up holds the keys", () => {
  const controls = entry("feature-split", 1);
  it("lists the three controls with their icons (D058: no topics or quiet hours; the Save voice recordings switch) beside the one privacy screen, without the caption (moved to fold 4) or the link to the product page's app fold (gone)", () => {
    if (controls.config.variant !== "app-screens") throw new Error("not the app-screens fold");
    const el = fold("controls-title");
    const { config } = controls;
    expect(config.placement).toBe("safety");
    expect(config.band).toBe(true);
    expect({ eyebrow: config.heading.eyebrow, title: plain(config.heading.title), lead: config.heading.lead && plain(config.heading.lead), id: config.heading.id }).toEqual(
      headingOf(el),
    );
    expect(config.heading.title).toBe("The grown-up holds {hand:the keys.}");
    expect((config.items ?? []).map((i) => ({ icon: i.icon, title: plain(i.title!), body: plain(i.body) }))).toEqual(trustOf(el.querySelector("ul.kh-trust")!));
    expect((config.items ?? []).map((i) => [i.icon, plain(i.title!)])).toEqual([
      ["sliders-horizontal", "Your child’s age."],
      ["translate", "Languages."],
      ["microphone-slash", "Voice recordings."],
    ]);
    expect(config.screens.images).toHaveLength(1);
    expect(config.screens.images[0].alt).toBe(el.querySelector(".kh-device img")!.getAttribute("alt"));
    expect(config.screens.images[0].alt).toContain(`${RETENTION_MONTHS} months`);
    /* G26 (D065 item 7): "Delete all chats" deletes from the servers now, so the alt names the button again (plan v2 §4
       fold 5). */
    expect(config.screens.images[0].alt).toBe(
      `A real screen from the Kheelu parent app: the privacy centre. Chats are kept for ${RETENTION_MONTHS} months, with a switch to save voice recordings and buttons to download your child’s data and to delete all chats.`,
    );
    expect(config.screens.caption).toBeUndefined();
    expect(el.querySelector("figcaption")).toBeNull();
    expect(config.link).toBeUndefined();
    expect(el.querySelector(".kh-section__actions")).toBeNull();
  });
});

describe("fold 6: retention and certification", () => {
  const pair = entry("feature-split", 2);
  const cards = () => {
    if (pair.config.variant !== "pair") throw new Error("not the pair fold");
    return pair.config.cards;
  };

  it("prints each card's words as the mockup does", () => {
    for (const card of cards()) {
      const el = fold(card.heading.id!);
      expect({ eyebrow: card.heading.eyebrow, title: plain(card.heading.title), id: card.heading.id }).toEqual({
        eyebrow: headingOf(el).eyebrow,
        title: headingOf(el).title,
        id: headingOf(el).id,
      });
      expect(card.copy.map(plain)).toEqual(Array.from(el.querySelectorAll(":scope > p")).map((p) => norm(p.textContent)));
    }
  });

  /* The single-chat sentence comes off: "Delete all chats" now deletes from the servers (fold 2), and what removing one
     chat does since the app changed is not on file (plan v2 §4 fold 6, §14). */
  it("reads the retention line from policies.ts (D020's first sentence), then what deleting the account does (D058), beside the memory line, then links the privacy policy", () => {
    const [kept] = cards();
    expect(kept.copy[0]).toBe(RETENTION_LINE);
    expect(plain(kept.copy[1])).toBe("Deleting your account deletes your child’s profile, conversations and recordings from our servers.");
    expect(kept.copy.map(plain).join(" ")).not.toMatch(/Removing a chat|hides it on that phone/);
    expect(plain(kept.copy[2])).toBe("Kheelu remembers earlier conversations with your child, and you can read every one of them.");
    expect(kept.link).toEqual({ label: "Read our privacy policy", href: "/privacy" });
  });

  it("says certification is applied for, not yet granted: no mark, no badge, no standard, no date (claims §6, BIS-02)", () => {
    const [, cert] = cards();
    const text = cert.copy.map(plain).join(" ");
    expect(text).toBe(
      "We have applied for Kheelu’s BIS licence for toy safety. It has not been granted yet, so no toy-safety certificate has been issued to us so far. Until one is, you won’t see a mark or a badge from us.",
    );
    expect(text).not.toMatch(/\bISI\b|\bIS\s?\d|\bcertified\b|before Kheelu ships|\b20\d\d\b/i);
    expect(cert.link).toBeUndefined();
  });
});

describe("fold 7: questions parents ask", () => {
  const faq = entry("faq-section");
  it("shows the two safety answers from faqs.ts (never retyped), the first open, on the band with the whisper photo", () => {
    if (faq.config.variant !== "photo") throw new Error("not the photo FAQ");
    const { config } = faq;
    expect(config.items).toEqual([faqs["age-three"], faqs["child-safety-groups"]]);
    expect(config.items[0]).toBe(faqs["age-three"]);
    expect(config.items[1]).toBe(faqs["child-safety-groups"]);
    expect(config.firstOpen).toBe(true);
    expect(config.band).toBe(true);
    const el = fold("faq-title");
    expect({ eyebrow: config.heading.eyebrow, title: plain(config.heading.title), id: config.heading.id }).toMatchObject({
      eyebrow: headingOf(el).eyebrow,
      title: headingOf(el).title,
      id: headingOf(el).id,
    });
    expect(config.heading.title).toBe("Questions parents {hand:ask.}");
    expect(config.photo.variant).toBe("wide");
    expect(config.photo.image.alt).toBe(el.querySelector("figure img")!.getAttribute("alt"));
  });

  it("names its markers “Source” and lists the two Common Sense Media sources as the mockup prints them", () => {
    if (faq.config.variant !== "photo") throw new Error("not the photo FAQ");
    expect(faq.config.sourceMarker).toBe("Source");
    const notes = faq.notes!;
    expect(notes.variant).toBe("inline");
    expect(notes.label).toBe("Sources");
    const printed = Array.from(fold("faq-title").querySelectorAll("[id^=src-]")).map((p) => ({
      text: norm(p.textContent),
      href: p.querySelector("a")!.getAttribute("href"),
    }));
    expect(notes.sources.map((s) => s.href)).toEqual(printed.map((p) => p.href));
    notes.sources.forEach((source, i) => expect(printed[i].text).toContain(norm(plain(source.citation))));
  });

  it("closes with the guide link (no tracking value)", () => {
    if (faq.config.variant !== "photo") throw new Error("not the photo FAQ");
    const link = fold("faq-title").querySelector(".kh-section__actions a")!;
    expect(faq.config.more).toEqual({ label: norm(link.textContent), href: "/ai-toys-for-kids-in-india" });
  });
});

describe("fold 8: the close", () => {
  const close = entry("close-section");
  it("carries the one chilli button (finale, arrow, full width on phones), the compact trust pair and the help line", () => {
    if (close.config.variant !== "split") throw new Error("not the split close");
    const { config } = close;
    expect(config.cta).toEqual({ cta: "finale", arrow: true, block: true, trust: TRUST_COMPACT.map((id) => trustItems[id]), helpLine: true });
    const el = fold("close-title");
    expect({ eyebrow: config.heading.eyebrow, title: plain(config.heading.title), lead: plain(config.heading.lead!) }).toEqual({
      eyebrow: headingOf(el).eyebrow,
      title: headingOf(el).title,
      lead: headingOf(el).lead,
    });
    expect(config.heading.title).toBe("Check it all for yourself, {hand:at home.}");
  });

  it("places the art board's layers as the mockup does: the star, Ira, Kheelu tilted, the chalk heart (it draws)", () => {
    if (close.config.variant !== "split") throw new Error("not the split close");
    const board = fold("close-title").querySelector(".kh-art")!;
    const { art } = close.config;
    expect(close.config.artClamp).toBe(true);
    expect(art.tone).toBe("blue");
    expect(board.classList.contains(`kh-tone-${art.tone}`)).toBe(true);
    expect(art.label).toBe(board.getAttribute("aria-label"));
    const style = (el: Element) => {
      const s = el.getAttribute("style") ?? "";
      const num = (prop: string) => {
        const m = new RegExp(`(?:^|;)\\s*${prop}:\\s*(-?[\\d.]+)%`).exec(s);
        return m ? Number(m[1]) : undefined;
      };
      const rotate = /rotate\((-?[\d.]+)deg\)/.exec(s);
      return { left: num("left"), width: num("width"), top: num("top"), bottom: num("bottom"), rotate: rotate ? Number(rotate[1]) : undefined };
    };
    const expected = Array.from(board.querySelectorAll(".kh-art__layer")).map(style);
    const actual = art.layers.map(({ left, width, top, bottom, rotate }) => ({ left, width, top, bottom, rotate }));
    expect(actual).toEqual(expected);
    expect(art.layers.map((l) => (l.doodle ? `doodle:${l.doodle.name}` : "image"))).toEqual(["image", "image", "image", "doodle:chalk-heart"]);
    expect(art.layers.every((l) => l.doodle !== undefined || l.image.alt === "")).toBe(true);
  });
});

describe("the safety page: page-wide rules", () => {
  it("has the copy page's title and description, and the default share card", () => {
    expect(plain(safetyPage.meta.title)).toBe("Are AI toys safe? How Kheelu works · Kheelona");
    expect(plain(safetyPage.meta.description)).toBe(
      "Are AI toys safe? Check Kheelu: its mic turns on only when someone presses its button, no camera, no internet browsing, and you read every conversation.",
    );
    expect(safetyPage.meta.og).toBe(DEFAULT_OG);
  });

  it("says “safe” only inside the two questions parents type (copy page; messaging, words to stop using)", () => {
    const sentences = strings(safetyPage).flatMap((s) => [toPlainText(s, token), toPlainText(s, full)]);
    const hits = sentences.filter((s) => /\bsafe\b/i.test(s));
    expect(hits.length).toBeGreaterThan(0);
    for (const s of hits) {
      expect(s.replace(/Are AI toys safe\?|Is Kheelu safe for my child\?/g, ""), s).not.toMatch(/\bsafe\b/i);
    }
  });

  /* Equal values cannot tell a read from a retyped copy, which would go stale the day the shared module changes; the
   * source can. The trust pair's delivery label is the {delivery} token, so only its typed labels are listed. */
  it("reads the shared words by reference: no retention line, FAQ question or answer, or trust label typed in its source", () => {
    const source = readRepoFile("src/content/en-IN/pages/safety.ts");
    const shared = [
      RETENTION_LINE,
      ...[faqs["age-three"], faqs["child-safety-groups"]].flatMap((f) => [f.question, f.answer]),
      ...TRUST_COMPACT.map((id) => trustItems[id].label).filter((label) => !label.startsWith("{")),
    ];
    expect(shared.length).toBeGreaterThanOrEqual(6);
    for (const text of shared) expect(source, text).not.toContain(text);
    expect(source).toMatch(/\bRETENTION_LINE\b/);
    expect(source).toMatch(/\bfaqs\["age-three"\], faqs\["child-safety-groups"\]/);
  });

  /* The plan v2 §1.4 and §13: G28's other half (Wi-Fi off at rest; a conversation that cannot run on without end) is not
     confirmed, the pre-launch test gets no new use, "one tap" never comes back (D058 item 1), nobody is said to set the
     daily limit (D065 item 5), and no "incl. GST" on a selling page (D065 item 3). The page's own words: fold 7's shared
     answers (faqs.ts) keep the pre-launch-test sentence where it was already built (§13 item 3). */
  it("says nothing the selling update keeps out: Wi‑Fi at rest, a per-conversation limit, a new pre-launch-test line, one tap, who sets the limit, GST", () => {
    const own = [safetyPage.meta, ...sections.filter((e) => e.kind !== "faq-section")];
    const all = strings(own)
      .flatMap((s) => [toPlainText(s, token), toPlainText(s, full)])
      .join("\n");
    expect(all).toContain("No talking all day.");
    expect(all).not.toMatch(/Wi[‑-]Fi|run on without end|endless|Before launch|tested before|one tap|\bGST\b/i);
    expect(all).not.toMatch(/(?:you|parents?) (?:can )?set (?:a |the )?(?:daily )?limit/i);
  });

  it("names no amount, no placeholder and none of the retired safety lines (copy page, live page changes)", () => {
    const all = strings(safetyPage).join("\n");
    expect(all).not.toMatch(/₹|\{price:|\{ph:|\[PLACEHOLDER/);
    expect(all).not.toMatch(/Region-pinned|Parent-consented|Nothing leaves without consent|COPPA|GDPR|ISO 27001|Designed for|toddler|on-device and cloud/i);
  });

  it("links only planned routes of the site (internal links resolve)", () => {
    const hrefs = strings(safetyPage)
      .flatMap((s) => [...s.matchAll(/\]\((\/[^)]*)\)/g)].map((m) => m[1]))
      .concat(
        sections.flatMap((e) => {
          const c = e.config as { link?: { href: string }; more?: { href: string }; cards?: { link?: { href: string } }[] };
          return [c.link?.href, c.more?.href, ...(c.cards ?? []).map((card) => card.link?.href)].filter((h): h is string => h !== undefined);
        }),
      );
    /* The guide (twice) and the privacy policy; the controls' link to the product page's app fold went with task Q2.11. */
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of hrefs.filter((h) => h.startsWith("/"))) {
      expect(routeFor(href.replace(/#.*$/, "")), href).toBeDefined();
    }
  });
});

/* Task Q2.11's selling update as a parity deviation (test/e2e/support/deviations.ts SAFETY_SELLING): applied after the
 * page's earlier rules (task 7.1b's copy fixes, task 8b.1's claim fixes), its edits change exactly the sentences it
 * lists, its text rule excuses and accepts exactly those, its pixel hides each find one block holding a changed sentence
 * (or, for the blocks it moves without rewording, one block on its side), and none of its lines says a claim D058
 * withdrew. The route's test holds the build to the edited mockup, markup and words alike. */
describe("the selling update (task Q2.11) as a parity deviation", () => {
  const base = withFacts(withFacts(mockupFold("safety", "main"), COPY_FIXES.safety.edits), CLAIM_FIXES.safety.edits);
  const once = (lines: readonly string[]) => [...new Set(lines)];
  const rules = () => TEXT_DEVIATIONS.safety.filter((r) => r.approvedBy === SAFETY_SELLING.approvedBy);

  it("lists exactly the sentences its edits change, against the mockup with the claim fixes applied", () => {
    expect(factSentences(base, SAFETY_SELLING.edits)).toEqual({ missing: [...SAFETY_SELLING.mockup], extra: [...SAFETY_SELLING.build] });
  });

  it("is one text rule of the page, before the claim fixes, which excuses and accepts exactly those sentences", () => {
    expect(rules()).toHaveLength(1);
    const order = TEXT_DEVIATIONS.safety.map((r) => r.approvedBy);
    expect(order.indexOf(SAFETY_SELLING.approvedBy)).toBeLessThan(order.indexOf(CLAIM_FIXES.safety.approvedBy));
    expect(ruleReach(base, SAFETY_SELLING.edits, rules()[0])).toEqual({ excused: once(SAFETY_SELLING.mockup), accepted: once(SAFETY_SELLING.build) });
    expect(rules()[0].jsOff).toBeUndefined();
  });

  it("hides for the pixels the blocks it lists, each found once on its side and holding a sentence it changes, in VISUAL_HIDDEN in its order", () => {
    expect(hiddenProblems(base, SAFETY_SELLING)).toEqual([]);
    const mine = VISUAL_HIDDEN.safety.filter((r) => r.approvedBy === SAFETY_SELLING.approvedBy);
    const sel = (side: string) => mine.filter((r) => r.side === side).map((r) => r.selector);
    const layout = (side: string) => SAFETY_SELLING_LAYOUT_HIDDEN.filter((r) => r.side === side).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...SAFETY_SELLING.hidden.both, ...SAFETY_SELLING.hidden.mockup, ...layout("mockup")]);
    expect(sel("build")).toEqual([...SAFETY_SELLING.hidden.both, ...SAFETY_SELLING.hidden.build, ...layout("build")]);
  });

  it("finds each moved block it hides once in the approved mockup: the five-item “never” list and the controls' caption", () => {
    const frozen = mockup.querySelector("main")!;
    for (const rule of SAFETY_SELLING_LAYOUT_HIDDEN.filter((r) => r.side === "mockup")) {
      expect(frozen.querySelectorAll(rule.selector).length, rule.selector).toBe(1);
    }
    expect(frozen.querySelectorAll('section[aria-labelledby="never-title"] .kh-trust__item')).toHaveLength(5);
    expect(norm(frozen.querySelector('section[aria-labelledby="controls-title"] figcaption')?.textContent)).toBe(SAFETY_SELLING_LINES.app.caption);
  });

  it("says none of the claims D058 withdrew, and names the founder's decisions and the plan as its approval", () => {
    for (const line of SAFETY_SELLING.build) {
      expect(line).not.toMatch(/one tap|servers in India|keep none|closed (?:content )?library|curated|age-graded|safety layer|quiet hours|about a minute|open internet/);
    }
    expect(SAFETY_SELLING.approvedBy).toMatch(/^D064 item 2, D065 items 5 and 7 and the D2C plan v2 §4 \(founder, 2026-10-15; .*task Q2\.11/);
  });
});
