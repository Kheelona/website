import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { SectionLinkRow, SectionTitle } from "./section-parts";

/* The heading and the closing link row the 3.3 sections share (task 3.3). */

describe("SectionTitle", () => {
  it("renders the DS SectionHeading: eyebrow, h2 with its id, lead; aligned by the heading or the caller", () => {
    const heading = { eyebrow: "Compare", title: "Kheelu {hand:asks questions.}", lead: "Thinking out loud.", id: "compare-title" };
    const { container, rerender } = render(<SectionTitle heading={heading} />);
    const header = container.querySelector("header")!;
    expect(header.className).toBe("kh-heading");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "compare-title");
    expect(header.querySelector(".kh-hand")).toHaveTextContent("asks questions.");
    rerender(<SectionTitle heading={{ ...heading, align: "center" }} />);
    expect(container.querySelector("header")).toHaveClass("kh-heading--center");
    rerender(<SectionTitle heading={heading} align="center" className="ks-x" />);
    expect(container.querySelector("header")).toHaveClass("kh-heading--center", "ks-x");
  });

  it("resolves prices in the title with the page's offer", () => {
    render(<SectionTitle heading={{ title: "Kheelu is {price:headline}", id: "t" }} offer={buildOffer("token")} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Kheelu is ₹4,999");
  });
});

describe("SectionLinkRow", () => {
  it("renders nothing without a link", () => {
    const { container } = render(<SectionLinkRow link={undefined} />);
    expect(container.innerHTML).toBe("");
  });

  it("a ghost link with its arrow after the words, in the DS actions row, tagged with its CTA value", () => {
    const { container } = render(<SectionLinkRow link={{ label: "See all questions", href: "/products/kheelu#faq", cta: "faq-more" }} />);
    const row = container.firstElementChild!;
    expect(row.className).toBe("kh-section__actions");
    const link = screen.getByRole("link", { name: "See all questions" });
    expect(link).toHaveClass("kh-btn", "kh-btn--ghost");
    expect(link).toHaveAttribute("data-ph-capture-attribute-cta", "faq-more");
    expect([...link.children].map((c) => c.tagName.toLowerCase())).toEqual(["span", "svg"]);
  });

  it("another icon after the words with iconEnd, and a centred row", () => {
    const { container } = render(<SectionLinkRow center link={{ label: "Back to your details", href: "#details", iconEnd: "caret-up" }} />);
    expect(container.firstElementChild).toHaveClass("kh-section__actions--center");
    const arrow = container.querySelector("a svg path")!.getAttribute("d");
    const { container: plain } = render(<SectionLinkRow link={{ label: "x", href: "#x" }} />);
    expect(plain.querySelector("a svg path")!.getAttribute("d")).not.toBe(arrow);
  });

  it("a secondary button with its icon first when the link has an icon", () => {
    render(<SectionLinkRow link={{ label: "See the full safety facts", href: "/safety", icon: "shield-check" }} />);
    const link = screen.getByRole("link", { name: "See the full safety facts" });
    expect(link).toHaveClass("kh-btn--secondary");
    expect([...link.children].map((c) => c.tagName.toLowerCase())).toEqual(["svg", "span"]);
  });
});
