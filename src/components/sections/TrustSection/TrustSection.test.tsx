import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { TrustSection, type TrustItemCopy } from "./TrustSection";

/* TrustSection (task 3.3; components §2): the safety folds of Home and the product page (D020 order, with the
 * parent app's privacy screen, the facts line and the CTA slot), the safety page's four facts and its "never" list,
 * and the buyer's guide's answers. Each compared class by class (mk- renamed ks-) and word for word with the built
 * mockup fold; the CTA block is the page's (CtaBlock, task 3.2), so here a stand-in takes its place. */

const mockup = (slug: string) =>
  new DOMParser().parseFromString(readFileSync(join(process.cwd(), "mockup", `${slug}.html`), "utf8"), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");
const RENAME: Record<string, string[]> = {
  "mk-safety": ["ks-safety"],
  "mk-safety-split": ["ks-safety-split"],
  "mk-shots": ["ks-shots"],
  "mk-shots--solo": ["ks-shots--solo", "ks-shots--product"],
  "mk-facts": ["ks-facts", "ks-trustline--center"],
  "mk-sf-belly": ["ks-sf-belly"],
  "mk-sf-list": [],
  "mk-sf-never": ["ks-sf-never", "ks-trust--span-last"],
  "mk-gd-answers": ["ks-gd-answers", "ks-trust--span-last"],
  "mk-gd-pointer": ["ks-gd-pointer"],
};

/** Inside these the primitive's own test owns the markup (AppScreens, Photo). */
const STOP = (el: Element) => el.tagName.toLowerCase() === "svg" || el.classList.contains("mk-shots") || el.classList.contains("ks-shots") || el.classList.contains("kh-photo");

function shape(el: Element, depth = 0): string[] {
  const classes = [...el.classList].flatMap((c) => RENAME[c] ?? [c]);
  // TrustList resets its lists with the shared class (mockup.css:95, safety.css:6, ai-toys-for-kids-in-india.css:6).
  if (/^(ul|ol)$/i.test(el.tagName) && el.classList.contains("kh-trust")) classes.push("ks-list-reset");
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${[...new Set(classes)].sort().map((c) => `.${c}`).join("")}${el.hasAttribute("data-reveal") ? "[data-reveal]" : ""}`;
  if (STOP(el)) return [line];
  return [line, ...[...el.children].flatMap((c) => shape(c, depth + 1))];
}

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
