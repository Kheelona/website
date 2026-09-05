import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  LAUNCH_PRICE,
  FULL_PRICE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  TAX_LINE,
} from "@/config/site";

/** The whole offer as one table (agency audit D06, 2026-09-05).
 *
 *  WHY A TABLE, on a site whose grammar is prose rooms. The offer is the one
 *  thing on this page a parent needs to compare rather than read: four amounts,
 *  a date and a market, where the failure mode is mistaking the ₹499 for the
 *  price of the toy. Prose can state that; a two-column table makes it
 *  impossible to misread, because every number sits beside the words that say
 *  what it is.
 *
 *  It is also the most extractable shape we can hand an answer engine for
 *  "how much does Lumi cost in India", which for this site is not a footnote:
 *  ChatGPT sent 66 to 74 visitors in the fortnight to 2026-09-05, against
 *  Google's 75.
 *
 *  MONEY LAW (§8.25-c): every figure is derived from `config/site`. Nothing here
 *  is typed twice, so a price change stays a one-integer edit and this table
 *  cannot drift from the panel that takes the payment.
 *
 *  A real <table> with row headers, not a grid of divs: the relationship between
 *  a label and its amount is data, and `<th scope="row">` is what carries it to
 *  a screen reader and to a parser. */
export function PriceTable({ className }: { className?: string }) {
  const rows: readonly { label: string; value: string }[] = [
    { label: `Total price for the ${CAP_UNITS_TEXT}`, value: LAUNCH_PRICE },
    { label: "Refundable deposit today", value: TOKEN_PRICE },
    { label: "Balance due at dispatch", value: BALANCE_PRICE },
    { label: `Price once the ${CAP_UNITS_TEXT} are gone`, value: FULL_PRICE },
    { label: "Shipping starts", value: SHIP_DATE_TEXT },
    { label: "Delivery market", value: "India" },
  ];

  return (
    <div className={cn("max-w-[560px]", className)}>
      {/* Wide content scrolls inside its own box rather than widening the page.
          The table is narrow, but the rule is cheap to keep and the mobile pass
          law about never widening the layout viewport is absolute. */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[16.5px]">
          <caption className="sr-only">
            Lumi pre-order price, deposit and dispatch in India
          </caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-b-0">
                <th
                  scope="row"
                  /* text-ink, not text-ink-muted. The muted token measures
                     4.19:1 on the sun wash this table sits on, which fails AA and is
                     NOT a §8.29 accepted pair (that exemption covers white on
                     the orange action fill only). Caught by qa:sweep on first
                     run, 7 violations. `ink` is >=8.99:1 on every tint. */
                  className="py-3 pr-4 font-normal text-ink"
                >
                  {row.label}
                </th>
                <td className="py-3 text-right font-display font-bold text-ink-head tabular-nums">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[15px] text-ink">
        {TAX_LINE} Your deposit is refundable in full until we dispatch. Read the{" "}
        <Link href="/refund" className="font-semibold text-ink-head underline">
          refund policy
        </Link>{" "}
        and the{" "}
        <Link href="/shipping" className="font-semibold text-ink-head underline">
          shipping details
        </Link>
        . Shipping starts on this date, which is when we dispatch rather than
        when it arrives.
      </p>
    </div>
  );
}
