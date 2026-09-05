import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFoundPanel } from "./NotFoundPanel";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

describe("NotFoundPanel", () => {
  it("offers a person, not only a link home", () => {
    render(<NotFoundPanel />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("That page is not here.");
    expect(screen.getByRole("link", { name: /message us on whatsapp/i })).toHaveAttribute(
      "href",
      SUPPORT_WHATSAPP_HREF,
    );
    expect(screen.getByRole("link", { name: /pre-order page/i })).toHaveAttribute("href", "/");
  });

  it("drops the pre-order button for a reader who has already paid", () => {
    /* Sending someone who paid us back to the buying page is the wrong offer,
       and it is the case the confirmation page hits. */
    render(<NotFoundPanel title="We cannot open that order right now." cta={false} />);
    expect(screen.queryByRole("link", { name: /pre-order page/i })).toBeNull();
    expect(screen.getByRole("link", { name: /message us on whatsapp/i })).toBeInTheDocument();
  });

  it("does not say 'Or' when there is nothing to be an alternative to", () => {
    const { container } = render(<NotFoundPanel cta={false} />);
    expect(container.textContent).not.toMatch(/\bOr\s+Message/);
    expect(container.textContent).toContain("Message us on WhatsApp");
  });
});
