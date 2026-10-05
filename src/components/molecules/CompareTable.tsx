/** The honest comparison table. Revamp M2 (founder brief pointer 6): same
 *  verdicts, parent words instead of technical ones, "Static toys" renamed for
 *  humans.
 *
 *  THE KHEELU COLUMN IS A TINT IN A FRAME, NOT A FILL (founder, 2026-10-04).
 *  It used to be a solid orange column with white text, which read as very
 *  colourful and was hard to read (2.88:1 on every cell). It is now the soft
 *  orange tint the hero chip uses, framed by a brand-orange border, with ink
 *  text: the column still owns the eye, and every cell reads at full contrast.
 *
 *  PLACE THIS ON WHITE OR CREAM ONLY (2026-09-11). The "No" cells are greyed
 *  with `text-ink-muted`, which measures 4.21:1 on the cool wash and 4.20:1 on
 *  sun. Both are under AA and both are already banned by
 *  `test/contrast-tokens.test.ts`; on white it is 4.80:1 and on cream 4.52:1.
 *  This went unnoticed for as long as it did because the component was written
 *  and then never rendered on any route, so no sweep had ever seen it. Its
 *  first placement, on /ai-toys-for-kids-in-india, put it on a cool room and
 *  `qa:sweep` failed it the same minute.
 *
 *  M4 mobile pass: below `sm` the table becomes a STACK, one card per claim.
 *  A 640px-wide table inside a phone-width room could only ever be a sideways
 *  scroll with no affordance: parents saw the claims and Kheelu's column with
 *  "Yes, up to 10" sliced mid-word, and the three toys being compared against
 *  sat off-screen entirely. Both views read from `rows`, so a verdict can never
 *  disagree with itself, and only one is ever in the DOM's a11y tree. */
/** One claim and its verdicts, in column order (Kheelu first). The site has
 *  ONE comparison, in lib/comparison.ts, shown on Home, /products/kheelu and
 *  the buyer's guide (founder, 2026-10-04: every page in sync). This component
 *  used to carry a second, private category table as its default; that table
 *  is gone, so a call site must pass the shared data and cannot drift. */
export type CompareRow = { label: string; values: readonly string[] };

export function CompareTable({
  columns,
  rows,
}: {
  /** Column heads, Kheelu first. Every row carries one value per column. */
  columns: readonly string[];
  rows: readonly CompareRow[];
}) {
  return (
    <>
      {/* Phones: one card per claim, Kheelu's answer first and loudest */}
      <ul className="flex flex-col gap-4 sm:hidden">
        {rows.map(({ label: claim, values }) => (
          <li
            key={claim}
            className="rounded-(--radius-card) border border-line bg-cream p-5"
          >
            <p className="mb-3 font-display text-[17px] font-extrabold leading-snug text-ink-head">
              {claim}
            </p>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[15px]">
              {columns.map((col, i) => (
                <div
                  key={col}
                  className={
                    i === 0
                      ? "col-span-2 -mx-2 grid grid-cols-subgrid items-baseline rounded-lg border-2 border-orange bg-orange/15 px-2 py-1.5"
                      : "col-span-2 grid grid-cols-subgrid items-baseline"
                  }
                >
                  <dt
                    className={
                      i === 0
                        ? "font-display font-bold text-ink-head"
                        : "text-ink-muted"
                    }
                  >
                    {col}
                  </dt>
                  <dd
                    className={
                      i === 0
                        ? "text-right font-bold text-ink-head"
                        : "text-right text-ink-head/85"
                    }
                  >
                    {values[i]}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* sm and up: the real table */}
      <div className="hidden overflow-x-auto rounded-(--radius-card) sm:block">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-[16px]">
          <thead>
            <tr>
              <th scope="col" className="p-4 text-left">
                <span className="sr-only">What matters</span>
              </th>
              {columns.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={
                    i === 0
                      ? "rounded-t-(--radius-card) border-2 border-b-0 border-orange bg-orange/15 p-4 text-left font-display text-lg font-bold text-ink-head"
                      : "p-4 text-left font-display text-lg font-bold text-ink-head"
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, values: [kheelu, ...others] }, i) => (
              <tr key={label}>
                <th
                  scope="row"
                  className={`p-4 text-left font-semibold text-ink-head ${i % 2 === 0 ? "bg-cream" : ""}`}
                >
                  {label}
                </th>
                <td
                  className={`border-x-2 border-orange bg-orange/15 p-4 text-left font-bold text-ink-head ${i === rows.length - 1 ? "rounded-b-(--radius-card) border-b-2" : ""}`}
                >
                  {kheelu}
                </td>
                {others.map((v, j) => (
                  <td
                    key={j}
                    className={`p-4 text-left ${v === "No" ? "text-ink-muted" : ""} ${i % 2 === 0 ? "bg-cream" : ""}`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
