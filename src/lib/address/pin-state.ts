import type { IndianState } from "@/features/preorder/lib/india";

/* The PIN code's first three digits against the state the parent picked (D072, K-184 B8). It lives here and not in
   src/features/preorder/lib/ because that folder is frozen against the tag and takes no new file; the checkout's
   validate.ts imports it, so the form and the address route run the same table. */

/** Which states and union territories each PIN code's first three digits belong to (D072, K-184 B8).
 *
 *  SOURCE: the Department of Posts' "All India Pincode Directory" (data.gov.in, Open Government Data Licence -
 *  India), read on 25 November 2026 from two public copies: github.com/dropdevrahul/pincodes-india (pincode.csv,
 *  30 June 2024) and github.com/arobindo/pincode-india-csv (all-india-pincodes.csv, updated 9 July 2025). For
 *  every post office we took the first three digits of its PIN code and its state. A prefix lists EVERY state
 *  either copy names for it, even a single row that looks like a slip, because a slip can only make this check
 *  more lenient. A run such as "560-563" holds only prefixes the directory has for that state.
 *
 *  Added by hand, each one only widening:
 *  - Andhra Pradesh and Telangana (one state until 2014) share every prefix from 500 to 535.
 *  - Jammu and Kashmir and Ladakh (one until 2019) share every prefix from 180 to 199.
 *  - Chandigarh's tricity: 160 also takes Haryana; 134 (Panchkula) and 140 (Mohali, Zirakpur) also take Chandigarh.
 *  Left out: 9xx, the Army Postal Service, which is not a state, so it is always allowed.
 *
 *  This table may only ever stop an obvious mismatch: a parent who has paid must never be blocked by it. A prefix
 *  no state lists is unknown, and an unknown prefix is always allowed. */
export const PIN_PREFIXES: Readonly<Record<IndianState, string>> = {
  "Andaman and Nicobar Islands": "744",
  "Andhra Pradesh": "500-509 515-518 520-524 530-535",
  "Arunachal Pradesh": "790-792",
  "Assam": "781-788",
  "Bihar": "800-805 811-814 821 823-824 841-848 851-855",
  "Chandigarh": "134 140 160",
  "Chhattisgarh": "334 490-497",
  "Dadra and Nagar Haveli and Daman and Diu": "362 396",
  "Delhi": "110",
  "Goa": "403",
  "Gujarat": "360-365 370 380 382-385 387-396",
  "Haryana": "121-127 131-136 160",
  "Himachal Pradesh": "171-177",
  "Jammu and Kashmir": "180-182 184-185 190-194",
  "Jharkhand": "813-816 818 822 825-829 831-835",
  "Karnataka": "560-563 570-577 580-587 590-591",
  "Kerala": "612 670-671 673 676 678-680 682-683 685-686 688-691 695",
  "Ladakh": "180-182 184-185 190-194",
  "Lakshadweep": "682",
  "Madhya Pradesh": "450-458 460-466 470-477 480-488",
  "Maharashtra": "400-402 410-416 421-425 431 440-445",
  "Manipur": "795",
  "Meghalaya": "781-782 793-794",
  "Mizoram": "791 796",
  "Nagaland": "797-798",
  "Odisha": "751-770",
  "Puducherry": "533 605 607 609 673",
  "Punjab": "140-148 151-152 160",
  "Rajasthan": "301-307 311-314 321-328 331-335 341-345 384",
  "Sikkim": "737",
  "Tamil Nadu": "600-614 620-632 635-639 641-643",
  "Telangana": "305 311 332-333 335 343 500-509 515-518 520-524 530-535 756 799",
  "Tripura": "799",
  "Uttar Pradesh": "110 201-212 221-233 241-247 250-251 261-262 271-277 281-285 802",
  "Uttarakhand": "244 246-249 262-263",
  "West Bengal": "700 711-713 721-723 731-736 741-743",
};

let byPrefix: Map<string, Set<string>> | null = null;

/** Prefix → states, built once on first use (nothing runs at import). */
function index(): Map<string, Set<string>> {
  if (byPrefix) return byPrefix;
  const map = new Map<string, Set<string>>();
  for (const [state, runs] of Object.entries(PIN_PREFIXES)) {
    for (const run of runs.split(" ")) {
      const [from, to = from] = run.split("-").map(Number);
      for (let n = from; n <= to; n++) {
        const key = String(n);
        const states = map.get(key) ?? new Set<string>();
        states.add(state);
        map.set(key, states);
      }
    }
  }
  byPrefix = map;
  return map;
}

/** False only when the PIN's first three digits are known and none of their states is the one picked. */
export function pinMatchesState(pincode: string, state: string): boolean {
  const states = index().get(pincode.trim().slice(0, 3));
  return !states || states.has(state);
}
