import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import postcss, { type Rule } from "postcss";
import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { outline, parseMockup, type Renames } from "../../../../test/support/mockup-compare";
import { TrustSection, type TrustItemCopy } from "./TrustSection";

/* TrustSection (task 3.3; components §2): the safety folds of Home and the product page (D020 order, with the
 * parent app's privacy screen, the facts line and the CTA slot), the safety page's four facts and its "never" list,
 * and the buyer's guide's answers. Each compared class by class (mk- renamed ks-) and word for word with the built
 * mockup fold, through the mockup comparison harness (test/support/mockup-compare.ts); the CTA block is the page's
 * (CtaBlock, task 3.2), so here a stand-in takes its place. */

const mockup = parseMockup;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");
/** The blocks the build names otherwise; every other mockup block takes its ks- name. */
const RENAMES: Renames = {
  "shots--solo": ["ks-shots--solo", "ks-shots--product"],
  facts: ["ks-facts", "ks-trustline--center"],
  "sf-list": [],
  "sf-never": ["ks-sf-never", "ks-trust--span-last"],
  "gd-answers": ["ks-gd-answers", "ks-trust--span-last"],
};

/** Inside these the primitive's own test owns the markup (AppScreens, Photo). */
const STOP = (el: Element) => el.classList.contains("mk-shots") || el.classList.contains("ks-shots") || el.classList.contains("kh-photo");
/** TrustList resets its lists with the shared class (mockup.css:95, safety.css:6, ai-toys-for-kids-in-india.css:6). */
const listReset = (el: Element) => (/^(ul|ol)$/i.test(el.tagName) && el.classList.contains("kh-trust") ? ["ks-list-reset"] : []);
const shape = (el: Element) => outline(el, { renames: RENAMES, stop: STOP, extra: listReset });

/** The fold with the CTA block (everything after the facts line) replaced by the stand-in the test passes. */
function withCtaSlot(fold: Element): Element {
  const facts = fold.querySelector(".mk-facts")!;
  while (facts.nextElementSibling) facts.nextElementSibling.remove();
  const slot = fold.ownerDocument.createElement("div");
  slot.className = "cta-slot";
  facts.after(slot);
  return fold;
}
const CTA = <div className="cta-slot" />;

const itemsFrom = (fold: Element, icons: TrustItemCopy["icon"][]): TrustItemCopy[] =>
  [...fold.querySelectorAll(".kh-trust__item")].map((item, i) => ({
    icon: icons[i],
    title: item.querySelector(".kh-trust__title") ? norm(item.querySelector(".kh-trust__title")?.textContent) : undefined,
    body: norm(item.querySelector(".kh-trust__body")?.textContent),
  }));

const image = (name: string, width: number, height: number, alt: string) => ({
  src: { src: `/_next/static/media/${name}`, width, height } as StaticImageData,
  alt,
});
const PRIVACY = image("app-privacy.webp", 576, 1209, "The parent app's privacy centre.");
const FACTS = [
  { icon: "eye-slash" as const, text: "No camera" },
  { icon: "wifi-slash" as const, text: "It can’t browse the internet" },
  { icon: "smiley" as const, text: "It says it’s a toy, and never asks your child to keep a secret from you" },
];
const CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";
const SAFETY_ICONS: TrustItemCopy["icon"][] = ["microphone", "lock-simple", "eye", "hand-heart"];

describe("TrustSection: safety (Home fold 6)", () => {
  const fold = mockup("home").querySelector('[aria-labelledby="safety-title"]')!;
  const props = {
    variant: "safety" as const,
    placement: "home" as const,
    band: true,
    heading: { eyebrow: "Safety", title: "Safety you can {hand:check.}", id: "safety-title" },
    items: itemsFrom(fold, SAFETY_ICONS),
    screens: { images: [PRIVACY] as const, caption: CAPTION },
    facts: FACTS,
  };

  it("matches the approved fold up to the CTA: centred heading, the four facts beside the privacy screen, the facts line", () => {
    const { container } = render(<TrustSection {...props} cta={CTA} />);
    const expected = withCtaSlot(fold);
    expect(shape(container.firstElementChild!)).toEqual(shape(expected));
    expect(words(container.textContent)).toBe(words(expected.textContent));
  });

  it("keeps the D020 order, puts the CTA last and never reveals the facts line or the CTA", () => {
    const { container } = render(<TrustSection {...props} cta={<a className="kh-btn kh-btn--cta">Pre-order Kheelu</a>} />);
    expect([...container.querySelectorAll(".kh-trust__title")].map((t) => t.textContent)).toEqual(props.items.map((i) => i.title));
    expect(container.querySelector(".kh-container")!.lastElementChild).toHaveClass("kh-btn--cta");
    expect([...container.querySelectorAll("[data-reveal]")].map((e) => e.className)).toEqual(["ks-shots"]);
  });
});

describe("TrustSection: safety (product fold 6)", () => {
  const fold = mockup("meet-kheelu").querySelector('[aria-labelledby="safety-title"]')!;
  const props = {
    variant: "safety" as const,
    placement: "product" as const,
    id: "safety",
    band: true,
    heading: { eyebrow: "Safety", title: "Safety you can {hand:check.}", id: "safety-title" },
    items: itemsFrom(fold, SAFETY_ICONS),
    screens: { images: [PRIVACY] as const, caption: CAPTION },
    facts: FACTS,
  };

  it("matches the approved fold up to the CTA: the wide split with the screen standing alone (sticky on laptops)", () => {
    const { container } = render(<TrustSection {...props} cta={CTA} />);
    const expected = withCtaSlot(fold);
    expect(shape(container.firstElementChild!)).toEqual(shape(expected));
    expect(words(container.textContent)).toBe(words(expected.textContent));
    expect(container.querySelector("section")).toHaveAttribute("id", "safety");
  });
});

describe("TrustSection: facts (safety fold 2)", () => {
  const fold = mockup("safety").querySelector('[aria-labelledby="facts-title"]')!;
  const props = {
    variant: "facts" as const,
    id: "facts",
    band: true,
    heading: {
      eyebrow: "Four facts",
      title: "Is Kheelu safe for {hand:my child?}",
      lead: norm(fold.querySelector(".kh-heading__lead")?.textContent),
      id: "facts-title",
    },
    items: itemsFrom(fold, SAFETY_ICONS),
    photo: image("kheelu-belly-module.png", 389, 397, "Kheelu’s tummy unit up close, with its speaker, light ring and buttons."),
  };

  it("matches the approved fold: heading beside the tummy unit, then the four facts as an ordered list", () => {
    const { container } = render(<TrustSection {...props} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("keeps the #facts fragment the FAQ links to; the facts are an ordered list (D020 order) and do not reveal", () => {
    const { container } = render(<TrustSection {...props} />);
    expect(container.querySelector("section")).toHaveAttribute("id", "facts");
    expect(container.querySelector("ol.kh-trust")).not.toHaveAttribute("data-reveal");
    expect(container.querySelector(".ks-sf-belly")).toHaveAttribute("data-reveal");
  });
});

describe("TrustSection: never (safety fold 3)", () => {
  const fold = mockup("safety").querySelector('[aria-labelledby="never-title"]')!;
  const props = {
    variant: "never" as const,
    heading: { eyebrow: "Never", title: "What you {mark:won’t} find in Kheelu.", id: "never-title" },
    items: itemsFrom(fold, ["eye-slash", "speaker-high", "wifi-slash", "x", "smiley"]),
    link: { label: "How to choose an AI toy: five checks", href: "/ai-toys-for-kids-in-india" },
  };

  it("matches the approved fold: the five 'never' items, revealing, then the guide link", () => {
    const { container } = render(<TrustSection {...props} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
    expect(container.querySelector("ul.kh-trust")).toHaveAttribute("data-reveal");
    expect(screen.getByRole("link", { name: "How to choose an AI toy: five checks" })).toHaveClass("kh-btn--ghost");
  });

  /* From 1024 px the list is a six-column grid, each item two columns wide, three to a row (safety.css:16-18). The
     approved five widen the last row's two items to half the width each; since task Q2.11 the list may hold six (the
     daily limit, D065 item 5), which make two full rows of three, so only a last row of exactly two widens. */
  it("lays out three per row from 1024 px and widens only a last row of two: five as three then two, six as three and three", () => {
    const laptop: { selector: string; span: string }[] = [];
    postcss.parse(readRepoFile("src/components/sections/TrustSection/trust-section.css")).walkAtRules("media", (media) => {
      if (media.params !== "(min-width: 1024px)") return;
      media.walkRules((rule: Rule) =>
        rule.walkDecls("grid-column", (decl) => void laptop.push(...rule.selectors.map((selector) => ({ selector, span: decl.value })))),
      );
    });
    const spans = (count: number) => {
      const list = document.createElement("ul");
      list.className = "kh-trust ks-sf-never";
      list.innerHTML = '<li class="kh-trust__item"></li>'.repeat(count);
      document.body.append(list);
      const result = Array.from(list.children).map((item) => laptop.filter((r) => item.matches(r.selector)).at(-1)?.span);
      list.remove();
      return result;
    };
    expect(spans(5)).toEqual(["span 2", "span 2", "span 2", "span 3", "span 3"]);
    expect(spans(6)).toEqual(Array(6).fill("span 2"));
  });
});

describe("TrustSection: meets (buyer's guide fold 3)", () => {
  const fold = mockup("ai-toys-for-kids-in-india").querySelector('[aria-labelledby="answers-title"]')!;
  const props = {
    variant: "meets" as const,
    heading: {
      eyebrow: "Kheelu’s answers",
      title: "How Kheelu meets {hand:each check.}",
      lead: norm(fold.querySelector(".kh-heading__lead")?.textContent),
      id: "answers-title",
    },
    items: itemsFrom(fold, ["eye-slash", "microphone", "wifi-slash", "eye", "translate"]),
    pointer: norm(fold.querySelector(".mk-gd-pointer")?.textContent),
    link: { label: "See the full safety facts", href: "/safety", icon: "shield-check" as const },
  };

  it("matches the approved fold: the five answers in order, the pointer line, then the secondary link", () => {
    const { container } = render(<TrustSection {...props} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
    const link = screen.getByRole("link", { name: "See the full safety facts" });
    expect(link).toHaveClass("kh-btn--secondary");
    expect(link.firstElementChild?.tagName.toLowerCase()).toBe("svg");
  });
});

/* Task Q2.10 (the D2C plan v2 §3 fold 9, D064 item 2, ruling 8): the product page's safety fold becomes one line that
   points to /safety, where the safety facts live, with the built link "See how we built safety in" as a DS ghost link.
   No mockup fold (the approved page had the whole safety fold): a tight section, named by its line, no heading. */
describe("TrustSection: pointer (product fold 9, task Q2.10)", () => {
  const props = {
    variant: "pointer" as const,
    id: "safety",
    band: true,
    pointer: "When the microphone is on, how Kheelu answers, and what you can read and delete, fact by fact:",
    link: { label: "See how we built safety in", href: "/safety", cta: "product-safety-learn" as const },
  };

  it("is a tight section named by its one line, with the page's fragment and no heading", () => {
    const { container } = render(<TrustSection {...props} />);
    const section = screen.getByRole("region", { name: props.pointer });
    expect(container.firstElementChild).toBe(section);
    expect(section.className).toBe("kh-section kh-section--band kh-section--tight ks-pointer-fold");
    expect(section.id).toBe("safety");
    expect(section.querySelector("h1, h2, h3, header")).toBeNull();
    const line = section.querySelector(".kh-container > p.kh-body-l.ks-pointer")!;
    expect(line.textContent).toBe(props.pointer);
    expect(section.getAttribute("aria-labelledby")).toBe(line.id);
    expect(line.id).toBe("safety-line");
  });

  it("ends on the ghost link with its arrow, tracked by the page's value, right after the line", () => {
    const { container } = render(<TrustSection {...props} />);
    const link = screen.getByRole("link", { name: props.link.label });
    expect(link).toHaveClass("kh-btn", "kh-btn--ghost");
    expect(link).toHaveAttribute("href", "/safety");
    expect(link).toHaveAttribute("data-ph-capture-attribute-cta", "product-safety-learn");
    expect(link.lastElementChild?.tagName.toLowerCase()).toBe("svg");
    const row = link.closest(".kh-section__actions")!;
    expect(row).toHaveClass("kh-section__actions--center");
    expect(row.previousElementSibling).toHaveClass("ks-pointer");
    expect(container.querySelector(".kh-container")?.lastElementChild).toBe(row);
  });

  it("takes the page surface and its own fragment when the page gives them; moves nothing", () => {
    const { container } = render(<TrustSection {...props} band={undefined} id="where-safety-lives" />);
    const section = container.firstElementChild!;
    expect(section.className).toBe("kh-section kh-section--tight ks-pointer-fold");
    expect(section.getAttribute("aria-labelledby")).toBe("where-safety-lives-line");
    expect(container.querySelector("[data-reveal], [data-draw]")).toBeNull();
  });
});
