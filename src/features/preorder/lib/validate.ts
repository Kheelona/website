import { INDIAN_STATES } from "./india";

/** Validation for the pre-order form (§8.25-h).
 *
 *  Pure functions, no dependency, and the SAME functions run in the browser and
 *  in the route handler. That is the point: a client check is a courtesy to the
 *  parent and a server check is the only one that counts, and when they are two
 *  different implementations they drift until the form accepts something the
 *  server rejects with no explanation.
 *
 *  Messages are written to be read by a tired parent on a phone, so each one
 *  says what to do rather than what went wrong. */

/** The longest age answer we store. Named here because the route handler caps
 *  the incoming string at the same number, and two different numbers would mean
 *  the server silently trimming something the form accepted. */
export const CHILD_AGE_MAX = 20;

export type ContactInput = {
  parentName: string;
  phone: string;
  email: string;
  childAge: string;
  /** The single required tick: terms, refunds, and order updates on WhatsApp. */
  accepted: boolean;
};

export type AddressInput = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Indian mobile numbers are ten digits starting 6 to 9. People type them with
 *  +91, with 0, and with spaces, and refusing those would be us being difficult
 *  about a number we can read perfectly well. */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("91") && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith("0") && digits.length === 11
      ? digits.slice(1)
      : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

/** Deliberately permissive: the job of an email check on a form is to catch a
 *  typo, and the only real test of an address is whether our email arrives. A
 *  stricter regex rejects valid addresses and teaches nobody anything. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim());
}

export function validateContact(input: ContactInput): FieldErrors<ContactInput> {
  const errors: FieldErrors<ContactInput> = {};

  const name = input.parentName.trim();
  if (name.length < 2) errors.parentName = "We need a name to put on the order.";
  else if (name.length > 80) errors.parentName = "That is longer than we can fit on a label.";

  if (!normalisePhone(input.phone)) {
    errors.phone = "We need a 10 digit Indian mobile number, the one you use on WhatsApp.";
  }

  if (!looksLikeEmail(input.email)) {
    errors.email = "We need an email address, so we can send your confirmation.";
  }

  /* Free text since 2026-08-23 (founder call). This was a six-option dropdown,
     and a dropdown was the wrong control for it: a parent whose child is two and
     a half, or who is buying for two children, had no honest option to pick, and
     the picker cost a tap and a scroll on a phone for a fact we use only to plan
     production. Whatever they type is more use to us than the nearest option.
     Permissive for the same reason as the email check above: the job here is to
     notice an empty field, not to argue with how somebody writes an age. */
  const age = input.childAge.trim();
  if (age.length < 1) {
    errors.childAge = "Tell us your child's age, so we send you the right thing.";
  } else if (age.length > CHILD_AGE_MAX) {
    errors.childAge = "Just the age is enough, like 3, or 2 and 5 for two children.";
  }

  if (!input.accepted) {
    errors.accepted = "Please tick the box to accept the pre-order terms.";
  }

  return errors;
}

export function validateAddress(input: AddressInput): FieldErrors<AddressInput> {
  const errors: FieldErrors<AddressInput> = {};

  const line1 = input.line1.trim();
  if (line1.length < 5) errors.line1 = "We need the flat or house and the street.";
  else if (line1.length > 120) errors.line1 = "Please shorten this a little.";

  if (input.line2.trim().length > 120) errors.line2 = "Please shorten this a little.";

  const city = input.city.trim();
  if (city.length < 2) errors.city = "Which city or town?";
  else if (city.length > 60) errors.city = "Please shorten this a little.";

  if (!(INDIAN_STATES as readonly string[]).includes(input.state)) {
    errors.state = "Pick your state from the list.";
  }

  /* An Indian PIN code is six digits and never starts with 0. Catching that
     here saves a parcel from going to a sorting office that does not exist. */
  if (!/^[1-9]\d{5}$/.test(input.pincode.trim())) {
    errors.pincode = "A PIN code is six digits, and never starts with a zero.";
  }

  return errors;
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
