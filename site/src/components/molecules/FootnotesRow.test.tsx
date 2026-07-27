import { render, screen } from "@testing-library/react";
import { Footnote, FootnotesRow, V3_FOOTNOTES } from "./FootnotesRow";

describe("FootnotesRow", () => {
  it("renders the notes as an ordered list", () => {
    const { container } = render(<FootnotesRow items={V3_FOOTNOTES} />);
    expect(container.querySelectorAll("ol > li").length).toBe(2);
    expect(screen.getByText(/the full language list is announced before launch/)).toBeInTheDocument();
  });

  it("gives every note an anchor id a marker can reach", () => {
    const { container } = render(<FootnotesRow items={V3_FOOTNOTES} />);
    for (const f of V3_FOOTNOTES) {
      expect(container.querySelector(`#${f.id}`)).not.toBeNull();
    }
  });

  it("marker links to its note and is labelled for screen readers", () => {
    render(<Footnote n={2} id="fn-kheelona-plus" />);
    const marker = screen.getByRole("link", { name: "Footnote 2" });
    expect(marker).toHaveAttribute("href", "#fn-kheelona-plus");
  });

  it("keeps the Kheelona+ note free of a rupee price (gate V3-b)", () => {
    render(<FootnotesRow items={V3_FOOTNOTES} />);
    const plus = screen.getByText(/Kheelona\+:/);
    expect(plus.textContent).not.toMatch(/₹|Rs\.?\s?\d/);
    expect(plus.textContent).toMatch(/announced before launch/);
  });
});
