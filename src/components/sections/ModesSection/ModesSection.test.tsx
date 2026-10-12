import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { ModesSection, type ModesSectionProps } from "./ModesSection";

/* ModesSection (task 3.3; components §2): "What is Kheelu?" on Home (fold 4) and "How it works" on the product page
 * (fold 4, with the compact mode rows and the Good to know card). Each compared class by class (mk- renamed ks-) and
 * word for word with the built mockup fold. */

const mockup = (slug: string) =>
  new DOMParser().parseFromString(readFileSync(join(process.cwd(), "mockup", `${slug}.html`), "utf8"), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");
const RENAME: Record<string, string[]> = {
  "mk-modes": ["ks-modes"],
  "mk-list-reset": ["ks-list-reset"],
  "mk-know": ["ks-know"],
  "mk-know__text": ["ks-know__text"],
  "mk-know__img": ["ks-know__img"],
  "mk-ticks": ["ks-ticks"],
  "mk-placeholder": ["ks-placeholder"],
};

function shape(el: Element, depth = 0): string[] {
  const classes = [...el.classList].flatMap((c) => RENAME[c] ?? [c]);
  // Home's language list resets itself inline (home.html:180); the build uses the shared reset class.
  if (el.classList.contains("kh-langs") && !classes.includes("ks-list-reset")) classes.push("ks-list-reset");
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${classes.sort().map((c) => `.${c}`).join("")}${el.hasAttribute("data-reveal") ? "[data-reveal]" : ""}`;
  if (el.tagName.toLowerCase() === "svg" || el.classList.contains("kh-photo")) return [line];
  return [line, ...[...el.children].flatMap((c) => shape(c, depth + 1))];
}

const image = (name: string, width: number, height: number, alt: string) => ({
  src: { src: `/_next/static/media/${name}`, width, height } as StaticImageData,
  alt,
});

const MODES = [
  { tone: "blue", icon: "wifi-high", title: "AI mode", body: "Open conversation, on your home Wi‑Fi. It can’t browse the internet." },
  {
    id: "story-mode",
    tone: "sun",
    tint: true,
    icon: "book-open",
    title: "Story mode",
    body: "Stories, poems and jingles your child enjoys and learns from. No Wi‑Fi needed.",
  },
  { tone: "chilli", icon: "bluetooth", title: "Bluetooth mode", body: "Pair your phone and use it as a speaker." },
] as const;

const LANGUAGES = {
  title: "Up to 10 languages at launch",
  items: [
    { native: "English" },
    { native: "हिन्दी", english: "Hindi", lang: "hi" },
    { native: "বাংলা", english: "Bengali", lang: "bn" },
    { native: "తెలుగు", english: "Telugu", lang: "te" },
    { native: "தமிழ்", english: "Tamil", lang: "ta" },
    { native: "ಕನ್ನಡ", english: "Kannada", lang: "kn" },
    { native: "Español", english: "Spanish", lang: "es" },
    { native: "Français", english: "French", lang: "fr" },
  ],
  note: "It can switch between them mid-sentence.",
};

describe("ModesSection: home (Home fold 4)", () => {
  const fold = mockup("home").querySelector("#modes")!;
  const props: ModesSectionProps = {
    variant: "home",
    heading: {
      eyebrow: "Modes and languages",
      title: "What is {hand:Kheelu?}",
      lead: norm(fold.querySelector(".kh-heading__lead")?.textContent),
      id: "what-title",
    },
    photo: { image: image("ira-01-story-on-the-bed-web.webp", 1208, 1500, "A laughing girl in a peach kurta.") },
    modes: MODES,
    languages: LANGUAGES,
    link: { label: "See what each mode does", href: "/products/kheelu" },
  };

  it("matches the approved fold: heading beside the photo, three mode cards, the languages, then the link", () => {
    const { container } = render(<ModesSection {...props} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("keeps the #modes and #story-mode fragments and names the section by its heading", () => {
    const { container } = render(<ModesSection {...props} />);
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("id", "modes");
    expect(section).toHaveAttribute("aria-labelledby", "what-title");
    expect(container.querySelector("#story-mode")).toHaveTextContent("Story mode");
  });

  it("reveals the photo and the cards only; each language carries its lang (G-13)", () => {
    const { container } = render(<ModesSection {...props} />);
    expect([...container.querySelectorAll("[data-reveal]")].map((e) => e.className)).toEqual(["kh-photo kh-photo--xl", "kh-cols kh-cols--3"]);
    expect(screen.getByText("বাংলা")).toHaveAttribute("lang", "bn");
  });
});

describe("ModesSection: product (product fold 4)", () => {
  const fold = mockup("meet-kheelu").querySelector("#modes")!;
  const props: ModesSectionProps = {
    variant: "product",
    heading: {
      eyebrow: "How it works",
      title: "A toy that talks back, not a toy that {hand:repeats.}",
      lead: norm(fold.querySelector(".kh-heading__lead")?.textContent),
      id: "modes-title",
    },
    photo: { image: image("advik-02-whispering-to-kheelu-web.webp", 1500, 837, "A boy whispering to Kheelu."), wide: true },
    modes: MODES,
    languages: LANGUAGES,
    know: {
      title: "Good to know",
      id: "know-title",
      items: [
        { icon: "wifi-high", text: "AI mode needs your home Wi‑Fi. Story mode and Bluetooth mode work without it." },
        { icon: "wifi-slash", text: "It can’t browse the internet. When it doesn’t know something, it says so." },
        { icon: "microphone", text: "Each conversation starts with a press of the wake-up button. It switches itself off after about a minute of quiet." },
        { icon: "sliders-horizontal", text: "At setup, you enter your child’s age in the parent app." },
        { icon: "battery-charging", text: "It charges with the charger in the box. {ph:F4 battery life per charge and charging time}" },
      ],
      image: image("kheelu-belly-module.png", 389, 397, "Kheelu’s tummy unit up close, with its speaker, light ring and buttons."),
    },
    link: { label: "How setup works", href: "/setup" },
  };

  it("matches the approved fold: compact mode rows, the languages, the Good to know card, then the link", () => {
    const { container } = render(<ModesSection {...props} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("names the Good to know card by its title and shows the open fact as a visible placeholder", () => {
    const { container } = render(<ModesSection {...props} />);
    const know = container.querySelector(".ks-know")!;
    expect(know).toHaveAttribute("aria-labelledby", "know-title");
    expect(know).toHaveAttribute("data-reveal");
    expect(know.querySelector(".ks-placeholder")).toHaveTextContent("[PLACEHOLDER F4: battery life per charge and charging time]");
    const img = know.querySelector("img.ks-know__img")!;
    expect(img).toHaveAttribute("alt", "Kheelu’s tummy unit up close, with its speaker, light ring and buttons.");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("sizes", "(min-width: 720px) 224px, 176px");
    expect(img.parentElement?.tagName.toLowerCase()).not.toBe("figure");
  });

  /* Architecture §10 (wave-3 close ruling): DS rasters reach next/image only inside the media primitives. The Good to
     know photo is Photo's bare form (task 3.6 item 18), never next/image straight from the section. */
  it("draws the Good to know photo through Photo's bare form, never next/image directly", () => {
    const source = readFileSync(join(process.cwd(), "src/components/sections/ModesSection/ModesSection.tsx"), "utf8");
    expect(source).not.toMatch(/from "next\/image"/);
    expect(source).toMatch(/<Photo\s[^>]*\bbare\b[^>]*className="ks-know__img"/);
  });
});
