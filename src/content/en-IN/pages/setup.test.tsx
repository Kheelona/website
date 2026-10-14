import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import type { OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import type { SectionEntry } from "@/layouts/sections-registry";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { COPY_FIXES, SETUP_STEP_BUILD, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { APP_STORE, GOOGLE_PLAY, PAGE_FACTS, type FactEdit } from "../../../../test/e2e/support/page-facts";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupFold, mockupRoute, skeleton, words } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";
import { DEFAULT_OG } from "../organization";
import { routeFor } from "../routes";
import { seller } from "../seller";
import { setupPage } from "./setup";

/*
 * Setup `/setup` (task 5.8; structure §5 setup row, as corrected after the 4.1 review; architecture §9.2; tasks.md SPA):
 * the page is its content module, rendered by PageTemplate, and it prints what the approved mockup prints
 * (mockup/setup.html, the built Gate A page, D046): seven folds in order, word for word, with the mockup's links,
 * pictures, icons and tones, no chilli button (setup.md question 4, CMO view: as built), and the HowTo of its four
 * steps (architecture §9.2).
 *
 * The approved differences from the mockup, and only these. Step 2's light names no colour (deviation V8: the app's own
 * screen bracketed it, CMO review M-S1, and the founder has not confirmed one, D055 item 25). The founder's page facts
 * (task 6.7; test/e2e/support/page-facts.ts): the charger's F4 slot hidden until its value arrives (D055 item 27, D054
 * item 19), the parent app named and linked on both stores (item 26), and the wake-up button's place, the button on
 * Kheelu's back that step 2 holds (item 25). Fold 4's age-3 line in the site's one wording (task 7.1b, CMO review A M8;
 * deviation V20; test/e2e/support/deviations.ts COPY_FIXES.setup). APPROVED below is the mockup with exactly those
 * applied; every comparison runs against it, and one test pins that it differs from the mockup there alone. The activity screenshot is the D044
 * round-2 file (task 1.5b: no "Games"); the alt and the caption are the mockup's.
 */

const MOCKUP = mockupFold("setup", "main");

/** Step 2: the mockup's title, the founder's (D055 item 25), and its light without a colour (V8). */
const STEP_2 = { title: "Press and hold the button on Kheelu’s back.", body: SETUP_STEP_BUILD[0] };
const V8: FactEdit = { at: ".kh-step__body", was: "Hold it for 3 seconds, until the light starts pulsing blue.", now: STEP_2.body, inner: true };

/** The approved page: the mockup's <main> with V8, the founder's page facts and task 7.1b's age line applied. */
const APPROVED = withFacts(MOCKUP, [...PAGE_FACTS.setup.edits, V8, ...COPY_FIXES.setup.edits]);

const LABELS = ["hero-title", "before-title", "connect-title", "age-title", "button-title", "talk-title", "help-title"];

function rendered(mode: OfferMode) {
  const main = renderToStaticMarkup(<PageTemplate page={setupPage} offer={buildOffer(mode)} path="/setup" />);
  const html = `<!doctype html><html><body><main id="main">${main}</main></body></html>`;
  return { html, doc: new DOMParser().parseFromString(html, "text/html") };
}

const TOKEN = rendered("token");
const FULL = rendered("full");
const BUILT = TOKEN.doc.querySelector("main")!;

const folds = (main: Element) => [...main.children].filter((el) => el.tagName === "SECTION");
const fold = (main: Element, label: string) => folds(main).find((el) => el.getAttribute("aria-labelledby") === label)!;
const each = (label: string) => ({ built: fold(BUILT, label), approved: fold(APPROVED, label) });

const all = (el: Element, selector: string) => [...el.querySelectorAll(selector)];
const hrefs = (el: Element) => all(el, "a[href]").map((a) => a.getAttribute("href")!);
const pictureWords = (el: Element) =>
  all(el, 'img, [role="img"]').flatMap((p) => (p.getAttribute("role") === "img" ? [`label: ${p.getAttribute("aria-label")}`] : p.getAttribute("alt") ? [`alt: ${p.getAttribute("alt")}`] : []));
const icons = (el: Element) => all(el, "svg path").map((p) => p.getAttribute("d"));
const tones = (el: Element) =>
  [el, ...all(el, "*")].flatMap((e) => [...e.classList].filter((c) => /^kh-tone-|^kh-card--tint$|^kh-section--band$/.test(c)));

/* What the build names otherwise than the mockup, each documented by the section that ports it: the words-only hero
 * (HeroSection test), the four-step layout (StepLoop's own variant, StepsSection test), the setup paragraphs' shared
 * block (FeatureSplit, components §2), and the list reset TrustList adds. */
const SKELETON = {
  rename: { "setup-hero": "ks-hero-words", "steps-4": "ks-steps--four", "setup-copy": "ks-feature-copy" },
  drop: /^ks-list-reset$/,
};

const sections: readonly SectionEntry[] = setupPage.sections;
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

describe("Setup: the folds of the approved page", () => {
  it("lists the folds in the corrected structure §5 order: hero answer, ticks with the Wi-Fi tip, four steps, three photo splits, the links close", () => {
    expect(sections.map((e) => [e.kind, variantOf(e)])).toEqual([
      ["hero-section", "answer"],
      ["feature-split", "ticks"],
      ["steps-section", "four"],
      ["feature-split", "photo"],
      ["feature-split", "photo"],
      ["feature-split", "photo"],
      ["close-section", "links"],
    ]);
  });

  it("names each fold by its heading as the mockup does, with the mockup's anchors", () => {
    expect(folds(MOCKUP).map((f) => f.getAttribute("aria-labelledby"))).toEqual(LABELS);
    expect(folds(BUILT).map((f) => f.getAttribute("aria-labelledby"))).toEqual(LABELS);
    expect(folds(BUILT).map((f) => f.id || null)).toEqual(folds(MOCKUP).map((f) => f.id || null));
  });

  it("differs from the mockup only in fold 2's first and last items, step 2's light, fold 4's age line and fold 5's button line", () => {
    const step = (main: Element) => main.querySelector("#connect .kh-step:nth-child(2)")!;
    expect(words(step(MOCKUP))).toBe("2 Press and hold the button on Kheelu’s back. Hold it for 3 seconds, until the light starts pulsing blue.");
    expect(words(step(BUILT))).toBe(`2 ${STEP_2.title} ${STEP_2.body}`);
    const items = (main: Element) => all(fold(main, "before-title"), "li").map((li) => words(li));
    expect(items(BUILT)).toEqual([
      "Charge Kheelu with the charger in the box.",
      "Have your home Wi‑Fi password ready.",
      "Stay close to your Wi‑Fi router.",
      "Keep your phone with you, with the parent app installed. It’s called the Kheelona app: get it on the App Store for iPhone, or on Google Play for Android.",
    ]);
    expect(items(MOCKUP).slice(1, 3)).toEqual(items(BUILT).slice(1, 3));
    const ageLine = (main: Element) => words(all(fold(main, "age-title"), "p")[2]);
    expect(ageLine(MOCKUP)).toBe(`Kheelu is made for children aged 3 to 7. ${COPY_FIXES.setup.mockup[0]}`);
    expect(ageLine(BUILT)).toBe(`Kheelu is made for children aged 3 to 7. ${COPY_FIXES.setup.build[0]}`);
    const rest = (main: Element) => {
      const copy = main.cloneNode(true) as Element;
      const gone = '#connect .kh-step:nth-child(2), [aria-labelledby="before-title"] li, [aria-labelledby="button-title"] p:first-of-type, [aria-labelledby="age-title"] p:nth-of-type(3)';
      for (const el of copy.querySelectorAll(gone)) el.remove();
      return words(copy);
    };
    expect(rest(APPROVED)).toBe(rest(MOCKUP));
    expect(words(APPROVED)).not.toBe(words(MOCKUP));
  });

  it.each(LABELS)("%s says word for word what the approved page says", (label) => {
    const { built, approved } = each(label);
    expect(words(built)).toBe(words(approved));
  });

  it.each(LABELS)("%s draws the mockup's icons, tones and pictures (and the pictures' words)", (label) => {
    const { built, approved } = each(label);
    expect(icons(built)).toEqual(icons(approved));
    expect(tones(built)).toEqual(tones(approved));
    expect(pictureWords(built)).toEqual(pictureWords(approved));
  });

  it.each(LABELS)("%s links where the mockup links", (label) => {
    const { built, approved } = each(label);
    expect(hrefs(built)).toEqual(hrefs(approved).map(mockupRoute));
  });

  it.each(LABELS)("%s has the mockup's markup: tags, classes, ARIA, ids and addresses (SCA 1)", (label) => {
    const { built, approved } = each(label);
    expect(skeleton(built, SKELETON)).toBe(skeleton(approved, SKELETON));
  });

  it("moves nothing on arrival, as the mockup marks no reveal, and no money ever (SPA 9)", () => {
    expect(all(MOCKUP, "[data-reveal]")).toHaveLength(0);
    expect(all(BUILT, "[data-reveal], [data-draw]")).toHaveLength(0);
    expect(revealOnMoneyInDocument(TOKEN.doc)).toEqual([]);
  });
});

describe("Setup: the hero and the first screen", () => {
  it("is the page's one h1, the copy page's option A, with the Hand accent on “day one.”", () => {
    const h1 = all(BUILT, "h1");
    expect(h1).toHaveLength(1);
    expect(words(h1[0])).toBe("How to set up Kheelu on day one.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("day one.");
  });

  it("answers first: the lead is the 47-word day-one answer, with no image in the hero", () => {
    const hero = fold(BUILT, "hero-title");
    const lead = words(hero.querySelector(".kh-heading__lead")!);
    expect(lead.split(" ")).toHaveLength(47);
    expect(lead.startsWith("Charge Kheelu, then open the parent app on your phone.")).toBe(true);
    expect(all(hero, "img")).toHaveLength(0);
  });

  it("orders its headings without a skipped level: the h1, each fold's h2, the steps' h3 (SPA 5)", () => {
    const levels = all(BUILT, "h1, h2, h3, h4, h5, h6").map((h) => Number(h.tagName[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => expect(level).toBeLessThanOrEqual((levels[i - 1] ?? 0) + 1));
    expect(all(BUILT, "h1, h2, h3").map((h) => h.tagName)).toEqual(all(APPROVED, "h1, h2, h3").map((h) => h.tagName));
  });
});

describe("Setup: no chilli button and no buy bar (setup.md question 4; CMO view: as built)", () => {
  it("has no pre-order button and no tracking value anywhere in its folds (the nav and drawer carry theirs)", () => {
    expect(all(BUILT, ".kh-btn--cta")).toHaveLength(0);
    expect(all(BUILT, "[data-ph-capture-attribute-cta]")).toHaveLength(0);
    // No link to the Kheelona store (the parent app's Google Play listing lives under play.google.com/store/).
    expect(all(BUILT, '[href*="store.kheelona.com"]')).toHaveLength(0);
  });

  it("is not a page of the phone buy bar (mockup meta buybar: false)", () => {
    expect(stickyBarPaths()).not.toContain("/setup");
  });

  it("names no amount, in either mode, and changes no word with the offer", () => {
    for (const { doc } of [TOKEN, FULL]) expect(doc.querySelector("main")!.textContent).not.toMatch(/₹/);
    expect(strings(setupPage).join("\n")).not.toMatch(/₹|\{price:/);
    expect(words(FULL.doc.querySelector("main")!)).toBe(words(BUILT));
  });

  it("closes on “Stuck? We’ll help.”: the contact line, the secondary button to /contact, the link to Meet Kheelu", () => {
    const help = fold(BUILT, "help-title");
    expect(help.id).toBe("help");
    const button = help.querySelector(".kh-section__actions a")!;
    expect(button.className).toBe("kh-btn kh-btn--secondary");
    expect(button.getAttribute("href")).toBe("/contact");
    expect(button.querySelector("svg path")?.getAttribute("d")).toBe(ICON_PATHS["chat-circle-dots"]);
    expect(hrefs(help)).toEqual([seller.support.whatsapp, seller.support.tel, `mailto:${seller.support.email}`, "/contact", "/products/kheelu"]);
  });
});

describe("Setup: the steps and their HowTo (architecture §9.2)", () => {
  const steps = () => all(fold(BUILT, "connect-title"), ".kh-step");

  it("shows four steps under the #connect anchor, in the mockup's tones", () => {
    expect(steps()).toHaveLength(4);
    expect(steps().map((li) => [...li.classList].find((c) => c.startsWith("kh-tone-")))).toEqual(["kh-tone-sun", "kh-tone-blue", "kh-tone-chilli", "kh-tone-sun"]);
  });

  it("names the setup button's place, the founder's (D055 item 25), and no colour for its light (V8)", () => {
    const step2 = steps()[1];
    expect(words(step2.querySelector(".kh-step__title")!)).toBe("Press and hold the button on Kheelu’s back.");
    expect(words(step2.querySelector(".kh-step__body")!)).toBe("Hold it for 3 seconds, until its light starts pulsing.");
    expect(step2.querySelector(".ks-placeholder")).toBeNull();
    expect(words(BUILT)).not.toMatch(/\bblue\b/i);
  });

  it.each(["token", "full"] as const)("is one HowTo of exactly the four visible steps, anchored to #connect, and no FAQPage (%s mode)", (mode) => {
    const { html, doc } = mode === "token" ? TOKEN : FULL;
    type HowTo = { "@type": string; name: string; url: string; step: { "@type": string; position: number; name: string; text: string; url: string }[] };
    const graphs = jsonLdBlocks(html) as { "@graph": HowTo[] }[];
    expect(graphs).toHaveLength(1);
    expect(graphs[0]["@graph"].map((n) => n["@type"])).toEqual(["HowTo"]);
    const [howTo] = graphs[0]["@graph"];
    const main = doc.querySelector("main")!;
    expect(howTo.name).toBe(words(fold(main, "connect-title").querySelector("h2")!));
    expect(howTo.url).toBe("https://kheelona.com/setup");
    const visible = all(fold(main, "connect-title"), ".kh-step").map((li) => ({
      name: words(li.querySelector(".kh-step__title")!),
      text: words(li.querySelector(".kh-step__body")!),
    }));
    expect(howTo.step.map(({ name, text }) => ({ name, text }))).toEqual(visible);
    expect(howTo.step.map((s) => s.position)).toEqual([1, 2, 3, 4]);
    expect(howTo.step.every((s) => s.url === "https://kheelona.com/setup#connect")).toBe(true);
    expect(jsonLdMismatches(html)).toEqual([]);
  });
});

describe("Setup: the wake-up button (D018; gate-a-open-items A10)", () => {
  it("says D018's lines: listening only after a press, one press per conversation, the light, about a minute of quiet", () => {
    const text = words(fold(BUILT, "button-title"));
    expect(text).toContain("Kheelu only listens when someone presses its wake-up button.");
    expect(text).toContain(
      "One press starts a conversation. A light on Kheelu shows whenever it’s listening. After about a minute of quiet, it switches itself off, so the next chat starts with another press.",
    );
    // Where it is (D055 item 25): the button step 2 holds, in step 2's own words.
    expect(text).toContain("Kheelu only listens when someone presses its wake-up button. It’s the button on Kheelu’s back, the one you held during setup.");
    expect(fold(BUILT, "button-title").querySelector(".ks-placeholder")).toBeNull();
  });

  it("never says “wake word”, “teach the hello” or a blanket “works offline” (claims §4.1; setup.md keyword rules)", () => {
    const text = words(BUILT);
    expect(text).not.toMatch(/wake[- ]?word|teach the hello|works offline|toddler/i);
    expect(text).toMatch(/\b3 to 7\b/);
  });

  it("shows the tummy unit, square and never wider than its crop, with the copy page's alt", () => {
    const figure = fold(BUILT, "button-title").querySelector("figure")!;
    expect([...figure.classList]).toEqual(expect.arrayContaining(["kh-photo", "kh-photo--square", "ks-setup-belly"]));
    expect(figure.querySelector("img")?.getAttribute("alt")).toBe("Kheelu’s tummy unit up close, with its speaker, light ring and buttons.");
  });
});

describe("Setup: the parent app's activity screen (D044; task 1.5b)", () => {
  const figure = () => fold(BUILT, "talk-title").querySelector("figure")!;

  it("is the round-2 screenshot from src/assets/app (no “Games”), never the mockup's review copy", () => {
    const source = readRepoFile("src/content/en-IN/pages/setup.ts");
    expect(source).toMatch(/from "@\/assets\/app\/app-activity\.webp"/);
    expect(source).not.toMatch(/from "[^"]*mockup\//);
  });

  it("keeps its own ratio, at phone size, with the mockup's alt and its caption (the content is example data)", () => {
    expect([...figure().classList]).toEqual(expect.arrayContaining(["kh-photo", "ks-setup-shot"]));
    const img = figure().querySelector("img")!;
    expect(img.getAttribute("style")).toMatch(/--kh-ratio:\s*576 \/ 1209/);
    expect(img.getAttribute("alt")).toBe("The parent app’s activity screen on a phone, showing example activity for one child.");
    expect(words(figure().querySelector("figcaption")!)).toBe("The parent app’s activity screen. The child’s name and the activity shown are examples.");
  });
});

describe("Setup: content rules", () => {
  it("shows no placeholder: each was filled by the founder or hidden until its value arrives (setup.md, task 6.7)", () => {
    expect(all(BUILT, ".ks-placeholder")).toHaveLength(0);
    expect(TOKEN.html).not.toMatch(/PLACEHOLDER|\{ph:/);
  });

  it("keeps the charger's F4 slot in the source, where its value lands, and renders nothing of it (D054 item 19)", () => {
    const source = readRepoFile("src/content/en-IN/pages/setup.ts");
    expect(source).toContain(`Charge Kheelu with the charger in the box. {${"ph"}:F4 the charger type, and how long a full charge takes}`);
    expect(source).toMatch(/withoutHiddenRows\(/);
    expect(words(all(fold(BUILT, "before-title"), "li")[0])).toBe("Charge Kheelu with the charger in the box.");
  });

  it("links the parent app's two store listings, the live site's own (D055 item 26), with no tracking value", () => {
    const item = all(fold(BUILT, "before-title"), "li")[3];
    expect(all(item, "a").map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["App Store", APP_STORE],
      ["Google Play", GOOGLE_PLAY],
    ]);
    expect(all(item, "[data-ph-capture-attribute-cta]")).toHaveLength(0);
    expect(strings(setupPage).join("\n")).not.toMatch(/\bLumi\b/);
  });

  it("reads the support line from seller.ts: no phone number, WhatsApp address or email typed in its source", () => {
    const source = readRepoFile("src/content/en-IN/pages/setup.ts");
    for (const typed of [seller.support.phone, seller.support.email, "919187546483", "wa.me"]) expect(source, typed).not.toContain(typed);
    expect(source).toMatch(/\bseller\.support\b/);
  });

  it("links only planned routes of the site (internal links resolve)", () => {
    const internal = hrefs(BUILT).filter((h) => h.startsWith("/"));
    expect(internal.length).toBeGreaterThanOrEqual(2);
    for (const href of internal) expect(routeFor(href.replace(/#.*$/, "")), href).toBeDefined();
  });

  it("ships no mockup-only markup: no mk- class, no data-src, no review tool (SCA 6)", () => {
    expect(TOKEN.html).not.toMatch(/class="[^"]*\bmk-/);
    expect(TOKEN.html).not.toMatch(/\sdata-src=/);
  });
});

describe("Setup: search and share metadata (setup.md At a glance)", () => {
  it("is the copy page's title and description, the same in both modes, with the default card", () => {
    for (const mode of ["token", "full"] as const) {
      const offer = buildOffer(mode);
      expect(toPlainText(setupPage.meta.title, offer)).toBe("How to set up Kheelu on day one · Kheelona");
      expect(toPlainText(setupPage.meta.description, offer)).toBe(
        "How to set up Kheelu: charge it, connect it to your home Wi-Fi with the parent app, set your child’s age, and show your child the wake-up button.",
      );
    }
    expect(setupPage.meta.og).toBe(DEFAULT_OG);
  });
});

describe("Setup: the founder's page facts and task 7.1b's age line for the pixels (tasks 6.7, 7.1b)", () => {
  it("finds each block the visual pass hides on the build side, once, on the page as it renders (V8, the facts and the age line)", () => {
    const selectors = VISUAL_HIDDEN.setup.filter((rule) => rule.side === "build").map((rule) => rule.selector);
    expect(selectors).toHaveLength(5);
    for (const selector of selectors) expect(BUILT.querySelectorAll(selector), selector).toHaveLength(1);
  });

  it("hides fold 4's age line, the block task 7.1b rewords, on the build side (V20)", () => {
    const selectors = VISUAL_HIDDEN.setup.filter((rule) => rule.side === "build" && rule.approvedBy === COPY_FIXES.setup.approvedBy).map((rule) => rule.selector);
    expect(selectors).toHaveLength(1);
    const found = BUILT.querySelectorAll(selectors[0]);
    expect(found).toHaveLength(1);
    expect(words(found[0])).toBe(`Kheelu is made for children aged 3 to 7. ${COPY_FIXES.setup.build[0]}`);
  });
});
