import { describe, expect, it } from "vitest";
import { iconName } from "./icon-name";

/* Content names its icons as strings (IconRef, src/content/types.ts); the Icon primitive takes the generated union. */
describe("iconName", () => {
  it("passes a DS icon through", () => {
    expect(iconName("whatsapp-logo")).toBe("whatsapp-logo");
    expect(iconName("arrow-counter-clockwise")).toBe("arrow-counter-clockwise");
  });

  it("refuses anything that is not one of the DS icons (a DS gap, G-12), and the map's own keys", () => {
    expect(() => iconName("phone")).toThrow(/not one of the DS icons/);
    expect(() => iconName("toString")).toThrow(/not one of the DS icons/);
  });
});
