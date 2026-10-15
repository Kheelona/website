import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { outline, parseMockup, type Renames } from "../../../../test/support/mockup-compare";
import { FeatureSplit, type FeatureSplitProps } from "./FeatureSplit";

/* FeatureSplit (task 3.3; components §2): the words-beside-media folds of the approved mockup. Each test builds the
 * fold from data (the words read from the mockup itself) and compares its markup class by class (mk- renamed ks-) and
 * word for word with the fold in the built mockup page, through the mockup comparison harness
 * (test/support/mockup-compare.ts), down to the media primitives (ImaginationFrame, AppScreens, ArtBoard, Photo), which
 * carry their own tests. */

const offer = buildOffer("token");
const fold = (slug: string, labelledBy: string) => parseMockup(slug).querySelector(`[aria-labelledby="${labelledBy}"]`)!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

/** The blocks the build names otherwise; every other mockup block takes its ks- name. */
const RENAMES: Renames = {
  "sf-shot": ["ks-shots", "ks-shots--safety"],
  "gd-plush-art": ["ks-gd-plush-art", "ks-art--clamp"],
  "setup-copy": ["ks-feature-copy"],
  "team-why": ["ks-feature-copy"],
  "team-quote": [],
  /* The third parent control runs the full width from 720 px, as the never list's fifth item (CMO m2, 2026-10-14). */
  "sf-controls": ["ks-sf-controls", "ks-trust--span-last"],
};

/** Inside these the primitive's own test owns the markup. */
const STOP = /\b(?:kh-imagine|kh-art|kh-photo|mk-shots|mk-sf-shot|ks-shots)\b/;
/** TrustList resets its lists with the shared class. */
const listReset = (el: Element) => (/^(ul|ol)$/i.test(el.tagName) && el.classList.contains("kh-trust") ? ["ks-list-reset"] : []);
/** A fold may name a block otherwise than the table (the product page's app screens). */
const shape = (el: Element, rename: Renames = {}) => outline(el, { renames: { ...RENAMES, ...rename }, stop: (e) => STOP.test(e.className), extra: listReset });

/** A mockup paragraph as a content string: accents, no-wrap phrases, links, source markers and placeholders. */
function copyOf(el: Element): string {
  return [...el.childNodes]
    .map((n) => {
      if (n.nodeType === 3) return n.textContent ?? "";
      const e = n as Element;
      if (e.classList.contains("mk-placeholder")) {
        const m = /^\[PLACEHOLDER(?: ([A-Z][\w-]*))?: (.*)\]$/.exec(norm(e.textContent))!;
        return `{ph:${m[1] ? `${m[1]} ` : ""}${m[2]}}`;
      }
      if (e.classList.contains("mk-src")) return `[^${norm(e.textContent).replace(/\D/g, "")}]`;
      if (e.classList.contains("kh-hand")) return `{hand:${copyOf(e)}}`;
      if (e.classList.contains("kh-mark")) return `{mark:${copyOf(e)}}`;
      if (e.classList.contains("mk-nowrap")) return `{nowrap:${copyOf(e)}}`;
      if (e.tagName === "A") return `[${copyOf(e)}](${e.getAttribute("href")})`;
      return copyOf(e);
    })
    .join("")
    .replace(/\s+/g, " ");
}
const title = (f: Element) => copyOf(f.querySelector(".kh-heading__title")!).trim();
const eyebrow = (f: Element) => norm(f.querySelector(".kh-eyebrow")?.textContent) || undefined;
const lead = (f: Element) => (f.querySelector(".kh-heading__lead") ? norm(f.querySelector(".kh-heading__lead")?.textContent) : undefined);
const headingOf = (f: Element, id: string) => ({ eyebrow: eyebrow(f), title: title(f), lead: lead(f), id });
const paragraphs = (els: Iterable<Element>) => [...els].map((p) => copyOf(p).trim());
const trustItems = (f: Element, icons: string[]) =>
  [...f.querySelectorAll(".kh-trust__item")].map((li, i) => ({
    icon: icons[i] as "eye",
    title: li.querySelector(".kh-trust__title") ? norm(li.querySelector(".kh-trust__title")?.textContent) : undefined,
    body: copyOf(li.querySelector(".kh-trust__body")!).trim(),
  }));

const image = (name: string, width: number, height: number, alt = "") => ({
  src: { src: `/_next/static/media/${name}`, width, height } as StaticImageData,
  alt,
});
const SHOT = (name: string) => image(`${name}.webp`, 576, 1209, `The parent app's ${name} screen.`);
const CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";

function renders(props: FeatureSplitProps, expected: Element, rename?: Renames) {
  const { container } = render(<FeatureSplit offer={offer} {...props} />);
  expect(shape(container.firstElementChild!, rename)).toEqual(shape(expected, rename));
  expect(words(container.textContent)).toBe(words(expected.textContent));
  return container;
}

describe("FeatureSplit: imagination (Home fold 3)", () => {
  const f = fold("home", "why-title");
  const props: FeatureSplitProps = {
    variant: "imagination",
    heading: { ...headingOf(f, "why-title"), align: "center" },
    text: copyOf(f.querySelector(".kh-cols > .kh-body-l")!).trim(),
    card: {
      tone: "sun",
      tint: true,
      icon: "chat-circle-dots",
      title: norm(f.querySelector(".kh-card__title")?.textContent),
      body: norm(f.querySelector(".kh-card__body")?.textContent),
    },
    aside: norm(f.querySelector(".kh-cols > div > .kh-body-s")?.textContent),
    frame: {
      photo: image("kabir.webp", 1500, 1875, "A boy in glasses holding Kheelu."),
      zoom: true,
      question: norm(f.querySelector(".kh-imagine__question")?.textContent),
      doodles: [
        { doodle: { name: "chalk-planet" }, left: 4, top: 30, width: 20, rotate: -10 },
        { doodle: { name: "chalk-star" }, left: 16, top: 22, width: 8, rotate: -18 },
        { doodle: { name: "chalk-star" }, left: 86, top: 48, width: 7, rotate: 12 },
        { doodle: { name: "chalk-thought-cloud" }, left: 72, top: 22, width: 20 },
      ],
    },
    sources: {
      label: "Sources",
      marker: "Source",
      items: [
        {
          citation: "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts).",
          href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
        },
      ],
    },
    link: { label: "Read more: how children learn by talking", href: "/stories" },
  };

  it("matches the approved fold: the sourced words and the Kheelu card beside the imagination frame, the source, the link", () => {
    renders(props, f);
  });

  it("reveals the words and the frame, draws the frame's doodles one after another, and links the marker to its source", () => {
    const { container } = render(<FeatureSplit {...props} />);
    expect([...container.querySelectorAll("[data-reveal]")].map((e) => e.className)).toEqual(["kh-cols", "kh-imagine ks-imagine-zoom"]);
    expect([...container.querySelectorAll(".kh-imagine [data-draw]")].map((d) => d.getAttribute("data-draw-order"))).toEqual(["1", "2", "3", "4"]);
    expect(screen.getByRole("link", { name: "Source 1" })).toHaveAttribute("href", "#src-1");
    expect(container.querySelector("#src-1")).toHaveClass("kh-caption");
  });

  /* Task Q2.9 (the selling update; the D2C plan v2 §2 fold 3): Home's "Why it matters" without a picture (the Kabir frame
     left with Kabir to the hero, one appearance per page), and with the page's CTA block after the sources. */
  it("without a frame: the words and the card in two columns under the heading, no split and no picture, then the sources and what follows", () => {
    const rest = { ...props, frame: undefined, aside: undefined, link: undefined };
    const cta = <div className="cta-slot" />;
    const { container } = render(<FeatureSplit {...rest} after={cta} />);
    const inner = container.querySelector(".kh-container")!;
    expect([...inner.children].map((el) => el.className)).toEqual(["kh-section__head", "kh-cols kh-cols--2", "kh-caption", "cta-slot"]);
    expect(container.querySelector(".kh-split, .kh-imagine, img")).toBeNull();
    const cols = inner.querySelector(".kh-cols")!;
    expect(cols).toHaveAttribute("data-reveal", "");
    expect(cols.firstElementChild).toHaveClass("kh-body-l");
    expect(cols.lastElementChild?.firstElementChild).toHaveClass("kh-card");
    expect(screen.getByRole("link", { name: "Source 1" })).toHaveAttribute("href", "#src-1");
  });
});

describe("FeatureSplit: app-screens", () => {
  it("Home fold 5: the four lines and the app link revealing beside the two phones", () => {
    const f = fold("home", "see-title");
    const container = renders(
      {
        variant: "app-screens",
        placement: "home",
        id: "app",
        heading: headingOf(f, "see-title"),
        items: trustItems(f, ["eye", "chart-line-up", "sliders-horizontal", "trash"]),
        screens: { images: [SHOT("transcript"), SHOT("activity")], caption: CAPTION },
        link: { label: "See what the app shows you", href: "/products/kheelu", icon: "eye" },
      },
      f,
    );
    expect(container.querySelector("section")).toHaveAttribute("id", "app");
    expect(screen.getByRole("link", { name: "See what the app shows you" })).toHaveClass("kh-btn--secondary");
  });

  it("product fold 5: heading, skills and the Kheelona+ note beside the phones; the link under the words on laptops", () => {
    const f = fold("meet-kheelu", "app-title");
    const container = renders(
      {
        variant: "app-screens",
        placement: "product",
        id: "app",
        heading: headingOf(f, "app-title"),
        skills: { label: "The four thinking skills", items: ["Words", "Reasons", "Stories", "Questions"] },
        note: norm(f.querySelector(".mk-app-note")?.textContent),
        screens: { images: [SHOT("transcript"), SHOT("activity")], caption: CAPTION },
        link: { label: "See what we keep, and for how long", href: "#safety" },
      },
      f,
      { shots: ["ks-shots", "ks-shots--product"] },
    );
    expect(screen.getByRole("list", { name: "The four thinking skills" })).toHaveClass("kh-chips", "kh-tone-sun");
    expect(container.querySelector(".ks-app-split > .kh-section__actions")).not.toBeNull();
  });

  it("safety fold 4: the parent controls under the heading, the one privacy screen in the DS frame", () => {
    const f = fold("safety", "controls-title");
    renders(
      {
        variant: "app-screens",
        placement: "safety",
        band: true,
        heading: headingOf(f, "controls-title"),
        items: trustItems(f, ["sliders-horizontal", "book-open", "moon", "translate"]),
        screens: { images: [SHOT("privacy")], caption: CAPTION },
        link: { label: "See what the app shows you", href: "/products/kheelu#app", icon: "eye" },
      },
      f,
    );
  });

  it("gives the safety page one screen only (AppScreens `safety` takes one)", () => {
    const two = {
      variant: "app-screens",
      placement: "safety",
      heading: { title: "Controls", id: "c" },
      screens: { images: [SHOT("a"), SHOT("b")] },
    } as unknown as FeatureSplitProps;
    expect(() => render(<FeatureSplit {...two} />)).toThrow(/FeatureSplit/);
  });
});

/* Task Q2.9 (the selling update; the D2C plan v2 §2 fold 8, D064 item 2): Home's compact safety block. No mockup fold:
   the approved page's folds 5 and 6 merged into one. The heading and one-line promises (DS trust items, no titles, a
   single column) beside the one privacy screen in the DS device (AppScreens `safety`), then the page's CTA block across
   the fold (`after`). */
describe("FeatureSplit: app-screens compact (Home's safety block, task Q2.9)", () => {
  const COMPACT: FeatureSplitProps = {
    variant: "app-screens",
    placement: "compact",
    id: "safety",
    band: true,
    heading: { eyebrow: "Safety", title: "Safety you can {hand:check.}", id: "safety-title" },
    items: [
      { icon: "microphone", body: "It listens only after someone presses the wake-up button." },
      { icon: "wifi-slash", body: "No web browsing." },
    ],
    screens: { images: [SHOT("privacy")], caption: CAPTION },
  };

  it("puts the heading and the promises beside the one screen, then whatever follows the fold", () => {
    const { container } = render(<FeatureSplit {...COMPACT} offer={offer} after={<div className="cta-slot" />} />);
    const section = screen.getByRole("region", { name: "Safety you can check." });
    expect(section).toHaveAttribute("id", "safety");
    expect(section).toHaveClass("kh-section--band");
    const inner = container.querySelector(".kh-container")!;
    expect([...inner.children].map((el) => el.className)).toEqual(["kh-split kh-split--wide-start ks-safe-split", "cta-slot"]);
    const split = inner.firstElementChild!;
    expect([...split.firstElementChild!.children].map((el) => el.className)).toEqual(["kh-heading", "kh-trust ks-list-reset ks-safe-lines"]);
    expect([...split.querySelectorAll(".kh-trust__body")].map((b) => b.textContent)).toEqual(COMPACT.variant === "app-screens" ? COMPACT.items!.map((i) => i.body) : []);
    expect(split.querySelector(".kh-trust__title")).toBeNull();
    expect(split.querySelector(".ks-safe-lines")).toHaveAttribute("data-reveal", "");
    const media = split.lastElementChild!;
    expect(media).toHaveClass("ks-shots", "ks-shots--safety");
    expect(media.querySelectorAll("img")).toHaveLength(1);
    expect(media.querySelector("figcaption")?.textContent).toBe(CAPTION);
  });

  it("lays the promises out in one quiet column, on DS tokens", () => {
    const css = readRepoFile("src/components/sections/FeatureSplit/feature-split.css");
    expect(css).toMatch(/\.kh-trust\.ks-safe-lines \{\s*grid-template-columns: minmax\(0, 1fr\);\s*gap: var\(--space-3\);\s*margin-top: var\(--space-6\);\s*\}/);
  });
});

describe("FeatureSplit: photo", () => {
  it("guide fold 4: the words and link beside the 4:3 Kheelu board (1:1 from 900 px, clamped on tablets)", () => {
    const f = fold("ai-toys-for-kids-in-india", "plush-title");
    const container = renders(
      {
        variant: "photo",
        split: "start",
        band: true,
        heading: headingOf(f, "plush-title"),
        text: norm(f.querySelector(".mk-gd-plush-text")?.textContent),
        media: {
          kind: "art",
          plush: true,
          art: {
            tone: "blue",
            layers: [
              { image: image("star-sun.svg", 240, 240), left: 6, width: 26, top: 7 },
              { image: image("kheelu-front.webp", 1080, 1324, "Kheelu, the soft cream plush rabbit."), left: 22, width: 56, bottom: 4 },
            ],
          },
        },
        link: { label: "See what Kheelu does", href: "/products/kheelu" },
      },
      f,
    );
    const board = container.querySelector(".kh-art")!;
    expect(board).toHaveAttribute("data-reveal");
    expect(board).not.toHaveAttribute("role");
  });

  it("setup fold 4: heading beside the words, no media (the 5:7 split)", () => {
    const f = fold("setup", "age-title");
    renders(
      { variant: "photo", split: "end", band: true, heading: headingOf(f, "age-title"), copy: paragraphs(f.querySelectorAll(".mk-setup-copy p")) },
      f,
    );
  });

  it("setup fold 5: the words (with an open fact) beside the square tummy-unit photo", () => {
    const f = fold("setup", "button-title");
    const container = renders(
      {
        variant: "photo",
        heading: headingOf(f, "button-title"),
        copy: paragraphs(f.querySelectorAll(".mk-setup-copy p")),
        media: { kind: "photo", image: image("belly.png", 389, 397, "Kheelu’s tummy unit up close."), variant: "square", fit: "belly" },
      },
      f,
    );
    expect(container.querySelector(".ks-placeholder")).toHaveTextContent("[PLACEHOLDER: where the wake-up button sits on Kheelu]");
  });

  it("setup fold 6: the words beside the activity screenshot at its own ratio, with its caption", () => {
    const f = fold("setup", "talk-title");
    const container = renders(
      {
        variant: "photo",
        split: "start",
        band: true,
        heading: headingOf(f, "talk-title"),
        copy: paragraphs(f.querySelectorAll(".mk-setup-copy p")),
        media: {
          kind: "photo",
          image: image("app-activity.webp", 576, 1209, "The parent app’s activity screen on a phone."),
          ratio: "576 / 1209",
          caption: norm(f.querySelector("figcaption")?.textContent),
          fit: "shot",
        },
      },
      f,
    );
    expect(container.querySelector(".ks-setup-shot img")?.getAttribute("style")).toContain("--kh-ratio: 576 / 1209");
  });
});

describe("FeatureSplit: ticks (setup fold 2)", () => {
  it("matches the approved fold: heading, the checklist, then whatever follows it (the Wi-Fi tip)", () => {
    const f = fold("setup", "before-title");
    const tip = f.querySelector(".mk-setup-tip")!;
    const slot = f.ownerDocument.createElement("p");
    slot.className = "tip-slot";
    tip.replaceWith(slot);
    renders(
      {
        variant: "ticks",
        band: true,
        heading: headingOf(f, "before-title"),
        items: trustItems(f, ["battery-charging", "lock-simple", "wifi-high", "download-simple"]),
        after: <p className="tip-slot" />,
      },
      f,
    );
  });
});

describe("FeatureSplit: pair (safety folds 5 and 6)", () => {
  it("matches the approved block: two short folds as quiet cards side by side, each named by its own heading", () => {
    const f = fold("safety", "kept-title").closest("div.kh-section")!;
    const cards = [...f.querySelectorAll("section.kh-card")];
    const container = renders(
      {
        variant: "pair",
        cards: cards.map((card) => ({
          heading: { eyebrow: eyebrow(card), title: title(card), id: card.getAttribute("aria-labelledby")! },
          copy: paragraphs(card.querySelectorAll(":scope > p")),
          link: card.querySelector("a") ? { label: norm(card.querySelector("a")?.textContent), href: "/privacy" } : undefined,
        })),
      },
      f,
    );
    const sections = container.querySelectorAll("section.kh-card");
    expect([...sections].map((s) => s.getAttribute("aria-labelledby"))).toEqual(["kept-title", "cert-title"]);
    expect([...sections].every((s) => s.hasAttribute("data-reveal"))).toBe(true);
    expect(container.firstElementChild!.tagName.toLowerCase()).toBe("div");
  });
});

describe("FeatureSplit: quote (team fold 4)", () => {
  it("matches the approved fold: why we build, the founder's quote beside it, then the safety link", () => {
    const f = fold("team", "why-title");
    renders(
      {
        variant: "quote",
        band: true,
        heading: headingOf(f, "why-title"),
        copy: paragraphs(f.querySelectorAll(".mk-team-why .kh-body-l")),
        subtitle: norm(f.querySelector(".mk-team-why .kh-subtitle")?.textContent),
        quote: {
          text: norm(f.querySelector(".kh-quote__text")?.textContent),
          name: "Apoorva Sahu",
          role: "Co-Founder and CEO",
          initials: "AS",
          tone: "sun",
        },
        link: { label: "See how we built safety in", href: "/safety", icon: "shield-check" },
      },
      f,
    );
  });

  it("passes the person's photo to the quote, in the avatar's place (task 7.1a, CMO M10; the team page's live photo)", () => {
    const photo = { src: "/team/apoorva.jpg", width: 480, height: 480, alt: "" } as const;
    const { container } = render(
      <FeatureSplit
        offer={offer}
        variant="quote"
        heading={{ id: "why-title", title: "Why we build Kheelu." }}
        copy={["We are parents who build."]}
        quote={{ text: "The trust first.", name: "Apoorva Sahu", role: "Co-Founder and CEO", photo, tone: "sun" }}
      />,
    );
    const who = container.querySelector(".kh-quote__who")!;
    expect(who.querySelector(".kh-quote__avatar")).toBeNull();
    expect(who.querySelector(".kh-avatar img")?.getAttribute("alt")).toBe("");
  });
});
