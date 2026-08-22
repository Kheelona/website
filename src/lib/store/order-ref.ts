import { randomInt } from "node:crypto";

/** The order reference a parent reads out loud (§8.25).
 *
 *  Not the database key. The primary key is a sequential bigint that nothing
 *  outside the server ever sees; this is the string that goes in the
 *  acknowledgement email, gets quoted on WhatsApp, and gets typed back to us
 *  with one character wrong.
 *
 *  So the alphabet excludes every pair a person confuses when reading or
 *  saying a code: no 0 or O, no 1 or I or L, no U (heard as V over a phone
 *  line). What is left is 30 symbols and 8 of them, which is about 6.5e11
 *  combinations: nobody guesses another family's order, and nothing about the
 *  reference reveals how many orders exist, which a sequential number would. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newOrderRef(): string {
  let body = "";
  for (let i = 0; i < 8; i += 1) body += ALPHABET[randomInt(ALPHABET.length)];
  return `KH-${body.slice(0, 4)}-${body.slice(4)}`;
}

/** Shape check for anything arriving from a URL or a form, before it reaches a
 *  query. Deliberately strict: an order reference is generated, never typed by
 *  us, so anything that does not match this exactly is not one of ours. */
export const ORDER_REF_PATTERN = /^KH-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}$/;

export function isOrderRef(value: unknown): value is string {
  return typeof value === "string" && ORDER_REF_PATTERN.test(value);
}
