import { render } from "@testing-library/react";
import { SiteBackdrop } from "./SiteBackdrop";

describe("SiteBackdrop", () => {
  it("renders a decorative fixed layer hidden from the accessibility tree", () => {
    const { container } = render(<SiteBackdrop />);
    const backdrop = container.querySelector("[data-backdrop]")!;
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop.className).toContain("fixed");
    expect(backdrop.className).toContain("pointer-events-none");
    expect(backdrop.className).toContain("-z-10");
  });

  it("carries the base wash and the drifting blob layers", () => {
    const { container } = render(<SiteBackdrop />);
    expect(container.querySelector(".site-backdrop-base")).not.toBeNull();
    expect(container.querySelector(".site-backdrop-blob")).not.toBeNull();
  });
});
