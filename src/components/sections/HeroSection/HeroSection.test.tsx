import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import type { ArtBoardRef } from "@/content/types";
import { HeroSection, type HeroSectionProps } from "./HeroSection";

// The real next/image, as the media primitives' own tests use it: the loading hints are what this file checks.
vi.unmock("next/image");

/* HeroSection (task 3.3; components §2; D045, D049 pick 2): the first fold of eight approved pages, compared class by
 * class (mk- renamed ks-) and word for word with the built mockup, down to the media primitives (ArtBoard, Photo). The
 * CTA block is the page's (CtaBlock, task 3.2): a stand-in takes its place here. Nothing in a hero ever moves. */

const doc = (slug: string) =>
  new DOMParser().parseFromString(readFileSync(join(process.cwd(), "mockup", `${slug}.html`), "utf8"), "text/html");
const heroOf = (slug: string) => doc(slug).querySelector("main > section")!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

const RENAME: Record<string, string[]> = {
  "mk-hero": ["ks-hero"],
  "mk-hero-sticker": ["ks-hero-sticker"],
  "mk-gd-hero-art": ["ks-art--clamp"],
  "mk-team-board": ["ks-team-board"],
  "mk-sf-hero-photo": [],
  "mk-setup-hero": ["ks-hero-words"],
  "mk-contact-ways": ["ks-contact-ways"],
  "mk-nowrap": ["ks-nowrap"],
  "mk-journal-intro": ["ks-journal-intro"],
  "mk-written": ["ks-written"],
  "mk-topics": ["ks-topics"],
  "mk-topics__label": ["ks-topics__label"],
};

function shape(el: Element, extra: (el: Element) => string[] = () => [], depth = 0): string[] {
  const classes = [...[...el.classList].flatMap((c) => RENAME[c] ?? [c]), ...extra(el)];
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${[...new Set(classes)].sort().map((c) => `.${c}`).join("")}${el.hasAttribute("data-reveal") ? "[data-reveal]" : ""}`;
  if (el.tagName.toLowerCase() === "svg" || el.classList.contains("kh-art") || el.classList.contains("kh-photo")) return [line];
  return [line, ...[...el.children].flatMap((c) => shape(c, extra, depth + 1))];
}

/** A mockup string as content: accents, no-wrap phrases and links. */
function copyOf(el: Element): string {
  return [...el.childNodes]
    .map((n) => {
      if (n.nodeType === 3) return n.textContent ?? "";
      const e = n as Element;
      if (e.classList.contains("kh-hand")) return `{hand:${copyOf(e)}}`;
      if (e.classList.contains("mk-nowrap")) return `{nowrap:${copyOf(e)}}`;
      if (e.tagName === "A") return `[${copyOf(e)}](${e.getAttribute("href")})`;
      return copyOf(e);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}
const headingOf = (hero: Element) => ({
  eyebrow: norm(hero.querySelector(".kh-eyebrow")?.textContent),
  title: copyOf(hero.querySelector("h1")!),
  lead: copyOf(hero.querySelector(".kh-heading__lead")!),
  id: hero.querySelector("h1")!.id,
});

/** The hero with the CTA block (everything after the heading in its column) replaced by the test's stand-in. */
function withCtaSlot(hero: Element): Element {
  const header = hero.querySelector("header.kh-heading")!;
  while (header.nextElementSibling) header.nextElementSibling.remove();
  const slot = hero.ownerDocument.createElement("div");
  slot.className = "cta-slot";
  header.after(slot);
  return hero;
}
const CTA = <div className="cta-slot" />;

const raster = (name: string, width: number, height: number, alt = "") => ({
  src: { src: `/_next/static/media/${name}`, width, height } as StaticImageData,
  alt,
});
const svg = (name: string) => raster(`${name}.svg`, 240, 240);
const STILL = (hero: HTMLElement) => {
  expect(hero.querySelector("[data-reveal]"), "a hero never reveals (pick 2)").toBeNull();
  expect(hero.querySelector("[data-draw]"), "hero doodles stay still (pick 2)").toBeNull();
};

const HOME_ART: ArtBoardRef = {
  tone: "blue",
  label: "Kheelu by Kheelona, the cream plush rabbit with rainbow ears, beside a smiling boy",
  layers: [
    { image: svg("sun-sun"), left: 6, width: 30, top: 8 },
    { image: raster("advik-sticker.png", 744, 1198), left: 38, width: 54, bottom: 0 },
    { image: raster("kheelu-front-sticker.png", 1154, 1397), left: 2, width: 44, bottom: 2, rotate: -6 },
    { doodle: { name: "chalk-question-mark", draw: true }, left: 43, width: 13, top: 2, rotate: 10 },
  ],
  sticker: { tone: "sun", variant: "round", tilt: 8, lead: "It asks.", lines: ["They think."] },
};

describe("HeroSection: art (Home fold 1, D045)", () => {
  const hero = heroOf("home");
  const props: HeroSectionProps = { variant: "art", heading: headingOf(hero), art: HOME_ART };

  it("matches the approved fold: the hero heading and the CTA beside the art board", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const expected = withCtaSlot(hero);
    expect(shape(container.firstElementChild!)).toEqual(shape(expected));
    expect(words(container.textContent)).toBe(words(expected.textContent));
  });

  it("has one h1 naming the section, the board as one named image, and nothing that moves", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelector("section")).toHaveAttribute("aria-labelledby", "hero-title");
    expect(screen.getByRole("img", { name: HOME_ART.label })).toHaveClass("kh-art", "kh-tone-blue");
    STILL(container);
    // The board's doodle is the DS file as a still image even though the content asks it to draw.
    expect(container.querySelectorAll(".kh-art > *")[3].tagName.toLowerCase()).toBe("img");
  });

  it("holds the page's LCP image: the board's largest raster loads eagerly at high priority, nothing else does", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const high = [...container.querySelectorAll("img")].filter((img) => img.getAttribute("fetchpriority") === "high");
    expect(high).toHaveLength(1);
    expect(high[0].getAttribute("src")).toContain("advik-sticker");
    expect(high[0]).toHaveAttribute("loading", "eager");
  });

  it("puts the word sticker where Home's board has it (no product class)", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const sticker = container.querySelector(".kh-sticker")!;
    expect(sticker).not.toHaveClass("ks-hero-sticker");
    expect(sticker.getAttribute("style")).toContain("--kh-tilt: 8deg");
  });
});

describe("HeroSection: product (product fold 1)", () => {
  const hero = heroOf("meet-kheelu");
  const art: ArtBoardRef = {
    tone: "blue",
    label: "Kheelu, the cream plush rabbit that talks back, beside a curious little girl in a mustard flowered frock.",
    layers: [
      { image: svg("star-sun"), right: 4, width: 30, top: 6 },
      { image: raster("myra-sticker.png", 700, 1100), left: 44, width: 48, bottom: 0 },
      { image: raster("kheelu-front-sticker.png", 1154, 1397), left: 3, width: 46, bottom: 2, rotate: -5 },
      { doodle: { name: "chalk-speech-bubble" }, left: 40, width: 15, top: 14, rotate: -8 },
    ],
    sticker: { tone: "sun", variant: "round", tilt: -8, lead: "It asks.", lines: ["They think."] },
  };

  it("matches the approved fold, the word sticker moved clear of Myra's face (ks-hero-sticker)", () => {
    const { container } = render(<HeroSection variant="product" heading={headingOf(hero)} art={art} cta={CTA} />);
    const expected = withCtaSlot(hero);
    expect(shape(container.firstElementChild!)).toEqual(shape(expected));
    expect(words(container.textContent)).toBe(words(expected.textContent));
    expect(container.querySelector(".kh-sticker")).toHaveClass("ks-hero-sticker");
    STILL(container);
  });
});

describe("HeroSection: answer (safety, buyer's guide, team, setup)", () => {
  it("safety: the answer-first heading beside a wide photo, which is the LCP image", () => {
    const hero = heroOf("safety");
    const { container } = render(
      <HeroSection
        variant="answer"
        heading={headingOf(hero)}
        media={{ kind: "photo", image: raster("tara-02.webp", 1500, 837, "A girl and her mother on a sofa."), variant: "wide", xl: true }}
      />,
    );
    expect(shape(container.firstElementChild!)).toEqual(shape(hero));
    expect(words(container.textContent)).toBe(words(hero.textContent));
    const img = container.querySelector(".kh-photo img")!;
    expect(img).toHaveAttribute("fetchpriority", "high");
    expect(img).toHaveAttribute("loading", "eager");
    STILL(container);
  });

  it("buyer's guide: the heading beside the art board, clamped to 480 px on tablets", () => {
    const hero = heroOf("ai-toys-for-kids-in-india");
    const art: ArtBoardRef = {
      tone: "sun",
      label: "A little girl in a mustard floral frock beside Kheelu, the cream plush rabbit.",
      layers: [
        { image: svg("cloud-blue"), left: 52, width: 40, top: 7 },
        { image: raster("myra-sticker.png", 700, 1100), left: 42, width: 50, bottom: 0 },
        { image: raster("kheelu-front-sticker.png", 1154, 1397), left: 4, width: 44, bottom: 3, rotate: -5 },
        { doodle: { name: "ink-question-mark" }, left: 44, width: 11, top: 14, rotate: -10 },
      ],
    };
    const { container } = render(<HeroSection variant="answer" heading={headingOf(hero)} media={{ kind: "art", art, clamp: true }} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(hero));
    expect(words(container.textContent)).toBe(words(hero.textContent));
    STILL(container);
  });

  it("team: the heading beside the product-only board, which keeps its gap under the words until 900 px", () => {
    const hero = heroOf("team");
    const art: ArtBoardRef = {
      tone: "sun",
      label: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
      layers: [
        { image: svg("heart-chilli"), left: 7, width: 30, top: 8 },
        { image: raster("kheelu-front-sticker.png", 1154, 1397), left: 24, width: 56, bottom: 4, rotate: -5 },
        { doodle: { name: "ink-spark-lines" }, left: 74, width: 16, top: 12, rotate: 12 },
      ],
    };
    const { container } = render(<HeroSection variant="answer" heading={headingOf(hero)} media={{ kind: "art", art, stacked: true }} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(hero));
    expect(words(container.textContent)).toBe(words(hero.textContent));
    STILL(container);
  });

  it("setup: words only, the heading straight in the container, centred from 900 px", () => {
    const hero = heroOf("setup");
    const { container } = render(<HeroSection variant="answer" heading={headingOf(hero)} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(hero));
    expect(words(container.textContent)).toBe(words(hero.textContent));
    expect(container.querySelector("img")).toBeNull();
  });
});

describe("HeroSection: contact (contact fold 1)", () => {
  const hero = heroOf("contact");
  const props: HeroSectionProps = {
    variant: "contact",
    heading: headingOf(hero),
    ways: [
      { label: "Message on WhatsApp", href: "https://wa.me/919187546483", icon: "whatsapp-logo" },
      { label: "Call +91 91875 46483", href: "tel:+919187546483" },
      { label: "Email hello@kheelona.com", href: "mailto:hello@kheelona.com", icon: "envelope-simple" },
    ],
  };

  it("matches the approved fold: the heading beside the three ways to reach the team", () => {
    const { container } = render(<HeroSection {...props} />);
    expect(shape(container.firstElementChild!, (el) => (el.tagName === "SECTION" ? ["ks-hero--contact"] : []))).toEqual(
      shape(hero, (el) => (el.tagName === "SECTION" ? ["ks-hero--contact"] : [])),
    );
    expect(words(container.textContent)).toBe(words(hero.textContent));
  });

  it("scopes its lead-link weight to the contact hero and keeps the sticky bar's #hero-cta on the ways", () => {
    const { container } = render(<HeroSection {...props} />);
    expect(container.querySelector("section")).toHaveClass("ks-hero", "ks-hero--contact");
    expect(container.querySelector("#hero-cta")).toHaveClass("ks-contact-ways");
    expect(screen.getByRole("link", { name: "grievance officer" })).toHaveAttribute("href", "#grievance");
    const call = screen.getByRole("link", { name: "Call +91 91875 46483" });
    expect(call).toHaveClass("kh-btn", "kh-btn--secondary", "kh-btn--block");
    expect(call).not.toHaveAttribute("data-ph-capture-attribute-cta");
  });
});

describe("HeroSection: hub (stories fold 1)", () => {
  const hero = heroOf("stories");
  const props: HeroSectionProps = {
    variant: "hub",
    heading: headingOf(hero),
    written: norm(hero.querySelector(".mk-written")?.textContent),
    topics: {
      label: "Topics",
      id: "topics-label",
      links: [...hero.querySelectorAll(".kh-tag")].map((a) => ({ label: norm(a.textContent), href: a.getAttribute("href")! })),
    },
  };

  it("matches the approved fold: on the band, the centred heading, the byline and the topic links", () => {
    const { container } = render(<HeroSection {...props} />);
    const hub = (el: Element) => (el.tagName === "HEADER" ? ["ks-hero-words"] : []);
    expect(shape(container.firstElementChild!, hub)).toEqual(shape(hero, hub));
    expect(words(container.textContent)).toBe(words(hero.textContent));
  });

  it("names the topics navigation by its label and links each topic to its band", () => {
    render(<HeroSection {...props} />);
    const nav = screen.getByRole("navigation", { name: "Topics" });
    expect(nav).toHaveClass("ks-topics");
    expect(screen.getByRole("link", { name: "Talking and language" })).toHaveAttribute("href", "#talking");
  });
});
