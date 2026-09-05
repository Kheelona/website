import { render, screen } from "@testing-library/react";
import { SourcesList } from "./SourcesList";

const SOURCES = [
  { label: "WHO guideline", url: "https://www.ncbi.nlm.nih.gov/books/NBK541169/" },
  { label: "IAP guideline", url: "https://pubmed.ncbi.nlm.nih.gov/34969943/" },
];

describe("SourcesList", () => {
  it("renders nothing at all for an article without sources", () => {
    const { container } = render(<SourcesList sources={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is a labelled section with a heading and an ordered list a crawler can read", () => {
    render(<SourcesList sources={SOURCES} />);
    expect(screen.getByRole("region", { name: "Sources" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Sources" })).toBeTruthy();
    expect(screen.getAllByRole("listitem").length).toBe(2);
  });

  it("links every source, opening in a new tab without an opener, and names the host", () => {
    render(<SourcesList sources={SOURCES} />);
    const a = screen.getByRole("link", { name: "IAP guideline" });
    expect(a).toHaveAttribute("href", SOURCES[1].url);
    expect(a).toHaveAttribute("target", "_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
    expect(screen.getByText(/pubmed\.ncbi\.nlm\.nih\.gov/)).toBeTruthy();
  });
});
