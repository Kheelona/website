import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HelpLine } from "./HelpLine";

const icon = <svg className="kh-icon" data-icon="whatsapp-logo" aria-hidden="true" />;
/* The contact slot takes RichText on the pages ("[WhatsApp](https://wa.me/…) or [{nowrap:call …}](tel:…)"). */
const contact = (
  <>
    <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483">call +91 91875 46483</a>
  </>
);

describe("HelpLine", () => {
  it("renders the help line as home.html fold 1 does: p.kh-body-s.ks-help > icon, lead, contact", () => {
    const { container } = render(<HelpLine icon={icon} lead="Questions?" contact={contact} />);
    const p = container.firstElementChild as HTMLElement;
    expect(p.tagName).toBe("P");
    expect(p.className).toBe("kh-body-s ks-help");
    expect(p.firstElementChild?.getAttribute("data-icon")).toBe("whatsapp-logo");
    expect(p.textContent).toBe(" Questions? WhatsApp or call +91 91875 46483");
  });

  it("keeps both ways to reach a person as real links", () => {
    render(<HelpLine icon={icon} lead="Questions?" contact={contact} />);
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
    expect(screen.getByRole("link", { name: "call +91 91875 46483" })).toHaveAttribute("href", "tel:+919187546483");
  });

  it("renders without an icon in the store header, with the header's own class", () => {
    const { container } = render(<HelpLine lead="Need help?" contact={contact} className="ks-store-head__help" />);
    const p = container.firstElementChild as HTMLElement;
    expect(p.className).toBe("kh-body-s ks-help ks-store-head__help");
    expect(p.querySelector("svg")).toBeNull();
    expect(p.textContent).toBe("Need help? WhatsApp or call +91 91875 46483");
  });
});
