/* The founder's page facts against the frozen mockups (task 6.7; D055, D054 items 12 and 19).
 *
 * mockup/ keeps its Gate A text (D046), so every placeholder the founder filled, every line he ruled off and every
 * approved phrase his answers changed is an accepted parity deviation (deviations.ts header: a resolved placeholder,
 * a founder decision after Gate A). This file lists them once per page, in two forms:
 *
 * - `edits`: the changes as test/support/mockup-facts.ts applies them to a clone of the mockup's <main>. The route's
 *   unit test holds the build to that clone, markup and words alike, so every literal here is what the content module
 *   renders, and nothing else differs.
 * - `mockup` and `build`: the sentences that differ, as the text-parity spec reads a page, for deviations.ts's rules.
 *   The page's parity-deviations unit test proves them exactly the sentences the edits change.
 *
 * Literal and data-only, because Playwright loads deviations.ts and cannot load the content modules (they import
 * images). Only the main session accepts a deviation: these rows are filed in wiki/qa/deviations.md at the merge.
 */

/** One accepted change to a mockup element. */
export interface FactEdit {
  /** The mockup element the change starts from: a selector and its words (white space collapsed). The first such
   *  element that no earlier edit used, in document order. */
  readonly at: string;
  readonly was: string;
  /** The element around it that changes instead (its closest ancestor), when the change is wider than the match. */
  readonly scope?: string;
  /** The build's markup in its place (its children's, when `inner`), or null when it comes off. */
  readonly now: string | null;
  readonly inner?: true;
}

/** The accepted changes to one page, and the sentences they change. */
export interface PageFacts {
  readonly edits: readonly FactEdit[];
  /** Sentences of the mockup the build no longer prints. */
  readonly mockup: readonly string[];
  /** Sentences the build prints in their place. */
  readonly build: readonly string[];
  readonly reason: string;
  readonly approvedBy: string;
}

const MARKER = ".mk-placeholder";

/** A placeholder the founder filled: its marker becomes these words (inline markup allowed), or nothing. */
const fill = (marker: string, now: string): FactEdit => ({ at: MARKER, was: marker, now });

/** A row or line ruled off whole: the element around the marker (`scope`) comes off. */
const hide = (marker: string, scope: string): FactEdit => ({ at: MARKER, was: marker, scope, now: null });

/** An approved element whose words change: its children become this markup. */
const reword = (at: string, was: string, now: string): FactEdit => ({ at, was, now, inner: true });

/** An approved element ruled off whole (no placeholder in it). */
const cut = (at: string, was: string): FactEdit => ({ at, was, now: null });

const F4 = (note: string) => `[PLACEHOLDER F4: ${note}]`;

/** "Last updated" on the four legal pages (D055 item 8). */
const UPDATED = "14 October 2026";
/** The complaint-reference line under every legal page's grievance card comes off until a system issues one (D055
 *  item 7). It is the template's one shared value (legal/shared.ts), not the page's document, so a legal fixture rendered
 *  through the template already lacks it (its comparisons skip this edit); its paragraph stays, empty. */
export const GRIEVANCE_NOTE = fill("[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]", "");
const LEGAL_APPROVED = (row: string, items: string) => `deviations.md ${row} (founder, D055 ${items}, 2026-10-14; task 6.7)`;

/* /privacy's recipients, phone rows then the laptop table: who, then where (D055 items 16 and 24; privacy.md section 7). */
const RECIPIENT_FACTS: readonly FactEdit[] = [
  fill("[PLACEHOLDER: names, or “on request”]", ""),
  fill("[PLACEHOLDER: who stores conversations and runs the parent app]", "Kheelona, on Google Cloud"),
  fill("[PLACEHOLDER: region]", "India"),
  fill("[PLACEHOLDER: region]", "India"),
  fill("[PLACEHOLDER: region]", "Australia"),
  fill("[PLACEHOLDER: region]", "United States"),
  fill("[PLACEHOLDER: region of the store’s server code on the new site]", "India (Mumbai) for the store’s server code"),
  fill("[PLACEHOLDER: region]", "Google data centres around the world"),
  fill("[PLACEHOLDER: region]", "The United States and other countries"),
  fill("[PLACEHOLDER: region]", "United States"),
];

/** The parent app's two listings, as the live site links them (D055 item 26; llms.txt at the tag
 *  archive/pre-reset-2026-10-10, lines 86-87). */
export const APP_STORE = "https://apps.apple.com/in/app/kheelona/id6792490581";
export const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.kheelona.toyapp";

const MEET_KHEELU_REASON =
  "the parent app's phones filled (D055 item 26); the rows and lines still waiting on an F4 value hidden, the box contents kept (D054 item 19)";

export const PAGE_FACTS = {
  "meet-kheelu": {
    edits: [
      /* Fold 4, Good to know: the charging line keeps its confirmed half. */
      fill(F4("battery life per charge and charging time"), ""),
      /* Fold 7, Specs. */
      fill("[PLACEHOLDER: which phones the parent app runs on]", "On iPhone and Android."),
      hide(F4("size and weight"), "dl > div"),
      hide(F4("outer fabric and filling"), "dl > div"),
      hide(F4("battery type, life per charge and charging time"), "dl > div"),
      hide(F4("charger type and its BIS registration number"), "dl > div"),
      /* Fold 7, Safety. */
      hide(F4("toy-safety age grading and any required warnings"), "li"),
      hide(F4("battery safety certification"), "li"),
      /* Fold 7, Declarations. */
      hide(F4("net quantity"), "dl > div"),
      hide(F4("month and year of manufacture"), "dl > div"),
    ],
    mockup: [
      F4("battery life per charge and charging time"),
      "[PLACEHOLDER: which phones the parent app runs on]",
      "Size and weight",
      F4("size and weight"),
      "Materials",
      F4("outer fabric and filling"),
      "Battery",
      F4("battery type, life per charge and charging time"),
      "Charger",
      F4("charger type and its BIS registration number"),
      `Age grading and warnings: ${F4("toy-safety age grading and any required warnings")}`,
      `Battery safety: ${F4("battery safety certification")}`,
      "Net quantity",
      F4("net quantity"),
      "Month and year of manufacture",
      F4("month and year of manufacture"),
    ],
    build: ["On iPhone and Android."],
    reason: MEET_KHEELU_REASON,
    approvedBy: "deviations.md V16 (founder, D055 item 26 and D054 item 19, 2026-10-14; task 6.7)",
  },
  setup: {
    edits: [
      /* Fold 2: the charger's F4 slot hidden (D055 item 27, D054 item 19); the parent app named and linked (item 26). */
      fill(F4("the charger type, and how long a full charge takes"), ""),
      fill(
        "[PLACEHOLDER C6: where to get the parent app: App Store and Google Play links, and the listing name]",
        `It’s called the Kheelona app: get it on the <a href="${APP_STORE}">App Store</a> for iPhone, or on <a href="${GOOGLE_PLAY}">Google Play</a> for Android.`,
      ),
      /* Fold 5: where the wake-up button is (item 25). Step 2's light colour is deviation V8 (deviations.ts). */
      fill("[PLACEHOLDER: where the wake-up button sits on Kheelu]", "It’s the button on Kheelu’s back, the one you held during setup."),
    ],
    mockup: [
      F4("the charger type, and how long a full charge takes"),
      "[PLACEHOLDER C6: where to get the parent app: App Store and Google Play links, and the listing name]",
      "[PLACEHOLDER: where the wake-up button sits on Kheelu]",
    ],
    build: [
      "It’s called the Kheelona app: get it on the App Store for iPhone, or on Google Play for Android.",
      "It’s the button on Kheelu’s back, the one you held during setup.",
    ],
    reason:
      "the charger's F4 slot hidden (D055 item 27, D054 item 19); the parent app named and linked on both stores (item 26); the wake-up button's place (item 25)",
    approvedBy: "deviations.md V15 (founder, D055 items 25-27 and D054 item 19, 2026-10-14; task 6.7)",
  },
  privacy: {
    edits: [
      fill("[PLACEHOLDER: the date the founder approves this text]", UPDATED),
      /* The short version, item 4 (item 12). */
      fill("[PLACEHOLDER: how a parent turns it off]", "You can turn it off with a switch in the parent app."),
      /* Section 2 (items 13-16; B34, final by D054 item 23: no alerts in v1). */
      hide("[PLACEHOLDER: the names of the speech and AI providers, or the line “We tell you which providers we use if you ask.”]", "p"),
      fill("[PLACEHOLDER: whether recordings are used for anything else]", "Besides Kheelu’s reply and that training, we use them for nothing else."),
      hide("[PLACEHOLDER: parent alerts, if they ship in the app: what sets one off and what it uses]", "li"),
      fill(
        "[PLACEHOLDER: any other detail about your child the parent app asks for, for example a first name]",
        "<strong>Your child’s first name:</strong> the parent app asks for it.",
      ),
      fill(
        "[PLACEHOLDER: the account details (for example phone number or email, and whether you sign in with a password or a one-time code) and the device and Wi-Fi details the app keeps]",
        "your phone number. You sign in with it and a one-time code. The account also keeps Kheelu’s serial or device ID, the name of the Wi‑Fi network Kheelu joins (not its password), and your phone’s model and operating system.",
      ),
      fill(
        "[PLACEHOLDER: how you give consent for your child’s data at setup, and how we check that a parent or guardian is giving it; this step is not built yet]",
        "Setting Kheelu up in the parent app is how a parent or guardian agrees to this policy. A separate consent step, with a check that you are the parent or guardian, comes before May 2027.",
      ),
      /* Section 3 (item 12). */
      fill(
        "[PLACEHOLDER: the purpose in the founder’s words, for example “to make Kheelu better at understanding and answering children aged 3 to 7”]",
        "to make Kheelu better at understanding and answering children aged 3 to 7.",
      ),
      fill("[PLACEHOLDER: where our model is trained (country or region)]", "India, on Google Cloud."),
      reword(
        "li",
        "It’s on by default. You can turn it off at any time: [PLACEHOLDER: how a parent turns training off, for example a setting in the parent app]. From then on, your child’s conversations are not used to train our model. [PLACEHOLDER: what happens to recordings and transcripts already used before you turned it off]",
        "<strong>It’s on by default.</strong> You can turn it off at any time, with a switch in the parent app. From then on, your child’s conversations are not used to train our model. We take them out of our training data. A model already trained keeps what it learned, but they are never used again.",
      ),
      fill(
        "[PLACEHOLDER: confirm that turning it off changes nothing else about how Kheelu or the parent app works]",
        "Turning it off changes nothing else about how Kheelu or the parent app works.",
      ),
      /* Section 4 (item 19). */
      fill("[PLACEHOLDER: how long we keep unpaid orders]", "We keep them until you ask us to delete them."),
      /* Section 6 (D054 item 12, P14). */
      reword("strong", "Two things blocking can’t stop.", "What blocking can’t stop."),
      /* Section 7, the phone rows, then the same in the laptop table. */
      ...RECIPIENT_FACTS,
      ...RECIPIENT_FACTS,
      /* Section 8 (items 13, 18, 20, 19, 21). */
      fill("[PLACEHOLDER: how long we keep voice recordings, and whether the same 36 months applies]", "36 months, the same as transcripts."),
      fill("[PLACEHOLDER: what happens to your child’s conversations and recordings]", "we keep your child’s conversations and recordings until their 36 months end."),
      fill("[PLACEHOLDER: the period, from our CA]", ""),
      fill("[PLACEHOLDER: how long we keep them]", "we keep them until you ask us to delete them."),
      fill("[PLACEHOLDER: how long PostHog keeps the other events]", ""),
      /* Section 9 (item 17). */
      fill(
        "[PLACEHOLDER: how soon a deleted conversation is erased from our systems and backups, any period the law requires us to keep records, and whether it is also removed from Kheelu’s memory and from our model’s training data]",
        "It is not removed from Kheelu’s memory, or from the data our model trains on.",
      ),
      /* Section 11 (items 22 and 23). */
      hide(
        "[PLACEHOLDER: our security practices (for example encryption, who at Kheelona can read conversations, and backups), taken from our written security policy; this section will say only what that policy documents]",
        "p",
      ),
      fill(
        "[PLACEHOLDER: what we do, and how quickly we tell you, if your data is ever exposed, once our incident plan is written]",
        "If your data is ever exposed, we tell you without delay, and the Data Protection Board as the law requires.",
      ),
      /* Section 14 (item 7). */
      GRIEVANCE_NOTE,
    ],
    mockup: [
      "Last updated: [PLACEHOLDER: the date the founder approves this text]",
      "[PLACEHOLDER: how a parent turns it off]",
      "[PLACEHOLDER: the names of the speech and AI providers, or the line “We tell you which providers we use if you ask.”]",
      "[PLACEHOLDER: whether recordings are used for anything else]",
      "[PLACEHOLDER: parent alerts, if they ship in the app: what sets one off and what it uses]",
      "[PLACEHOLDER: any other detail about your child the parent app asks for, for example a first name]",
      "Your parent-app account and Kheelu’s setup: [PLACEHOLDER: the account details (for example phone number or email, and whether you sign in with a password or a one-time code) and the device and Wi-Fi details the app keeps]",
      "[PLACEHOLDER: how you give consent for your child’s data at setup, and how we check that a parent or guardian is giving it; this step is not built yet]",
      "Why: [PLACEHOLDER: the purpose in the founder’s words, for example “to make Kheelu better at understanding and answering children aged 3 to 7”]",
      "Where: [PLACEHOLDER: where our model is trained (country or region)]",
      "You can turn it off at any time: [PLACEHOLDER: how a parent turns training off, for example a setting in the parent app].",
      "[PLACEHOLDER: what happens to recordings and transcripts already used before you turned it off]",
      "[PLACEHOLDER: confirm that turning it off changes nothing else about how Kheelu or the parent app works]",
      "[PLACEHOLDER: how long we keep unpaid orders]",
      "Two things blocking can’t stop.",
      "Speech and AI providers [PLACEHOLDER: names, or “on request”]",
      "Speech and AI providers [PLACEHOLDER: names, or “on request”]",
      "[PLACEHOLDER: who stores conversations and runs the parent app]",
      "[PLACEHOLDER: who stores conversations and runs the parent app]",
      "Where: [PLACEHOLDER: region]",
      "Where: [PLACEHOLDER: region]",
      "Where: [PLACEHOLDER: region]",
      "Where: [PLACEHOLDER: region]",
      "Where: [PLACEHOLDER: region]",
      "Where: [PLACEHOLDER: region]",
      "Where: [PLACEHOLDER: region]",
      "Where: [PLACEHOLDER: region of the store’s server code on the new site]",
      "[PLACEHOLDER: region]",
      "[PLACEHOLDER: region]",
      "[PLACEHOLDER: region]",
      "[PLACEHOLDER: region]",
      "[PLACEHOLDER: region]",
      "[PLACEHOLDER: region]",
      "[PLACEHOLDER: region]",
      "[PLACEHOLDER: region of the store’s server code on the new site]",
      "Voice recordings: [PLACEHOLDER: how long we keep voice recordings, and whether the same 36 months applies]",
      "If you close your parent-app account: [PLACEHOLDER: what happens to your child’s conversations and recordings]",
      "[PLACEHOLDER: the period, from our CA]",
      "Unpaid orders: [PLACEHOLDER: how long we keep them]",
      "[PLACEHOLDER: how long PostHog keeps the other events]",
      "[PLACEHOLDER: how soon a deleted conversation is erased from our systems and backups, any period the law requires us to keep records, and whether it is also removed from Kheelu’s memory and from our model’s training data]",
      "[PLACEHOLDER: our security practices (for example encryption, who at Kheelona can read conversations, and backups), taken from our written security policy; this section will say only what that policy documents]",
      "[PLACEHOLDER: what we do, and how quickly we tell you, if your data is ever exposed, once our incident plan is written]",
      "[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]",
    ],
    build: [
      "Last updated: 14 October 2026",
      "You can turn it off with a switch in the parent app.",
      "Besides Kheelu’s reply and that training, we use them for nothing else.",
      "Your child’s first name: the parent app asks for it.",
      "Your parent-app account and Kheelu’s setup: your phone number.",
      "You sign in with it and a one-time code.",
      "The account also keeps Kheelu’s serial or device ID, the name of the Wi‑Fi network Kheelu joins (not its password), and your phone’s model and operating system.",
      "Setting Kheelu up in the parent app is how a parent or guardian agrees to this policy.",
      "A separate consent step, with a check that you are the parent or guardian, comes before May 2027.",
      "Why: to make Kheelu better at understanding and answering children aged 3 to 7.",
      "Where: India, on Google Cloud.",
      "You can turn it off at any time, with a switch in the parent app.",
      "We take them out of our training data.",
      "A model already trained keeps what it learned, but they are never used again.",
      "Turning it off changes nothing else about how Kheelu or the parent app works.",
      "We keep them until you ask us to delete them.",
      "What blocking can’t stop.",
      "Speech and AI providers",
      "Speech and AI providers",
      "Kheelona, on Google Cloud",
      "Kheelona, on Google Cloud",
      "Where: India",
      "Where: India",
      "Where: Australia",
      "Where: United States",
      "Where: United States",
      "Where: India (Mumbai) for the store’s server code",
      "Where: Google data centres around the world",
      "Where: The United States and other countries",
      "India",
      "India",
      "Australia",
      "United States",
      "United States",
      "India (Mumbai) for the store’s server code",
      "Google data centres around the world",
      "The United States and other countries",
      "Voice recordings: 36 months, the same as transcripts.",
      "If you close your parent-app account: we keep your child’s conversations and recordings until their 36 months end.",
      "Unpaid orders: we keep them until you ask us to delete them.",
      "It is not removed from Kheelu’s memory, or from the data our model trains on.",
      "If your data is ever exposed, we tell you without delay, and the Data Protection Board as the law requires.",
    ],
    reason:
      "the founder's privacy facts (D055 items 7, 8, 12-24): each placeholder filled in his words or ruled off; the recipients' regions from D047, vercel.json and the providers' published documents; \"What blocking can’t stop.\" (D054 item 12)",
    approvedBy: LEGAL_APPROVED("V11", "items 7, 8 and 12-24, D054 item 12"),
  },
  refund: {
    edits: [
      fill("[PLACEHOLDER: the date the founder approves this page]", UPDATED),
      /* The short version: items 2, 3 and 5 (D055 items 1, 5 and 4). */
      fill("[PLACEHOLDER: confirm a change-of-mind return is refunded in full]", "You get a full refund of everything you paid."),
      reword(
        ".kh-trust__body",
        "After a cancellation, we start your refund within 2 working days. After a return, it’s processed within 7 working days of your Kheelu reaching us. Then your bank takes 5-7 working days.",
        `After a cancellation, we start your refund within 2 working days. Then your bank takes <span class="mk-nowrap">5-7</span> working days. After a return, your refund reaches you within 7 working days of your Kheelu reaching us.`,
      ),
      fill("[PLACEHOLDER: confirm a full refund if neither works]", ""),
      /* Section 2 (items 1, 5 and 6). */
      reword(
        "li",
        "Once your Kheelu reaches us and qualifies for return, your refund is processed within 7 working days. [PLACEHOLDER: confirm how much comes back, for example “a full refund of everything you paid”]",
        "Once your Kheelu reaches us and qualifies for return, your refund reaches you within 7 working days. It’s a full refund of everything you paid.",
      ),
      fill(
        "[PLACEHOLDER: what happens if a returned Kheelu comes back damaged or with something missing, and what counts as damage on a plush toy a child has played with for a few days]",
        "If your Kheelu comes back with something missing, or damaged beyond normal play, we’ll talk to you before deciding the refund.",
      ),
      /* Section 3 (items 3, 4 and 2). */
      fill("[PLACEHOLDER: confirm the warranty starts on the delivery date]", ""),
      fill("[PLACEHOLDER: confirm this line: “If a repair and a replacement don’t put it right, you get a full refund.”]", ""),
      fill(
        "[PLACEHOLDER: confirm that sending the repaired or replacement Kheelu back to you is free too]",
        "Sending the repaired or replacement Kheelu back to you is free too.",
      ),
      /* Section 5 (item 5: the 7 working days include the bank's time, so the bank's line follows the cancellation). */
      reword(
        "li",
        "Cancelled before dispatch: we start your refund within 2 working days of your request.",
        `<strong>Cancelled before dispatch:</strong> we start your refund within 2 working days of your request; your bank takes <span class="mk-nowrap">5-7</span> working days.`,
      ),
      reword(
        "li",
        "Returned, faulty or not as described: your refund is processed within 7 working days of your Kheelu reaching us. [PLACEHOLDER: confirm whether the 7 working days is when we start the refund, before your bank’s 5-7, or when the money reaches you]",
        "<strong>Returned, faulty or not as described:</strong> your refund reaches you within 7 working days of your Kheelu reaching us.",
      ),
      cut("li", "Then your bank: once we’ve started it, your bank takes 5-7 working days."),
      /* Section 7 (item 7). */
      GRIEVANCE_NOTE,
    ],
    mockup: [
      "Last updated: [PLACEHOLDER: the date the founder approves this page]",
      "[PLACEHOLDER: confirm a change-of-mind return is refunded in full]",
      "After a return, it’s processed within 7 working days of your Kheelu reaching us.",
      "[PLACEHOLDER: confirm a full refund if neither works]",
      "Once your Kheelu reaches us and qualifies for return, your refund is processed within 7 working days.",
      "[PLACEHOLDER: confirm how much comes back, for example “a full refund of everything you paid”]",
      "[PLACEHOLDER: what happens if a returned Kheelu comes back damaged or with something missing, and what counts as damage on a plush toy a child has played with for a few days]",
      "[PLACEHOLDER: confirm the warranty starts on the delivery date] If a defect shows up after the first 7 days, we repair it, or replace it if the repair doesn’t work.",
      "[PLACEHOLDER: confirm this line: “If a repair and a replacement don’t put it right, you get a full refund.”] The warranty doesn’t cover drops, water damage or misuse.",
      "[PLACEHOLDER: confirm that sending the repaired or replacement Kheelu back to you is free too] How long a repair or a replacement takes depends on where in India you are, so we don’t promise a number of days.",
      "Cancelled before dispatch: we start your refund within 2 working days of your request.",
      "Returned, faulty or not as described: your refund is processed within 7 working days of your Kheelu reaching us.",
      "[PLACEHOLDER: confirm whether the 7 working days is when we start the refund, before your bank’s 5-7, or when the money reaches you]",
      "Then your bank: once we’ve started it, your bank takes 5-7 working days.",
      "[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]",
    ],
    build: [
      "Last updated: 14 October 2026",
      "You get a full refund of everything you paid.",
      "After a return, your refund reaches you within 7 working days of your Kheelu reaching us.",
      "Once your Kheelu reaches us and qualifies for return, your refund reaches you within 7 working days.",
      "It’s a full refund of everything you paid.",
      "If your Kheelu comes back with something missing, or damaged beyond normal play, we’ll talk to you before deciding the refund.",
      "If a defect shows up after the first 7 days, we repair it, or replace it if the repair doesn’t work.",
      "The warranty doesn’t cover drops, water damage or misuse.",
      "Sending the repaired or replacement Kheelu back to you is free too.",
      "How long a repair or a replacement takes depends on where in India you are, so we don’t promise a number of days.",
      "Cancelled before dispatch: we start your refund within 2 working days of your request; your bank takes 5-7 working days.",
      "Returned, faulty or not as described: your refund reaches you within 7 working days of your Kheelu reaching us.",
    ],
    reason:
      "the founder's refund facts (D055 items 1-8): a full refund on a change-of-mind return, the money within 7 working days of the return (bank time included), the free return leg, the warranty from delivery; the unconfirmed backstop and the complaint reference ruled off",
    approvedBy: LEGAL_APPROVED("V12", "items 1-8"),
  },
  shipping: {
    edits: [
      fill("[PLACEHOLDER: the date the founder approves this page]", UPDATED),
      /* Section 6 (item 9): the lost-parcel line comes off; its sentence stays. */
      fill(
        "[PLACEHOLDER: what we do if a parcel is lost in transit, for example “we send a replacement, or refund you in full if you’d rather” (no number of days)]",
        "",
      ),
      /* Section 7 (item 7). */
      GRIEVANCE_NOTE,
    ],
    mockup: [
      "Last updated: [PLACEHOLDER: the date the founder approves this page]",
      "[PLACEHOLDER: what we do if a parcel is lost in transit, for example “we send a replacement, or refund you in full if you’d rather” (no number of days)]",
      "[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]",
    ],
    build: [
      "Last updated: 14 October 2026",
    ],
    reason: "the founder's shipping facts (D055 items 7-9): the date; the lost-parcel line and the complaint reference ruled off",
    approvedBy: LEGAL_APPROVED("V13", "items 7-9"),
  },
  terms: {
    edits: [
      fill("[PLACEHOLDER: the date the founder approves this text]", UPDATED),
      /* Section 4 (item 10): only what D024 confirms. */
      fill(
        "[PLACEHOLDER: which GST documents you get and when, for example a receipt voucher for the advance and a tax invoice at dispatch, as our CA sets them up]",
        "",
      ),
      hide("[PLACEHOLDER: the price breakup (taxable value, GST rate and amount, delivery ₹0), once our CA confirms the HSN code and the GST rate]", "p"),
      /* Section 11 (item 11, as on /privacy). */
      reword(
        "p",
        "Kheelona’s own AI model learns from your child’s voice recordings and conversation transcripts. This is on by default, and you can turn it off at any time: [PLACEHOLDER: how a parent turns training off, for example a setting in the parent app]. Our outside speech and AI providers never train on your child’s voice.",
        "Kheelona’s own AI model learns from your child’s voice recordings and conversation transcripts. This is on by default, and you can turn it off at any time with a switch in the parent app. Our outside speech and AI providers never train on your child’s voice.",
      ),
      /* Section 16 (item 7). */
      GRIEVANCE_NOTE,
    ],
    mockup: [
      "Last updated: [PLACEHOLDER: the date the founder approves this text]",
      "[PLACEHOLDER: which GST documents you get and when, for example a receipt voucher for the advance and a tax invoice at dispatch, as our CA sets them up]",
      "[PLACEHOLDER: the price breakup (taxable value, GST rate and amount, delivery ₹0), once our CA confirms the HSN code and the GST rate]",
      "This is on by default, and you can turn it off at any time: [PLACEHOLDER: how a parent turns training off, for example a setting in the parent app].",
      "[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]",
    ],
    build: [
      "Last updated: 14 October 2026",
      "This is on by default, and you can turn it off at any time with a switch in the parent app.",
    ],
    reason: "the founder's terms facts (D055 items 7, 8, 10 and 11): the date, GST as D024 confirms it, the training switch; the CA slots and the complaint reference ruled off",
    approvedBy: LEGAL_APPROVED("V14", "items 7, 8, 10 and 11"),
  },
} as const satisfies Readonly<Record<string, PageFacts>>;

export type PageFactsSlug = keyof typeof PAGE_FACTS;
