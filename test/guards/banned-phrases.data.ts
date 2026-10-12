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
 * Scope: src/content/** strings and rendered text (test/e2e/content-integrity.spec.ts); the offer
 * entries also over every shipped src/**\/*.ts(x) file, comments aside, as the old test did; the
 * claim entries also over every shipped src file that is not still legacy. The en-IN spelling
 * entries apply to content and rendered text only (N24), never to code, where CSS words like
 * "center" and identifiers like "color" are not copy.
 */

export type BannedKind = "claim" | "offer" | "spelling";

export type BannedPhrase = {
  id: string;
  kind: BannedKind;
  /** The claims.md row this enforces: the start of its first cell, or "§3: …", or "N24" for spelling. */
  claimsRow: string;
  pattern: RegExp;
  /** A sentence that matches the pattern but also matches this is allowed (the named exceptions). */
  allowSentence?: RegExp;
  /** An example the pattern must catch. */
  planted: string;
  why: string;
};

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

const APOS = "['’]";

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
  // (task 2.13; architecture §6.1, §9.2).
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
  // ── en-IN spelling (N24): src/content strings and rendered text only ──
  { id: "us-color", kind: "spelling", claimsRow: "N24", pattern: /\bcolor(?:s|ed|ful|ing|way|ways)?\b/i, planted: "Pick a color.", why: "en-IN: colour." },
  { id: "us-center", kind: "spelling", claimsRow: "N24", pattern: /\bcent(?:er|ers|ered|ering)\b/, planted: "Put it in the center.", why: "en-IN: centre. Proper nouns (\"Center on the Developing Child\", \"Synergy Center\") are capitalised and pass." },
  { id: "us-favorite", kind: "spelling", claimsRow: "N24", pattern: /\bfavorites?\b|\bfavorite\b/i, planted: "Her favorite story.", why: "en-IN: favourite." },
  { id: "us-program", kind: "spelling", claimsRow: "N24", pattern: /\bprograms?\b/i, planted: "An accelerator program.", why: "en-IN: programme (the copy writes \"programme\")." },
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
