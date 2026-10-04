import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";
import { NAV_LINKS, RESERVE_LABEL, RESERVE_SHORT_LABEL, STORE_URL } from "@/config/site";

const pathname = vi.hoisted(() => ({ current: "/" as string | null }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

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
      screen.getByRole("link", { name: RESERVE_SHORT_LABEL }),
    ).toHaveAttribute("href", STORE_URL);
  });

  /* CMO merge (2026-10-04): every indexed URL stayed where it was, so the new
     tab labels must still point at the old paths. */
  it("keeps the indexed URLs behind the new tab labels", () => {
    const byLabel = Object.fromEntries(NAV_LINKS.map((l) => [l.label, l.href]));
    expect(byLabel["Meet Kheelu"]).toBe("/products/kheelu");
    expect(byLabel["Our story"]).toBe("/team");
    expect(byLabel["How it helps"]).toBe("/how");
    expect(byLabel["FAQ"]).toBe("/faq");
  });

  it("marks the current page, and its sub-pages, for assistive tech", () => {
    pathname.current = "/stories/how-children-learn-by-talking";
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Stories" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Safety" })).not.toHaveAttribute("aria-current");
    pathname.current = "/";
  });

  it("opens the mobile sheet with the nav links when the menu is tapped", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link", { name: NAV_LINKS[0].label })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: RESERVE_LABEL })).toHaveAttribute(
      "href",
      STORE_URL,
    );
  });
});
