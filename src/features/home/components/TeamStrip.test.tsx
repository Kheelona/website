import { render, screen } from "@testing-library/react";
import { TeamStrip } from "./TeamStrip";
import { FOUNDERS } from "@/lib/team";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

describe("TeamStrip", () => {
  it("shows every founder with a photo and the one-liner from lib/team", () => {
    render(<TeamStrip />);
    for (const f of FOUNDERS) {
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
});
