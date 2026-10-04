import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";
import { NAV_LINKS, PREORDER_LABEL, STORE_URL } from "@/config/site";

describe("Navbar", () => {
  it("renders the logo, the primary nav links, and the reserve CTA", () => {
    render(<Navbar />);
    expect(screen.getByRole("img", { name: "Kheelona" })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const l of NAV_LINKS) {
      const link = within(nav).getByRole("link", { name: l.label });
      expect(link).toHaveAttribute("href", l.href);
    }
    expect(
      screen.getByRole("link", { name: PREORDER_LABEL }),
    ).toHaveAttribute("href", STORE_URL);
  });

  it("opens the mobile sheet with the nav links when the menu is tapped", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link", { name: NAV_LINKS[0].label })).toBeInTheDocument();
  });
});
