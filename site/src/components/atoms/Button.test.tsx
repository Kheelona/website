import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders as a crawlable link with its label and href", () => {
    render(<Button href="/reserve">Reserve Lumi</Button>);
    const link = screen.getByRole("link", { name: "Reserve Lumi" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/reserve");
  });

  it("primary variant carries the brand fill and white label", () => {
    render(<Button href="#">Go</Button>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-orange-cta");
    expect(link.className).toContain("text-white");
  });

  it("ghost variant uses the outlined ink treatment, not the fill", () => {
    render(
      <Button href="#" variant="ghost">
        Go
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("border-ink-head");
    expect(link.className).not.toContain("bg-orange-cta");
  });

  it("emits a ripple element on pointer-down when motion is allowed", async () => {
    const user = userEvent.setup();
    render(<Button href="#">Go</Button>);
    const link = screen.getByRole("link");
    await user.pointer({ target: link, keys: "[MouseLeft>]" });
    expect(link.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
