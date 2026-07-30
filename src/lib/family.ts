/** The product pipeline (V3, founder 2026-07-27 from the YC application):
 *  ONE friend inside many bodies, Lumi first. This replaced the old
 *  Lori/Lua/Robu lineup on kheelona.com — those characters stay published on
 *  kheelona.ai, and their renders stay in `public/products/` untouched for
 *  parity, but .com now tells the age-arc story instead: Lumi at 2, the Kheelu
 *  Speaker through the school years, AI books across the whole range.
 *
 *  ONE source for the Home pipeline room and /playos so the lineup can never
 *  drift (the setup-steps lesson, R9). Tints brand-4 only. `img: null` renders
 *  the calm placeholder until the founder's Gemini art lands (gate V3-c). */
export type FamilyMember = {
  name: string;
  ages: string;
  note: string;
  img: string | null;
  alt: string;
  w: number;
  h: number;
  tint: string;
  here?: boolean;
};

export const FAMILY: readonly FamilyMember[] = [
  {
    name: "Lumi",
    ages: "2 to 5",
    note: "Here first. The friend who listens.",
    img: "/product/lumi-blue-2.png",
    alt: "Lumi, the sky blue talking plush toy with a speaker in its tummy, wearing its striped party hat",
    w: 1234,
    h: 1600,
    tint: "bg-blue/15",
    here: true,
  },
  {
    name: "Kheelu Speaker",
    ages: "5 to 14",
    note: "The same friend, grown up a little. For the school years.",
    /* V3-c CLEARED 2026-07-31: founder-generated render, house cutout
       pipeline (Vision, tight crop). Source staged in
       Design/product-images/generated-2026-07/. */
    img: "/products/kheelu-speaker.png",
    alt: "The Kheelu Speaker: a friendly robot-shaped speaker with softly glowing eyes and five simple buttons",
    w: 653,
    h: 1200,
    tint: "bg-orange/15",
  },
  {
    name: "AI books",
    ages: "2 to 14",
    note: "Stories that answer back. Read, ask, and be asked.",
    img: "/products/ai-book.png",
    alt: "A Kheelona AI book: a sturdy white talking book with a carry handle, pastel page tabs, and a glowing speaker in its cover",
    w: 883,
    h: 1200,
    tint: "bg-yellow/15",
  },
] as const;
