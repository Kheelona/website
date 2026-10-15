import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import type { ArtBoardRef } from "@/content/types";
import { VISUAL_HIDDEN, hiddenCss } from "../../../../test/e2e/support/deviations";
import { outline, parseMockup, type Renames } from "../../../../test/support/mockup-compare";
import { HeroSection, type HeroSectionProps } from "./HeroSection";

// The real next/image, as the media primitives' own tests use it: the loading hints are what this file checks.
vi.unmock("next/image");

/* HeroSection (task 3.3; components §2; D045, D049 pick 2): the first fold of eight approved pages, compared class by
 * class (mk- renamed ks-) and word for word with the built mockup through the mockup comparison harness
 * (test/support/mockup-compare.ts), down to the media primitives (ArtBoard, Photo). The CTA block is the page's
 * (CtaBlock, task 3.2): a stand-in takes its place here. Nothing in a hero ever moves. */

const heroOf = (slug: string) => parseMockup(slug).querySelector("main > section")!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

/** The hero blocks the build names otherwise; every other mockup block takes its ks- name. */
const RENAMES: Renames = {
  "gd-hero-art": ["ks-art--clamp"],
  "sf-hero-photo": [],
  "setup-hero": ["ks-hero-words"],
};

/** Inside the art board and the photo, the media primitives' own tests own the markup. */
const STOP = (el: Element) => el.classList.contains("kh-art") || el.classList.contains("kh-photo");
const shape = (el: Element, extra: (el: Element) => string[] = () => []) => outline(el, { renames: RENAMES, stop: STOP, extra });

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

/* D061 item 1 (task 8c.1): on a phone, under 720 px, Kheelu is wholly on the first screen. The board's phone composition
 * (`phoneLayers`: the same DS files, placed for a 4:3 board, the ratio the approved mockup's phone boards render at,
 * ai-toys-for-kids-in-india.css:30) takes the approved board's place right under the trust line; the approved board shows from 720 px as it always has. Where each board shows, and the order on a phone, is
 * hero-section.css's, measured in a browser by test/e2e/first-screen.spec.ts; this file holds the markup and loading. */
const HOME_PHONE_LAYERS: ArtBoardRef["layers"] = [
  { image: svg("sun-sun"), right: 3, width: 18, top: 5 },
  { image: raster("advik-sticker.png", 744, 1198), left: 52, width: 30, bottom: 0 },
  { image: raster("kheelu-front-sticker.png", 1154, 1397), left: 32, width: 27, bottom: 16, rotate: -6 },
  { doodle: { name: "chalk-question-mark", draw: true }, left: 45, width: 8, top: 22, rotate: 10 },
];
const PHONE_SIZES = { lcp: "(min-width: 720px) calc(1px * 0.3), calc((100vw - 32px) * 0.3)" };
const APPROVED_SIZES = {
  lcp: "(min-width: 1296px) calc(480px * 0.54), (min-width: 900px) calc(40vw * 0.54), (min-width: 720px) calc((100vw - 32px) * 0.54), calc(1px * 0.54)",
};

describe("HeroSection: the phone board (D061 item 1)", () => {
  const props: HeroSectionProps = { variant: "art", heading: headingOf(heroOf("home")), art: HOME_ART, phoneLayers: HOME_PHONE_LAYERS };
  const boards = (container: Element) => [...container.querySelectorAll(".kh-art")];
  const placements = (board: Element) => [...board.querySelectorAll(".kh-art__layer")].map((layer) => layer.getAttribute("style")?.replace(/color:\s*transparent;?/, ""));

  it("puts the phone composition before the approved board: the board's tone, name and sticker, its own layers, 4:3", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    expect(boards(container)).toHaveLength(2);
    const [phone, approved] = boards(container);
    expect(phone).toHaveClass("kh-art", "kh-tone-blue", "ks-hero__phone-art");
    expect(phone.getAttribute("style")).toContain("--kh-ratio: 4 / 3");
    expect(phone).toHaveAttribute("role", "img");
    expect(phone).toHaveAttribute("aria-label", HOME_ART.label);
    expect(phone.querySelectorAll(".kh-art__layer")).toHaveLength(HOME_PHONE_LAYERS.length);
    expect(placements(phone)[2]).toContain("left: 32%; width: 27%; bottom: 16%; transform: rotate(-6deg)");
    expect(phone.querySelector(".kh-sticker")?.textContent).toBe("It asks.They think.");
    expect(phone.querySelector(".kh-sticker")?.getAttribute("style")).toContain("--kh-tilt: 8deg");
    // The approved board follows, its layers where they always were and without a ratio of its own (the DS 1:1).
    const { container: alone } = render(<HeroSection {...props} phoneLayers={undefined} cta={CTA} />);
    expect(approved).not.toHaveClass("ks-hero__phone-art");
    expect(approved.getAttribute("style")).toBe(boards(alone)[0].getAttribute("style"));
    expect(placements(approved)).toEqual(placements(boards(alone)[0]));
    expect(approved.querySelector(".kh-sticker")?.outerHTML).toBe(boards(alone)[0].querySelector(".kh-sticker")?.outerHTML);
  });

  it("gives each board one LCP image, asked for at its own widths: the phone board's under 720 px, the approved one's from 720 px", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const [phone, approved] = boards(container);
    const high = [...container.querySelectorAll("img")].filter((img) => img.getAttribute("fetchpriority") === "high");
    expect(high).toHaveLength(2);
    expect(phone.contains(high[0]) && approved.contains(high[1])).toBe(true);
    for (const img of high) {
      expect(img.getAttribute("src")).toContain("advik-sticker");
      expect(img).toHaveAttribute("loading", "eager");
    }
    expect(high[0]).toHaveAttribute("sizes", PHONE_SIZES.lcp);
    expect(high[1]).toHaveAttribute("sizes", APPROVED_SIZES.lcp);
  });

  it("keeps the approved board's sizes as they were without a phone board", () => {
    const { container } = render(<HeroSection {...props} phoneLayers={undefined} cta={CTA} />);
    const high = [...container.querySelectorAll("img")].filter((img) => img.getAttribute("fetchpriority") === "high");
    expect(high.map((img) => img.getAttribute("sizes"))).toEqual([
      "(min-width: 1296px) calc(480px * 0.54), (min-width: 900px) calc(40vw * 0.54), calc((100vw - 32px) * 0.54)",
    ]);
  });

  it("keeps both boards still: no reveal, every doodle a still image (pick 2)", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    STILL(container);
    expect(boards(container)[0].querySelectorAll(".kh-art > *")[3].tagName.toLowerCase()).toBe("img");
  });

  it("puts the phone board's word sticker top left on both pages, out of the WhatsApp bubble's column; Home's approved board keeps its corner", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const [phone, approved] = boards(container);
    expect(phone.querySelector(".kh-sticker")).toHaveClass("ks-hero-sticker");
    expect(approved.querySelector(".kh-sticker")).not.toHaveClass("ks-hero-sticker");
    const art: ArtBoardRef = { ...HOME_ART, sticker: { ...HOME_ART.sticker!, tilt: -8 } };
    const { container: product } = render(<HeroSection variant="product" heading={headingOf(heroOf("meet-kheelu"))} art={art} phoneLayers={HOME_PHONE_LAYERS} cta={CTA} />);
    for (const board of boards(product)) expect(board.querySelector(".kh-sticker")).toHaveClass("ks-hero-sticker");
  });

  it("leaves the words column as the approved markup: one h1, the CTA slot, then the boards", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const split = container.querySelector(".kh-split")!;
    expect([...split.children].map((el) => el.className)).toEqual(["", "kh-art kh-tone-blue ks-hero__phone-art", "kh-art kh-tone-blue"]);
    expect(split.firstElementChild!.querySelector("h1 + p, header")).not.toBeNull();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});

/* Task Q2.1 (D064 item 4): Home's hero picture is the DS photo library's "Kabir · block rocket", one of the DS web-hero
 * photos (design-system 10-pages.md, "Choosing pictures for a page"), in place of the board: `photo` gives its two crops
 * (scripts/assets/build-hero-crops.mjs), the 4:5 DS photo frame from 720 px and a 16:10 band under 720 px, which takes
 * the phone board's place right under the trust line (D061 item 1; hero-section.css), so Kabir and Kheelu are whole on
 * the first phone screen (test/e2e/first-screen.spec.ts). The words column is the approved one; a photo carries no
 * board, so no word sticker. */
const KABIR = "A boy in round glasses and an olive T-shirt kneels on a patterned rug, grinning as he stacks wooden blocks into a tall tower, with Kheelu sitting beside it.";
const HOME_PHOTO = {
  image: raster("kabir-02-block-rocket-4x5.jpg", 1200, 1500, KABIR),
  phone: raster("kabir-02-block-rocket-16x10.jpg", 1600, 1000, KABIR),
};
const PHOTO_SIZES = {
  phone: "(min-width: 720px) 1px, calc(100vw - 32px)",
  image: "(min-width: 1296px) 480px, (min-width: 900px) 40vw, (min-width: 720px) 480px, 1px",
};

describe("HeroSection: the photo (Home since task Q2.1, D064 item 4)", () => {
  const hero = heroOf("home");
  const props: HeroSectionProps = { variant: "art", heading: headingOf(hero), photo: HOME_PHOTO };
  const split = (container: Element) => container.querySelector(".kh-split")!;

  it("keeps Home's approved words column: the hero heading, then the CTA slot", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const expected = withCtaSlot(hero).querySelector(".kh-split")!.firstElementChild!;
    expect(shape(split(container).firstElementChild!)).toEqual(shape(expected));
    expect(words(split(container).firstElementChild!.textContent)).toBe(words(expected.textContent));
    expect(container.querySelector("section")).toHaveAttribute("aria-labelledby", "hero-title");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows the photo in its two crops, the phone crop first: DS photo frames with the larger radius, each at its own ratio, one alt", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    // The 4:5 crop stops at 480 px between 720 and 899 px through ArtBoard's tablet clamp (ks-art--clamp, art-board.css).
    expect([...split(container).children].map((el) => el.className)).toEqual([
      "",
      "kh-photo kh-photo--xl ks-hero__phone-art",
      "kh-photo kh-photo--xl ks-hero-photo ks-art--clamp",
    ]);
    const [phone, image] = [...split(container).querySelectorAll<HTMLImageElement>("figure.kh-photo > img")];
    expect(phone.style.getPropertyValue("--kh-ratio")).toBe("1600 / 1000");
    expect(image.style.getPropertyValue("--kh-ratio")).toBe("1200 / 1500");
    expect([phone.getAttribute("alt"), image.getAttribute("alt")]).toEqual([KABIR, KABIR]);
    expect(split(container).querySelector("figcaption")).toBeNull();
  });

  it("gives each crop one LCP image at its own widths: the phone crop under 720 px, the 4:5 crop from 720 px (480 px wide until the split)", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    const high = [...container.querySelectorAll("img")].filter((img) => img.getAttribute("fetchpriority") === "high");
    expect(high).toHaveLength(2);
    expect(high.map((img) => img.getAttribute("src"))).toEqual([expect.stringContaining("kabir-02-block-rocket-16x10"), expect.stringContaining("kabir-02-block-rocket-4x5")]);
    for (const img of high) expect(img).toHaveAttribute("loading", "eager");
    expect(high.map((img) => img.getAttribute("sizes"))).toEqual([PHOTO_SIZES.phone, PHOTO_SIZES.image]);
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });

  it("draws no board and no word sticker, and nothing in it moves (D049 pick 2)", () => {
    const { container } = render(<HeroSection {...props} cta={CTA} />);
    expect(container.querySelector(".kh-art, .kh-sticker")).toBeNull();
    STILL(container);
  });
});

/* The visual pass's hero rules (test/e2e/support/deviations.ts; tasks.md SPA 1): on a phone the build's hero art is the
 * D061 phone board, in another place than the approved board, so under 720 px both sides compare the hero without its
 * art (the folds below then line up); from 720 px nothing is hidden and the approved board is compared as before. Home's
 * hero picture is the photo since task Q2.1 (D064 item 4), another picture at every width: both sides compare its hero
 * without the picture at every width, the words column still compared. */
describe("HeroSection: the visual pass's hero rules (D061 item 1, D064 item 4)", () => {
  const PHONES = "(max-width: 719px)";
  it("home: the approved board and the photo hidden at every width, each on its own side", () => {
    expect(hiddenCss("home", "mockup").split("\n")[0]).toContain(".mk-hero .kh-art");
    expect(hiddenCss("home", "build").split("\n")[0]).toContain(".ks-hero .kh-photo");
    const hero = VISUAL_HIDDEN.home.filter((rule) => /hero/.test(rule.selector));
    expect(hero.map((rule) => [rule.side, rule.selector, rule.media])).toEqual([
      ["mockup", ".mk-hero .kh-art", undefined],
      ["build", ".ks-hero .kh-photo", undefined],
    ]);
  });

  it.each(["meet-kheelu"])("%s: the hero art hidden on both sides under 720 px only", (slug) => {
    expect(hiddenCss(slug, "mockup")).toContain(`@media ${PHONES} { .mk-hero .kh-art { display: none !important; } }`);
    expect(hiddenCss(slug, "build")).toContain(`@media ${PHONES} { .ks-hero .kh-art { display: none !important; } }`);
    const hero = VISUAL_HIDDEN[slug].filter((rule) => /hero/.test(rule.selector));
    expect(hero.map((rule) => [rule.side, rule.media])).toEqual([
      ["mockup", PHONES],
      ["build", PHONES],
    ]);
    // Every other rule still hides at every width, in the one block it always had.
    expect(hiddenCss(slug, "build").split("\n")[0]).not.toContain("@media");
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
