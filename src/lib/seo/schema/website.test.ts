import { describe, expect, it } from "vitest";
import { websiteNode } from "./website";

describe("websiteNode", () => {
  it("declares the site, published by the Organization it points at", () => {
    expect(websiteNode({ name: "Kheelona", inLanguage: "en-IN" })).toEqual({
      "@type": "WebSite",
      "@id": "https://kheelona.com/#website",
      url: "https://kheelona.com",
      name: "Kheelona",
      inLanguage: "en-IN",
      publisher: { "@id": "https://kheelona.com/#organization" },
    });
  });
});
