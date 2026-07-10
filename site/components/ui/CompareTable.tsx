/** The honest comparison table (Home S07, content verbatim from the doc). */
const ROWS = [
  ["Screen-free", "Yes", "Varies", "No", "Yes"],
  ["Holds a conversation", "Yes", "Limited", "No", "No"],
  ["Speaks your language", "Yes (10)", "Rarely", "Varies", "No"],
  ["No open internet", "Yes", "Rarely", "No", "Yes"],
  ["The parent sees everything", "Yes", "Partial", "Partial", "No"],
  ["Made for ages 3 to 6", "Yes", "Varies", "No", "Varies"],
] as const;

export function CompareTable() {
  return (
    <div className="overflow-x-auto rounded-(--radius-card)">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-[16px]">
        <thead>
          <tr>
            <th scope="col" className="p-4 text-left">
              <span className="sr-only">What matters</span>
            </th>
            {/* ink on orange (Button.tsx precedent, ~5.9:1): white on
                #EF762F is 2.88:1 and fails even the large-text floor */}
            <th scope="col" className="rounded-t-(--radius-card) bg-orange p-4 font-display text-lg font-bold text-ink-head">
              Lumi
            </th>
            <th scope="col" className="p-4 font-display text-lg font-bold text-ink-head">Smart toys</th>
            <th scope="col" className="p-4 font-display text-lg font-bold text-ink-head">Phone / TV</th>
            <th scope="col" className="p-4 font-display text-lg font-bold text-ink-head">Static toys</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, lumi, smart, phone, staticToys], i) => (
            <tr key={label}>
              <th
                scope="row"
                className={`p-4 text-left font-semibold text-ink-head ${i % 2 === 0 ? "bg-cream" : ""}`}
              >
                {label}
              </th>
              <td
                className={`bg-orange p-4 text-center font-bold text-ink-head ${i === ROWS.length - 1 ? "rounded-b-(--radius-card)" : ""}`}
              >
                {lumi}
              </td>
              {[smart, phone, staticToys].map((v, j) => (
                <td
                  key={j}
                  className={`p-4 text-center ${v === "No" ? "text-ink-muted" : ""} ${i % 2 === 0 ? "bg-cream" : ""}`}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
