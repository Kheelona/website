import postcss from "postcss";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { placeholder as ph } from "@/lib/content/placeholder";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { Placeholder } from "./Placeholder";

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

/* The production placeholder scan (task 2.9) hunts the marker opening across src/; built in pieces here so
   a test never reads as open content. */
const OPEN = "[" + "PLACEHOLDER";

describe("Placeholder", () => {
  it("renders an open item with its id as team.html does (founder photo, B24)", () => {
    expect(renderToStaticMarkup(<Placeholder id="B24" note="founder photo" />)).toBe(
      `<span class="ks-placeholder">${OPEN} B24: founder photo]</span>`,
    );
  });

  it("renders a note without an id as the legal pages do", () => {
    expect(renderToStaticMarkup(<Placeholder id={null} note="region" />)).toBe(
      `<span class="ks-placeholder">${OPEN}: region]</span>`,
    );
  });

  it("takes a placeholder made in content data as it is", () => {
    expect(renderToStaticMarkup(<Placeholder {...ph("F4", "size and weight")} />)).toBe(
      `<span class="ks-placeholder">${OPEN} F4: size and weight]</span>`,
    );
  });
});

describe("Placeholder CSS", () => {
  it("ports the mockup's dashed placeholder declaration for declaration (mockup.css:102)", () => {
    const ported = declarations("src/components/ui/Placeholder/placeholder.css", ".ks-placeholder");
    expect(ported.length).toBeGreaterThan(0);
    expect(ported).toEqual(declarations("mockup/mockup.css", ".mk-placeholder"));
  });
});
