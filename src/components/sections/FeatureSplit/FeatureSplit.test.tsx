import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { FeatureSplit, type FeatureSplitProps } from "./FeatureSplit";

/* FeatureSplit (task 3.3; components §2): the words-beside-media folds of the approved mockup. Each test builds the
 * fold from data (the words read from the mockup itself) and compares its markup class by class (mk- renamed ks-) and
 * word for word with the fold in the built mockup page, down to the media primitives (ImaginationFrame, AppScreens,
 * ArtBoard, Photo), which carry their own tests. */

const offer = buildOffer("token");
const doc = (slug: string) =>
  new DOMParser().parseFromString(readFileSync(join(process.cwd(), "mockup", `${slug}.html`), "utf8"), "text/html");
const fold = (slug: string, labelledBy: string) => doc(slug).querySelector(`[aria-labelledby="${labelledBy}"]`)!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

const RENAME: Record<string, string[]> = {
  "mk-imagine-zoom": ["ks-imagine-zoom"],
  "mk-src": ["ks-src"],
  "mk-shots": ["ks-shots"],
  "mk-sf-shot": ["ks-shots", "ks-shots--safety"],
  "mk-app-split": ["ks-app-split"],
  "mk-skills": ["ks-skills"],
  "mk-list-reset": ["ks-list-reset"],
  "mk-app-note": ["ks-app-note"],
  "mk-sf-controls": ["ks-sf-controls"],
  "mk-gd-plush-text": ["ks-gd-plush-text"],
  "mk-gd-plush-art": ["ks-gd-plush-art", "ks-art--clamp"],
  "mk-setup-split": ["ks-setup-split"],
  "mk-setup-copy": ["ks-feature-copy"],
  "mk-setup-belly": ["ks-setup-belly"],
  "mk-setup-shot": ["ks-setup-shot"],
  "mk-placeholder": ["ks-placeholder"],
  "mk-sf-pair": ["ks-sf-pair"],
  "mk-team-why": ["ks-feature-copy"],
  "mk-team-quote": [],
};

/** Inside these the primitive's own test owns the markup. */
const STOP = /\b(?:kh-imagine|kh-art|kh-photo|mk-shots|mk-sf-shot|ks-shots)\b/;

function shape(el: Element, rename: Record<string, string[]> = {}, depth = 0): string[] {
  const classes = [...el.classList].flatMap((c) => rename[c] ?? RENAME[c] ?? [c]);
  if (/^(ul|ol)$/i.test(el.tagName) && el.classList.contains("kh-trust")) classes.push("ks-list-reset");
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${[...new Set(classes)].sort().map((c) => `.${c}`).join("")}${el.hasAttribute("data-reveal") ? "[data-reveal]" : ""}`;
  if (el.tagName.toLowerCase() === "svg" || STOP.test(el.className)) return [line];
  return [line, ...[...el.children].flatMap((c) => shape(c, rename, depth + 1))];
}

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

function renders(props: FeatureSplitProps, expected: Element, rename?: Record<string, string[]>) {
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
      { "mk-shots": ["ks-shots", "ks-shots--product"] },
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
});
