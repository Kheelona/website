import { describe, expect, it } from "vitest";
import { isSitePath } from "./links";

/* The one site-path test (task 3.6; wave-3 close "One of each helper"): Button, Logo and RichText route a site path
   through next/link, the rich-text parser accepts one as a link address, and the SEO URLs make one absolute. A browser
   reads `//host/path` and `/\host/path` as another site, so neither is a site path. */

describe("isSitePath", () => {
  it("is true for a path that starts with one slash", () => {
    for (const href of ["/", "/safety", "/products/kheelu", "/stories#learning", "/refund#returns", "/x?y=1", "/a/b/"]) {
      expect(isSitePath(href), href).toBe(true);
    }
  });

  it("is false for a protocol-relative address, //host (another site)", () => {
    for (const href of ["//evil.example", "//evil.example/safety", "///x"]) expect(isSitePath(href), href).toBe(false);
  });

  it("is false for a backslash after the slash, /\\host (browsers read it as //host)", () => {
    for (const href of ["/\\evil.example", "/\\/evil.example", "/\\"]) expect(isSitePath(href), href).toBe(false);
  });

  it("is false for everything else: other schemes, anchors, relative paths, the empty string", () => {
    for (const href of ["https://kheelona.com/", "mailto:hello@kheelona.com", "tel:+919187546483", "#faq", "safety", "./safety", "", " /safety"]) {
      expect(isSitePath(href), href).toBe(false);
    }
  });
});
