import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import floorTrain from "@ds/assets/Photo library/advik-04-floor-train-web.webp";
import type { ArticlePart, FigureBlock, ProseBlock } from "@/content/types";
import { ArticleBody } from "./ArticleBody";

/* ArticleBody (task 3.4): the reading column of the three approved article mockups (story-*.html). The bodies below
 * are the approved copy, ported verbatim into the content model's blocks (src/content/types.ts) as task 5.6 will port
 * them into the article modules; they are story and test data only (exported in capitals, which Storybook leaves out
 * of the story list). The answer and the sources are their own sections (AnswerSection, SourcesSection), passed in. */

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

const fact = (icon: string, title: string, body: string) => ({ icon, title, body });

/** story-what-to-look-for-in-a-safe-ai-toy.html, folds 3-5 (fold 5 breaks out of the column from 1200 px). */
export const SAFE_AI_TOY_BODY: Body = [
  part("What do child-safety groups say about AI toys?", [
    p("In November 2025 Fairplay, a children’s advocacy group, published an advisory signed by more than 150 experts and organisations telling parents not to buy AI toys that season.[^1]"),
    p("In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as “smart toys with voice-based interactions”, to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.[^2] When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.[^3]"),
    p("Common Sense Media also says children aged 5 and under “cannot reliably distinguish AI from real people”.[^3]"),
    p("Before any AI toy comes home, ask what it does with your child’s voice, what you can see as a parent, and how it handles a hard question."),
  ]),
  part("What to look for, warning by warning", [
    p("Most of these worries are about how a toy is built, so check the build. Put each question below to the maker and expect a plain answer."),
    {
      kind: "questions",
      items: [
        {
          question: "When is the microphone on?",
          answer: [
            "Look for a toy that listens only after you or your child start it, and that shows you when it is listening. Ask whether it has a camera at all. Common Sense Media found that AI toys “collect extensive data in children’s private spaces”.[^2]",
          ],
        },
        {
          question: "Can it reach the open internet?",
          answer: [
            "Ask where its answers come from. A toy that can browse or search can stumble onto things your child should not hear, and a filter on top then has to catch everything. Look for a toy that cannot browse the internet at all.",
          ],
        },
        {
          question: "Can you read and delete every conversation?",
          answer: [
            "You would not leave your child with a babysitter who won’t tell you how the afternoon went. Ask whether you can read every conversation, word for word, and delete any of it yourself, without emailing anyone. A summary is not the conversation.",
          ],
        },
        {
          question: "Where does your child’s voice go, and who keeps it?",
          answer: [
            "Ask who processes your child’s voice and in which country, whether any of it is kept and for how long, and whether it is ever sold or used to advertise to your child. A vague answer is an answer. For what India’s data law asks of companies, read [What India’s data law asks of a toy that listens](/stories#ai-and-safety).",
          ],
        },
        {
          question: "Is it built for your child’s age?",
          answer: [
            "Ask how replies are filtered for the age of the child playing, and who sets that age. Ask, too, what the toy does when it doesn’t know something. The answer you want: it says so.",
          ],
        },
        {
          question: "Does it pretend to be more than a toy?",
          answer: [
            "Common Sense Media says AI toy companions “create emotional attachment by design”.[^2] Look for a toy that tells your child it is a toy, and never asks your child to keep a secret from you.",
          ],
        },
      ],
    },
    p("To compare toys side by side, use the shorter checklist in our guide to [AI toys for kids in India](/ai-toys-for-kids-in-india)."),
  ]),
  part(
    "How is Kheelu built against each worry?",
    [
      p("Kheelu is made for children aged 3 to 7. Common Sense Media’s advice covers that whole range: avoid AI toys at 5 and under, and use extreme caution at 6 and 7. You should hear that from us. Here is how we built [Kheelu](/products/kheelu) on each point above, so you can check it yourself and decide."),
      {
        kind: "facts",
        items: [
          fact("microphone", "The microphone.", "It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it’s listening. It switches itself off after about a minute of quiet. Kheelu has no camera."),
          fact("lock-simple", "Your child’s voice.", "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so."),
          fact("eye", "Every conversation.", "You can read every conversation in the parent app. Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically. You can delete any of them sooner, in one tap."),
          fact("hand-heart", "Your data.", "We don’t sell your data. Your child’s data is never used to advertise to them."),
          fact("wifi-slash", "No open internet.", "Kheelu can’t browse the internet. Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app."),
          fact("question", "When it doesn’t know.", "It says so, instead of guessing."),
          fact("smiley", "A toy, and it says so.", "It tells your child it’s a toy, and never asks them to keep a secret from you."),
          fact("magnifying-glass", "Tested by us first.", "We attack our own safety layer before every release."),
          fact("clock", "Certification.", "Kheelu’s toy-safety (BIS) licence has been applied for and is not yet granted. No badge appears before it is earned."),
        ],
        figure: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
      },
      p("If your child is 3, keep a grown-up nearby while they play."),
      p("Whether that is enough is your call. The detail is on our [Safety page](/safety), and you can ask us anything: [WhatsApp](https://wa.me/919187546483) or {nowrap:[call +91 91875 46483](tel:+919187546483)}."),
    ],
    { variant: "breakout" },
  ),
];

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

const meta = {
  title: "Sections/ArticleBody",
  component: ArticleBody,
  excludeStories: /^[A-Z0-9_]+$/,
  args: { blocks: LEARNING_TOYS_BODY, sourceLabel: SOURCE_LABEL },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ArticleBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Learning toys: parts, a "Try this" callout, a wide photo between parts, the checks list and in-text links. */
export const LearningToys: Story = {};

/** Safe AI toy: the six questions, and the facts list with the belly unit, breaking out of the column from 1200 px. */
export const SafeAiToy: Story = { args: { blocks: SAFE_AI_TOY_BODY } };

/** Late talkers: an untitled opening part, a bulleted list with markers, the plain "gut" line, the tips card, myths. */
export const LateTalkers: Story = { args: { blocks: LATE_TALKERS_BODY } };

/** The other block types the content model allows: numbered steps, a quote, a blue callout and a captioned photo. */
export const OtherBlocks: Story = {
  args: {
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
