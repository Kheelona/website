import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DefinitionList } from "./DefinitionList";

const ROWS = [
  { term: "Ages", value: "3 to 7" },
  { term: "Screen", value: "None" },
];
const dl = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("DefinitionList", () => {
  it("renders the spec table as meet-kheelu.html's specs panel does: dl.ks-specs > div > dt + dd", () => {
    const list = dl(<DefinitionList rows={ROWS} />);
    expect(list.tagName).toBe("DL");
    expect(list.className).toBe("ks-specs");
    expect(list.innerHTML).toBe("<div><dt>Ages</dt><dd>3 to 7</dd></div><div><dt>Screen</dt><dd>None</dd></div>");
  });

  it.each([
    ["specs", "ks-specs"],
    ["stack", "ks-specs ks-specs--stack"],
    ["order", "ks-order__rows"],
  ] as const)("the %s variant carries %s", (variant, classes) => {
    expect(dl(<DefinitionList rows={ROWS} variant={variant} />).className).toBe(classes);
  });

  it("keeps rich values (placeholders, links) as given", () => {
    const list = dl(<DefinitionList rows={[{ term: "Battery", value: <span className="ks-placeholder">[PLACEHOLDER F4: battery]</span> }]} />);
    expect(list.querySelector("dd > .ks-placeholder")?.textContent).toBe("[PLACEHOLDER F4: battery]");
  });
});
