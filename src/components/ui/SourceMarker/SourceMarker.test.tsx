import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SourceMarker, sourceId } from "./SourceMarker";

describe("SourceMarker", () => {
  it("renders a marker as the mockup does (home.html fold 3), linked to the section's source", () => {
    expect(renderToStaticMarkup(<SourceMarker n={1} label="Source" />)).toBe(
      '<a class="ks-src" href="#src-1" aria-label="Source 1">[1]</a>',
    );
  });

  it("numbers the link, the name and the visible label alike", () => {
    render(<SourceMarker n={7} label="Source" />);
    const link = screen.getByRole("link", { name: "Source 7" });
    expect(link).toHaveAttribute("href", "#src-7");
    expect(link).toHaveTextContent("[7]");
  });

  it("adds the article variant's class (articles keep the marker on one line)", () => {
    render(<SourceMarker n={2} label="Source" variant="article" />);
    expect(screen.getByRole("link").className).toBe("ks-src ks-src--article");
  });

  it("shares its target id with the sources note", () => {
    expect(sourceId(3)).toBe("src-3");
  });
});
