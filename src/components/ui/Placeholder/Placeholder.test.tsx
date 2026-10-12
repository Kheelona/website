import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { placeholder as ph } from "@/lib/content/placeholder";
import { Placeholder } from "./Placeholder";

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
