import { useCallback, type RefCallback } from "react";

/** Keeps what a parent has typed in the pre-order form while they leave the tab to pay (D070 / B3).
 *
 *  A UPI app, an app switch or a phone that discards the tab can come back to an empty form. This holds the name, the
 *  phone number and the email in THIS tab's `sessionStorage`, and puts them back into the fields on the next load of
 *  the form, so the parent finishes instead of typing it all again.
 *
 *  What the founder approved (24 Nov 2026), and what this file therefore does not do:
 *   - `sessionStorage` only: it lives in this tab, is gone when the tab closes, and no other tab or visit sees it. Never
 *     `localStorage`, a cookie or IndexedDB.
 *   - Three fields, and only those: DRAFT_FIELDS below. NEVER the child's age, the consent tick, the tier or anything
 *     that came from the server. The list is the whole of what is read from the form and the whole of what is stored.
 *   - It ends when the parent pays (`clearFormDraft`, called from `onPaid` before the move to /thanks) and after 30
 *     minutes (DRAFT_TTL_MS): an older draft is deleted and nothing is restored.
 *   - It is private to the browser: no tracker is called from here, no event is added, and the fields stay masked in
 *     session replay. A restore is not a change event, so it never counts as "started filling the form".
 *   - It is a convenience, never a dependency: every access to storage can fail (private mode, a full quota, blocked
 *     site data) and the form then works exactly as it did before. Nothing here throws. */

/** The single storage key. Its value is `{ v: 1, savedAt: <ms since the epoch>, parentName, phone, email }`. */
export const DRAFT_KEY = "kh_preorder_draft";

/** How long a draft is good for, counted from the last change to one of the three fields. */
export const DRAFT_TTL_MS = 30 * 60 * 1000;

/** The only fields ever read from the form or written to storage. The child's age is not here, on purpose. */
export const DRAFT_FIELDS = ["parentName", "phone", "email"] as const;

type DraftField = (typeof DRAFT_FIELDS)[number];
type Draft = { v: 1; savedAt: number } & Record<DraftField, string>;

/** A ceiling on what is written or put back, whatever the form allows (the name field already stops at 80). */
const MAX_CHARS = 254;

const isDraftField = (name: unknown): name is DraftField => (DRAFT_FIELDS as readonly unknown[]).includes(name);

/** This tab's storage, or null when the browser refuses it: reading the property itself can throw. */
function tabStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function field(form: HTMLFormElement, name: DraftField): HTMLInputElement | null {
  const control = form.elements.namedItem(name);
  return control instanceof HTMLInputElement ? control : null;
}

/** A stored draft read back with exactly the known keys, or null when it is not one of ours. */
function parse(raw: string): Draft | null {
  try {
    const data = JSON.parse(raw) as Record<string, unknown> | null;
    if (!data || typeof data !== "object" || data.v !== 1 || typeof data.savedAt !== "number") return null;
    const { parentName, phone, email } = data;
    if (typeof parentName !== "string" || typeof phone !== "string" || typeof email !== "string") return null;
    return {
      v: 1,
      savedAt: data.savedAt,
      parentName: parentName.slice(0, MAX_CHARS),
      phone: phone.slice(0, MAX_CHARS),
      email: email.slice(0, MAX_CHARS),
    };
  } catch {
    return null;
  }
}

/** Write what is in the three fields now; an empty draft removes the key instead of leaving an empty record behind. */
export function saveFormDraft(form: HTMLFormElement): void {
  const storage = tabStorage();
  if (!storage) return;
  try {
    const draft: Draft = { v: 1, savedAt: Date.now(), parentName: "", phone: "", email: "" };
    for (const name of DRAFT_FIELDS) draft[name] = (field(form, name)?.value ?? "").slice(0, MAX_CHARS);
    if (DRAFT_FIELDS.every((name) => draft[name].trim() === "")) storage.removeItem(DRAFT_KEY);
    else storage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* private mode, quota, blocked storage: the form works exactly as it always did */
  }
}

/** Put a draft back into the fields that are EMPTY: never over browser autofill, never over what the parent typed.
 *  Setting `.value` fires no event, so a restore is invisible to the form's own change handler and its analytics. A
 *  draft older than the 30 minutes (or one that cannot be read, or one dated in the future) is deleted instead. */
export function restoreFormDraft(form: HTMLFormElement): void {
  const storage = tabStorage();
  if (!storage) return;
  try {
    const raw = storage.getItem(DRAFT_KEY);
    if (raw === null) return;
    const draft = parse(raw);
    const age = draft ? Date.now() - draft.savedAt : Number.NaN;
    if (!draft || !(age >= 0 && age <= DRAFT_TTL_MS)) {
      storage.removeItem(DRAFT_KEY);
      return;
    }
    for (const name of DRAFT_FIELDS) {
      const input = field(form, name);
      if (input && input.value === "") input.value = draft[name];
    }
  } catch {
    /* as above: the form is simply empty, as it was before this existed */
  }
}

/** Delete the draft. Called when the parent has paid, before the page moves on. */
export function clearFormDraft(): void {
  try {
    tabStorage()?.removeItem(DRAFT_KEY);
  } catch {
    /* nothing to do: the draft expires by itself in 30 minutes and with the tab */
  }
}

/** A ref for the pre-order `<form>`: when the form appears it takes back any draft, and from then on it saves each
 *  change to the name, phone or email. A change to any other field (the child's age included) is not even looked at.
 *  Native listeners on the form, not React props, so the form's own `onChange` and the markup stay as they were. */
export function useFormDraft(): RefCallback<HTMLFormElement> {
  return useCallback((form: HTMLFormElement | null) => {
    if (!form) return;
    restoreFormDraft(form);
    const save = (event: Event) => {
      if (isDraftField((event.target as HTMLInputElement | null)?.name)) saveFormDraft(form);
    };
    form.addEventListener("input", save);
    form.addEventListener("change", save);
    return () => {
      form.removeEventListener("input", save);
      form.removeEventListener("change", save);
    };
  }, []);
}
