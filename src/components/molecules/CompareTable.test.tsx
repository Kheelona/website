import { render, screen } from "@testing-library/react";
import { CompareTable } from "./CompareTable";
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from "@/lib/comparison";

const table = () => render(<CompareTable columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />);

describe("CompareTable (the site's one comparison, lib/comparison.ts)", () => {
  it("draws every column head and every claim, as a real table", () => {
    table();
    expect(screen.getByRole("table")).toBeInTheDocument();
    for (const col of COMPARISON_COLUMNS) {
      expect(screen.getByRole("columnheader", { name: col })).toBeInTheDocument();
    }
    for (const row of COMPARISON_ROWS) {
      expect(screen.getByRole("rowheader", { name: row.label })).toBeInTheDocument();
    }
  });

  it("compares product types, never brands", () => {
    expect(COMPARISON_COLUMNS).toEqual(["Kheelu", "Smart speaker", "Tablet or phone", "Robot toy with a screen"]);
  });

  it("says no camera, which the founder confirmed on 2026-10-04", () => {
    table();
    expect(screen.getByRole("rowheader", { name: "Camera in your home" })).toBeInTheDocument();
  });

  it("never claims talking is free for life (not confirmed)", () => {
    const { container } = table();
    expect(container.textContent).not.toMatch(/free for life/i);
  });

  /* Founder, 2026-10-04: the Kheelu column was solid orange with white text
     and hard to read; it is an orange tint in an orange frame, with ink text. */
  it("frames the Kheelu column as a tint with ink text, not a white-on-orange fill", () => {
    const { container } = table();
    const head = screen.getByRole("columnheader", { name: "Kheelu" });
    expect(head.className).toContain("bg-orange/15");
    expect(head.className).toContain("border-orange");
    expect(head.className).toContain("text-ink-head");
    expect(container.innerHTML).not.toMatch(/bg-action|text-white/);
  });

  /* M4 mobile pass: phones get a stack instead of a sideways scroll. */
  it("also stacks one card per claim for phones", () => {
    const { container } = table();
    expect(container.querySelectorAll("ul.sm\\:hidden li")).toHaveLength(COMPARISON_ROWS.length);
  });

  it("cannot let the two views disagree (both read the same rows)", () => {
    const { container } = table();
    const cardValues = Array.from(container.querySelectorAll("ul.sm\\:hidden li")).map(
      (li) => li.querySelectorAll("dd")[0]!.textContent,
    );
    const tableValues = Array.from(container.querySelectorAll("tbody tr")).map(
      (tr) => tr.querySelectorAll("td")[0]!.textContent,
    );
    expect(cardValues).toEqual(tableValues);
  });
});
