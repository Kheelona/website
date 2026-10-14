import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import type { Copy } from "@/content/types";
import type { SectionEntry, SectionEntryOf, SectionKind } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { CLAIM_FIXES, COPY_FIXES } from "../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { withFacts } from "../../../../test/support/mockup-facts";
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
 * by reference (faqs.ts, policies.ts, trust.ts), never retyped. The mockup is read with task 7.1b's copy fixes (V19)
 * and task 8b.1's claim fixes (V28; D058: the live team's code check) applied (test/e2e/support/deviations.ts). */

const token = buildOffer("token");
const full = buildOffer("full");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (copy: Copy) => toPlainText(copy, token);

const mockup = new DOMParser().parseFromString(readRepoFile("mockup/safety.html"), "text/html");
const main = withFacts(withFacts(mockup.querySelector("main")!, COPY_FIXES.safety.edits), CLAIM_FIXES.safety.edits);
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
  it("lists the approved folds in order (structure §5: hero answer, facts, never, app screens, pair, FAQ, close)", () => {
    expect(sections.map((e) => [e.kind, variantOf(e)])).toEqual([
      ["hero-section", "answer"],
      ["trust-section", "facts"],
      ["trust-section", "never"],
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
    expect(ids).toEqual(["hero-title", "facts-title", "never-title", "controls-title", "kept-title cert-title", "faq-title", "close-title"]);
    expect(labelled).toEqual(["hero-title", "facts-title", "never-title", "controls-title", "kept-title", "cert-title", "faq-title", "close-title"]);
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
});

describe("fold 3: what you won't find", () => {
  const never = entry("trust-section", 1);
  it("lists the five nevers with their icons, the Mark on “won’t”, and the guide link (no tracking value)", () => {
    if (never.config.variant !== "never") throw new Error("not the never fold");
    const el = fold("never-title");
    expect(never.config.heading.title).toBe("What you {mark:won’t} find in Kheelu.");
    expect(headingOf(el)).toMatchObject({ eyebrow: never.config.heading.eyebrow, title: plain(never.config.heading.title), id: never.config.heading.id });
    expect(never.config.items.map((i) => ({ icon: i.icon, title: plain(i.title!), body: plain(i.body) }))).toEqual(trustOf(el.querySelector("ul.kh-trust")!));
    expect(never.config.band).toBeFalsy();
    expect(never.faq).toBeUndefined();
    const link = el.querySelector(".kh-section__actions a")!;
    expect(never.config.link).toEqual({ label: norm(link.textContent), href: "/ai-toys-for-kids-in-india" });
    expect(link.getAttribute("href")).toBe("ai-toys-for-kids-in-india.html");
  });
});

describe("fold 4: the grown-up holds the keys", () => {
  const controls = entry("feature-split", 0);
  it("lists the three controls with their icons (D058: no topics or quiet hours; the Save voice recordings switch) beside the one privacy screen, then the secondary link to the app fold", () => {
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
    /* The "delete all chats" button hides chats on that phone, so the alt no longer names it (D058 item 1; task 8b.1b). */
    expect(config.screens.images[0].alt).not.toMatch(/delete all chats/);
    expect(plain(config.screens.caption!)).toBe(norm(el.querySelector("figcaption")?.textContent));
    const link = el.querySelector(".kh-section__actions a")!;
    expect(link.getAttribute("href")).toBe("meet-kheelu.html#app");
    expect(config.link).toEqual({ label: norm(link.textContent), href: "/products/kheelu#app", icon: iconOf(link.querySelector("svg")) });
  });
});

describe("folds 5 and 6: retention and certification", () => {
  const pair = entry("feature-split", 1);
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

  it("reads the retention line from policies.ts (D020's first sentence), then what removing and deleting do (D058), beside the memory line, then links the privacy policy", () => {
    const [kept] = cards();
    expect(kept.copy[0]).toBe(RETENTION_LINE);
    expect(plain(kept.copy[1])).toBe(
      "Removing a chat in the app hides it on that phone. Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
    );
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
    expect(hrefs.length).toBeGreaterThanOrEqual(4);
    for (const href of hrefs.filter((h) => h.startsWith("/"))) {
      expect(routeFor(href.replace(/#.*$/, "")), href).toBeDefined();
    }
  });
});
