/** The honest comparison table. Revamp M2 (founder brief pointer 6): same
 *  verdicts, parent words instead of technical ones, ages widened to 3 to 10,
 *  "Static toys" renamed for humans. The Lumi column fills with the semantic
 *  action token (white 4.66:1); raw brand orange stays decorative-only. */
const ROWS = [
  ["No screen, ever", "Yes", "Varies", "No", "Yes"],
  ["Talks with your child, not at them", "Yes", "Limited", "No", "No"],
  ["Speaks the languages of your home", "Yes, up to 10", "Rarely", "Varies", "No"],
  ["Cannot wander the internet", "Yes", "Rarely", "No", "Yes"],
  ["You can read every conversation", "Yes", "Partial", "Partial", "No"],
  ["Grows with them, ages 3 to 10", "Yes", "Varies", "No", "Varies"],
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
            <th scope="col" className="rounded-t-(--radius-card) bg-action p-4 text-left font-display text-lg font-bold text-white">
              Lumi
            </th>
            <th scope="col" className="p-4 text-left font-display text-lg font-bold text-ink-head">Smart toys</th>
            <th scope="col" className="p-4 text-left font-display text-lg font-bold text-ink-head">Phone or TV</th>
            <th scope="col" className="p-4 text-left font-display text-lg font-bold text-ink-head">Ordinary toys</th>
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
  );
}
