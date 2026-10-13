import type { TextDeviation } from "../e2e/support/deviations";
import type { FactEdit } from "../e2e/support/page-facts";
import { normaliseText, sentenceDiff, sentences } from "../e2e/support/parity";

/*
 * The approved mockups with the founder's page facts applied (task 6.7; D055, D054 items 12 and 19). mockup/ is frozen
 * (D046), so a test that compares a page with its mockup applies the accepted changes to a clone of the mockup's
 * element: each placeholder the founder filled, each line ruled off, each approved phrase that changed, as
 * test/e2e/support/page-facts.ts lists them for the page. What is left must be the build, markup and words alike, and
 * the sentences that differ from the untouched mockup are exactly the ones the text-parity rule accepts. Test support
 * (it needs a DOM), never shipped.
 */

/** A mockup element's words as an edit names them: its text, white space collapsed. */
const wordsOf = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

export interface FactsOptions {
  /** Apply the edits to a page the build rendered (a legal template's parity fixture, copied from the mockup) instead
   *  of the mockup itself: the mockup's `mk-` block names, in a selector or in new markup, read as the build's `ks-`. */
  readonly built?: boolean;
}

const asBuilt = (text: string) => text.replace(/\bmk-/g, "ks-");

/** A fragment of markup as nodes of `doc`, for the place an edit fills. */
function nodes(doc: Document, html: string): Node[] {
  const template = doc.createElement("template");
  template.innerHTML = html;
  return Array.from(template.content.childNodes);
}

/** Takes an element out of its line with the white space before it, as a hidden slot goes (withoutHiddenSlots): the
 *  words around it then read as the build prints them, to the character. */
function removeWithSpace(el: Element): void {
  const before = el.previousSibling;
  if (before?.nodeType === 3) before.textContent = (before.textContent ?? "").replace(/\s+$/, "");
  el.remove();
}

/**
 * A deep clone of `source` with every edit applied, in order. Each edit finds the first element its selector matches
 * whose words are the edit's `was` and that no earlier edit used (document order, so two identical placeholders take
 * two edits, the first match first), then changes it, or the element around it that `scope` names. An edit that finds
 * nothing throws: an accepted change the mockup does not hold is a mistake, never a silent pass.
 */
export function withFacts(source: Element, edits: readonly FactEdit[], { built = false }: FactsOptions = {}): Element {
  const root = source.cloneNode(true) as Element;
  const doc = root.ownerDocument;
  const used = new Set<Element>();
  const markup = built ? asBuilt : (text: string) => text;
  for (const edit of edits) {
    const at = markup(edit.at);
    const match = Array.from(root.querySelectorAll(at)).find((el) => !used.has(el) && wordsOf(el) === edit.was);
    if (!match) throw new Error(`no unused ${at} reads "${edit.was}" in the ${built ? "page" : "mockup"}`);
    used.add(match);
    const target = edit.scope ? match.closest(edit.scope) : match;
    if (!target) throw new Error(`"${edit.was}" sits in no ${edit.scope}`);
    if (edit.now === null) target.remove();
    else if (edit.inner) target.replaceChildren(...nodes(doc, markup(edit.now)));
    else if (edit.now === "") removeWithSpace(target);
    else target.replaceWith(...nodes(doc, markup(edit.now)));
  }
  return root;
}

/** Elements that start a line of their own, as the browser lays the pages out (innerText puts a break at each). */
const BLOCKS =
  "address, article, aside, blockquote, dd, div, dl, dt, figcaption, figure, footer, h1, h2, h3, h4, h5, h6, header, li, nav, ol, p, section, table, tbody, td, th, thead, tr, ul";

/** An element's sentences as the text-parity spec reads a page (its visible text, a line per block), from the DOM. */
export function blockSentences(el: Element): string[] {
  const copy = el.cloneNode(true) as Element;
  for (const block of copy.querySelectorAll(BLOCKS)) {
    block.before("\n");
    block.after("\n");
  }
  return sentences(normaliseText(copy.textContent ?? ""));
}

/** The sentences an edit list changes, as the text-parity spec diffs a page: the mockup's that go (`missing`) and the
 *  ones the build prints in their place (`extra`), each in the order it first appears. */
export function factSentences(source: Element, edits: readonly FactEdit[]): { missing: string[]; extra: string[] } {
  return sentenceDiff(blockSentences(source), blockSentences(withFacts(source, edits)));
}

/** What a text-parity rule reaches on a page: the mockup's sentences it excuses, and the sentences of the page with its
 *  facts applied that it accepts (each once, in order). A page's facts rule must reach exactly its listed sentences. */
export function ruleReach(source: Element, edits: readonly FactEdit[], rule: TextDeviation): { excused: string[]; accepted: string[] } {
  const once = (lines: string[]) => [...new Set(lines)];
  return {
    excused: once(blockSentences(source).filter((line) => rule.mockup.test(line))),
    accepted: once(blockSentences(withFacts(source, edits)).filter((line) => rule.build?.test(line) ?? false)),
  };
}
