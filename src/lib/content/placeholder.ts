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

/* ── Hidden until the value arrives (D054 item 19; task 6.7) ──────────────── */

/**
 * Open items whose slots are hidden, not marked: F4, the product's final specs. The founder sends each value before
 * Gate B; a row or line still waiting on one comes off the page instead of blocking the build (the box contents stay).
 * Nothing of a hidden slot renders, on any environment, so the production build has nothing to refuse, and the
 * placeholder guard lets the slot stay in the source, where its value lands (scripts/guards/placeholders.mjs). Every
 * other placeholder is marked on beta and refused in production.
 */
export const HIDDEN_ITEMS: readonly string[] = Object.freeze(["F4"]);

/** True for a placeholder whose open item is hidden until its value arrives (an F4 slot). */
export function isHiddenPlaceholder(value: unknown): value is Placeholder {
  return isPlaceholder(value) && value.id !== null && HIDDEN_ITEMS.includes(value.id);
}

/** An inline placeholder token with the white space before it. Its body never holds a brace (the rich-text parser
 *  refuses one), so the first closing brace ends it. */
const TOKEN_WITH_SPACE = /\s*\{ph:([^{}]*)\}/g;

/** A label waiting on its value: the words before a hidden slot end in a colon ("Battery safety:"). */
const LABEL_ONLY = /:\s*$/;

/**
 * A content string without its hidden slots, each with the white space before it; null when nothing of its own is left
 * (no words, or only a label whose value was the slot). Every other token, placeholders included, stays as it is.
 */
export function withoutHiddenSlots(text: string): string | null {
  let hid = false;
  const rest = text
    .replace(TOKEN_WITH_SPACE, (whole, body: string) => {
      if (!isHiddenPlaceholder(parsePlaceholderToken(body))) return whole;
      hid = true;
      return "";
    })
    .trim();
  if (!hid) return text;
  return rest === "" || LABEL_ONLY.test(rest) ? null : rest;
}

/** A value with its hidden slots gone, or null when nothing of it is left. */
function shownValue(value: unknown): unknown {
  if (typeof value === "string") return withoutHiddenSlots(value);
  if (isHiddenPlaceholder(value)) return null;
  if (Array.isArray(value)) {
    const kept = value.map(shownValue).filter((v) => v !== null);
    return kept.length === 0 ? null : kept;
  }
  return value;
}

/**
 * The rows or lines that still say something once their hidden slots are gone (D054 item 19), in order, each with those
 * slots removed. `key` names the field holding the words: a spec row's `value`, a line's `text` or `body`. A value that
 * is a list keeps the entries that say something; a row with nothing left comes off. Every other placeholder stays.
 */
export function withoutHiddenRows<const T extends object>(items: readonly T[], key: keyof T): T[] {
  return items.flatMap((item) => {
    const value = shownValue(item[key]);
    if (value === null) return [];
    return value === item[key] ? [item] : [{ ...item, [key]: value }];
  });
}
