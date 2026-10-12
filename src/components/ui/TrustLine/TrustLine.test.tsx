import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrustLine } from "./TrustLine";

/* The icon slot takes the Icon primitive (task 2.2) on the pages; a marked svg stands in for it here. */
const icon = (name: string) => <svg className="kh-icon" data-icon={name} aria-hidden="true" />;

const LINKED = [
  { icon: icon("truck"), label: "Deliveries start mid-November", href: "/shipping" },
  { icon: icon("arrow-counter-clockwise"), label: "7-day returns, no questions asked", href: "/refund" },
];

describe("TrustLine", () => {
  it("renders the linked trust line as home.html fold 1 does: ul.kh-trustline.ks-trust > li > a > icon, label", () => {
    const { container } = render(<TrustLine items={LINKED} />);
    const list = container.firstElementChild as HTMLElement;
    expect(list.tagName).toBe("UL");
    expect(list.className).toBe("kh-trustline ks-trust");
    const links = within(list).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/shipping", "/refund"]);
    expect(links.map((a) => a.textContent)).toEqual(["Deliveries start mid-November", "7-day returns, no questions asked"]);
    // the icon comes first inside the link, then the words (mockup order)
    expect(links[0].firstElementChild?.getAttribute("data-icon")).toBe("truck");
    expect(list.querySelectorAll(":scope > li > a").length).toBe(2);
  });

  it("names each link by its words only (the icon is decorative)", () => {
    render(<TrustLine items={LINKED} />);
    expect(screen.getByRole("link", { name: "7-day returns, no questions asked" })).toBeInTheDocument();
  });

  it("opens each link in a new tab on the store and says so to screen readers", () => {
    render(<TrustLine items={LINKED} newTabNote=" (opens in a new tab)" />);
    // jsdom's name computation trims the note's leading space; the text itself is checked below
    const link = screen.getByRole("link", { name: /^Deliveries start mid-November\s?\(opens in a new tab\)$/ });
    expect(link.textContent).toBe("Deliveries start mid-November (opens in a new tab)");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link.querySelector(".kh-sr")?.textContent).toBe(" (opens in a new tab)");
  });

  it("keeps marketing links in the same tab", () => {
    render(<TrustLine items={LINKED} />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("target");
      expect(link.querySelector(".kh-sr")).toBeNull();
    }
  });

  it("renders an unlinked facts line without the link styling (home.html fold 6, mk-facts)", () => {
    const { container } = render(
      <TrustLine
        className="ks-facts"
        items={[
          { icon: icon("eye-slash"), label: "No camera" },
          { icon: icon("wifi-slash"), label: "It can’t browse the internet" },
        ]}
      />,
    );
    const list = container.firstElementChild as HTMLElement;
    expect(list.className).toBe("kh-trustline ks-facts");
    expect(within(list).queryAllByRole("link")).toEqual([]);
    expect([...list.querySelectorAll("li")].map((li) => li.textContent)).toEqual(["No camera", "It can’t browse the internet"]);
    expect(list.querySelector("li > svg")?.getAttribute("data-icon")).toBe("eye-slash");
  });
});
