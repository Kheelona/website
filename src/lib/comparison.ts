import { KHEELU_AGES } from "@/config/site";

/** "How Kheelu compares" (content doc v7, Home screen 6 and Meet Kheelu,
 *  incorporated 2026-10-02). ONE source for both pages, because the doc asks
 *  for the two tables to stay in sync.
 *
 *  Three rules ride with it, all from the doc:
 *  - Product TYPES only. No smart speaker, tablet or robot toy brand is named
 *    anywhere, nor a speaker's wake word ("Smart speaker", never a brand).
 *  - The four ticks that used to sit in the hero live here now.
 *  - Every cell is to be checked against current products and date-stamped.
 *
 *  Two deliberate departures from the doc, both recorded in Technical-Todo.md:
 *  - The PRICE row and the "checked on" date are left out until the team
 *    supplies checked market ranges (the doc has them as [brackets]).
 *  - The doc's "ages 3 to 7" is rendered as KHEELU_AGES ("3+"): the site
 *    publishes no age ceiling (founder decision #8, 2026-08-23). */
export const COMPARISON_COLUMNS = [
  "Kheelu",
  "Smart speaker",
  "Tablet or phone",
  "Robot toy with a screen",
] as const;

export type ComparisonRow = {
  label: string;
  /** One value per column, in COMPARISON_COLUMNS order. */
  values: readonly [string, string, string, string];
};

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    label: `Made for ages ${KHEELU_AGES}`,
    values: ["Yes", "No, made for adults", "Only with kids' apps set up", "Often made for 5 and up"],
  },
  { label: "Screen", values: ["None", "None", "Yes", "Yes"] },
  {
    label: "Asks your child questions back",
    values: [
      "Yes, by design",
      "Rarely. It answers and stops",
      "Rarely. Your child mostly watches or taps",
      "Sometimes",
    ],
  },
  {
    label: "Answers in words a small child understands",
    values: ["Yes", "Not usually", "Depends on the app", "Usually"],
  },
  {
    label: "Can open videos, websites or shopping",
    values: ["No", "Yes, unless you set limits", "Yes, unless you lock it down", "Many have video apps"],
  },
  {
    label: "You can read every conversation",
    values: ["Yes, word for word", "Voice history only", "No", "Varies"],
  },
  {
    label: "Talks in Indian home languages",
    values: [
      "English, Hindi, Bengali, Telugu, Tamil and Kannada, and switches mid-sentence",
      "Some, usually one at a time",
      "Depends on the app",
      "Varies, sometimes only on a paid plan",
    ],
  },
  { label: "Camera in your home", values: ["None", "None on most", "Yes", "Often"] },
  { label: "Soft enough to hug", values: ["Yes", "No", "No", "No"] },
  {
    label: "Monthly fee to keep talking",
    values: ["No. Talking is free for life", "No", "Varies by app", "Often, for full features"],
  },
];
