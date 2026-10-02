import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";
import { NAV_LINKS, RESERVE_LABEL, RESERVE_SHORT_LABEL, STORE_URL } from "@/config/site";

describe("Navbar", () => {
  it("renders the wordmark, the five tabs, and the reserve CTA", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Kheelona" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const l of NAV_LINKS) {
      const link = within(nav).getByRole("link", { name: l.label });
      expect(link).toHaveAttribute("href", l.href);
    }
    const cta = screen.getByRole("link", { name: RESERVE_SHORT_LABEL });
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "navbar");
  });

  it("opens and closes the mobile menu, which carries every tab and the CTA", async () => {
    const user = userEvent.setup();
    const { container } = render(<Navbar />);
    const menu = container.querySelector<HTMLElement>("#mobile-menu")!;
    expect(menu).toHaveAttribute("aria-label", "Mobile");
    expect(menu).not.toBeVisible();

    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await user.click(button);
    expect(menu).toBeVisible();
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    for (const l of NAV_LINKS) {
      expect(within(menu).getByRole("link", { name: l.label })).toHaveAttribute("href", l.href);
    }
    expect(within(menu).getByRole("link", { name: RESERVE_LABEL })).toHaveAttribute(
      "data-ph-capture-attribute-cta",
      "navbar-mobile",
    );

    await user.keyboard("{Escape}");
    expect(menu).not.toBeVisible();
  });

  it("has no Hindi toggle: there is no Hindi site for it to open", () => {
    render(<Navbar />);
    expect(screen.queryByText("हिन्दी")).toBeNull();
  });
});
