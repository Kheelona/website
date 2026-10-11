import type { Placeholder } from "@/content/types";

/**
 * Placeholders: the one place their syntax and marker text are defined (ADR-004,
 * architecture §6.2). In data: `placeholder('F4', 'size and weight')`. Inside a
 * content string: `{ph:F4 size and weight}`, or `{ph:region}` when the copy page
 * names no open item. Both render `[PLACEHOLDER F4: size and weight]` and
 * `[PLACEHOLDER: region]`.
 *
 * The placeholder build guard (task 2.9) skips this file and src/content/types.ts,
 * which define the syntax; every other file in src/ that still carries one fails
 * the production build. So nothing else in src/lib spells the marker or the token:
 * they import from here.
 *
 * An id is an open-item id: a capital letter, then capitals and digits, optionally
 * in hyphenated groups, with at least one digit (F4, F11, B24, C6, G-20, D047), or
 * one of the few word ids in WORD_IDS (ARTICLE, task 2.1's article stubs). In a
 * token, the first word is the id when it is one and a note follows; otherwise the
 * whole body is the note. So "GST documents", "BIS number" and "HSN code" stay
 * notes, as the mockups print them. A new word id is added to WORD_IDS, never
 * guessed from capitals.
 */

const ID = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*$/;

/** Open-item ids that are words, not numbered items. */
const WORD_IDS: readonly string[] = ["ARTICLE"];

function isId(word: string): boolean {
  return ID.test(word) && (/\d/.test(word) || WORD_IDS.includes(word));
}

/** The inline token, for messages that tell an author how to write one. */
export const PLACEHOLDER_TOKEN_HINT = "{ph:ID note}";

/** A placeholder for a fact the founder has not supplied yet. */
export function placeholder(id: string | null, note: string): Placeholder {
  if (id !== null && !isId(id)) {
    throw new Error(
      `Placeholder id "${id}" is not an open-item id (a numbered item such as F4, B24 or G-20, or ${WORD_IDS.join(", ")}); pass null when the copy page names none.`,
    );
  }
  const trimmed = note.trim();
  if (trimmed === "") {
    throw new Error(`Placeholder ${id ?? "without an id"} needs a note saying what is missing.`);
  }
  return Object.freeze({ kind: "placeholder", id, note: trimmed }) as Placeholder;
}

/** True for a placeholder, including one copied through serialisation. */
export function isPlaceholder(value: unknown): value is Placeholder {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "placeholder" &&
    typeof (value as { note?: unknown }).note === "string"
  );
}

/** The visible marker: `[PLACEHOLDER F4: size and weight]` or `[PLACEHOLDER: region]`. */
export function placeholderText(item: Pick<Placeholder, "id" | "note">): string {
  return `[PLACEHOLDER${item.id === null ? "" : ` ${item.id}`}: ${item.note}]`;
}

/** Reads the body of an inline placeholder token: "F4 size and weight" or "region". */
export function parsePlaceholderToken(body: string): Placeholder {
  const trimmed = body.trim();
  if (trimmed === "") {
    throw new Error(`A placeholder token is empty: write ${PLACEHOLDER_TOKEN_HINT}.`);
  }
  const space = trimmed.search(/\s/);
  const first = space === -1 ? trimmed : trimmed.slice(0, space);
  if (isId(first)) {
    if (space === -1) {
      throw new Error(`Placeholder ${first} needs a note after its id: write ${PLACEHOLDER_TOKEN_HINT}.`);
    }
    return placeholder(first, trimmed.slice(space));
  }
  return placeholder(null, trimmed);
}
