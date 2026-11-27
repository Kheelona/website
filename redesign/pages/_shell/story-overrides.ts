/**
 * Per-post overrides over the dashboard (K-215; the founder's decision of 27 Nov 2026: the sprint-1 guide edits go
 * through code, not admin.kheelona.com, whose Website tab cannot save `lead`, `answer` or `photo` today).
 *
 * They live with the redesign, not in src/content/en-IN: only the redesign's story pages read them, and they link the
 * redesign-only guide pages, which are not routes of src/content/en-IN/routes.ts.
 *
 * tools/generate-stories.mjs applies them over the dashboard's published posts (the API on a production build, the
 * committed snapshot otherwise), before the journal gate, so the result passes the same checks:
 *   - `fields`: these post fields replace the dashboard's (`updated`: the later of the two dates wins).
 *   - `insert`: dashboard-shaped body nodes, placed `after` or `before` the ONE top-level block whose text is exactly
 *     the anchor. No such block, or two → the build fails. Every inserted text already in the post → skipped with a
 *     warning (the dashboard caught up: remove the entry); only some of them → the build fails.
 *   - `head`: the head image from the repo (WebP on the page, `<image>-640.webp` for phones when present; `card` is the
 *     share image, `cardSize` its pixels), instead of the post's `photo` or uploaded cover. Also the post's card image.
 * While an entry is here, dashboard edits to its fields and inserts do not show on the site. To hand a post back to
 * the dashboard, delete its entry (or this file); nothing else depends on it.
 *
 * NO IMPORTS, AND NOTHING BUT ERASABLE TYPESCRIPT: the generator imports this file with Node's type stripping.
 */

interface Mark {
  readonly type: "link";
  readonly attrs: { readonly href: string };
}
interface Text {
  readonly type: "text";
  readonly text: string;
  readonly marks?: readonly Mark[];
}
interface Block {
  readonly type: "paragraph" | "heading";
  readonly attrs?: { readonly level: 2 | 3 };
  readonly content: readonly Text[];
}
export interface StoryOverride {
  readonly fields?: Readonly<Record<string, unknown>>;
  readonly insert?: readonly (({ readonly after: string; readonly before?: never } | { readonly before: string; readonly after?: never }) & { readonly nodes: readonly Block[] })[];
  readonly head?: { readonly image: string; readonly alt: string; readonly card: string; readonly cardSize: readonly [number, number] };
}

const p = (...content: readonly Text[]): Block => ({ type: "paragraph", content });
const h2 = (text: string): Block => ({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] });
const t = (text: string): Text => ({ type: "text", text });
const a = (text: string, href: string): Text => ({ type: "text", text, marks: [{ type: "link", attrs: { href } }] });

export const storyOverrides: Readonly<Record<string, StoryOverride>> = {
  "screen-free-does-not-mean-silent": {
    fields: {
      lead: "Which screen-free toys suit a 3 to 7 year old, type by type, and how to choose the ones that fill a home with talk.",
      answer: {
        question: "What are screen-free toys for 3 to 7 year olds?",
        text: "Screen-free toys are toys with no display. For a 3 to 7 year old, that means blocks, puzzles, crayons and dough, pretend-play sets, picture books, puppets, board games, and audio or talking toys. The best ones give your child something to do or say. A simple test: will this toy wait for my child, or perform at them?",
      },
      updated: "2026-11-27",
    },
    head: {
      image: "/assets/img/stories/covers/screen-free-does-not-mean-silent.webp",
      alt: "Khelu by Kheelona, a plush rabbit, beside toy blocks, a crayon and two speech bubbles, with the words \"Screen-free does not mean silent\".",
      card: "/og/screen-free-does-not-mean-silent.jpg",
      cardSize: [1200, 675],
    },
  },

  "the-gentle-way-off-the-phone": {
    fields: {
      title: "How to reduce screen time for kids: a 7-day plan",
      metaTitle: "How to reduce screen time for kids: a 7-day plan · Kheelona",
      accent: null,
      description:
        "How to reduce screen time for kids aged 3 to 7: a gentle seven-day plan, a family \"digital fasting\" time, and the 3-6-9-12 rule explained.",
      author: "Apoorva Sahu",
      sources: [
        {
          label: "Indian Academy of Pediatrics, “Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents”, Indian Pediatrics, 2022, pp. 239–240.",
          url: "https://www.indianpediatrics.net/mar2022/235.pdf",
        },
        {
          label: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
          url: "https://doi.org/10.1542/peds.2016-2591",
        },
        { label: "Serge Tisseron, “Les balises 3-6-9-12+” (in French).", url: "https://www.3-6-9-12.org/les-balises-3-6-9-12/" },
      ],
      updated: "2026-11-27",
    },
    insert: [
      {
        before: "Days 1 and 2: notice when the phone comes out",
        nodes: [
          h2("What is the 3-6-9-12 rule for screen time?"),
          p(t("It is a set of age markers from the French psychiatrist Serge Tisseron, first published in 2008: no screens before 3, no games console of their own before 6, no internet before 9, and no internet alone before 12.[^3] It says what to introduce and when, not how many minutes a day, so it sits beside the limits above.")),
          p(t("For a 3 to 7 year old, it comes to this: limit screens, share them and talk about what you watched; let a personal console wait until 6; let the internet wait until 9, and then with an adult alongside.[^3]")),
          p(t("One difference to know. India's paediatricians draw the first line at 2, not 3: the Indian Academy of Pediatrics says children below 2 should not be exposed to any type of screen.[^1]")),
        ],
      },
      {
        after: "For the slots where your hands are full, Kheelu is one screen-free option. It is a plush toy for ages 3 to 7 that answers your child, then asks a question back, and you can read every conversation in the parent app. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.",
        nodes: [
          h2("How do I detox my child from screen time?"),
          p(t("Gradually, and as a family. A sudden ban leaves a gap, and the gap turns into a fight, which is why the plan above replaces one slot at a time. For a reset, the Indian Academy of Pediatrics suggests \"digital fasting\": a time when nobody at home uses a device, as short daily breaks or longer weekend ones.[^1]")),
          p(t("It also suggests marking places where no one uses a gadget, such as the bedroom, the dining table and the car.[^1]")),
          p(t("Pick one fasting time and one such place this week, and keep to them yourself. A detox that applies only to the child feels like a punishment. One the whole family keeps feels like a house rule.")),
        ],
      },
    ],
    head: {
      image: "/assets/img/stories/covers/the-gentle-way-off-the-phone.webp",
      alt: "Khelu by Kheelona, a plush rabbit, beside seven coloured dots and two speech bubbles, with the words \"Reduce screen time: a 7-day plan\".",
      card: "/og/the-gentle-way-off-the-phone.jpg",
      cardSize: [1200, 675],
    },
  },

  "a-toy-that-talks-vs-a-toy-that-listens": {
    fields: { updated: "2026-11-27" },
    insert: [
      {
        after: "A toy that repeats is a mirror. It can be funny, but it can’t answer a question, and it never asks one of its own. A toy with a handful of sentences has nothing new to say once your child has heard them all.",
        nodes: [
          p(
            t("How each kind works, and what to check before you buy one, is in "),
            a("Talking toys: a toy that repeats, or a toy that talks back?", "/talking-toys-that-talk-back"),
            t(" For soft toys, read "),
            a("Talking soft toys and bunnies", "/talking-soft-toys-and-bunnies"),
            t("."),
          ),
        ],
      },
    ],
  },

  "does-a-three-year-old-need-an-ai-tutor": {
    fields: { updated: "2026-11-27" },
    insert: [
      {
        before: "What child-safety groups advise about AI toys at this age, and our answer, is in our guide to what to look for in a safe AI toy.",
        nodes: [p(t("Choosing between a robot and a soft toy? Read "), a("AI robot or AI plush for a 3 to 7 year old?", "/ai-robot-or-ai-plush"))],
      },
    ],
  },
};
