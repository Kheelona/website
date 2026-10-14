/** The no-wrap spans a journal post never stores (ADR-014; journal-pipeline §5.2, "(derived)").
 *
 *  The approved heads and bodies keep every "N-year-old" compound on one line, with its trailing comma or ’s
 *  ("a {nowrap:3-year-old,} skill by skill", "a {nowrap:3-year-old’s} vocabulary"), so a narrow phone never breaks it
 *  at a hyphen. A writer in the dashboard types the plain words; the adapter (./to-article.ts) puts the span back on
 *  every rich-text field the head and the reading column show. Text only: the caller never passes a link address. */

/** An age compound in figures or in words, plural or not, with a trailing comma or ’s; never part of a longer word
 *  (a slug's "3-to-6-year-old", "3-year-older"). */
const AGE = /(?<![\p{L}\p{N}-])(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)-year-olds?(?:,|[’']s)?(?![\p{L}\p{N}-])/giu;

/** An existing span, left as it is (so the function is idempotent). */
const SPAN = /\{nowrap:[^{}]*\}/g;

/** `text` with every age compound outside an existing span wrapped in `{nowrap:…}`. */
export function nowrapAges(text: string): string {
  let out = "";
  let from = 0;
  for (const span of text.matchAll(SPAN)) {
    out += text.slice(from, span.index).replace(AGE, "{nowrap:$&}") + span[0];
    from = span.index + span[0].length;
  }
  return out + text.slice(from).replace(AGE, "{nowrap:$&}");
}
