import { render, screen } from "@testing-library/react";
import { CompareTable } from "./CompareTable";
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from "@/lib/comparison";

describe("CompareTable", () => {
  it("renders the comparison grid with the Kheelu column", () => {
    render(<CompareTable />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Kheelu" }),
    ).toBeInTheDocument();
  });

  it("labels each row in parent words via a row header", () => {
    render(<CompareTable />);
    expect(
      screen.getByRole("rowheader", { name: "No screen, ever" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Talks with your child, not at them" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Grows with them" }),
    ).toBeInTheDocument();
  });

  it("keeps the category columns, renamed for humans", () => {
    render(<CompareTable />);
    expect(
      screen.getByRole("columnheader", { name: "Smart toys" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Phone or TV" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Ordinary toys" }),
    ).toBeInTheDocument();
  });

  /* M4 mobile pass: phones get a stack instead of a 640px sideways scroll. */
  it("also stacks one card per claim for phones", () => {
    const { container } = render(<CompareTable />);
    const stack = container.querySelector("ul.sm\\:hidden");
    expect(stack).not.toBeNull();
    expect(stack!.querySelectorAll("li").length).toBe(6);
    // each card names every column, so nothing compared against is off-screen
    const first = stack!.querySelector("li")!;
    for (const col of ["Kheelu", "Smart toys", "Phone or TV", "Ordinary toys"]) {
      expect(first.textContent).toContain(col);
    }
  });

  it("hides exactly one view at each size, so the a11y tree never doubles", () => {
    const { container } = render(<CompareTable />);
    expect(container.querySelector("ul")!.className).toContain("sm:hidden");
    expect(
      container.querySelector("div.overflow-x-auto")!.className,
    ).toContain("hidden");
  });

  it("carries the age arc as the growth verdict (V3, open-ended since 3+)", () => {
    render(<CompareTable />);
    expect(screen.getAllByText("Yes, for years with the family").length).toBe(2);
  });

  it("answers the languages row with the published number in both views", () => {
    render(<CompareTable />);
    expect(screen.getAllByText("Yes, up to 10").length).toBe(2);
  });

  it("cannot let the two views disagree (both read one ROWS source)", () => {
    const { container } = render(<CompareTable />);
    const cardValues = Array.from(
      container.querySelectorAll("ul.sm\\:hidden li"),
    ).map((li) => li.querySelectorAll("dd")[0]!.textContent);
    const tableValues = Array.from(
      container.querySelectorAll("tbody tr"),
    ).map((tr) => tr.querySelectorAll("td")[0]!.textContent);
    expect(cardValues).toEqual(tableValues);
  });

  /* CMO merge (2026-10-04): the product-type comparison renders through this
     same component, from lib/comparison.ts. */
  describe("with the product-type comparison", () => {
    it("draws every column head and every claim from lib/comparison", () => {
      render(<CompareTable columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />);
      for (const col of COMPARISON_COLUMNS) {
        expect(screen.getByRole("columnheader", { name: col })).toBeInTheDocument();
      }
      for (const row of COMPARISON_ROWS) {
        expect(screen.getByRole("rowheader", { name: row.label })).toBeInTheDocument();
      }
    });

    it("says no camera, which the founder confirmed on 2026-10-04", () => {
      render(<CompareTable columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />);
      expect(screen.getByRole("rowheader", { name: "Camera in your home" })).toBeInTheDocument();
    });

    it("never claims talking is free for life (not confirmed)", () => {
      const { container } = render(
        <CompareTable columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />,
      );
      expect(container.textContent).not.toMatch(/free for life/i);
    });

    it("keeps the two views in agreement with custom rows too", () => {
      const { container } = render(
        <CompareTable columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />,
      );
      const cardValues = Array.from(container.querySelectorAll("ul.sm\\:hidden li")).map(
        (li) => li.querySelectorAll("dd")[0]!.textContent,
      );
      const tableValues = Array.from(container.querySelectorAll("tbody tr")).map(
        (tr) => tr.querySelectorAll("td")[0]!.textContent,
      );
      expect(cardValues).toEqual(tableValues);
    });
  });
});
