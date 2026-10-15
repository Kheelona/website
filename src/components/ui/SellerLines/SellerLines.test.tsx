import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SellerLines } from "./SellerLines";

/* The three seller lines as the pages print them (entity, registered address, contact); the shells and SellerBlock pass
 * them from content/en-IN/seller.ts. The mockups' GSTIN line came off the website (D063 item 3, D064 item 11; task Q2.3),
 * so no shape takes one. */
const LINES = {
  entity: "Kheelona Robotics Private Limited",
  address: "5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India",
  contact: (
    <>
      <a href="https://wa.me/919187546483">WhatsApp</a> · <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>
    </>
  ),
};
const CONTACT_TEXT = "WhatsApp · hello@kheelona.com";

describe("SellerLines", () => {
  it("prints the footer's three spans in the footer's order: entity, address, contact (partials/footer.html, the GSTIN off)", () => {
    const { container } = render(
      <div className="kh-footer__legal">
        <SellerLines {...LINES} variant="footer" />
      </div>,
    );
    const spans = [...(container.firstElementChild as HTMLElement).children];
    expect(spans.map((s) => s.tagName)).toEqual(["SPAN", "SPAN", "SPAN"]);
    expect(spans.map((s) => s.textContent)).toEqual([LINES.entity, LINES.address, CONTACT_TEXT]);
  });

  /* Task Q2.16 (consistency review QAL-1): the footer passes its grievance officer link as `links`, which joins the
     contact line in one group (`ks-footer__links`, footer.css), so the two wrap together instead of the grievance link
     falling alone onto a line of its own at 1280 px. */
  it("with links, prints the contact line and the links as one group after the entity and the address", () => {
    const { container } = render(
      <div className="kh-footer__legal">
        <SellerLines {...LINES} variant="footer" links={<a href="/contact#grievance">Grievance officer</a>} />
      </div>,
    );
    const parts = [...(container.firstElementChild as HTMLElement).children];
    expect(parts.map((p) => `${p.tagName}.${p.className}`)).toEqual(["SPAN.", "SPAN.", "SPAN.ks-footer__links"]);
    expect(parts.slice(0, 2).map((p) => p.textContent)).toEqual([LINES.entity, LINES.address]);
    const group = [...parts[2].children];
    expect(group.map((c) => c.tagName)).toEqual(["SPAN", "A"]);
    expect(group.map((c) => c.textContent)).toEqual([CONTACT_TEXT, "Grievance officer"]);
  });

  it("takes links in the footer shape only", () => {
    for (const variant of ["block", "store"] as const) {
      expect(() => render(<SellerLines {...LINES} variant={variant} links={<a href="/contact#grievance">Grievance officer</a>} />), variant).toThrow(
        /footer/,
      );
    }
  });

  it("defaults to the footer spans", () => {
    const { container } = render(
      <div>
        <SellerLines {...LINES} />
      </div>,
    );
    expect((container.firstElementChild as HTMLElement).children).toHaveLength(3);
  });

  it("prints the contact page's address block: strong.kh-title, then the two lines as spans (contact.html fold 4)", () => {
    const { container } = render(<SellerLines {...LINES} variant="block" />);
    const address = container.firstElementChild as HTMLElement;
    expect(address.tagName).toBe("ADDRESS");
    expect(address.className).toBe("kh-body-l");
    const parts = [...address.children];
    expect(parts.map((p) => `${p.tagName}.${p.className}`)).toEqual(["STRONG.kh-title", "SPAN.", "SPAN."]);
    expect(parts.map((p) => p.textContent)).toEqual([LINES.entity, LINES.address, CONTACT_TEXT]);
  });

  it("prints the store footer's address in the store's order: entity, address, contact, broken by <br> (store.html fold 7)", () => {
    const { container } = render(<SellerLines {...LINES} variant="store" className="ks-store-foot__seller" />);
    const address = container.firstElementChild as HTMLElement;
    expect(address.tagName).toBe("ADDRESS");
    expect(address.className).toBe("kh-body-s ks-store-foot__seller");
    expect(address.firstElementChild?.tagName).toBe("STRONG");
    expect(address.firstElementChild?.textContent).toBe(LINES.entity);
    expect(address.querySelectorAll("br")).toHaveLength(2);
    expect(address.innerHTML.split("<br>").map((part) => part.replace(/<[^>]+>/g, ""))).toEqual([LINES.entity, LINES.address, CONTACT_TEXT]);
  });

  it("prints no GSTIN in any shape, whatever it is handed", () => {
    for (const variant of ["footer", "block", "store"] as const) {
      const extra = { ...LINES, gstin: "GSTIN 29AAMCK1530E1ZN" } as Parameters<typeof SellerLines>[0];
      const { container } = render(<SellerLines {...extra} variant={variant} />);
      expect(container.textContent, variant).not.toContain("GSTIN");
    }
  });
});
