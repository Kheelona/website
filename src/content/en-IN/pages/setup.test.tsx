import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import type { OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import type { SectionEntry } from "@/layouts/sections-registry";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupFold, mockupRoute, skeleton, words } from "../../../../test/support/mockup-compare";
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
 * One approved difference from the mockup, and only one: step 2 of "Connect Kheelu to your home Wi-Fi" takes the CMO
 * review's values (wiki/qa/cmo-review-pages-help-2026-10-11.md, M-S1): the mockup's "button on Kheelu's back" and
 * "pulsing blue" were the app's own bracketed placeholders, so the step names no place and no colour, and a placeholder
 * holds the button's place until the founder answers (setup.md question 1, CMO question 1). APPROVED below is the
 * mockup with that one step corrected; every comparison runs against it, and one test pins that it differs from the
 * mockup in that step alone. The activity screenshot is the D044 round-2 file (task 1.5b: no "Games"); the alt and the
 * caption are the mockup's.
 */

const MOCKUP = mockupFold("setup", "main");

/** CMO review M-S1's step 2: the setup button without a place or a light colour, its place a placeholder. */
const STEP_2 = {
  title: "Press and hold Kheelu’s setup button.",
  placeholder: "[PLACEHOLDER: which button and where; the app’s own screen still shows “[back]”]",
  body: "Hold it for 3 seconds, until its light starts pulsing.",
};

/** The approved page: the mockup's <main> with step 2 as the CMO review words it (M-S1). */
const APPROVED = (() => {
  const main = MOCKUP.cloneNode(true) as Element;
  const step = main.querySelector("#connect .kh-step:nth-child(2)")!;
  const title = step.querySelector(".kh-step__title")!;
  title.textContent = `${STEP_2.title} `;
  const marker = main.ownerDocument.createElement("span");
  marker.className = "mk-placeholder";
  marker.textContent = STEP_2.placeholder;
  title.append(marker);
  step.querySelector(".kh-step__body")!.textContent = STEP_2.body;
  return main;
})();

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

  it("differs from the mockup only in step 2, which takes the CMO review's values (M-S1)", () => {
    const step = (main: Element) => main.querySelector("#connect .kh-step:nth-child(2)")!;
    expect(words(step(MOCKUP))).toBe("2 Press and hold the button on Kheelu’s back. Hold it for 3 seconds, until the light starts pulsing blue.");
    expect(words(step(BUILT))).toBe(`2 ${STEP_2.title} ${STEP_2.placeholder} ${STEP_2.body}`);
    const rest = (main: Element) => {
      const copy = main.cloneNode(true) as Element;
      copy.querySelector("#connect .kh-step:nth-child(2)")!.remove();
      return words(copy);
    };
    expect(rest(APPROVED)).toBe(rest(MOCKUP));
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
    expect(all(BUILT, '[href*="store"]')).toHaveLength(0);
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

  it("names no place and no colour for the setup button, and holds its place open (CMO M-S1)", () => {
    const step2 = steps()[1];
    const marker = step2.querySelector(".kh-step__title .ks-placeholder");
    expect(marker?.textContent).toBe(STEP_2.placeholder);
    const outside = step2.cloneNode(true) as Element;
    outside.querySelector(".ks-placeholder")!.remove();
    expect(words(outside)).not.toMatch(/\bback\b|\bblue\b/i);
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
    expect(fold(BUILT, "button-title").querySelector(".ks-placeholder")?.textContent).toBe("[PLACEHOLDER: where the wake-up button sits on Kheelu]");
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
  it("shows exactly the copy page's three placeholders and the CMO review's step-2 one, each visibly", () => {
    expect(all(BUILT, ".ks-placeholder").map((p) => p.textContent)).toEqual([
      "[PLACEHOLDER F4: the charger type, and how long a full charge takes]",
      "[PLACEHOLDER C6: where to get the parent app: App Store and Google Play links, and the listing name]",
      STEP_2.placeholder,
      "[PLACEHOLDER: where the wake-up button sits on Kheelu]",
    ]);
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
