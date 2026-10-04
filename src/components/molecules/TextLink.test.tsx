import { render, screen } from "@testing-library/react";
import { TextLink } from "./TextLink";

describe("TextLink", () => {
  it("is a crawlable link with the label as its accessible name", () => {
    render(<TextLink href="/how">Read the research</TextLink>);
    expect(screen.getByRole("link", { name: "Read the research" })).toHaveAttribute("href", "/how");
  });

  /* One orange (founder, 2026-10-04): brand orange as small text fails AA, so
     the label is ink and the orange is the arrow and the underline. */
  it("keeps its text ink and puts the orange in decoration only", () => {
    const { container } = render(<TextLink href="/how">Read</TextLink>);
    const a = container.querySelector("a")!;
    expect(a.className).toContain("text-ink-head");
    expect(a.className).not.toMatch(/\btext-orange(-ink)?\b/);
    expect(a.className).toContain("decoration-orange");
    expect(container.querySelector("svg")!.getAttribute("class")).toContain("text-orange");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("opens external links safely in a new tab", () => {
    render(
      <TextLink href="https://wa.me/1" external>
        WhatsApp
      </TextLink>,
    );
    const a = screen.getByRole("link", { name: "WhatsApp" });
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("answers touch through the interaction contract", () => {
    render(<TextLink href="/x">Go</TextLink>);
    expect(screen.getByRole("link").className).toMatch(/active:scale/);
  });
});
