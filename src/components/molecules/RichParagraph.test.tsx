import { render, screen } from "@testing-library/react";
import { RichParagraph, linksIn, parseRichText } from "./RichParagraph";

describe("RichParagraph", () => {
  it("renders a plain paragraph unchanged", () => {
    render(<RichParagraph text="No links here." className="lead" />);
    const p = screen.getByText("No links here.");
    expect(p.tagName).toBe("P");
    expect(p.className).toContain("lead");
    expect(p.querySelector("a")).toBeNull();
  });

  it("turns an internal [label](/path) into a same-site link", () => {
    render(<RichParagraph text="Read the [Safety page](/safety) first." />);
    const a = screen.getByRole("link", { name: "Safety page" });
    expect(a).toHaveAttribute("href", "/safety");
    expect(a).not.toHaveAttribute("target");
  });

  it("opens an external source in a new tab without leaking an opener", () => {
    render(<RichParagraph text="Per the [WHO](https://www.who.int/x)." />);
    const a = screen.getByRole("link", { name: "WHO" });
    expect(a).toHaveAttribute("href", "https://www.who.int/x");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
    expect(a.getAttribute("rel")).toContain("noreferrer");
  });

  it("keeps the words around the links, in order", () => {
    const { container } = render(
      <RichParagraph text="One [two](/a) three [four](https://x.y/z) five." />,
    );
    expect(container.textContent).toBe("One two three four five.");
  });

  it("leaves brackets alone when they are not a link", () => {
    const { container } = render(<RichParagraph text="Ages [3+] and (still) plain, see [this](javascript:alert(1))." />);
    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toContain("[3+]");
  });

  it("parses only http(s) and root-relative targets", () => {
    expect(parseRichText("[a](/x) [b](https://h/p) [c](mailto:x@y) [d](//evil)")).toEqual([
      { type: "link", label: "a", href: "/x" },
      { type: "text", value: " " },
      { type: "link", label: "b", href: "https://h/p" },
      { type: "text", value: " [c](mailto:x@y) [d](//evil)" },
    ]);
    expect(linksIn("x [Safety](/safety) y").map((l) => l.href)).toEqual(["/safety"]);
  });
});
