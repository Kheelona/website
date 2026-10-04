import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders the kicker label text", () => {
    render(<Eyebrow>How it works</Eyebrow>);
    expect(screen.getByText("How it works")).toBeInTheDocument();
  });

  /* One orange (founder, 2026-10-04): the words are ink, readable on every
     wash, and the brand orange is the decorative bar in front of them. */
  it("defaults to ink words with a brand-orange bar, never the dark orange", () => {
    render(<Eyebrow>label</Eyebrow>);
    const cls = screen.getByText("label").className;
    expect(cls).toContain("text-ink-head");
    expect(cls).toContain("before:bg-orange");
    expect(cls).not.toContain("orange-ink");
  });

  it("applies a caller-supplied color instead of the default", () => {
    render(<Eyebrow color="text-white">label</Eyebrow>);
    const el = screen.getByText("label");
    expect(el.className).toContain("text-white");
    expect(el.className).not.toContain("text-ink-head");
  });

  it("merges spacing overrides through className (last-wins)", () => {
    render(<Eyebrow className="mb-0">label</Eyebrow>);
    expect(screen.getByText("label").className).toContain("mb-0");
  });
});
