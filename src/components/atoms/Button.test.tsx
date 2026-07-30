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

  it("primary variant carries the brand action fill and dark ink label (V4 D1)", () => {
    render(<Button href="#">Go</Button>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-action");
    expect(link.className).toContain("text-ink-head");
    // D1: the white keyline left with the white label
    expect(link.className).not.toContain("border-white");
  });

  it("ghost variant uses the outlined ink treatment, not the fill", () => {
    render(
      <Button href="#" variant="ghost">
        Go
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("border-ink-head");
    expect(link.className).not.toContain("bg-action");
  });

  it("holds one line from sm up but wraps below it, so long labels stay on screen", () => {
    render(<Button href="#">See the parent app on the Lumi page</Button>);
    const cls = screen.getByRole("link").className;
    expect(cls).toContain("whitespace-nowrap");
    expect(cls).toContain("max-sm:whitespace-normal");
  });

  it("emits a ripple element on pointer-down when motion is allowed", async () => {
    const user = userEvent.setup();
    render(<Button href="#">Go</Button>);
    const link = screen.getByRole("link");
    await user.pointer({ target: link, keys: "[MouseLeft>]" });
    expect(link.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
