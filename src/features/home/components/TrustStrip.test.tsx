import { render, screen } from "@testing-library/react";
import { TrustStrip } from "./TrustStrip";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

describe("TrustStrip", () => {
  it("settles the four things a parent asks before scrolling on", () => {
    render(<TrustStrip />);
    for (const t of [
      "Team based in Bengaluru",
      "Refundable until we ship",
      "A real person on WhatsApp",
      "Ships 20 October 2026",
    ]) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
  });

  it("links the real person to the WhatsApp line, with the press contract", () => {
    render(<TrustStrip />);
    const link = screen.getByRole("link", { name: "A real person on WhatsApp" });
    expect(link).toHaveAttribute("href", SUPPORT_WHATSAPP_HREF);
    expect(link.className).toMatch(/active:scale/);
  });

  it("makes no investment claim (recognition stays 'Recognised by')", () => {
    const { container } = render(<TrustStrip />);
    expect(container.textContent).not.toMatch(/backed|supported|invest/i);
  });
});
