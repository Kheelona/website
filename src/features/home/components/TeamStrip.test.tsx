import { render, screen } from "@testing-library/react";
import { TeamStrip, HOME_TEAM } from "./TeamStrip";
import { FOUNDERS } from "@/lib/team";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

describe("TeamStrip", () => {
  it("shows every co-founder with a photo and the one-liner from lib/team", () => {
    render(<TeamStrip />);
    for (const f of HOME_TEAM) {
      expect(screen.getByAltText(f.name)).toHaveAttribute("src", expect.stringContaining("team"));
      expect(screen.getByText(f.short)).toBeInTheDocument();
    }
  });

  it("links to the full story on /team, the URL that stays indexed", () => {
    render(<TeamStrip />);
    expect(screen.getByRole("link", { name: /Our story/ })).toHaveAttribute("href", "/team");
  });

  it("offers a person on WhatsApp", () => {
    render(<TeamStrip />);
    expect(screen.getByRole("link", { name: "Ask us on WhatsApp" })).toHaveAttribute(
      "href",
      SUPPORT_WHATSAPP_HREF,
    );
  });

  it("makes no investment claim", () => {
    const { container } = render(<TeamStrip />);
    expect(container.textContent).not.toMatch(/backed by|supported by|invest/i);
  });

  /* Founder, 2026-10-04: Ria is removed from the site, Home's strip included. */
  it("shows the three co-founders, and not Ria", () => {
    render(<TeamStrip />);
    expect(HOME_TEAM.map((f) => f.name)).toEqual(["Apoorva Sahu", "Aman Soni", "Kashyap C.R"]);
    expect(screen.queryByText("Ria Mangala Rewari")).toBeNull();
    expect(FOUNDERS.some((f) => f.name.startsWith("Ria"))).toBe(false);
  });
});
