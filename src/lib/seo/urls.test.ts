import { describe, expect, it } from "vitest";
import { absoluteUrl, KHEELU_PRODUCT_ID, ORGANIZATION_ID, personId, WEBSITE_ID } from "./urls";

describe("absoluteUrl", () => {
  it("puts a site path on the production origin, whatever the environment", () => {
    expect(absoluteUrl("/products/kheelu")).toBe("https://kheelona.com/products/kheelu");
    expect(absoluteUrl("/media/kheelu-front.jpg")).toBe("https://kheelona.com/media/kheelu-front.jpg");
  });

  it("writes the home page as the bare origin, as the live graph does", () => {
    expect(absoluteUrl("/")).toBe("https://kheelona.com");
  });

  it("keeps an in-page anchor (breadcrumb topics, setup steps)", () => {
    expect(absoluteUrl("/stories#learning")).toBe("https://kheelona.com/stories#learning");
  });

  it("refuses anything that is not a site path, so another host can never sneak in", () => {
    expect(() => absoluteUrl("https://example.com/x" as never)).toThrow(/site path/);
    expect(() => absoluteUrl("//example.com/x" as never)).toThrow(/site path/);
    expect(() => absoluteUrl("products/kheelu" as never)).toThrow(/site path/);
  });
});

describe("stable entity ids", () => {
  /* Opaque identifiers, not links: every consumer that already knows these entities recognises
     them by these exact strings (lessons §6). The product's still says lumi after the rename, on
     purpose: changing it would make one product read as two (architecture §9.2). */
  it("keeps the product @id on the pre-rename URL", () => {
    expect(KHEELU_PRODUCT_ID).toBe("https://kheelona.com/products/lumi#product");
  });

  it("keeps the publisher's two ids", () => {
    expect(ORGANIZATION_ID).toBe("https://kheelona.com/#organization");
    expect(WEBSITE_ID).toBe("https://kheelona.com/#website");
  });

  it("gives a person the id the live graph gave them, from their name", () => {
    expect(personId("Apoorva Sahu")).toBe("https://kheelona.com/team#apoorva-sahu");
    expect(personId("Kashyap C.R")).toBe("https://kheelona.com/team#kashyap-c-r");
    expect(personId("Ria Mangala Rewari")).toBe("https://kheelona.com/team#ria-mangala-rewari");
  });

  it("refuses a name that leaves nothing to identify", () => {
    expect(() => personId(" . ")).toThrow(/name/);
  });
});
