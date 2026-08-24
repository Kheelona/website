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

  it("primary variant carries the brand action fill and a WHITE label (§8.29)", () => {
    render(<Button href="#">Go</Button>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-action");
    /* Founder decision 2026-08-24, reversing V4 D1: white on #EF762F, knowingly
       at 2.88:1. The arithmetic and the acceptance live in
       test/contrast-tokens.test.ts; this only pins what the atom renders. */
    expect(link.className).toContain("text-white");
    expect(link.className).not.toContain("text-ink-head");
    // the white keyline stays retired: V4 removed it, and §8.29 does not undo that
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
