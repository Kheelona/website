import { describe, expect, it } from "vitest";
import { pageGraph } from "../jsonld";
import { aboutPageNode, contactPageNode, type WebPageFacts } from "./web-page";

/* /team and /contact declare what they are, as the live pages did (team/page.tsx:120-131 and
   contact/page.tsx:69-79 at archive/pre-reset-2026-10-10), and point at the Organization node,
   which carries the founders, the number and the email (architecture §9.2, ruling 2026-10-12).
   Fixture facts: the real name and fold 2's answer are content's (team.md fold 2, task 5.x). */
const fold2Answer =
  "Kheelona Robotics Private Limited, a small company in Bengaluru, makes Kheelu. Its three co-founders are Apoorva Sahu, Aman Soni and Kashyap C.R.";

describe("aboutPageNode", () => {
  it("declares /team the about page, with fold 2's answer, pointing at the Organization", () => {
    expect(aboutPageNode({ name: "The people who build Kheelona", description: fold2Answer, path: "/team" })).toEqual({
      "@type": "AboutPage",
      name: "The people who build Kheelona",
      url: "https://kheelona.com/team",
      description: fold2Answer,
      mainEntity: { "@id": "https://kheelona.com/#organization" },
    });
  });

  it("leaves the description out when it is not given, instead of inventing one", () => {
    const node = aboutPageNode({ name: "The people who build Kheelona", path: "/team" });
    expect(Object.keys(node).sort()).toEqual(["@type", "mainEntity", "name", "url"]);
  });
});

describe("contactPageNode", () => {
  it("declares /contact the contact page, pointing at the Organization", () => {
    expect(contactPageNode({ name: "Contact Kheelona", path: "/contact" })).toEqual({
      "@type": "ContactPage",
      name: "Contact Kheelona",
      url: "https://kheelona.com/contact",
      mainEntity: { "@id": "https://kheelona.com/#organization" },
    });
  });

  /* The Organization node holds the number and the email once (organization.ts); a second copy
     here could drift from it, so the builder has no way to take one, and a value that reaches it
     anyway is dropped. */
  it("never restates the Organization's number or email, even if they are passed in", () => {
    const smuggled = {
      name: "Contact Kheelona",
      path: "/contact",
      telephone: "+91 91875 46483",
      email: "hello@kheelona.com",
      contactPoint: { "@type": "ContactPoint" },
    } as WebPageFacts;
    expect(Object.keys(contactPageNode(smuggled)).sort()).toEqual(["@type", "mainEntity", "name", "url"]);
  });
});

describe("both page nodes", () => {
  it.each([
    ["AboutPage", aboutPageNode],
    ["ContactPage", contactPageNode],
  ] as const)("%s refuses an empty name or an empty description", (_type, build) => {
    expect(() => build({ name: " ", path: "/team" })).toThrow(/name/i);
    expect(() => build({ name: "Kheelona", description: "", path: "/team" })).toThrow(/description/i);
  });

  it("belong in a page graph: the shell declares the Organization they point at", () => {
    const graph = pageGraph(contactPageNode({ name: "Contact Kheelona", path: "/contact" }));
    expect(graph["@graph"].map((node) => node["@type"])).toEqual(["ContactPage"]);
  });
});
