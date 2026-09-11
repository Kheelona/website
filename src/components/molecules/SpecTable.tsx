import { KHEELU_FACTS } from "@/lib/product-facts";

/** Kheelu's specification, as a table (SEO/AEO/GEO round 2026-09-11, §8.36).
 *
 *  Rendered from `KHEELU_FACTS`, the same constant that becomes the Product's
 *  `additionalProperty` array, so the visible page and the emitted graph are
 *  one list by construction. Nothing here is hand-typed; see that file for why
 *  battery life, warranty and country of manufacture are deliberately absent.
 *
 *  A real `<table>` with `<th scope="row">`, not a definition list or a grid of
 *  cards. Two reasons, and the second is the point of the whole round. A table
 *  is what a screen reader announces as a table, with the spec name read before
 *  its value on every row. And a table is the shape an answer engine lifts into
 *  a comparison: the Perplexity answer measured on 2026-09-11 rendered its
 *  recommendation as a feature grid, built from vendor pages that published
 *  their numbers in rows. Prose describing the same facts does not get lifted.
 *
 *  Two columns, so it never needs a horizontal scroll at 390px and the
 *  overflow-x law has nothing to catch. No `min-width`. */
export function SpecTable({ caption }: { caption?: string }) {
  return (
    <table className="w-full border-separate border-spacing-0 text-left text-[16px]">
      {caption ? (
        <caption className="mb-5 text-left text-[15px] leading-[1.6] text-ink-muted">
          {caption}
        </caption>
      ) : null}
      <tbody>
        {KHEELU_FACTS.map((f, i) => (
          <tr key={f.name}>
            <th
              scope="row"
              className={`w-[40%] max-w-[16ch] border-line py-4 pr-4 align-top font-display text-[15px] font-bold leading-snug text-ink-head sm:text-[16px] ${
                i > 0 ? "border-t" : ""
              }`}
            >
              {f.name}
            </th>
            <td
              className={`border-line py-4 align-top leading-[1.6] ${
                i > 0 ? "border-t" : ""
              } ${f.pending ? "text-ink-muted" : "text-ink-head/90"}`}
            >
              {f.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
