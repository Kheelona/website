import type { RichTextString, Tone } from "@/content/types";

/**
 * Words with the order's own values in them (task 5.16). /thanks prints the amount paid, the balance and the email the
 * confirmation went to from the order row, never from the store's current mode (ADR-013; the store-confirmation copy
 * page, "How to read this page"), so the content's `{price:…}` tokens, which read the live offer, cannot carry them.
 * Content holds the words around named slots instead, and the page fills them with the values it already derives.
 *
 *   ["We have your ", { slot: "amount" }, ", and your place …"]
 *
 * A filled string is plain text: the head and the order card print it as a text node, so an email address is never
 * read as markup.
 */
export type SlotText<K extends string = never> = readonly (string | { readonly slot: K })[];

/** The words with every slot filled, as one string. Throws on a slot it has no value for. */
export function fillSlots<K extends string>(text: SlotText<K>, values: Readonly<Record<K, string>>): string {
  return text
    .map((part) => {
      if (typeof part === "string") return part;
      const value = values[part.slot];
      if (value === undefined) throw new Error(`fillSlots: no value for the slot "${part.slot}"`);
      return value;
    })
    .join("");
}

/** A step of the confirmation's "What happens next" as content holds it: its body may name the order's balance. */
export interface ThanksStepCopy {
  readonly tone?: Tone;
  readonly title: RichTextString;
  readonly body: SlotText<"balance">;
}

/** The inline syntax's own characters (architecture §6.2): a value that holds one would be read as markup. */
const CONTENT_SYNTAX = /[{}[\]]/;

/**
 * The steps with their bodies filled, as StepsSection's `thanks` placement takes them (its RichText reads each body in
 * the content syntax, so a value carrying that syntax is refused instead of rendered). Steps that name no value (a
 * full-payment order's) need none; a slot with no value throws.
 */
export function fillSteps(
  steps: readonly ThanksStepCopy[],
  values: Readonly<Partial<Record<"balance", string>>> = {},
): { tone?: Tone; title: RichTextString; body: RichTextString }[] {
  const used = steps.flatMap(({ body }) => body.flatMap((part) => (typeof part === "string" ? [] : [values[part.slot]])));
  for (const value of used) {
    if (value !== undefined && CONTENT_SYNTAX.test(value)) throw new Error(`fillSteps: "${value}" carries content syntax`);
  }
  return steps.map(({ tone, title, body }) => ({
    ...(tone ? { tone } : {}),
    title,
    body: fillSlots(body, values as Readonly<Record<"balance", string>>),
  }));
}
