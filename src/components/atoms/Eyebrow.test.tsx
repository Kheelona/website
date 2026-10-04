import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders the kicker label text", () => {
    render(<Eyebrow>How it works</Eyebrow>);
    expect(screen.getByText("How it works")).toBeInTheDocument();
  });

  it("defaults to the orange-ink color that passes 4.5:1 on every wash", () => {
    render(<Eyebrow>label</Eyebrow>);
    expect(screen.getByText("label").className).toContain("text-orange-ink");
  });

  it("applies a caller-supplied color instead of the default", () => {
    render(<Eyebrow color="text-white">label</Eyebrow>);
    const el = screen.getByText("label");
    expect(el.className).toContain("text-white");
    expect(el.className).not.toContain("text-orange-ink");
  });

  it("merges spacing overrides through className (last-wins)", () => {
    render(<Eyebrow className="mb-0">label</Eyebrow>);
    expect(screen.getByText("label").className).toContain("mb-0");
  });
});
