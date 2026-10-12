import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { outline, parseMockup } from "../../../../test/support/mockup-compare";
import { CompareByCategory, type CompareByCategoryProps } from "./CompareByCategory";

/* CompareByCategory (task 3.3; components §2; DS gap G-05): Home fold 7, "compared by category". Below 720 px one card
 * per row with Kheelu's answer first; from 720 px the DS comparison table. Compared class by class (mk- renamed ks-)
 * with the built mockup fold through the mockup comparison harness (test/support/mockup-compare.ts), and word for word. */

const mockup = parseMockup;
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");
/** Every mockup block of the fold takes its ks- name (mk-compare-stack, mk-compare-others). */
const shape = (el: Element) => outline(el);

/* Home fold 7's words (home.md fold 7; home.html:270-307). */
const PROPS: CompareByCategoryProps = {
  heading: {
    eyebrow: "Compare",
    title: "Other AI gives answers. Kheelu {hand:asks questions.}",
    lead: "Thinking out loud, not tapping on a screen.",
    id: "compare-title",
  },
  label: "Comparison by kind of product",
  firstColumn: "What matters",
  columns: { us: "Kheelu", others: ["Puzzles and activity books", "Learning apps and videos", "Smart speakers and chatbots"] },
  rows: [
    {
      label: "Screen-free",
      us: { mark: "yes", text: "Yes" },
      others: [{ mark: "yes", text: "Yes" }, { mark: "no", text: "No" }, { mark: "some", text: "Varies" }],
      phone: {
        us: "Kheelu: Yes",
        others: ["Puzzles and activity books: yes", "Learning apps and videos: no", "Smart speakers and chatbots: varies"],
      },
    },
    {
      label: "Holds a back-and-forth conversation",
      us: { mark: "yes", text: "Yes" },
      others: [{ mark: "no", text: "No" }, { mark: "some", text: "Rarely: mostly tapping and watching" }, { mark: "yes", text: "Yes" }],
      phone: {
        us: "Kheelu: Yes",
        others: ["Puzzles and activity books: no", "Learning apps and videos: rarely, mostly tapping and watching", "Smart speakers and chatbots: yes"],
      },
    },
    {
      label: "Asks your child a question back",
      us: { mark: "yes", text: "Yes, after it answers" },
      others: [{ mark: "no", text: "No" }, { mark: "some", text: "Some ask quiz questions" }, { mark: "some", text: "Usually just answers" }],
      phone: {
        us: "Kheelu: Yes, after it answers",
        others: ["Puzzles and activity books: no", "Learning apps and videos: some ask quiz questions", "Smart speakers and chatbots: usually just answer"],
      },
    },
    {
      label: "You can read every conversation",
      us: { mark: "yes", text: "Yes, in the parent app" },
      others: [{ mark: "some", text: "Nothing to read" }, { mark: "some", text: "Nothing to read" }, { mark: "some", text: "Varies" }],
      phone: {
        us: "Kheelu: Yes, in the parent app",
        others: ["Puzzles and activity books: nothing to read", "Learning apps and videos: nothing to read", "Smart speakers and chatbots: varies"],
      },
    },
  ],
  caption: "Kinds of products, not brands: what each one usually does.",
  link: { label: "How to choose an AI toy", href: "/ai-toys-for-kids-in-india", cta: "compare-learn" },
};

describe("CompareByCategory (Home fold 7)", () => {
  const fold = mockup("home").querySelector('[aria-labelledby="compare-title"]')!;

  it("matches the approved fold: centred heading, the phone cards, the laptop table, then the guide link", () => {
    const { container } = render(<CompareByCategory {...PROPS} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("draws the DS check and cross where the mockup does", () => {
    const { container } = render(<CompareByCategory {...PROPS} />);
    const paths = (root: ParentNode, sel: string) => [...root.querySelectorAll(`${sel} path`)].map((p) => p.getAttribute("d"));
    for (const sel of [".kh-yes", ".kh-no"]) expect(paths(container, sel)).toEqual(paths(fold, sel));
    expect(container.querySelectorAll(".kh-some svg")).toHaveLength(0);
  });

  it("puts Kheelu first on each phone card and marks its table column (is-us)", () => {
    const { container } = render(<CompareByCategory {...PROPS} />);
    const card = container.querySelector(".ks-compare-stack .kh-card")!;
    expect(card.querySelector(".kh-card__body .kh-yes")).toHaveTextContent("Kheelu: Yes");
    expect([...container.querySelectorAll("thead th")].map((th) => th.className)).toEqual(["", "is-us", "", "", ""]);
  });

  it("keeps the table a focusable named region for keyboard users (G-05) and reveals only the cards", () => {
    const { container } = render(<CompareByCategory {...PROPS} />);
    const region = screen.getByRole("region", { name: "Comparison by kind of product" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(container.querySelector(".ks-compare-stack")).toHaveAttribute("data-reveal");
    expect(container.querySelectorAll("[data-reveal]")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "How to choose an AI toy" })).toHaveAttribute("data-ph-capture-attribute-cta", "compare-learn");
  });

  it("refuses a row whose cells or phone lines do not match the columns", () => {
    const bad = { ...PROPS, rows: [{ ...PROPS.rows[0], others: PROPS.rows[0].others.slice(1) }] };
    expect(() => render(<CompareByCategory {...bad} />)).toThrow(/CompareByCategory/);
    const badPhone = { ...PROPS, rows: [{ ...PROPS.rows[0], phone: { ...PROPS.rows[0].phone, others: ["one"] } }] };
    expect(() => render(<CompareByCategory {...badPhone} />)).toThrow(/CompareByCategory/);
  });
});
