import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * The DS ComparisonTable (`kh-compare-wrap`, `kh-compare`): Home's comparison by kind of product from 720 px
 * (home.html fold 7; CompareByCategory shows cards below 720 px) and the privacy page's recipients on laptops
 * (privacy.html part 6). The wrapper scrolls sideways inside itself, so it is a focusable, named region: keyboard
 * users can reach the hidden columns (DS gap G-05; axe `scrollable-region-focusable`). Marked cells take the DS
 * `kh-yes`, `kh-no` and `kh-some` spans; the check and cross are the `Icon` primitive, passed per cell. The caption line
 * closes the region; `compare-table.css` insets it inside the frame as the cells are (task Q2.16, QAL-7).
 */
export interface CompareCell {
  text: ReactNode;
  mark?: "yes" | "no" | "some";
  /** The mark's icon (check for yes, x for no); `some` has none. */
  icon?: ReactNode;
}

export interface CompareRow {
  label: ReactNode;
  cells: readonly CompareCell[];
}

export interface CompareTableProps {
  /** The region's accessible name ("Comparison by kind of product"). */
  label: string;
  /** The row-header column's heading ("What matters", "Who"). */
  firstColumn: ReactNode;
  columns: readonly ReactNode[];
  rows: readonly CompareRow[];
  /** The column that is Kheelu (`is-us`), counted in `columns` from 0. */
  usIndex?: number;
  /** The line under the table ("Kinds of products, not brands: …"). */
  caption?: ReactNode;
  /** The parent's composition class on the wrapper, added after the DS class. */
  className?: string;
}

function Cell({ cell }: { cell: CompareCell }) {
  if (cell.mark === undefined) return <>{cell.text}</>;
  return (
    <span className={`kh-${cell.mark}`}>
      {cell.icon}
      {cell.text}
    </span>
  );
}

export function CompareTable({ label, firstColumn, columns, rows, usIndex, caption, className }: CompareTableProps) {
  for (const row of rows) {
    if (row.cells.length !== columns.length) {
      throw new Error(`CompareTable: every row needs ${columns.length} columns of cells; one row has ${row.cells.length}`);
    }
  }
  const us = (i: number) => (i === usIndex ? "is-us" : undefined);
  return (
    <div className={clsx("kh-compare-wrap", className)} tabIndex={0} role="region" aria-label={label}>
      <table className="kh-compare">
        <thead>
          <tr>
            <th scope="col">{firstColumn}</th>
            {columns.map((column, i) => (
              <th key={i} scope="col" className={us(i)}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              <th scope="row">{row.label}</th>
              {row.cells.map((cell, i) => (
                <td key={i} className={us(i)}>
                  <Cell cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption !== undefined && <p className="kh-caption">{caption}</p>}
    </div>
  );
}
