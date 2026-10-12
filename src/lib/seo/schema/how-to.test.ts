import { describe, expect, it } from "vitest";
import { howToNode } from "./how-to";

describe("howToNode", () => {
  /* /setup's HowTo comes from the same steps the page shows (architecture §9.2). */
  it("turns the page's steps into numbered HowToStep nodes that link back to the page", () => {
    expect(
      howToNode({
        name: "How to set up Kheelu",
        description: "Charge Kheelu, connect it to Wi-Fi with the parent app, and set your child's age.",
        path: "/setup",
        steps: [
          { name: "Charge Kheelu", text: "Plug Kheelu in until the light is steady.", anchor: "charge" },
          { name: "Connect it to Wi-Fi", text: "Open the parent app and follow the steps." },
        ],
      }),
    ).toEqual({
      "@type": "HowTo",
      name: "How to set up Kheelu",
      description: "Charge Kheelu, connect it to Wi-Fi with the parent app, and set your child's age.",
      url: "https://kheelona.com/setup",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Charge Kheelu",
          text: "Plug Kheelu in until the light is steady.",
          url: "https://kheelona.com/setup#charge",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Connect it to Wi-Fi",
          text: "Open the parent app and follow the steps.",
          url: "https://kheelona.com/setup",
        },
      ],
    });
  });

  it("names supplies, tools and a total time only when the page states them", () => {
    const node = howToNode({
      name: "How to set up Kheelu",
      path: "/setup",
      steps: [{ name: "Charge Kheelu", text: "Plug it in." }],
      supply: ["Kheelu and its charger"],
      tool: ["The parent app on a phone"],
      totalTime: "PT15M",
    });
    expect(node).toMatchObject({
      supply: [{ "@type": "HowToSupply", name: "Kheelu and its charger" }],
      tool: [{ "@type": "HowToTool", name: "The parent app on a phone" }],
      totalTime: "PT15M",
    });
    const bare = howToNode({ name: "How to set up Kheelu", path: "/setup", steps: [{ name: "Charge Kheelu", text: "Plug it in." }] });
    expect(Object.keys(bare).sort()).toEqual(["@type", "name", "step", "url"]);
  });

  it("refuses a HowTo without steps, or a step without words", () => {
    expect(() => howToNode({ name: "Setup", path: "/setup", steps: [] })).toThrow(/at least one/);
    expect(() => howToNode({ name: "Setup", path: "/setup", steps: [{ name: "Charge", text: "" }] })).toThrow(/text/);
  });

  it("refuses an anchor that is not a plain fragment id", () => {
    expect(() =>
      howToNode({ name: "Setup", path: "/setup", steps: [{ name: "Charge", text: "Plug it in.", anchor: "#charge" }] }),
    ).toThrow(/anchor/);
  });
});
