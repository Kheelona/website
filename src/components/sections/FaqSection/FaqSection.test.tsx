import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import type { FaqItem } from "@/content/types";
import { buildOffer } from "@/lib/offer/offer";
import { FaqSection } from "./FaqSection";

/* FaqSection (task 3.3; components §2): the FAQ folds of the approved mockup, Home fold 8, product fold 8 (with the
 * D025 disclaimer, its source and the help line), the safety and buyer's guide folds with their photo, and the
 * store's "Questions before you pay". Each test renders the fold from data and compares its markup, class by class
 * (mk- renamed ks-), with the fold in the built mockup page, down to the primitives (FaqList, Photo), which carry
 * their own tests. */

const offer = buildOffer("token");

const mockup = (slug: string) =>
  new DOMParser().parseFromString(readFileSync(join(process.cwd(), "mockup", `${slug}.html`), "utf8"), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
/** The fold's words with every space removed: the mockup's source formatting puts newlines between blocks. */
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

/** mk- blocks and the names they take in the build (components §7; mockup-css-mapping §6.2). */
const RENAME: Record<string, string[]> = {
  "mk-faq-head": ["ks-faq-head"],
  "mk-disclaimer": ["ks-faq__disclaimer"],
  "mk-sources": ["ks-faq__sources"],
  "mk-help": ["ks-help", "ks-faq__help"],
  "mk-nowrap": ["ks-nowrap"],
  "mk-faq": ["ks-faq"],
  "mk-h2": ["ks-h2"],
  "mk-gd-faq": ["ks-faq-photo"],
  "mk-gd-faq__head": ["ks-faq-photo__head"],
  "mk-gd-faq__photo": ["ks-faq-photo__photo", "ks-faq-photo__photo--clamp"],
  "mk-gd-faq__body": ["ks-faq-photo__body"],
  "mk-sf-faq": ["ks-faq-photo"],
  "mk-sf-faq__head": ["ks-faq-photo__head"],
  "mk-sf-faq__photo": ["ks-faq-photo__photo"],
  "mk-sf-faq__body": ["ks-faq-photo__body"],
};

/** Inside these the primitive's own test owns the markup (FaqList, Photo, the sources note), so the walk stops. */
const STOP = (el: Element) =>
  el.classList.contains("kh-faq") || el.classList.contains("kh-photo") || el.tagName.toLowerCase() === "svg" || /sources$/.test(el.className);

function shape(el: Element, depth = 0): string[] {
  const classes = [...el.classList].flatMap((c) => RENAME[c] ?? [c]);
  // Home's heading column carries an inline align-self (home.html fold 8); the build gives it the product's class.
  if (el.getAttribute("style")?.includes("align-self: start")) classes.push("ks-faq-head");
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${classes.sort().map((c) => `.${c}`).join("")}`;
  if (STOP(el)) return [line];
  return [line, ...[...el.children].flatMap((c) => shape(c, depth + 1))];
}

/** The mockup's questions and answers as plain items (words only; the shared FaqList test owns the details). */
function itemsFrom(fold: Element): FaqItem[] {
  return [...fold.querySelectorAll(".kh-faq__item")].map((d, i) => ({
    id: `q${i}`,
    question: norm(d.querySelector(".kh-faq__q span")?.textContent),
    // A source marker prints "[n]"; in content it is "[^n]".
    answer: norm(d.querySelector(".kh-faq__a p")?.textContent).replace(/\[(\d+)\]/g, "[^$1]"),
  }));
}

const heading = (fold: Element) => ({
  eyebrow: norm(fold.querySelector(".kh-eyebrow")?.textContent) || undefined,
  title: "Questions parents {hand:ask.}",
  id: "faq-title",
});

const HELP = {
  icon: "whatsapp-logo" as const,
  lead: "Still have a question?",
  contact: "[WhatsApp](https://wa.me/919187546483) or {nowrap:[call +91 91875 46483](tel:+919187546483)}",
};
const SOURCES = {
  label: "Sources",
  items: [
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/" as const,
      label: "developingchild.harvard.edu/key-concept/serve-and-return",
    },
  ],
};
const DISCLAIMER = {
  icon: "info" as const,
  text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
};
const photo = (name: string, width: number, height: number, alt: string) => ({
  src: { src: `/_next/static/media/${name}`, width, height } as StaticImageData,
  alt,
});

describe("FaqSection: default (Home fold 8)", () => {
  const fold = mockup("home").querySelector('[aria-labelledby="faq-title"]')!;
  const items = itemsFrom(fold);
  const more = { label: "See all questions", href: "/products/kheelu#faq", cta: "faq-more" as const };

  it("matches the approved fold: heading column, then the questions and the more link", () => {
    const { container } = render(<FaqSection heading={heading(fold)} items={items} more={more} offer={offer} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("is a section named by its heading, keeps the #faq anchor and reveals only the list", () => {
    const { container } = render(<FaqSection heading={heading(fold)} items={items} more={more} offer={offer} />);
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("id", "faq");
    expect(section).toHaveAttribute("aria-labelledby", "faq-title");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "faq-title");
    expect(section.querySelectorAll("[data-reveal]")).toHaveLength(1);
    expect(section.querySelector(".kh-faq")).toHaveAttribute("data-reveal");
  });

  it("asks with native details: every question is a summary, every answer closed at load", () => {
    const { container } = render(<FaqSection heading={heading(fold)} items={items} offer={offer} />);
    const details = [...container.querySelectorAll("details")];
    expect(details).toHaveLength(6);
    expect(details.every((d) => !d.open && d.querySelector("summary.kh-faq__q"))).toBe(true);
  });

  it("tags the more link with its secondary CTA value (architecture §8.3)", () => {
    render(<FaqSection heading={heading(fold)} items={items} more={more} offer={offer} />);
    const link = screen.getByRole("link", { name: "See all questions" });
    expect(link).toHaveAttribute("href", "/products/kheelu#faq");
    expect(link).toHaveAttribute("data-ph-capture-attribute-cta", "faq-more");
    expect(link).toHaveClass("kh-btn", "kh-btn--ghost");
  });

  it("renders prices from the offer in the page's mode, never a typed amount", () => {
    const priced: FaqItem[] = [{ id: "p", question: "How much is Kheelu?", answer: { token: "It is {price:headline} (incl. GST).", full: "It is {price:full}, paid in full." } }];
    const { container: token } = render(<FaqSection heading={heading(fold)} items={priced} offer={offer} />);
    expect(token.querySelector(".kh-faq__a")).toHaveTextContent("It is ₹4,999 (incl. GST).");
    const { container: full } = render(<FaqSection heading={heading(fold)} items={priced} offer={buildOffer("full")} />);
    expect(full.querySelector(".kh-faq__a")).toHaveTextContent("It is ₹7,999, paid in full.");
  });
});

describe("FaqSection: default with disclaimer, source and help (product fold 8)", () => {
  const fold = mockup("meet-kheelu").querySelector('[aria-labelledby="faq-title"]')!;
  const items = itemsFrom(fold);
  const props = { heading: heading(fold), items, band: true, disclaimer: DISCLAIMER, sources: SOURCES, sourceMarker: "Source", help: HELP, offer };

  it("matches the approved fold: questions, the D025 disclaimer, the source note and the help line, in that order", () => {
    const { container } = render(<FaqSection {...props} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("is on the band and links each source marker to its note", () => {
    const { container } = render(<FaqSection {...props} />);
    expect(container.querySelector("section")).toHaveClass("kh-section--band");
    const marker = screen.getByRole("link", { name: "Source 1" });
    expect(marker).toHaveAttribute("href", "#src-1");
    expect(container.querySelector("#src-1")).toHaveClass("kh-caption", "ks-faq__sources");
  });

  it("gives the product disclaimer its own name, never the article's (mockup-css-mapping §6.2)", () => {
    const { container } = render(<FaqSection {...props} />);
    const note = container.querySelector(".ks-faq__disclaimer")!;
    expect(note.tagName.toLowerCase()).toBe("p");
    expect(note).toHaveClass("kh-body-s");
    expect(note.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".ks-disclaimer")).toBeNull();
  });
});

describe("FaqSection: photo (buyer's guide fold 5, safety fold 7)", () => {
  it("matches the guide's fold: heading, the photo beside it (clamped), the questions and the sources slot", () => {
    const fold = mockup("ai-toys-for-kids-in-india").querySelector('[aria-labelledby="faq-title"]')!;
    const notes = <div className="ks-sources-slot" data-testid="notes" />;
    const { container } = render(
      <FaqSection
        variant="photo"
        heading={heading(fold)}
        items={itemsFrom(fold)}
        photo={{ image: photo("ira.webp", 1208, 1500, "A laughing girl in a peach kurta."), sizes: "(min-width: 900px) 360px, 100vw", clamp: true }}
        sourceMarker="Source"
        notes={notes}
        offer={offer}
      />,
    );
    const expected = shape(fold).map((l) => l.replace(/div\.mk-gd-sources$/, "div.ks-sources-slot"));
    expect(shape(container.firstElementChild!)).toEqual(expected);
    expect(container.querySelector(".ks-faq-photo__body > .kh-faq + [data-testid=notes]")).not.toBeNull();
  });

  it("matches the safety fold: a wide photo, the first answer open, the sources, then the link", () => {
    const fold = mockup("safety").querySelector('[aria-labelledby="faq-title"]')!;
    const items: FaqItem[] = itemsFrom(fold).map((item, i) =>
      i === 1
        ? {
            ...item,
            detail: [
              { kind: "p", text: "A second paragraph." },
              { kind: "list", items: [{ lead: "Replies:", text: "a curated library." }, "A plain line."] },
            ],
          }
        : item,
    );
    const { container } = render(
      <FaqSection
        variant="photo"
        heading={heading(fold)}
        items={items}
        band
        firstOpen
        sourceMarker="Source"
        photo={{ image: photo("advik.webp", 1500, 837, "A boy whispering to Kheelu."), sizes: "100vw", variant: "wide" }}
        notes={<div className="ks-sources-slot" />}
        more={{ label: "How to choose an AI toy", href: "/ai-toys-for-kids-in-india" }}
        offer={offer}
      />,
    );
    const expected = shape(fold).map((l) => l.replace(/div\.mk-sf-sources$/, "div.ks-sources-slot"));
    expect(shape(container.firstElementChild!)).toEqual(expected);
    const details = container.querySelectorAll("details");
    expect(details[0].open).toBe(true);
    expect(details[1].open).toBe(false);
    expect(container.querySelector(".ks-faq-photo__photo")).toHaveAttribute("data-reveal");
    expect(container.querySelector(".kh-faq")).not.toHaveAttribute("data-reveal");
    expect(container.querySelector(".ks-faq-photo__photo")).not.toHaveClass("ks-faq-photo__photo--clamp");
  });

  it("renders an answer's detail blocks: paragraphs, and lists with a bold lead (safety.html fold 7)", () => {
    const items: FaqItem[] = [
      {
        id: "groups",
        question: "What do child-safety groups say?",
        answer: "First paragraph.",
        detail: [
          { kind: "p", text: "Here is what Kheelu does:" },
          { kind: "list", items: [{ lead: "Data:", text: "[the four facts](#facts)." }, "No secrets."] },
        ],
      },
    ];
    const { container } = render(
      <FaqSection variant="photo" heading={{ title: "Questions", id: "faq-title" }} items={items} photo={{ image: photo("a.webp", 10, 10, "x"), sizes: "1px" }} />,
    );
    const answer = container.querySelector(".kh-faq__a")!;
    expect([...answer.children].map((c) => c.tagName.toLowerCase())).toEqual(["p", "p", "ul"]);
    const list = answer.querySelector("ul")!;
    expect(list).toHaveClass("ks-faq__list");
    expect(list.querySelector("li strong")).toHaveTextContent("Data:");
    expect(norm(list.querySelector("li")?.textContent)).toBe("Data: the four facts.");
    expect(list.querySelector("li a")).toHaveAttribute("href", "#facts");
  });

  it("refuses a detail block an FAQ answer cannot hold", () => {
    const items = [{ id: "x", question: "Q", answer: "A", detail: [{ kind: "figure", image: photo("a.webp", 1, 1, "") }] }] as unknown as FaqItem[];
    expect(() => render(<FaqSection heading={{ title: "Q", id: "faq-title" }} items={items} />)).toThrow(/FaqSection/);
  });
});

describe("FaqSection: store (store.html fold 5)", () => {
  it("matches the approved block: the store's h2 and the questions at the column's width", () => {
    const fold = mockup("store").querySelector('[aria-labelledby="faq-title"]')!;
    const { container } = render(
      <FaqSection variant="store" heading={{ title: "Questions before you pay", id: "faq-title" }} items={itemsFrom(fold)} offer={offer} />,
    );
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
    expect(container.querySelector("[data-reveal]")).toBeNull();
  });
});
