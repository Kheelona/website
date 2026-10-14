/* Banned wording (task 1.1; architecture §14, ADR-011; QA review N24).
 *
 * One entry per idea, each citing the row of wiki/product/claims.md §4 it enforces ("claimsRow" is
 * the start of that row's first cell; banned-phrases.test.ts fails if a §4 row has no entry). A
 * few §3 rows whose Site value is BANNED are covered too ("§3: …"). The retired offer terms of the
 * old test/preorder-copy.test.ts live here now, tightened so approved copy passes: "no payment" is
 * banned unless "fees" follows ("No payment fees" is approved, D042), and the "reserving is free"
 * pattern needs whole words, so "replacement … is free" (refund page) does not match.
 *
 * Rules for every entry (lessons §7): ban the idea, not one phrasing; match whole words; a pattern
 * may span a sentence where the false claim did. Every entry is red on its planted example and
 * green on all 18 approved mockup pages and every copy block of wiki/site/pages/*.md, so the guard
 * can never contradict approved copy; banned-phrases.test.ts proves both on every run.
 *
 * One exception to the mockup rule (task 8b.1b): the claims D058 withdrew after Gate A are still
 * printed by the frozen mockups (D046), on the pages whose routes carry a claim-fix rule (the build
 * prints that rule's words instead). Such an entry names those pages in `mockupExempt`, and only
 * those, with the rules' deviation rows: banned-phrases.test.ts proves each page carries such a
 * rule, prints the claim only inside <main> and is green there once its rules are applied, and that
 * the mockup rule is red without the field. Only findBannedOnMockup reads the field: the copy
 * pages, src/, the journal and the rendered build get no exemption.
 *
 * Erasable TypeScript only, and no import: scripts/journal/sync-posts.mjs loads this file with
 * Node's type stripping (test/journal-sync.test.ts runs it).
 *
 * Scope: src/content/** strings and rendered text (test/e2e/content-integrity.spec.ts); the offer
 * entries also over every shipped src/**\/*.ts(x) file, comments aside, as the old test did; the
 * claim entries also over every shipped src file that is not still legacy. The en-IN spelling
 * entries apply to content and rendered text only (N24), never to code, where CSS words like
 * "center" and identifiers like "color" are not copy.
 */

export type BannedKind = "claim" | "offer" | "spelling";

/** The frozen mockups (D046) whose routes carry a claim-fix rule in test/e2e/support/deviations.ts: task 8b.1's
 *  `CLAIM_FIXES` (deviations V26-V36) and task 8b.2a's `ARTICLE_CLAIM_FIXES` (V37). The only pages an entry may be
 *  exempted on. Spelled here because this file takes no import; banned-phrases.test.ts holds the list equal to those
 *  rules' keys. */
export const CLAIM_FIXED_MOCKUPS = [
  "home",
  "meet-kheelu",
  "safety",
  "setup",
  "team",
  "ai-toys-for-kids-in-india",
  "store",
  "privacy",
  "terms",
  "story-what-to-look-for-in-a-safe-ai-toy",
] as const;
export type ClaimFixedMockup = (typeof CLAIM_FIXED_MOCKUPS)[number];

/** Where a frozen mockup may still print an entry's wording, and why. */
export type MockupExemption = {
  /** The claim-fixed mockups that still print it. */
  readonly on: readonly ClaimFixedMockup[];
  /** The deviation rows whose rules replace those lines on the build ("deviations.md V26 (home), …"). */
  readonly because: string;
};

type BannedPhraseFields = {
  id: string;
  /** The claims.md row this enforces: the start of its first cell, or "§3: …", or "N24" for spelling. */
  claimsRow: string;
  pattern: RegExp;
  /** A sentence that matches the pattern but also matches this is allowed (the named exceptions). */
  allowSentence?: RegExp;
  /** An example the pattern must catch. */
  planted: string;
  why: string;
};

/** An entry. Only a claim may carry `mockupExempt`: a withdrawn claim the claim-fixed mockups still print, read by the
 *  approved-mockup check alone (findBannedOnMockup). */
export type BannedPhrase =
  | (BannedPhraseFields & { kind: "claim"; mockupExempt?: MockupExemption })
  | (BannedPhraseFields & { kind: "offer" | "spelling"; mockupExempt?: never });

/** The deviation row of each claim-fixed mockup's rule (wiki/qa/deviations.md; the rule's `approvedBy` in
 *  test/e2e/support/deviations.ts, which banned-phrases.test.ts holds each exemption's `because` to). */
const CLAIM_FIX_ROWS = {
  home: "V26",
  "meet-kheelu": "V27",
  safety: "V28",
  setup: "V29",
  team: "V30",
  "ai-toys-for-kids-in-india": "V31",
  privacy: "V32",
  terms: "V33",
  store: "V34",
  "story-what-to-look-for-in-a-safe-ai-toy": "V37",
} as const satisfies Record<ClaimFixedMockup, string>;

/** An exemption on these claim-fixed mockups, citing each one's deviation row. */
const frozenOn = (...on: ClaimFixedMockup[]): MockupExemption => ({
  on,
  because: `deviations.md ${on.map((slug) => `${CLAIM_FIX_ROWS[slug]} (${slug})`).join(", ")}: the frozen mockup prints the Gate A line; the page's claim-fix rule (D058) puts the code-checked words on the build`,
});

const R1 = `"The microphone is off. Not muted. Off."`;
const R2 = `"Listens only for its wake word`;
const R3 = `Absolutes about the microphone`;
const R4 = `"Internet access: None"`;
const R5 = `"Stays in your region"`;
const R6 = `"Your child's voice goes only to Kheelona's own servers`;
const R7 = `"Own the model … Nothing rented that matters"`;
const R8 = `"Answers … work offline"`;
const R9 = `Emotion reading`;
const R10 = `Story mode "stories and lessons"`;
const R11 = `"grows their vocabulary"`;
const R12 = `"cognitive development toy"`;
const R13 = `"Families already using Kheelu."`;
const R14 = `"Meet Kheelu on 20 October"`;
const R15 = `"Kheelu helps / grows / builds / develops / supports … brain"`;
const R16 = `"Made in Bengaluru", "built in Bengaluru"`;
const R17 = `Dead age ranges`;
const R18 = `"30 September", "₹9,999", "1 October 2026"`;
const R19 = `"Lumi" as the current name`;
const R20 = `Positioning's never-say list`;
/* The rows D058 added (the live team's code check of 12 October; task 8b.1b): one per withdrawn idea. */
const D1 = `One-tap deletion`;
const D2 = `"On servers in India"`;
const D3 = `A curated or closed content library`;
const D4 = `An age-graded safety layer`;
const D5 = `Quiet hours as a parent-app control`;
const D6 = `Topic controls`;
const D7 = `The new-word count`;
const D8 = `The weekly four-thinking-skills report`;
const D9 = `"About a minute of quiet"`;
const D10 = `"We attack our own safety layer before every release"`;
const D11 = `The providers "keep none of it"`;
/* The rows D061 added (the advisor's stale facts; task 8c.4): one per idea. */
const C1 = `Cash on delivery as a way to pay`;
const C2 = `"Ships 20 Oct"`;
const C3 = `Open-ended ages`;
const C4 = `A part-price in the pre-order button`;
const C5 = `"Real pilot homes"`;
const C6 = `"Backed by" over the programmes`;
const C7 = `"Safety certified"`;

const APOS = "['’]";

/* Task 8b.1d (8b.1b's review): three D058 ideas are a product's feature, and a parent's own habit says the same words
 * ("track your child's new words", "a minute of quiet", "choose which topics"). Those entries ban the feature: tied to
 * the product in the sentence (Kheelu, the app or parent app), named before or after the feature, with "it" as the toy
 * only as the subject of a verb of the toy's (going off, going to sleep), or in the feature's noun form ("a new-word
 * count", "topic controls"). The parents' advice lines are in banned-phrases.test.ts NEAR_MISSES, the product's
 * phrasings in VARIANTS. */
/** Kheelu or its app (the app, the parent app, its or Kheelona's app; not "a notes app"), somewhere in the same sentence
 *  (a pattern span stops at . ? ! and line breaks). */
const NAMED = `\\b(?:Kheelu|(?:the|its|our|parent|Kheelona(?:${APOS}s)?) app)\\b`;
/** A pattern for `core` with the product named before or after it in the same sentence. */
const withProduct = (core: string, gap = 80) => `${NAMED}[^.?!\\n]{0,${gap}}?${core}|${core}[^.?!\\n]{0,${gap}}?${NAMED}`;
/** About a minute, or sixty seconds (D058 item 1: a conversation ends after a couple of minutes of quiet). */
const A_MINUTE = "(?:about |around |roughly |nearly |just |only |under |over )?(?:(?:a|one|1) (?:minute|min)|(?:60|sixty) (?:seconds|secs))\\b";
const QUIET_SPELL = "(?:quiet|silence)";
/** What the toy or its microphone does when it goes off: switches or powers off, goes quiet or to sleep, stops
 *  listening, sleeps; "stops" or "ends" only at the end of the sentence ("it stops the tantrum" is a parent's). */
const GOES_OFF = "(?:(?:switch(?:es|ed)?|turns?|turned|shuts?|powers?|powered)(?: itself)? (?:off|down)|(?:goes|went|falls?|fell|drops?|dropped) (?:quiet|silent|off|to sleep|asleep)|(?:stops?|stopped) (?:listening|talking)|sleeps|slept|naps|dozes off|(?:stops?|stopped|ends?|ended)(?=[.?!\\n]|$))";
/** Counting a child's new words, as a feature: the verb, then (within a few words) "new word(s)"; "counts as a new word"
 *  is a parent's rule of thumb, not a count. */
const COUNTS_NEW_WORDS = "(?:counts?|counted|counting|tallies|tallied|tallying|tracks?|tracked|tracking|logs?|logged|logging|records?|recorded|recording)\\b(?! as\\b)[^.?!\\n]{0,24}?\\bnew words?\\b";
/** Choosing which topics are talked about, as a control ("picks the topic" is a child's own choice). */
const PICKS_TOPICS = "(?:choose|chooses|pick|picks|block|blocks|limit|limits|set|sets|decide|decides|control|controls|restrict|restricts) (?:which |what )topics?\\b";
/** Topics as open or shut. */
const TOPICS_GATED = "\\btopics? (?:are|is|stay|stays) (?:open|closed|allowed|blocked|off[- ]limits)\\b";

/* Task 8c.4 (D061): the advisor's stale facts. Each entry bans the idea; the sentences that deny it ("there's no cash on
 * delivery", "nothing to pay at the door", "not yet safety certified") are the approved pages' own and pass. */
/** Words just before a phrase that deny it: "no …", "we don't offer …", "nothing to pay …". */
const DENIED = `(?<!\\b(?:no|not|never|without|nor|nothing to|no need to|(?:don|doesn|can|won|didn)${APOS}t (?:offer|take|accept|do|have|support|allow|need to)|(?:do|does|can|will) not (?:offer|take|accept|do|have|support|allow|need to)|cannot (?:offer|take|accept|do|have|support|allow)) )`;
/** Paying for Kheelu on delivery, in cash or at the door. */
const ON_DELIVERY = `${DENIED}\\b(?:cash[- ]on[- ]delivery|(?-i:COD)|pay(?:ment|ing)?(?: (?:in )?cash)? (?:on|upon|at) (?:delivery|arrival)|pay(?:ing)?(?: (?:the |your )?(?:rest|balance|remaining amount|full price|full amount|whole price|in full|₹ ?[\\d,]+|\\{price:\\w+\\}))?(?: in cash)? (?:at (?:the|your) door|to the courier|when (?:it|Kheelu|your Kheelu|your order|the toy|the parcel) (?:arrives|is delivered|reaches you)))\\b(?! (?:is not|isn${APOS}t|is never|was never|are not|aren${APOS}t|not)\\b)`;
/** 20 October, in the forms a date takes. */
const OCT_20 = "(?:20(?:th)?(?: of)? Oct(?:ober)?\\b\\.?|Oct(?:ober)?\\.? 20(?:th)?\\b|2026-10-20\\b|20[/.]10(?:[/.](?:20)?26)?\\b)";
/** A verb of the parcel leaving or arriving. */
const SHIPS = "(?:ships?|shipping|shipped|dispatch(?:es|ed|ing)?|deliver(?:s|ed|ing|y|ies)|arriv(?:es|ing|als?)|reach(?:es)? you|out for delivery)";
/** An age as a number (1-12) or a word (one to ten). */
const AGE_N = "(?:[1-9]|1[0-2])";
const AGE_WORD = "(?:[1-9]|1[0-2]|one|two|three|four|five|six|seven|eight|nine|ten)";
/** An age with no ceiling: "Ages 3+", a bare "6+" label, "3+ years", "3 and up", "3 years onwards". A count with its unit
 *  ("2+ hours"), a school grade ("Grade 8 and beyond") and "up to age 7" are not ages without a ceiling. */
const OPEN_AGE = [
  `\\b(?:ages?|aged)\\b:? ?${AGE_N} ?\\+`,
  "(?<=^|[\\s(\\[·•|:,])[2-9]\\+(?=$|[\\n)\\].,;:!?·•|]| +$)",
  `\\b${AGE_N} ?\\+ ?(?:years?|yrs?|year[- ]olds?)\\b`,
  `(?<!\\b(?:grades?|class(?:es)?|std\\.?|standards?|levels?|years?|steps?|pages?|chapters?|parts?|books?) )\\b${AGE_WORD}(?:[- ](?:years?|yrs?)(?:[- ]olds?)?|[- ]year[- ]olds?)?,? (?:and|&) (?:up|upwards?|above|older|over)\\b(?! (?:to|until|till|than|the|a|an|their|his|her|our|children|kids|siblings|ones)\\b)`,
  `\\b${AGE_WORD}(?: ?\\+)? ?(?:years?|yrs?) (?:and )?(?:onwards?|plus)\\b`,
  `\\b(?:ages?|aged|from|for) ${AGE_WORD} (?:and )?onwards?\\b`,
].join("|");
/** The advance or the balance, typed or as its token (the total is ₹4,999, never a part-price). */
const PART_PRICE = "(?:(?:₹ ?|Rs\\.? ?|INR ?)(?:499|4,500)\\b|\\{price:(?:token|balance)\\})";
/** The programmes the strip names (case kept, so the verb "elevate" is not one). */
const PROGRAMME = "(?-i:NVIDIA|Inception|Karnataka Elevate|Elevate|nasscom|NASSCOM|Founders Inc)";
/** Words just before a certification that deny it: "not yet safety certified". */
const NOT_YET = `(?<!\\b(?:no|not|never|not yet|not been|isn${APOS}t|isn${APOS}t yet|aren${APOS}t|aren${APOS}t yet) )`;

export const BANNED_PHRASES: readonly BannedPhrase[] = [
  // ── Row 1: the retired microphone wording and its variants (claims §4.1) ──
  { id: "mic-not-muted", kind: "claim", claimsRow: R1, pattern: /\bnot muted\b/i, planted: "The microphone is off. Not muted. Off.", why: "Retired 2026-10-04 and superseded by the wake-up button (D018)." },
  { id: "mic-is-off", kind: "claim", claimsRow: R1, pattern: /\b(?:microphone|mic) is off\b/i, planted: "Kheelu's mic is off the rest of the time.", why: "Retired microphone wording; describe the wake-up button instead (D018)." },
  { id: "mic-off-rest-of-time", kind: "claim", claimsRow: R1, pattern: /\boff the rest of the time\b|\boff otherwise\b/i, planted: "It wakes to a word and is off otherwise.", why: "Retired microphone variants (claims §4.1 rows 6, 7, 9, 14)." },
  { id: "mic-sleeps", kind: "claim", claimsRow: R1, pattern: /\bsleeps until\b|\bnot listening between wakes\b|\bbetween wakes\b/i, planted: "A microphone that sleeps until a wake word.", why: "Softer variants that survived the mid version's guard (claims §4.1 rows 5, 11, 15)." },
  { id: "mic-off-means-off", kind: "claim", claimsRow: R1, pattern: /\bOff should mean off\b/i, planted: "Off should mean off, not muted and waiting.", why: "Retired variant (claims §4.1 rows 10, 12)." },
  // ── Row 2: any wording that implies a wake word (D018: there is none) ──
  { id: "wake-word", kind: "claim", claimsRow: R2, pattern: new RegExp(`(?<!\\bno )\\bwake[- ]?words?\\b`, "i"), planted: "Kheelu listens only for its wake word.", why: "Kheelu has no wake word (D018). \"Kheelu has no wake word\" is approved and passes." },
  { id: "wakes-to-a-word", kind: "claim", claimsRow: R2, pattern: /\bwakes? (?:up )?to a word\b|\bwake Kheelu up\b|\bHey,? Kheelu\b/i, planted: "Kheelu wakes to a word.", why: "Wake-word family (claims §4.1 rows 16, 20)." },
  // ── Row 3: absolutes about the microphone ──
  { id: "mic-absolutes", kind: "claim", claimsRow: R3, pattern: /\b(?:no|zero) risk\b|\b(?:physically|electrically) disconnected\b|\bnothing is ever recorded\b/i, planted: "There is zero risk: nothing is ever recorded.", why: "Absolute safety claims need substantiation (ASCI; D018 wording rules)." },
  // ── Row 4 ──
  { id: "internet-none", kind: "claim", claimsRow: R4, pattern: /\binternet access:?\s*none\b/i, planted: "Internet access: None", why: "Wrong: AI mode uses home Wi-Fi. Say it cannot browse the internet (D017)." },
  // ── Row 5 ──
  { id: "stays-in-region", kind: "claim", claimsRow: R5, pattern: /\bstays in your region\b|\bregion[- ]pinned\b|\bown voice brain\b/i, planted: "Kheelona's own voice brain, stays in your region.", why: "Superseded: outside providers process the voice in India (D019, D020)." },
  // ── Row 6 ──
  { id: "own-servers", kind: "claim", claimsRow: R6, pattern: new RegExp(`\\bonly (?:to )?(?:Kheelona${APOS}s|our) own servers?\\b|\\bnever leaves Kheelona\\b`, "i"), planted: "Your child's voice goes only to Kheelona's own servers, in India.", why: "Withdrawn 2026-10-10: Kheelu uses outside providers (D019). \"Our own server reports it to Meta\" (privacy) passes." },
  // ── Row 7 ──
  { id: "own-the-model", kind: "claim", claimsRow: R7, pattern: /\bown the model\b|\bnothing rented\b|\bshrunk from adult AI\b|\bsmall language model built only for children\b/i, planted: "Own the model. Nothing rented that matters.", why: "D019: the AI model is among the outside providers." },
  // ── Row 8 ──
  { id: "answers-offline", kind: "claim", claimsRow: R8, pattern: /\banswers?\b[^.?!\n]{0,40}\bwork(?:s)? offline\b/i, planted: "Its answers work offline.", why: "Wrong for AI mode. Story mode needs no Wi-Fi; AI mode does." },
  // ── Row 9 ──
  { id: "emotion-reading", kind: "claim", claimsRow: R9, pattern: new RegExp(`\\bthe feeling gets read\\b|\\bmeets the mood\\b|\\bmaps? emotions\\b|\\bmood[- ]reading\\b|\\breads? (?:your child${APOS}s |a child${APOS}s |their )?(?:moods?|feelings|emotions)\\b`, "i"), planted: "The feeling gets read, and the answer meets the mood.", why: "Emotion reading is dropped from the new site (R5)." },
  // ── Row 10 ──
  { id: "lessons", kind: "claim", claimsRow: R10, pattern: /\blessons?\b|\bbe quizzed\b|\bcan interrupt, question\b/i, planted: "Story mode: stories and lessons a child can interrupt, question and be quizzed on.", why: "D027: no interrupt-and-ask feature; \"lessons\" is dropped everywhere." },
  // ── Row 11 ──
  { id: "grows-vocabulary", kind: "claim", claimsRow: R11, pattern: new RegExp(`\\bgrows? (?:their|your child${APOS}s|a child${APOS}s|the) vocabulary\\b`, "i"), planted: "AI mode grows their vocabulary.", why: "Not research-anchored (D016)." },
  // ── Row 12 ──
  { id: "cognitive-development", kind: "claim", claimsRow: R12, pattern: /\bcognitive development\b/i, planted: "A cognitive development toy.", why: "Retired for \"a screen-free AI toy\"." },
  // ── Row 13 ──
  { id: "families-using", kind: "claim", claimsRow: R13, pattern: /\bfamilies already using\b/i, planted: "Families already using Kheelu.", why: "Kheelu has not shipped; only pilot families have used it." },
  // ── Row 14 ──
  { id: "meet-on-date", kind: "claim", claimsRow: R14, pattern: /\bMeet Kheelu on \d{1,2} [A-Z][a-z]+/, planted: "Meet Kheelu on 20 October.", why: "20 October is when shipping starts; new orders deliver from mid-November (D023)." },
  // ── Row 15 ──
  { id: "kheelu-brain", kind: "claim", claimsRow: R15, pattern: /(?<![/.])\bKheelu\b[^.?!\n]{0,40}\b(?:helps|grows|builds|develops|supports|boosts|improves)\b[^.?!\n]{0,40}\bbrains?\b/i, planted: "Kheelu helps your child's brain grow.", why: "Founder decision 4; D016. \"Conversation helps a young brain grow\" is approved and passes." },
  { id: "brain-development-product", kind: "claim", claimsRow: R15, pattern: new RegExp(`\\bsupports? your child${APOS}s brain development\\b|\\b(?:a|the|our) brain[- ]development toy\\b`, "i"), planted: "Kheelu is a brain-development toy that supports your child's brain development.", why: "D016: brain development is a searched topic, never what Kheelu does." },
  { id: "helps-child-brain-grow", kind: "claim", claimsRow: R15, pattern: new RegExp(`\\bhelps? your child${APOS}s brain grow\\b`, "i"), planted: "It helps your child’s brain grow.", why: "Claims §4 row 15 bans the exact phrase, with or without \"Kheelu\" nearby. \"Conversation helps a young brain grow\" is approved and passes." },
  // ── Row 16 ──
  { id: "made-in-bengaluru", kind: "claim", claimsRow: R16, pattern: /\bmade in Bengaluru\b|\bbuilt in Bengaluru\b|\bdesigned and built here\b/i, planted: "The toy is designed and built here, made in Bengaluru.", why: "Where in India it is made was not stated: say \"Made in India\" (D034)." },
  // ── Row 17 ──
  { id: "dead-age-ranges", kind: "claim", claimsRow: R17, pattern: /\b(?:2 to 5|2 to 14|3 to 6|3 to 10|2 to 8)\b/, planted: "Kheelu is for ages 3 to 6.", why: "Retired 2026-08-23; the band is 3 to 7. Third-party ranges (\"aged 4 to 6\") pass." },
  // ── Row 18: the retired offer terms (ported from test/preorder-copy.test.ts) ──
  { id: "offer-no-payment", kind: "offer", claimsRow: R18, pattern: /\bno payment(?! fees?\b)/i, planted: "No payment now.", why: "The token is real money: say what it costs and that it is refundable. \"No payment fees\" (D042) passes." },
  { id: "offer-pay-nothing", kind: "offer", claimsRow: R18, pattern: /\bpay nothing\b|\bnothing is charged today\b/i, planted: "Pay nothing today.", why: "₹499 is charged today." },
  { id: "offer-tally", kind: "offer", claimsRow: R18, pattern: /\btally\b/i, planted: "Reserve through Tally.", why: "The form is ours now, in src/features/preorder. Whole word, so \"totally\" passes." },
  { id: "offer-30-september", kind: "offer", claimsRow: R18, pattern: /\b30 September\b|2026-09-30/i, planted: "Reserve before 30 September.", why: "The date deadline is retired (2026-08-23): the urgency is the 500-unit cap." },
  { id: "offer-9999", kind: "offer", claimsRow: R18, pattern: /₹\s?9,999|\bRs\.? ?9,999|999_900/, planted: "₹9,999 after the launch.", why: "The post-cap price is ₹7,999 (FULL_PRICE)." },
  { id: "offer-1-october", kind: "offer", claimsRow: R18, pattern: /\b1 October 2026\b|2026-10-01/, planted: "Ships 1 October 2026.", why: "The old ship date; new orders deliver from mid-November (D023)." },
  { id: "offer-costs-nothing", kind: "offer", claimsRow: R18, pattern: /\bcosts nothing\b|\bfree to join\b/i, planted: "Joining costs nothing.", why: "Reserving costs a refundable ₹499 (TOKEN_PRICE)." },
  { id: "offer-list", kind: "offer", claimsRow: R18, pattern: /\bpre-?order list\b|\bwait-?list\b|\bthe list is open\b|\bjoin the list\b|\bleave the list\b/i, planted: "The pre-order list is open.", why: "There is no list: pre-orders are open and a paid token holds a unit." },
  { id: "offer-no-commitment", kind: "offer", claimsRow: R18, pattern: /\bdoes not commit you to buy\b|\bno commitment\b/i, planted: "Reserving now does not commit you to buy.", why: "A paid token is a commitment we refund on request: say refundable." },
  { id: "offer-reserving-free", kind: "offer", claimsRow: R18, pattern: new RegExp(`\\b(?:reserv\\w*|spot|place)\\b[\\s\\S]{0,60}\\b(?:is|it is|it${APOS}s) free\\b`, "i"), planted: "Reserve a spot on the list. It is free, and it holds the launch price.", why: "Nothing about a reservation is free. Whole words, so \"replacement … is free\" passes." },
  // ── Row 19: "Lumi" only as alternateName and in the rename answer ──
  // The alternateName line of src/content/en-IN/products/kheelu/product.ts reaches the code scan as
  // the sentence `alternateName: "Lumi",`; the bare string "Lumi" is how the content scan reads it
  // (task 2.13; architecture §6.1, §9.2). The allowance has no file scope (findBanned takes no
  // path), so that sentence passes in any file; row 19 allows "Lumi" as alternateName anywhere.
  { id: "lumi", kind: "claim", claimsRow: R19, pattern: /\bLumi\b/, allowSentence: /\bsame as Lumi\b|\bcalled Lumi\b|\bsold as Lumi\b|^Lumi$|^alternateName: "Lumi",?$/, planted: "Meet Lumi, the toy that talks back.", why: "Renamed 2026-09-05; allowed only as alternateName and in \"Is Kheelu the same as Lumi?\"." },
  // ── Row 20: the positioning's never-say list ──
  { id: "never-iq", kind: "claim", claimsRow: R20, pattern: new RegExp(`\\bboosts? (?:your child${APOS}s |a child${APOS}s |their )?IQ\\b|\\bmakes? (?:your child|kids|children|them) smarter\\b|\\b2x faster\\b|\\btwice as fast\\b|\\bgenius\\b`, "i"), planted: "It boosts IQ and makes your child smarter.", why: "ASCI substantiation and anti-anxiety rules (positioning guardrails)." },
  { id: "never-anxiety", kind: "claim", claimsRow: R20, pattern: new RegExp(`\\bdon${APOS}t miss the window\\b|\\b(?:will|could|might) fall behind\\b`, "i"), planted: "Don't miss the window, or your child will fall behind.", why: "Anti-anxiety rule (positioning guardrails)." },
  { id: "never-proven", kind: "claim", claimsRow: R20, pattern: /\bharvard[- ]proven\b|\bscientifically proven\b|\bas good as a parent\b|\blong[- ]term memory\b/i, planted: "A Harvard-proven toy with long-term memory.", why: "Unsubstantiated (positioning guardrails; \"long-term memory\" per claims §2)." },
  { id: "never-health", kind: "claim", claimsRow: R20, pattern: /(?<![/.])\bKheelu\b[^.?!\n]{0,60}\b(?:treats?|cures?|fixes|therapy for|helps? (?:with )?(?:a )?(?:speech delay|late talking|stammer(?:ing)?|ADHD|autism))\b|\b(?:treats?|cures?) (?:speech delay|autism|ADHD)\b/i, planted: "Kheelu helps with speech delay.", why: "No health claims. The D025 disclaimer (\"a toy, not a therapy or treatment\") passes." },
  // ── §3 rows whose Site value is BANNED ──
  { id: "pilot-results", kind: "claim", claimsRow: "§3: \"Our pilot results will be published, good or bad\"", pattern: /\bpilot results will be published\b|\bpublish(?:ed)? (?:our )?pilot results\b/i, planted: "Our pilot results will be published, good or bad.", why: "The founder dropped the line (D038)." },
  { id: "wrong-terms", kind: "claim", claimsRow: "§3: \"[1-year] warranty\", \"15-day returns\"", pattern: /\b(?:1|one)[- ]year warranty\b|\b15[- ]day returns?\b/i, planted: "A 1-year warranty and 15-day returns.", why: "Decided terms: 7-day returns (D021), 6-month warranty (D022)." },
  { id: "adapts", kind: "claim", claimsRow: "§3: The **\"adapts\" family**", pattern: new RegExp(`\\bKheelu adapts\\b|\\badapts to (?:your|a|the) child\\b|\\bat (?:your|a) child${APOS}s (?:own )?pace\\b|\\bgrows with your child\\b|\\badjusts (?:itself )?to your child\\b|\\bpersonalises itself\\b|\\btailors itself\\b|\\blevels up with\\b`, "i"), planted: "Kheelu adapts and grows with your child, at your child's pace.", why: "Not confirmed (F8, D036): describe the age setting and memory instead." },
  { id: "advisor", kind: "claim", claimsRow: "§3: A named advisor, \"Reviewed by [advisor]\"", pattern: /\breviewed by (?:an? |our )?(?:child[- ]development )?(?:advisor|expert|paediatrician|pediatrician)\b|\bReviewed by \[/i, planted: "Reviewed by our child-development advisor.", why: "There is no advisor (D038)." },
  { id: "recordings-days", kind: "claim", claimsRow: "§3: \"Recordings kept for X days\"", pattern: /\brecordings? (?:are |is )?kept for \d+ days\b/i, planted: "Recordings kept for 30 days.", why: "Any \"X days\" form is banned; conversations are kept 36 months (D020)." },
  // ── The claims D058 withdrew (the live team's code check of 12 October, c630a49; claims §4, task 8b.1b) ──
  // Each is still printed by the frozen mockups its `mockupExempt` names (the build prints the claim-fix rule's words).
  { id: "one-tap-delete", kind: "claim", claimsRow: D1, pattern: /\b(?:one|single|a single)[- ]tap (?:to )?(?:delet|eras|remov|wip|clear)\w*|\b(?:delet|eras|remov|wip|clear)\w*\b[^.?!\n]{0,60}\b(?:in|with) (?:one|a single|a) tap\b/i, planted: "You can delete any of them sooner, in one tap.", why: "D058 item 1: no one-tap delete; removing a chat hides it on that phone, deleting the account deletes the conversations. \"One-tap buttons\" for calls pass.", mockupExempt: frozenOn("home", "meet-kheelu", "safety", "setup", "team", "ai-toys-for-kids-in-india", "privacy", "terms", "story-what-to-look-for-in-a-safe-ai-toy") },
  { id: "servers-in-india", kind: "claim", claimsRow: D2, pattern: /\bservers? (?:(?:are|is) )?(?:(?:located|based|hosted) )?in India\b|\b(?:Indian|India[- ]based) (?:servers?|data cent(?:re|er)s?|cloud)\b|\bIndian soil\b|\bnever leaves? India\b|\b(?:hosted|stored) (?:only |entirely |safely |securely |always )?(?:in|within|inside) India\b|\b(?:data|voices?|recordings?|conversations?|chats?|transcripts?|everything)\b[^.?!\n]{0,40}?\b(?:stays?|stayed|remains?|remained|kept|held|processed) (?:only |entirely |safely |securely |always )?(?:in|within|inside) India\b/i, planted: "Kheelu uses trusted speech and AI providers, on servers in India.", why: "D058 item 6: some processors work outside India, and /privacy names them: no place is claimed for the data (\"stays in India\", \"on Indian soil\", task 8b.1d). Staying in India is the data's only (\"Grandma stays in India\" passes). \"India (Mumbai) for the store's server code\" (Vercel's region) and delivery \"anywhere in India\" pass.", mockupExempt: frozenOn("home", "meet-kheelu", "safety", "privacy", "story-what-to-look-for-in-a-safe-ai-toy") },
  { id: "closed-library", kind: "claim", claimsRow: D3, pattern: /\b(?:curated|closed)\b[^.?!\n]{0,30}\blibrar(?:y|ies)\b|\bclosed set of (?:material|content|answers|stories|topics)\b|\bcurated (?:content|answers|replies)\b/i, planted: "Its answers come from a curated, closed content library.", why: "D058 item 1: replies are generated by an AI model given child-safety rules and the age. The DS \"Photo library\" folder passes.", mockupExempt: frozenOn("safety", "ai-toys-for-kids-in-india", "terms", "story-what-to-look-for-in-a-safe-ai-toy") },
  { id: "safety-layer", kind: "claim", claimsRow: D4, pattern: /\bage[- ]graded (?:safety|layer|filters?|replies|answers|content)\b|\bsafety layer\b|\b(?:every|each) (?:reply|answer|response)\b[^.?!\n]{0,30}\bpass(?:es)?\b/i, planted: "Every reply passes an age-graded safety layer set to your child's age.", why: "D058 item 1: no age-graded layer; the model gets child-safety rules and the age, with Google's safety filters on top. The guides' question \"Is every reply checked for your child's age?\" passes.", mockupExempt: frozenOn("home", "meet-kheelu", "safety", "setup", "team", "ai-toys-for-kids-in-india", "privacy", "terms", "story-what-to-look-for-in-a-safe-ai-toy") },
  { id: "quiet-hours", kind: "claim", claimsRow: D5, pattern: new RegExp(`\\bquiet hours?\\b[^.?!\\n]{0,100}\\b(?:parent app|the app|Kheelu)\\b|\\b(?:parent app|the app|Kheelu)\\b[^.?!\\n]{0,100}\\bquiet hours?\\b|\\bQuiet hours\\.\\s+They${APOS}re yours to set\\b`, "i"), planted: "In the parent app, you set quiet hours.", why: "D058 item 1: the app has no quiet hours. A family's own quiet hours, with no app or Kheelu in the sentence, pass.", mockupExempt: frozenOn("safety", "setup") },
  { id: "topic-controls", kind: "claim", claimsRow: D6, pattern: new RegExp(`\\btopic (?:controls?|settings?|filters?|locks?)\\b|${withProduct(`\\b${PICKS_TOPICS}`)}|${withProduct(TOPICS_GATED)}|\\bit (?:lets you |can )?${PICKS_TOPICS}|\\bTopics\\.\\s+You choose what${APOS}s open\\b|\\bwhat${APOS}s open, and what waits\\b`, "i"), planted: "In the app, you pick which topics are open.", why: "D058 item 1: the app has no topic controls. The journal's topics (the hub's sections) pass, and so does a parent's own choice of topics with no app or Kheelu in the sentence (task 8b.1d).", mockupExempt: frozenOn("safety", "setup") },
  { id: "new-word-count", kind: "claim", claimsRow: D7, pattern: new RegExp(`\\bnew[- ]words? (?:count|counter|tally|tracker)s?\\b|${withProduct(`\\b${COUNTS_NEW_WORDS}`, 60)}|${withProduct("\\bhow many new words\\b", 60)}|\\bit (?:also |even |then )?${COUNTS_NEW_WORDS}`, "i"), planted: "Every week the app gives you a new-word count.", why: "D058 items 1 and 8: no new-word count until it ships. A guide's \"Explain a new word\" passes, and so does a parent's own count of new words, with no app or Kheelu in the sentence, and \"it counts as a new word\" (task 8b.1d).", mockupExempt: frozenOn("home", "meet-kheelu", "privacy") },
  { id: "four-skills-report", kind: "claim", claimsRow: D8, pattern: new RegExp(`\\breport on (?:the |your child${APOS}s |their )?(?:four )?thinking skills\\b|\\bfour[- ](?:thinking[- ])?skills?[- ]report\\b|\\bin four thinking skills\\b|\\bweekly (?:[\\w-]+ ){0,2}report\\b[^.?!\\n]{0,60}\\b(?:parent app|the app|Kheelu)\\b|\\b(?:parent app|the app|Kheelu)\\b[^.?!\\n]{0,60}\\bweekly (?:[\\w-]+ ){0,2}report\\b`, "i"), planted: "Every week, the parent app gives you a report on four thinking skills.", why: "D058 item 8: the weekly four-skills report comes off until it ships. A guide's talk of thinking skills passes; so does a weekly report that is not the app's.", mockupExempt: frozenOn("home", "meet-kheelu", "privacy") },
  { id: "minute-of-quiet", kind: "claim", claimsRow: D9, pattern: new RegExp(`\\boff,? after ${A_MINUTE} of ${QUIET_SPELL}\\b|\\b(?:switch(?:es|ed)?|turns?|turned|shuts?|powers?)(?: itself)? off,? after ${A_MINUTE}|\\b(?:it|Kheelu|microphone|mic|conversations?|chats?)\\b[^.?!\\n]{0,60}?\\b(?:goes|go|went|stops?|stopped|ends?|ended)(?: quiet| silent| listening| off)?,? after ${A_MINUTE}|\\bafter ${A_MINUTE}(?: of ${QUIET_SPELL})?,? (?:it|Kheelu|the microphone|the mic|the conversation|the chat)(?: itself)? (?:switch(?:es)?|turns?|shuts?|powers?|goes|stops?|ends?)\\b|\\b(?:Kheelu|microphone|mic)\\b[^.?!\\n]{0,60}?\\b${A_MINUTE} of ${QUIET_SPELL}\\b|\\b${A_MINUTE} of ${QUIET_SPELL}\\b[^.?!\\n]{0,60}?\\b(?:Kheelu|microphone|mic)\\b|\\bit (?:also |then |just )?${GOES_OFF},? after ${A_MINUTE} of ${QUIET_SPELL}\\b|\\b${A_MINUTE} of ${QUIET_SPELL},? and (?:it|Kheelu|the microphone|the mic) ${GOES_OFF}`, "i"), planted: "It switches itself off after about a minute of quiet.", why: "D058 item 1: a conversation ends after a couple of minutes of quiet. \"A couple of minutes of quiet\" passes, and so does a family's own minute of quiet, with no switching off and no Kheelu in the sentence, before or after (task 8b.1d).", mockupExempt: frozenOn("home", "meet-kheelu", "safety", "setup", "ai-toys-for-kids-in-india", "privacy", "story-what-to-look-for-in-a-safe-ai-toy") },
  { id: "attack-own-safety", kind: "claim", claimsRow: D10, pattern: /\battack(?:s|ed|ing)? (?:our|its) own (?:safety|filters?|layer|model|AI|systems?|guardrails?)\b|\bred[- ]team(?:s|ed|ing)? (?:our|its) own\b|\b(?:try|tries|trying|tried) to (?:break|crack|beat|fool|trick|bypass|jailbreak|defeat) (?:our|its) own\b|\b(?:break|breaks|breaking|crack|cracks|cracking|jailbreak|jailbreaks|jailbreaking|bypass|bypasses|bypassing) (?:our|its) own (?:safety|filters?|layer|model|AI|systems?|guardrails?)\b|\bsafety (?:layer|filters?|guardrails?) before (?:every|each) (?:release|update)\b/i, planted: "We attack our own safety layer before every release.", why: "D058 item 1: the line goes, in any wording (\"We try to break our own safety filters\", task 8b.1d). The pre-launch test (\"Tested before launch by trying to make it say unsafe things\") is open question G29 and passes.", mockupExempt: frozenOn("story-what-to-look-for-in-a-safe-ai-toy") },
  { id: "keep-none-of-it", kind: "claim", claimsRow: D11, pattern: new RegExp(`\\b(?:keeps?|retains?|stores?|holds?|saves?) none of (?:it|them|your child${APOS}s (?:voice|data|words|conversations|recordings))\\b|\\b(?:providers?|they)\\b[^.?!\\n]{0,60}\\b(?:keeps?|kept|retains?|retained) nothing\\b|\\bproviders?\\b[^.?!\\n]{0,60}\\b(?:stores?|stored|holds?|held|saves?|saved) nothing\\b|\\bnothing (?:is |gets )?(?:kept|retained|stored|saved) by (?:them|the providers?|our providers?)\\b`, "i"), planted: "The speech and AI providers that help Kheelu reply keep none of it.", why: "D058 item 6: the live /privacy names the processors instead. Banned as written, in any wording (\"The providers retain nothing\", task 8b.1d): D020's \"They don't keep it\" stays until the founder checks the provider contracts (journal pipeline §9.2). Holding, saving or storing nothing is the providers' only (\"they hold nothing back\" passes).", mockupExempt: frozenOn("privacy") },
  // ── The advisor's stale facts (D061, 2026-10-15; claims §4, task 8c.4) ──
  { id: "cash-on-delivery", kind: "offer", claimsRow: C1, pattern: new RegExp(ON_DELIVERY, "i"), allowSentence: /\?\s*$/, planted: "Cash on delivery", why: "D024, D061: every order is paid online (UPI, card or net banking); there is no cash on delivery, and the checkout is frozen (ADR-013). Saying there is none passes (\"there's no cash on delivery\", \"nothing to pay at the door\"), and so does a parent's question." },
  { id: "ships-20-october", kind: "offer", claimsRow: C2, pattern: new RegExp(`\\b${SHIPS}\\b[^.?!\\n]{0,30}?\\b${OCT_20}|\\b${OCT_20}[^.?!\\n]{0,20}?\\b${SHIPS}\\b`, "i"), planted: "Ships 20 Oct", why: "D023, D061: new orders deliver from mid-November; the pages say \"Deliveries start mid-November\" ({delivery}). A receipt for an order placed before 10 October keeps its \"Ships from\" row beside the date (D054 item 1): two cells, never one line of a page." },
  { id: "open-ended-ages", kind: "claim", claimsRow: C3, pattern: new RegExp(OPEN_AGE, "i"), planted: "Ages 3+", why: "D009, D061: the band is 3 to 7; \"3+\" has no ceiling and, beside \"AI toy\", invites toddler use. A closed band (\"aged 5 and under\", \"aged 6 to 12\"), \"up to age 7\" and a count with its unit (\"2+ hours\") pass." },
  { id: "part-price-button", kind: "offer", claimsRow: C4, pattern: new RegExp(`\\b(?:pre-?order|book now|buy now|order now)(?: (?:now|today|Kheelu|yours|your Kheelu|it))?(?: (?:for|at|from|@)|:| ·| \\|)? (?:just |only )?${PART_PRICE}`, "i"), planted: "Pre-order for ₹499", why: "D041 G1, D028, D061: the button reads \"Pre-order Kheelu\" (a registered tracking label), and ₹499 beside it is said with the total in the same sentence (DARK-03). The price sentence and the store's own pay button (\"Pay ₹499 and reserve\") pass." },
  { id: "pilot-homes", kind: "claim", claimsRow: C5, pattern: /\bpilot[- ](?:homes?|households?|houses?)\b/i, planted: "Real pilot homes", why: "D057 item 2, D061: not every film was shot at home. \"Real pilot families\" (/terms, /privacy) and \"Real children in real homes.\" pass." },
  { id: "backed-by", kind: "claim", claimsRow: C6, pattern: new RegExp(`\\bbacked by\\b(?! (?:the |good |solid |strong |sound |published |peer[- ]reviewed )?(?:research|evidence|science|studies|study|data|sources?)\\b)|\\b${PROGRAMME}[- ](?:backed|funded|supported|endorsed|sponsored)\\b|\\b(?:supported|funded|endorsed|sponsored|invested in|incubated|accelerated|mentored)(?: by)?\\b[^.?!\\n]{0,40}?\\b${PROGRAMME}\\b|\\b${PROGRAMME}\\b[^.?!\\n]{0,40}?\\b(?:backs|backed|funds|funded|invests? in|invested in|endorses|endorsed|sponsors|sponsored)\\b`, "i"), planted: "Backed by top programs", why: "B26, D054 item 20, D061: the strip names the programmes only, with no relationship; \"Backed by\" reads as an investment claim (the live /team dropped it, V6 QA M1). \"Recognised by.\" and advice \"backed by research\" pass." },
  { id: "safety-certified", kind: "claim", claimsRow: C7, pattern: new RegExp(`${NOT_YET}\\b(?:toy[- ])?safety[- ]certified\\b|${NOT_YET}\\bcertified (?:as )?(?:safe|child[- ]safe|kid[- ]safe|toy[- ]safe|non[- ]toxic)\\b|${NOT_YET}\\bcertified for (?:toy |child |children${APOS}s |kids${APOS} )?safety\\b|${NOT_YET}\\b(?:BIS|ISI)[- ](?:certified|approved|marked|licensed)\\b(?! (?:charger|adapter|power))`, "i"), planted: "Safety certified", why: "Claims §6, D061: Kheelu's toy-safety (BIS) licence is applied for, not granted. \"Toy-safety certification (BIS): applied for, not yet granted.\" and \"not yet safety certified\" pass." },
  // ── en-IN spelling (N24): src/content strings and rendered text only ──
  { id: "us-color", kind: "spelling", claimsRow: "N24", pattern: /\bcolor(?:s|ed|ful|ing|way|ways)?\b/i, planted: "Pick a color.", why: "en-IN: colour." },
  { id: "us-center", kind: "spelling", claimsRow: "N24", pattern: /\bcent(?:er|ers|ered|ering)\b/, allowSentence: /^center$/, planted: "Put it in the center.", why: "en-IN: centre. Proper nouns (\"Center on the Developing Child\", \"Synergy Center\") are capitalised and pass. A string that is only \"center\" is a layout value (a CTA block's `align`), not copy." },
  { id: "us-favorite", kind: "spelling", claimsRow: "N24", pattern: /\bfavorites?\b|\bfavorite\b/i, planted: "Her favorite story.", why: "en-IN: favourite." },
  { id: "us-program", kind: "spelling", claimsRow: "N24", pattern: /\bprograms?\b/i, allowSentence: /^NVIDIA Inception Program$/, planted: "An accelerator program.", why: "en-IN: programme (the copy writes \"programme\"). \"NVIDIA Inception Program\", the programme's own name printed on its mark, passes only as that exact string (the /team mark's alt, team.md question 5)." },
  { id: "us-ize", kind: "spelling", claimsRow: "N24", pattern: /(?<!\bHealth )\b(?:recogni|personali|organi|reali|apologi|prioriti|summari|memori|customi|speciali|minimi|maximi|emphasi|categori|authori|finali|utili|visuali|optimi)z(?:e|es|ed|ing|ation|ations)\b/i, planted: "It recognizes your child and personalizes nothing.", why: "The copy spells -ise (recognise, personalised, organisations). \"World Health Organization\" is a proper noun and passes." },
  { id: "us-behavior", kind: "spelling", claimsRow: "N24", pattern: /\bbehaviors?\b|\bbehavioral\b/i, planted: "Sedentary behavior.", why: "en-IN: behaviour (as the WHO citation in the copy)." },
  { id: "us-pediatrician", kind: "spelling", claimsRow: "N24", pattern: /\bpediatricians?\b/i, planted: "Ask your pediatrician.", why: "en-IN: paediatrician. \"Indian Academy of Pediatrics\" is a proper noun and passes." },
];

export type BannedHit = { id: string; match: string; sentence: string };

/** The sentence around an index: from after the previous . ? ! or line break to the next one. */
function sentenceAt(text: string, at: number): string {
  let start = at;
  while (start > 0 && !/[.?!\n]/.test(text[start - 1])) start--;
  let end = at;
  while (end < text.length && !/[.?!\n]/.test(text[end])) end++;
  return text.slice(start, Math.min(text.length, end + 1)).trim();
}

/** Every banned phrase in a text, the named exceptions (allowSentence) applied. */
export function findBanned(text: string, kinds: readonly BannedKind[] = ["claim", "offer", "spelling"]): BannedHit[] {
  const hits: BannedHit[] = [];
  const flat = text.replace(/[ \t\r\f\v]+/g, " ");
  for (const entry of BANNED_PHRASES) {
    if (!kinds.includes(entry.kind)) continue;
    const flags = entry.pattern.flags.includes("g") ? entry.pattern.flags : `${entry.pattern.flags}g`;
    for (const m of flat.matchAll(new RegExp(entry.pattern.source, flags))) {
      const sentence = sentenceAt(flat, m.index ?? 0);
      if (entry.allowSentence?.test(sentence)) continue;
      hits.push({ id: entry.id, match: m[0], sentence: sentence.slice(0, 160) });
    }
  }
  return hits;
}

/** The banned phrases in an approved mockup page's text (`slug`, its file name in mockup/): findBanned's, less the
 *  withdrawn claims the entry exempts on that frozen page (`mockupExempt`). For the mockup checks only (the guard's rule
 *  3, the content-integrity calibration); never for the build, the copy pages, src/ or the journal. */
export function findBannedOnMockup(slug: string, text: string, kinds: readonly BannedKind[] = ["claim", "offer", "spelling"]): BannedHit[] {
  const exempt = new Set(BANNED_PHRASES.filter((e) => (e.mockupExempt?.on as readonly string[] | undefined)?.includes(slug)).map((e) => e.id));
  return findBanned(text, kinds).filter((hit) => !exempt.has(hit.id));
}
