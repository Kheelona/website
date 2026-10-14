import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import floorTrain from "@ds/assets/Photo library/advik-04-floor-train-web.webp";
import { getArticle } from "@/content/en-IN/stories/articles";
import type { Answer, Article, ArticlePart, FigureBlock, ProseBlock, Source } from "@/content/types";
import { AnswerSection } from "../AnswerSection/AnswerSection";
import { SourcesSection } from "../SourcesSection/SourcesSection";
import { ArticleBody } from "./ArticleBody";

/* ArticleBody (task 3.4): the reading column of the three approved article mockups (story-*.html). The bodies, answers
 * and sources below are the approved copy, ported verbatim into the content model's shapes (src/content/types.ts) as
 * task 5.6 will port them into the article modules; they are story and test data only (exported in capitals, which
 * Storybook leaves out of the story list), shared by the AnswerSection and SourcesSection stories. The answer and the
 * sources are their own sections, passed in as `before` and `after`: each story shows the column as the article does.
 *
 * The safe-AI-toy guide's body is the exception (task 8b.1d): several of its Gate A facts are claims the live team's
 * code check withdrew (D058: one tap, servers in India, a closed library, the safety layer, a minute of quiet, "Tested
 * by us first"), so its body is the guide as the site prints it, read through the journal registry, and
 * ArticleBody.test.tsx holds it to the frozen mockup (D046) with the guide's claim fixes applied. Its answer and
 * sources, which D058 left alone, stay the approved copy. */

type Body = readonly (ArticlePart | FigureBlock)[];

const part = (title: string | undefined, blocks: readonly ProseBlock[], extra: Partial<ArticlePart> = {}): ArticlePart => ({
  kind: "part",
  ...(title === undefined ? {} : { title }),
  ...extra,
  blocks,
});
const p = (text: string): ProseBlock => ({ kind: "p", text });

/** story-learning-toys-for-a-three-year-old.html, folds 3-12. */
export const LEARNING_TOYS_BODY: Body = [
  part("What is a {nowrap:3-year-old} working on?", [
    p("India’s National Education Policy 2020 treats ages 3 to 8 as the Foundational Stage: three years of Anganwadi or pre-school, then Grades 1 and 2.[^2]"),
    p("For these early years, it describes learning that is “play-based, activity-based, and inquiry-based”, covering languages, numbers and counting, colours and shapes, puzzles, drawing, craft, drama and puppetry, music and movement.[^3]"),
    p("It is written for Anganwadis and pre-schools, not for toy shops. Here is what those kinds of play look like at home, skill by skill."),
  ]),
  part("Language: does the toy make a turn?", [
    p("Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^1]"),
    p("In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.[^4]"),
    p("So the test for a language toy is simple: does it make a turn? A picture book you read together makes plenty. A puppet makes as many as you have patience for. A toy that plays a recorded sentence at the press of a button can’t answer back, however many words the sentence has."),
    { kind: "callout", icon: "book-open", lead: "Try this:", text: "when you read together, pause once or twice and ask what your child thinks will happen next." },
  ]),
  part("Taking turns: games with a “your go, my go” rhythm", [
    p("Look for games where your child has to wait, watch and then go: simple board games with two rules, picture matching, rolling a ball back and forth. Play them together and say the turns out loud: “My go. Now yours.”"),
  ]),
  part("Pretend play: props that leave the story to your child", [
    p("A cardboard kitchen, a doctor set, a box of mismatched figures. Open props let your child decide who is cooking and what is wrong with teddy. A toy kitchen that plays its own sounds and names its own characters decides some of that for them."),
  ]),
  {
    kind: "figure",
    variant: "wide",
    image: { src: floorTrain, alt: "A boy in a green T-shirt lying on a red floor, smiling as he pushes a blue wooden train." },
  },
  part("Hands: plain things do the job", [p("Threading beads, stacking cups, dough, chunky crayons, tongs and a bowl of pom-poms. None of them needs a battery or a screen.")]),
  part("Numbers: count real things together", [
    p("Count spoons at dinner, steps to the door, autos at the signal. Ask, “Which pile has more?” Any toy with parts you can count will do."),
  ]),
  part(
    "Brain development toys for a {nowrap:3-year-old}: what the label means",
    [
      p("The words “brain development” on a box prove nothing on their own. What matters is whether a toy gets your child trying, asking and explaining, and whether you talk together while they play."),
      p("Harvard’s centre describes the same back-and-forth from infancy: exchanges between a young child and a caring adult that help build and strengthen the connections in the child’s brain.[^1] So for a younger child the rule is the same: fewer toys that perform, more time playing and talking together."),
    ],
    { id: "brain-development" },
  ),
  part("What about screens?", [
    p("For three and four year olds, the World Health Organization and the Indian Academy of Pediatrics both say no more than an hour of screen time a day, and less is better.[^5][^6]"),
    p("The American Academy of Pediatrics asks parents to watch with their children, help them understand what they are seeing, and switch screens off an hour before bedtime.[^7]"),
    p("When your child does watch, sit with them and talk about it."),
  ]),
  part("A short rule for the toy shop", [
    {
      kind: "list",
      variant: "checks",
      items: [
        "Check the age on the box.",
        "Prefer toys that wait for your child over toys that perform at them.",
        "Prefer open ends over scripts.",
        "Prefer anything that makes a turn.",
      ],
    },
    p("[Kheelu](/products/kheelu) is built around that last rule: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play."),
    p("Choosing any AI toy? Our guide to [AI toys for kids in India](/ai-toys-for-kids-in-india) sets out what to check first."),
  ]),
];

/** The safe-AI-toy guide as the site prints it (D058; tasks 8b.1b, 8b.1d): read from the journal registry, never from a
 *  guide's module by path, so the story follows the site (the module now; the dashboard's post after task 8b.2e). */
function siteArticle(slug: string): Article & { readonly answer: Answer } {
  const article = getArticle(slug);
  if (!article?.answer) throw new Error(`ArticleBody stories: the journal has no "${slug}" with an answer`);
  return { ...article, answer: article.answer };
}
const SAFE_AI_TOY_NOW = siteArticle("what-to-look-for-in-a-safe-ai-toy");

/** story-what-to-look-for-in-a-safe-ai-toy.html, folds 3-5 (fold 5 breaks out of the column from 1200 px), as the site
 *  prints it: the guide's body in the live team's code-checked words (D058). ArticleBody.test.tsx holds it to the frozen
 *  mockup's column with the guide's claim fixes applied (deviations.md V37), as approved-articles.test.tsx does. */
export const SAFE_AI_TOY_BODY: Body = SAFE_AI_TOY_NOW.body;

/** story-talking-toys-and-late-talkers.html, folds 3-7. */
export const LATE_TALKERS_BODY: Body = [
  part(undefined, [
    p("Few silences are louder than a 3-year-old who says less than the cousins. The family group chat fills with advice, most of it confident and some of it wrong."),
    p("Here is what public guidance says, and what you can do at home today."),
  ]),
  part("When should you ask a professional?", [
    p("As a general guide, talk to your child’s doctor if:"),
    {
      kind: "list",
      items: [
        "at 3, other people still can’t understand your child most of the time;[^1]",
        "at 3, your child doesn’t yet keep up a short conversation with you, of at least two back-and-forth exchanges;[^1]",
        "by 4, people can’t yet understand most of what your child says;[^2]",
        "at any age, your child loses words or skills they used to have.[^1]",
      ],
    },
    p("These are US guides, and every child is different. Missing one is a reason to ask, not a diagnosis."),
    p("The US Centers for Disease Control and Prevention suggest you talk with your child’s doctor, share your concerns and ask about developmental screening.[^1] ASHA, the US association of speech and hearing professionals, suggests an assessment by an audiologist or a speech-language pathologist if a child misses many of the milestones for their age.[^2]"),
    { kind: "p", variant: "gut", text: "If your gut says ask, ask." },
  ]),
  part("What does the research say helps?", [
    p("Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^3]"),
    p("In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link.[^4] The children were typically developing, not late talkers, and the study shows a link, not cause and effect.[^4]"),
    p("Its authors suggest encouraging parents to talk with their children in “more interactive, back-and-forth conversation”.[^4] A turn can be tiny: your child points, you name the thing, they try the word, you smile and add one more."),
  ]),
  part("What helps at home, every day", [
    {
      kind: "list",
      variant: "tips",
      items: [
        { icon: "chat-circle-dots", text: "Talk about what you’re doing, in short sentences: “The dal is boiling. Now the cooker. One whistle, two.”" },
        { icon: "clock", text: "After you ask something, wait longer than feels natural. Count to five in your head." },
        { icon: "question", text: "Offer choices out loud: “The red cup or the blue cup?” A choice asks for a word." },
        { icon: "plus", text: "Answer every try as if it were a full sentence, then add one word: “Ball? Yes, a big ball.”" },
        { icon: "book-open", text: "Read the same book again, and pause before a word your child knows so they can say it." },
        { icon: "music-notes", text: "Sing together, and leave gaps for your child to fill." },
        { icon: "eye-slash", text: "Turn off the TV in the background while you play and talk." },
      ],
    },
    p("None of this needs a programme or a purchase. It needs turns, and anyone who loves your child can give them: parents, grandparents, cousins, the auntie next door."),
  ]),
  part("Two myths worth dropping", [
    { kind: "h3", text: "Myth 1: a second home language causes speech delay." },
    p("Asked whether using more than one language can cause a speech or language disorder, the American Academy of Pediatrics and the American Speech-Language-Hearing Association answer no: “Speech or language problems are not caused by learning multiple languages.”[^5] A bilingual child may split their words across two languages. Counted together, the total should be about the same as for a child of the same age learning one language.[^5] And a strong model in any language helps build a foundation for learning others.[^6] Keep both languages."),
    { kind: "h3", text: "Myth 2: a talking toy will teach your child to talk." },
    p("A toy that plays recorded phrases or repeats your child’s words gives them nothing new to answer. No toy replaces the people who talk with your child every day."),
  ]),
];

/** The marker word the article templates pass (story-*.html: aria-label "Source 1"). */
export const SOURCE_LABEL = "Source";

/** The play word a video's button reads before its title (journal-pipeline §7: "Play video: <title>"); story and test
 *  data only: the article template passes the content's (task 8b.2c). */
export const VIDEO_LABEL = "Play video:";

/** story-learning-toys-for-a-three-year-old.html fold 2: the answer, then two paragraphs of detail. */
export const LEARNING_TOYS_ANSWER: Answer = {
  question: "What are the best learning toys for a {nowrap:3-year-old}?",
  answer:
    "Toys that get your child building, pretending and talking: blocks, simple puzzles, pretend-play sets, crayons and dough, and picture books you read together. Research links back-and-forth talk between a young child and a caring adult to early language and brain development,[^1] so the best toys are often the ones you play with together, out loud.",
  detail: [
    { kind: "p", text: "The word “educational” on a box says little about the toy inside. A shape sorter is educational. So is a tablet full of phonics videos. They are not the same purchase." },
    { kind: "p", text: "A better question: what is my {nowrap:3-year-old} working on right now, and does this toy help or get in the way? Here is that list, skill by skill." },
  ],
};

/** story-what-to-look-for-in-a-safe-ai-toy.html fold 2. */
export const SAFE_AI_TOY_ANSWER: Answer = {
  question: "What should you look for in a safe AI toy?",
  answer:
    "Look for mechanisms you can check, not promises. Ask when the microphone is on, whether the toy can reach the open internet, where your child’s voice goes and who keeps it, whether you can read and delete every conversation, and how replies are filtered for your child’s age. Then weigh what child-safety groups say.",
};

/** story-talking-toys-and-late-talkers.html fold 2: the answer, then the D025 line. */
export const LATE_TALKERS_ANSWER: Answer = {
  question: "What helps a late talker?",
  answer:
    "Talk with your child, wait, and follow their lead. Name what they look at, add one word to what they say, and give them time to answer before you fill the silence. If your child is 3 or older and other people still can’t understand them most of the time, talk to your paediatrician.[^1]",
  detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
};

/** The heading the article notes and the guide's note open with. */
export const SOURCES_LABEL = "Sources";

export const LEARNING_TOYS_SOURCES: readonly Source[] = [
  {
    citation:
      "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
    href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
  },
  {
    citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 4, para 4.1, p. 11.",
    href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
  },
  {
    citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 1, para 1.2, p. 7.",
    href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
  },
  {
    citation:
      "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract and Results.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
  },
  {
    citation:
      "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
    href: "https://iris.who.int/handle/10665/311664",
  },
  {
    citation: "Indian Academy of Pediatrics, “Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents”, Indian Pediatrics, 2022, p. 239.",
    href: "https://www.indianpediatrics.net/mar2022/235.pdf",
  },
  {
    citation: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
    href: "https://doi.org/10.1542/peds.2016-2591",
  },
];

export const SAFE_AI_TOY_SOURCES: readonly Source[] = [
  { citation: "Fairplay, “AI Toys are NOT Safe for Kids” (advisory), 2025, opening paragraph.", href: "https://fairplayforkids.org/pf/aitoyadvisory/" },
  {
    citation:
      "Common Sense Media, “Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks” (press release), 22 January 2026, paragraph 1 and the list of findings.",
    href: "https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks",
  },
  {
    citation: "Common Sense Media Youth AI Safety Institute, “AI Toys” (risk assessment), 2026, “What we found” and “Where they fall short”.",
    href: "https://institute.commonsensemedia.org/risk-assessments/ai-toys",
  },
];

export const LATE_TALKERS_SOURCES: readonly Source[] = [
  {
    citation: "US Centers for Disease Control and Prevention, “Learn the Signs. Act Early.”: milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and “act early”.",
    href: "https://www.cdc.gov/act-early/milestones/3-years.html",
  },
  {
    citation: "American Speech-Language-Hearing Association, “Communication Milestones: 3 to 4 Years” and “Communication Milestones: 2 to 3 Years”, undated pages.",
    href: "https://www.asha.org/public/developmental-milestones/communication-milestones-3-to-4-years/",
  },
  {
    citation:
      "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
    href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
  },
  {
    citation:
      "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract, Method and Discussion.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
  },
  {
    citation:
      "American Academy of Pediatrics and American Speech-Language-Hearing Association, “Young Children Learning Multiple Languages: Parent FAQs”, HealthyChildren.org, 2025 (updated 20 November).",
    href: "https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx",
  },
  {
    citation: "American Speech-Language-Hearing Association, “Late Language Emergence” (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations.",
    href: "https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/",
  },
];


/** The answer first and the sources last, as the article template (4.2) passes them. */
function column(answer: Answer, sources: readonly Source[]) {
  return {
    before: <AnswerSection {...answer} variant="article" sourceLabel={SOURCE_LABEL} />,
    after: <SourcesSection variant="article" label={SOURCES_LABEL} sources={sources} />,
  };
}

const meta = {
  title: "Sections/ArticleBody",
  component: ArticleBody,
  excludeStories: /^[A-Z0-9_]+$/,
  args: { blocks: LEARNING_TOYS_BODY, sourceLabel: SOURCE_LABEL, ...column(LEARNING_TOYS_ANSWER, LEARNING_TOYS_SOURCES) },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ArticleBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Learning toys, the whole column: the answer, parts, a "Try this" callout, a wide photo between parts, the checks list and in-text links. */
export const LearningToys: Story = {};

/** Safe AI toy, as the site prints it: the six questions, and the facts list with the belly unit, breaking out of the
 *  column from 1200 px. */
export const SafeAiToy: Story = { args: { blocks: SAFE_AI_TOY_BODY, ...column(SAFE_AI_TOY_NOW.answer, SAFE_AI_TOY_NOW.sources) } };

/** Late talkers: an untitled opening part, a bulleted list with markers, the plain "gut" line, the tips card, myths. */
export const LateTalkers: Story = { args: { blocks: LATE_TALKERS_BODY, ...column(LATE_TALKERS_ANSWER, LATE_TALKERS_SOURCES) } };

/** The other block types the content model allows: numbered steps, a quote, a blue callout and a captioned photo. */
export const OtherBlocks: Story = {
  args: {
    before: undefined,
    after: undefined,
    blocks: [
      part("Other blocks", [
        { kind: "list", variant: "steps", items: ["Charge Kheelu.", "Open the parent app."] },
        { kind: "quote", quote: "The hard part of AI for children is not the model. It is the trust.", cite: "Apoorva Sahu" },
        { kind: "callout", icon: "info", tone: "blue", lead: "Note:", text: "a callout in Kheelu Blue." },
        { kind: "figure", variant: "square", image: { src: bellyModule, alt: "Kheelu’s tummy unit up close." }, caption: "The tummy unit." },
        { kind: "p", lead: "Lead:", text: "a paragraph that opens with a bold label." },
        { kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment." },
      ]),
    ],
  },
};

/** A journal post's video (task 8b.2c; journal-pipeline §5.1, §7) between paragraphs: YouTube's still in the DS frame at
 *  16:9 with the play button, then its caption; Vimeo's frame with the button alone (it has no still). Nothing loads
 *  from either host until a press. The ids are the providers' own player-documentation samples (story data only); in
 *  Storybook the still loads straight from i.ytimg.com, where the site serves it through its own image optimiser. */
export const Video: Story = {
  args: {
    before: undefined,
    after: undefined,
    videoLabel: VIDEO_LABEL,
    blocks: [
      part("Videos", [
        p("A paragraph before the video."),
        { kind: "video", provider: "youtube", videoId: "M7lc1UVf-VE", title: "A sample from YouTube’s player documentation", caption: "A caption under the video." },
        p("A paragraph between the two."),
        { kind: "video", provider: "vimeo", videoId: "76979871", title: "A sample from Vimeo’s player documentation" },
      ]),
    ],
  },
};
