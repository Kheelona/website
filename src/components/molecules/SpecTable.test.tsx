import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpecTable } from "./SpecTable";
import { KHEELU_FACTS, productProperties } from "@/lib/product-facts";
import { KHEELU_AGES, SHIP_DATE_TEXT } from "@/config/site";

describe("SpecTable", () => {
  it("renders one row per published fact, name before value", () => {
    render(<SpecTable />);
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(KHEELU_FACTS.length);
    /* Row headers, not plain cells: a screen reader must announce the spec
       name with each value. */
    expect(screen.getAllByRole("rowheader")).toHaveLength(KHEELU_FACTS.length);
  });

  it("renders facts from config, never hand-typed copies", () => {
    render(<SpecTable />);
    expect(screen.getByText(`${KHEELU_AGES} years`)).toBeInTheDocument();
    expect(screen.getByText(SHIP_DATE_TEXT)).toBeInTheDocument();
  });

  it("shows a caption only when one is given", () => {
    const { unmount } = render(<SpecTable />);
    expect(screen.queryByRole("caption")).not.toBeInTheDocument();
    unmount();
    render(<SpecTable caption="What you get" />);
    expect(screen.getByText("What you get")).toBeInTheDocument();
  });
});

describe("the never-invent law, pinned", () => {
  /* These three are the specs a competitor table carries and this product has
     not announced. If a future edit types a number into any of them, this test
     is the thing that stops it reaching production. */
  it.each(["Battery life", "Warranty", "Toy-safety certification"])(
    "keeps %s honest and out of schema",
    (name) => {
      const fact = KHEELU_FACTS.find((f) => f.name === name);
      expect(fact, `${name} row must exist and answer honestly`).toBeDefined();
      expect(fact!.pending).toBe(true);
      /* No digits: a pending spec that has acquired a number has stopped being
         pending, and the row must be re-rated deliberately rather than drift. */
      expect(fact!.value).not.toMatch(/\d+\s*(hours?|days?|months?|years?)\b/i);
    },
  );

  it("emits only announced facts as schema properties", () => {
    const props = productProperties();
    const pendingNames = KHEELU_FACTS.filter((f) => f.pending).map((f) => f.name);
    expect(props).toHaveLength(KHEELU_FACTS.length - pendingNames.length);
    for (const name of pendingNames) {
      expect(props.map((p) => p.name)).not.toContain(name);
    }
    expect(props.every((p) => p["@type"] === "PropertyValue")).toBe(true);
  });

  it("makes no manufacturing-origin claim anywhere in the facts", () => {
    /* The company is in Bengaluru; where the toy is MADE has never been
       published. A competitor's cited page says "built in India" and that is
       not a reason to say it too. */
    const all = KHEELU_FACTS.map((f) => `${f.name} ${f.value}`).join(" ");
    expect(all).not.toMatch(/made in|built in|manufactured in|assembled in/i);
  });
});
