/**
 * Policy constants (architecture §6.1): every policy number the site publishes, once. Trust items,
 * FAQ answers, the grievance line, the legal pages and the Product JSON-LD (return policy,
 * warranty) all render from here, so the page and its schema can never disagree. The owner page
 * is wiki/product/policies.md ("Decided for the new site"); a change starts there.
 */

/** Returns: within 7 days of delivery, no questions asked; opened is fine if undamaged and complete (D021). */
export const RETURN_DAYS = 7;

/** Return pickup is arranged by us and free: returns, faulty units and warranty claims (D022, D033). */
export const RETURN_PICKUP_FREE = true;

/** Faulty on arrival: replaced if reported within 7 days of receipt; no replacement timeline (D022). */
export const FAULTY_REPORT_DAYS = 7;

/** Warranty on manufacturing defects, not drops, water or misuse; repaired, or replaced if the
 *  repair fails (D022, D033). */
export const WARRANTY_MONTHS = 6;

/** Before dispatch: we start the refund within this many working days of the request (D042). */
export const REFUND_START_WORKING_DAYS = 2;

/** Then the bank's own time, as published (D042). */
export const BANK_REFUND_WORKING_DAYS = "5-7";

/** After a return: processed within this many working days of the unit reaching us (D022). */
export const REFUND_AFTER_RETURN_WORKING_DAYS = 7;

/** Complaints are acknowledged within 48 hours (Rule 4(5)); "5 days" is never published (D032). */
export const GRIEVANCE_ACK_HOURS = 48;

/** Complaints are resolved within one month of receipt: the rule's own words, never "30 days" (D032). */
export const GRIEVANCE_RESOLUTION = "one month";

/** Conversation transcripts are kept 36 months, then deleted automatically (D020). */
export const RETENTION_MONTHS = 36;

/** The payment methods on offer, and only those (D024): never wallets, EMI or Pay Later. */
export const PAYMENT_METHODS = "UPI, card or net banking";

/** Fees and the payment provider (D042, Rule 7(1)(c)). */
export const PAYMENT_TERMS = "No payment fees. Nothing recurring. Payments by Razorpay.";

/** The exchange line (D042). */
export const NO_EXCHANGES = `No exchanges: return it within ${RETURN_DAYS} days and order again.`;

/** The retention line as every page that names it prints it (D020). */
export const RETENTION_LINE = `Your child’s conversations stay in your parent app for ${RETENTION_MONTHS} months, then they’re deleted automatically. You can delete any of them sooner, in one tap.`;
