/** The honest comparison table. Revamp M2 (founder brief pointer 6): same
 *  verdicts, parent words instead of technical ones, the growth row now carrying
 *  the V3 age arc (2 to 14 with the family),
 *  "Static toys" renamed for humans. The Kheelu column fills with the semantic
 *  action token (white 4.66:1); raw brand orange stays decorative-only.
 *
 *  M4 mobile pass: below `sm` the table becomes a STACK, one card per claim.
 *  A 640px-wide table inside a phone-width room could only ever be a sideways
 *  scroll with no affordance: parents saw the claims and Kheelu's column with
 *  "Yes, up to 10" sliced mid-word, and the three toys being compared against
 *  sat off-screen entirely. Both views read from ROWS, so a verdict can never
 *  disagree with itself, and only one is ever in the DOM's a11y tree. */
const COLUMNS = ["Kheelu", "Smart toys", "Phone or TV", "Ordinary toys"] as const;

const ROWS = [
  ["No screen, ever", "Yes", "Varies", "No", "Yes"],
  ["Talks with your child, not at them", "Yes", "Limited", "No", "No"],
  ["Speaks the languages of your home", "Yes, up to 10", "Rarely", "Varies", "No"],
  ["Cannot wander the internet", "Yes", "Rarely", "No", "Yes"],
  ["You can read every conversation", "Yes", "Partial", "Partial", "No"],
  /* V3: the row that carries the pipeline story (Kheelu from 3, the Kheelu
     Speaker onward, books across) — the age arc IS the differentiator the
     category cannot match (benchmarks-v3.md: MyWonder's clearest gap). No
     published ceiling since the 3+ repositioning (2026-08-23). */
  ["Grows with them", "Yes, for years with the family", "Varies", "No", "Varies"],
] as const;

export function CompareTable() {
  return (
    <>
      {/* Phones: one card per claim, Kheelu's answer first and loudest */}
      <ul className="flex flex-col gap-4 sm:hidden">
        {ROWS.map(([claim, ...values]) => (
          <li
            key={claim}
            className="rounded-(--radius-card) border border-line bg-cream p-5"
          >
            <p className="mb-3 font-display text-[17px] font-extrabold leading-snug text-ink-head">
              {claim}
            </p>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[15px]">
              {COLUMNS.map((col, i) => (
                <div key={col} className="col-span-2 grid grid-cols-subgrid items-baseline">
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
                        ? "text-right font-bold text-orange-ink"
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
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={
                    i === 0
                      ? "rounded-t-(--radius-card) bg-action p-4 text-left font-display text-lg font-bold text-white"
                      : "p-4 text-left font-display text-lg font-bold text-ink-head"
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, lumi, smart, phone, ordinary], i) => (
              <tr key={label}>
                <th
                  scope="row"
                  className={`p-4 text-left font-semibold text-ink-head ${i % 2 === 0 ? "bg-cream" : ""}`}
                >
                  {label}
                </th>
                <td
                  className={`bg-action p-4 text-left font-bold text-white ${i === ROWS.length - 1 ? "rounded-b-(--radius-card)" : ""}`}
                >
                  {lumi}
                </td>
                {[smart, phone, ordinary].map((v, j) => (
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
