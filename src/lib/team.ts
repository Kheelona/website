/** The people behind Kheelona, one source for Home's team strip and /team
 *  (CMO merge, 2026-10-04: the data moved out of the /team page so Home can
 *  show the same four people; /team kept its URL, labelled "Our story").
 *
 *  R7 full-parity rebuild from kheelona.ai/team (founder-published source).
 *  Bios adapted to parent voice; facts verbatim (14 patents, Intel +
 *  Thunderbolt 4/5 compliance, CA + 15 years scaling). Pull-quotes verbatim.
 *  `short` is the one-line role the Home strip prints, condensed from `bio`
 *  and claiming nothing the bio does not. */

/* CEO first, as the mockup orders them (the old /team led with Aman). */
export const FOUNDERS = [
  {
    id: "apoorva",
    /** The element id on /team, equal to the fragment of this person's
     *  schema `@id` in lib/seo.ts, so `/team#apoorva-sahu` lands on the card. */
    anchor: "apoorva-sahu",
    short: "CEO. Grew up in his family's pre-school.",
    name: "Apoorva Sahu",
    role: "Co-founder and CEO",
    tag: "The business and the trust",
    photo: "/team/apoorva.jpg",
    linkedin: "https://www.linkedin.com/in/sahu-apoorva/",
    bio: "Apoorva grew up inside education businesses: his family runs the pre-school where he was the first student, in 1994, and he helped run his father's coaching centre as a teenager. Fifteen years in finance and company-building later, he is a Chartered Accountant who learned to ship AI. He owns the frontend, the firmware, and the promise this brand makes to your family.",
    quote:
      "The hard part of AI for children is not the model. It is the trust. So we build that first, and everything else second.",
  },
  {
    id: "aman",
    /** The element id on /team, equal to the fragment of this person's
     *  schema `@id` in lib/seo.ts, so `/team#aman-soni` lands on the card. */
    anchor: "aman-soni",
    short: "CTO. Builds Kheelu's AI and safety filters.",
    name: "Aman Soni",
    role: "Co-founder and CTO",
    tag: "The brain",
    photo: "/team/aman.jpg",
    linkedin: "https://www.linkedin.com/in/aman-soni-6b17b6223/",
    bio: "Aman builds the part that thinks. He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name. He owns the backend and the brain: the voice loop your child talks to, the safety filters, and the small language model we train ourselves.",
    quote:
      "A toy that listens has to think on the device, in real time, and never say the wrong thing. That is the hard problem. It is the only one I want to work on.",
  },
  {
    id: "kashyap",
    /** The element id on /team, equal to the fragment of this person's
     *  schema `@id` in lib/seo.ts, so `/team#kashyap-c-r` lands on the card. */
    anchor: "kashyap-c-r",
    short: "Hardware. A decade taking devices to certified products.",
    name: "Kashyap C.R",
    role: "Co-founder and Chief Hardware Officer",
    tag: "The body",
    photo: "/team/kashyap.jpg",
    linkedin: "https://www.linkedin.com/in/kashyap-c-r-7ba18177/",
    bio: "Kashyap makes Kheelu something small hands reach for. Over a decade, including years at Intel leading Thunderbolt 4 and 5 compliance, he took hardware from a blank page to certified products on real shelves. He owns the hardware and the power: the Kheelona Magic Box, the battery that lasts, and the unglamorous work of making it safe to hug.",
    quote:
      "Anyone can build a demo. Shipping a safe, certified toy by the thousand is a different sport. I have played it for ten years.",
  },
  {
    // R10 (founder 2026-07-11): Ria joins between Kashyap and Apoorva.
    // Bio facts from her published profile; quote drafted from her own
    // published line ("most businesses don't have a marketing problem, they
    // have a clarity problem") — founder-approved via the R10 plan, Ria's
    // personal sign-off flagged in FOUNDER-TODO. R11: the founder's source
    // PNG had a BAKED checkerboard (fake transparency) — re-cut with
    // tools/cutout (Vision) and composited on flat pale lavender #F1ECFB,
    // matching the set (each photo bg echoes its card tint family).
    id: "ria",
    /** The element id on /team, equal to the fragment of this person's
     *  schema `@id` in lib/seo.ts, so `/team#ria-mangala-rewari` lands on the card. */
    anchor: "ria-mangala-rewari",
    short: "Marketing. Co-founded and ran a marketing agency for seven years.",
    name: "Ria Mangala Rewari",
    role: "Head of Marketing",
    tag: "The voice",
    photo: "/team/ria.jpg",
    linkedin: "https://www.linkedin.com/in/ria-mangala/",
    bio: "Ria owns how Kheelona speaks to the world. She co-founded a marketing agency and ran it for seven years, and has trained more than 1,000 students and entrepreneurs in digital marketing. She owns the story: where Kheelu shows up, how it speaks, and why it never overpromises.",
    quote:
      "Most brands do not have a marketing problem. They have a clarity problem. My job is to keep this one clear and honest.",
  },
] as const;

export const BELIEFS = [
  "Screen-free is not nostalgia. It is the next product.",
  "Safety is not a feature. It is the whole product.",
  "A toy should be kept, not outgrown.",
  "The parent holds the keys. Always.",
] as const;
