import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

const icon = <svg className="kh-icon" data-icon="magnifying-glass" aria-hidden="true" />;
const box = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("EmptyState", () => {
  it("renders the 404 block as 404.html does: div.kh-empty.kh-tone-blue.ks-404 > hidden art circle, then the page's heading and links", () => {
    const el = box(
      <EmptyState icon={icon} tone="blue" variant="404">
        <header className="kh-heading kh-heading--center" />
        <nav className="ks-404__nav" aria-label="Where to go next" />
      </EmptyState>,
    );
    expect(el.tagName).toBe("DIV");
    expect(el.className).toBe("kh-empty kh-tone-blue ks-404");
    const art = el.firstElementChild as HTMLElement;
    expect(art.className).toBe("kh-empty__art");
    expect(art.getAttribute("aria-hidden")).toBe("true");
    expect(art.firstElementChild?.getAttribute("data-icon")).toBe("magnifying-glass");
    expect([...el.children].map((c) => c.tagName)).toEqual(["SPAN", "HEADER", "NAV"]);
  });

  it("renders the DS title and sentence when given instead of children", () => {
    const el = box(<EmptyState icon={icon} title="No stories yet" body="When there are, you will see them here." />);
    expect(el.className).toBe("kh-empty");
    expect([...el.children].map((c) => `${c.tagName}.${c.className}`)).toEqual(["SPAN.kh-empty__art", "P.kh-empty__title", "P.kh-empty__body"]);
    expect(el.querySelector(".kh-empty__title")?.textContent).toBe("No stories yet");
  });
});
