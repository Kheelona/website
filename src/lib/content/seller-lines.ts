import type { RichTextString } from "@/content/types";

/**
 * The seller lines (task 4.3, wave-3 close): content/en-IN/seller.ts holds the facts (entity, the registered address
 * in parts, the grievance officer and the D032 line); this one helper composes what the pages print from them, so a
 * fact is written once and every line that carries it says the same words (architecture §6.1). The website prints no
 * GSTIN (D063 item 3, D064 item 11; task Q2.3): src/config/site.ts keeps it for the receipt emails and invoices.
 *
 *   legalSellerSentence  "<entity>, registered at <address>."  the legal pages' seller line
 *   grievanceOfficerLine the D032 line, `{ lead, text }`       the legal pages' grievance card
 *
 * Each takes `{ nowrap }`. With it, the phrases a line break would split badly stay on one line, as the approved
 * refund and shipping pages mark them (refund.html:133, 141; shipping.html:114, 118): a house number ("No 51"), a
 * parenthesis ("(Old Site No 1)"), the city with its PIN code ("Bengaluru 560041") and a hyphenated word
 * ("Co-Founder"). Privacy, terms and contact print the same words with nothing held together. The words never change:
 * `{nowrap:…}` is invisible in the plain text (src/lib/content/plain-text.ts).
 *
 * Takes the seller as a parameter (a structural subset of content/en-IN/seller.ts), since src/lib never imports a
 * locale's content (structure §6).
 */

/** The registered address in its parts (src/config/site.ts `REGISTERED_ADDRESS`). */
export interface AddressParts {
  readonly line1: string;
  readonly line2: string;
  readonly city: string;
  readonly state: string;
  readonly pincode: string;
  readonly country: string;
}

/** What the lines are built from: the shape content/en-IN/seller.ts already has. */
export interface SellerFacts {
  readonly legalName: string;
  readonly address: AddressParts;
  /** The footer's one-line address; the parts must make exactly this. */
  readonly addressLine: string;
  readonly grievance: {
    readonly role: string;
    /** The D032 published line: "Grievance Officer:", then the officer, the contacts and the response times. */
    readonly line: { readonly lead: RichTextString; readonly text: RichTextString };
  };
}

export interface LineOptions {
  /** Keep the phrases a line break would split badly on one line (the refund and shipping family). */
  readonly nowrap?: boolean;
}

/** Between the entity and its address in the legal seller sentence (privacy.html:294, refund.html:141). */
const REGISTERED_AT = "registered at";

/** A house number ("No 51") or a parenthesis ("(Old Site No 1)"): one line each. */
const ADDRESS_PHRASE = /\([^()]*\)|\bNo \d+\b/g;
/** A hyphenated word ("Co-Founder"): a browser may break after the hyphen. */
const HYPHENATED = /[\p{L}\d]+(?:-[\p{L}\d]+)+/gu;

const keep = (text: string): RichTextString => `{nowrap:${text}}`;
const keepEach = (text: string, phrase: RegExp): RichTextString => text.replace(phrase, (match) => keep(match));

/** The registered address in one line, its parts in the footer's order, each phrase kept whole with nowrap. */
function addressLine(seller: SellerFacts, nowrap: boolean): RichTextString {
  const { line1, line2, city, pincode, state, country } = seller.address;
  const plain = `${line1}, ${line2}, ${city} ${pincode}, ${state}, ${country}`;
  if (plain !== seller.addressLine) {
    throw new Error(`The address parts make "${plain}", not the one-line address "${seller.addressLine}" the footer prints (src/config/site.ts).`);
  }
  if (!nowrap) return plain;
  return `${keepEach(line1, ADDRESS_PHRASE)}, ${line2}, ${keep(`${city} ${pincode}`)}, ${state}, ${country}`;
}

/** "<entity>, registered at <address>." The legal pages' seller line (privacy.html:294, terms.html:218,
 *  refund.html:141, shipping.html:114), whose closing "GSTIN …." came off with D063 item 3. */
export function legalSellerSentence(seller: SellerFacts, { nowrap = false }: LineOptions = {}): RichTextString {
  return `${seller.legalName}, ${REGISTERED_AT} ${addressLine(seller, nowrap)}.`;
}

/** The D032 grievance line, verbatim from seller.ts; with nowrap, the hyphenated words of the officer's role stay
 *  whole ("{nowrap:Co-Founder} and CTO"), as refund.html:133 and shipping.html:118 print it. */
export function grievanceOfficerLine(
  seller: Pick<SellerFacts, "grievance">,
  { nowrap = false }: LineOptions = {},
): { readonly lead: RichTextString; readonly text: RichTextString } {
  const { role, line } = seller.grievance;
  if (!nowrap) return line;
  const at = line.text.indexOf(role);
  if (at === -1) throw new Error(`The grievance line does not name the officer's role "${role}": ${line.text}`);
  return { lead: line.lead, text: `${line.text.slice(0, at)}${keepEach(role, HYPHENATED)}${line.text.slice(at + role.length)}` };
}
