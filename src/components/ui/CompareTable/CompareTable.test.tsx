import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { CompareTable } from "./CompareTable";

const yes = <svg className="kh-icon" data-icon="check" aria-hidden="true" />;
const no = <svg className="kh-icon" data-icon="x" aria-hidden="true" />;
const COLUMNS = ["Kheelu", "Puzzles and activity books", "Learning apps and videos"];
const ROWS = [
  {
    label: "Screen-free",
    cells: [
      { mark: "yes", icon: yes, text: "Yes" },
      { mark: "yes", icon: yes, text: "Yes" },
      { mark: "no", icon: no, text: "No" },
    ],
  },
  {
    label: "Asks your child a question back",
    cells: [
      { mark: "yes", icon: yes, text: "Yes, after it answers" },
      { mark: "no", icon: no, text: "No" },
      { mark: "some", text: "Some ask quiz questions" },
    ],
  },
] as const;

const table = () =>
  render(
    <CompareTable
      label="Comparison by kind of product"
      firstColumn="What matters"
      columns={COLUMNS}
      rows={ROWS}
      usIndex={0}
      caption="Kinds of products, not brands: what each one usually does."
    />,
  ).container.firstElementChild as HTMLElement;

describe("CompareTable", () => {
  it("wraps the table in a focusable, named region (DS gap G-05: keyboard users reach the hidden columns)", () => {
    const wrap = table();
    expect(wrap.className).toBe("kh-compare-wrap");
    expect(wrap.getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("region", { name: "Comparison by kind of product" })).toBe(wrap);
  });

  it("renders the DS table as home.html fold 7 does: column headers, then row headers with marked cells", () => {
    const wrap = table();
    const t = wrap.querySelector("table.kh-compare") as HTMLElement;
    expect(within(t).getAllByRole("columnheader").map((th) => [th.textContent, th.className])).toEqual([
      ["What matters", ""],
      ["Kheelu", "is-us"],
      ["Puzzles and activity books", ""],
      ["Learning apps and videos", ""],
    ]);
    expect(within(t).getAllByRole("rowheader").map((th) => th.textContent)).toEqual(["Screen-free", "Asks your child a question back"]);
    const row = t.querySelectorAll("tbody tr")[1];
    expect(row.innerHTML).toBe(
      '<th scope="row">Asks your child a question back</th>' +
        '<td class="is-us"><span class="kh-yes"><svg class="kh-icon" data-icon="check" aria-hidden="true"></svg>Yes, after it answers</span></td>' +
        '<td><span class="kh-no"><svg class="kh-icon" data-icon="x" aria-hidden="true"></svg>No</span></td>' +
        '<td><span class="kh-some">Some ask quiz questions</span></td>',
    );
  });

  it("prints the caption line under the table, inside the region", () => {
    const wrap = table();
    expect(wrap.lastElementChild?.outerHTML).toBe('<p class="kh-caption">Kinds of products, not brands: what each one usually does.</p>');
  });

  /* Task Q2.16 (the consistency review's QAL-7): the caption sat flush against the frame's left border (1 px in, the
     browser's 12 px p margins above and below), where every cell above keeps the DS's 16 px inset (bundle.css .kh-compare
     th/td: padding space-3 space-4). compare-table.css gives it the cells' inset inside the frame, its bottom a space-4
     clear of the 24 px corner, still the region's last child. */
  it("insets the caption inside the frame as the cells are, from its own stylesheet", () => {
    const css = readRepoFile("src/components/ui/CompareTable/compare-table.css").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css.replace(/\s+/g, " ").trim()).toBe(".kh-compare-wrap > .kh-caption { margin: 0; padding: var(--space-3) var(--space-4) var(--space-4); }");
    expect(table().lastElementChild).toHaveClass("kh-caption");
  });

  it("renders plain cells without a mark and no is-us column when none is given (privacy recipients table)", () => {
    const { container } = render(
      <CompareTable
        label="Everyone who handles your data, and where"
        firstColumn="Who"
        columns={["What they do for us", "Where"]}
        rows={[{ label: "Razorpay", cells: [{ text: "Takes your payment" }, { text: "India" }] }]}
        className="ks-recips-table"
      />,
    );
    expect(container.firstElementChild?.className).toBe("kh-compare-wrap ks-recips-table");
    expect(container.querySelector("tbody tr")?.innerHTML).toBe('<th scope="row">Razorpay</th><td>Takes your payment</td><td>India</td>');
    expect(container.querySelector(".is-us")).toBeNull();
    expect(container.querySelector(".kh-caption")).toBeNull();
  });

  it("refuses a row whose cells do not match the columns", () => {
    expect(() =>
      render(<CompareTable label="x" firstColumn="Who" columns={["A", "B"]} rows={[{ label: "r", cells: [{ text: "only one" }] }]} />),
    ).toThrow(/2 columns/);
  });
});
