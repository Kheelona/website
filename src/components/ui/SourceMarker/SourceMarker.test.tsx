import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { SourceMarker, sourceId } from "./SourceMarker";

/** The declarations of the top-level rule with exactly these selectors, in order. */
function declarations(path: string, selector: string): string[] {
  const out: string[] = [];
  postcss.parse(readRepoFile(path)).each((node) => {
    if (node.type === "rule" && node.selectors.join(", ") === selector) {
      node.each((d) => void (d.type === "decl" && out.push(`${d.prop}: ${d.value}`)));
    }
  });
  return out;
}

const CSS = "src/components/ui/SourceMarker/source-marker.css";

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

describe("SourceMarker CSS: the mockup's marker, declaration for declaration", () => {
  it("ports the marker (mockup.css:35), its weight under the ds-weight-800 exception", () => {
    const ported = declarations(CSS, ".ks-src");
    expect(ported).toContain("font-weight: 800");
    expect(ported).toEqual(declarations("mockup/mockup.css", ".mk-src"));
  });

  it("keeps a tap area 4 px above and below the line and none to the sides, so neighbouring markers keep their own taps", () => {
    // mockup.css:36 reached 12 px above and below and 8 px each side; side by side or on consecutive lines one marker
    // took the other's taps (test/e2e/tap-areas.spec.ts; the main session's ruling at the wave 8 merge).
    expect(declarations("mockup/mockup.css", ".mk-src::before")).toEqual(["content: \"\"", "position: absolute", "inset: calc(var(--space-3) * -1) calc(var(--space-2) * -1)"]);
    expect(declarations(CSS, ".ks-src::before")).toEqual(["content: \"\"", "position: absolute", "inset: calc(var(--space-1) * -1) 0"]);
    expect(declarations(CSS, ".ks-src")).toContain("position: relative");
    expect(readRepoFile("design-system/project/tokens.css")).toMatch(/--space-1:\s*4px/);
  });

  it("ports the article stylesheet's marker rule as the article variant only (stories.css:72; mapping §6.2)", () => {
    expect(declarations(CSS, ".ks-src--article")).toEqual(declarations("mockup/css/stories.css", ".mk-src"));
  });
});
