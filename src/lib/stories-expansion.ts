import type { Story } from "./stories";

/** Journal expansion (2026-07-06): 10 articles from live keyword research
 *  (Google autocomplete, India locale; question-form clusters). Useful-first,
 *  scene-first, voice-linted. Product mentions stay soft or absent. */

export const EXPANSION: Story[] = [
  {
    slug: "how-much-screen-time-for-a-3-to-6-year-old",
    title: "How much screen time is okay for a young child?",
    description:
      "What the WHO and AAP actually recommend, why the number is not the whole story, and what to do at 6pm when the guideline meets real life.",
    theme: "Screen-free living",
    minutes: 5,
    pose: "curious",
    tint: "bg-blue/15",
    hero: "/stories/how-much-screen-time-for-a-3-to-6-year-old.jpg",
    heroAlt:
      "A mother and her young child laughing over wooden blocks in the evening while the TV stays dark",
    paragraphs: [
      { p: "Every parent has googled this at some point, usually at 9pm, usually after a day when the tablet did more babysitting than planned. So here is the straight answer first." },
      { p: "The World Health Organization recommends no more than one hour of sedentary screen time a day for children aged 3 to 4, and says less is better. The American Academy of Pediatrics lands in a similar place for ages 2 to 5: about an hour a day of high-quality content, watched together when you can." },
      { h: "The number is the small half of the advice", p: "Read those guidelines closely and you notice something. Both spend less ink on the hour and more on what the hour replaces. The real worry is not the screen. It is the sleep, the play, the running, and above all the talking that the screen quietly eats." },
      { p: "An hour of cartoons in a day full of conversation is a different thing from an hour of cartoons in a day of silence. The guideline is a fence. The field inside it is language." },
      { h: "What to do at 6pm", p: "Knowing the number does not cook dinner. A few things that work in real houses: pick the screen window in advance and let your child know when it ends. Put something after it that they like, so the end is a beginning. And when you can, sit with them for a few minutes of it. A cartoon you talk about together is closer to a conversation than to a screen." },
      { p: "If the evening still collapses without a screen, you do not need more discipline. You need a better alternative. Something that answers back." },
      { p: "That is the gap we are building Lumi for: a screen-free friend that talks, in the languages you speak at home. But screen or no screen, the hour is yours to place. The talking is the part that cannot be skipped." },
    ],
  },
  {
    slug: "screen-time-and-tantrums",
    title: "Screen time and tantrums: what is actually happening",
    description:
      "Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive.",
    theme: "Screen-free living",
    minutes: 5,
    pose: "grumpy",
    tint: "bg-orange/15",
    hero: "/stories/screen-time-and-tantrums.jpg",
    heroAlt:
      "A small child crying on the living room rug while his mother kneels beside him, calm and open-armed",
    paragraphs: [
      { p: "The video ends. You say that is enough for today. And a child who was silent for forty minutes becomes a small weather system on your living room floor." },
      { p: "If this is your house some evenings, it is most houses some evenings. The tantrum after the screen is so common it has its own research literature. Knowing the mechanics helps." },
      { h: "Why the meltdown comes at the off switch", p: "Fast, bright, always-rewarding video sets a pace no living room can match. When it stops, everything real feels slow and dim by comparison, and a three year old does not have the brakes to manage that drop. The tantrum is not defiance. It is a small brain being asked to change gears at highway speed." },
      { p: "This is also why the second video is easier to grant than the first was. Each yes resets the peak, and the fall gets steeper." },
      { h: "Making the off switch boring", p: "The trick that works is not a firmer no. It is a softer landing. End the screen at a natural break, not mid-episode. Announce the landing before takeoff: one episode, then we water the plants together. And give the hands somewhere to go the moment the screen goes dark, because empty hands go looking for the remote." },
      { p: "Notice the pattern in all three: the exit needs somewhere to arrive. Children leave screens easily for things that want them back." },
      { p: "A voice that listens is one of those things. It does not flash or score points. It just answers, and asks, and waits. Calm holds attention longer than parents expect, and it hands attention back gently. That idea is the reason our little talking friend exists, but it works with a grandparent on the phone too." },
    ],
  },
  {
    slug: "the-gentle-way-off-the-phone",
    title: "The gentle way off the phone: a seven-day plan",
    description:
      "A realistic week-long plan to reduce a young child's screen time without turning your home into a battlefield.",
    theme: "Screen-free living",
    minutes: 6,
    pose: "bliss",
    tint: "bg-yellow/15",
    hero: "/stories/the-gentle-way-off-the-phone.jpg",
    heroAlt:
      "A parent's hand placing a phone into a wooden drawer while a child builds a block tower in the background",
    paragraphs: [
      { p: "Nobody plans for their four year old to know exactly where the YouTube app lives. It happens one busy evening at a time, and then one day the phone is the first thing they ask for and the last thing they give up." },
      { p: "Going cold turkey usually fails, because the phone was solving real problems: your meeting, their boredom, the queue at the clinic. Take it away without replacing what it did and the house pays. So here is a week that replaces before it removes." },
      { h: "Days one and two: just watch", p: "Change nothing yet. Notice when the phone appears. Morning rush? The cooking hour? The car? Each slot is a problem the phone got hired to solve. Write them down. You will usually find two or three, not ten." },
      { h: "Days three and four: replace the easiest slot", p: "Pick the slot where the stakes are lowest and put something in it that talks or moves: audio stories in your language, a cousin on a voice call, a puzzle you started together at breakfast so it is waiting for them. Keep the hard slots untouched. One win matters more than three fights." },
      { h: "Days five and six: shrink, do not snatch", p: "In the remaining slots, end the screen at natural breaks and land it somewhere: a job, a snack, a who-can-spot-a-crow contest at the window. The plan from our tantrums article applies here on repeat." },
      { h: "Day seven: make the new normal visible", p: "Tell your child what changed, in their language: mornings are for songs now, the car is for spotting autos. Children accept rules they can predict far better than moods they cannot." },
      { p: "Expect a wobbly week two, and expect it to pass. What stays is the discovery underneath: most of what the phone was providing was a voice paying attention. Provide that, from anyone or anything that genuinely listens, and the phone loses its main job." },
    ],
  },
  {
    slug: "how-to-get-your-child-talking",
    title: "How to get your child talking",
    description:
      "Better questions than 'how was school', and the small habits that turn one-word answers into real conversations.",
    theme: "Talking together",
    minutes: 5,
    pose: "joy",
    tint: "bg-blue/15",
    hero: "/stories/how-to-get-your-child-talking.jpg",
    heroAlt:
      "A child standing at the family dinner table, arms wide mid-story, while his parents lean in laughing",
    paragraphs: [
      { p: "How was school? Fine. What did you do? Nothing. Two questions in, the conversation is over, and the child who narrated every ant on the footpath at age three has become a vault at five." },
      { p: "The vault is rarely about you. Broad questions are genuinely hard to answer. A whole day is too big to summarize, so children reach for the smallest true word they have. Fine." },
      { h: "Ask smaller, get bigger", p: "Swap the summary question for a specific one. Who made someone laugh today? What was the worst thing on your plate at lunch? If your classroom had a door to anywhere, where did it go today? Specific questions are easier to enter and more fun to answer, and one good answer usually brings friends." },
      { p: "Two more habits do quiet magic. Answer the question yourself first: the worst thing on my plate was the office canteen dal, and here is why. Children join conversations more easily than they start them. And leave gaps. A count of five feels like an hour, but the gap is where children decide to fill." },
      { h: "The follow-up is the whole game", p: "Whatever comes back, chase it one step. Not with a quiz, with curiosity. He fell off the bench? What did the teacher do? Then what did you do? The follow-up tells your child that their answer went somewhere, and answers that go somewhere get longer." },
      { p: "This serve and return pattern is the same mechanism researchers keep finding at the center of language growth. We wrote about the science of it in another piece. The kitchen version is simpler: ask small, answer first, wait long, follow up." },
      { p: "And on the evenings you cannot be the asker, any patient voice helps keep the muscle warm. That is the job we gave Lumi: ask, listen, ask again. The dinner table stays yours." },
    ],
  },
  {
    slug: "talking-late-or-talking-little",
    title: "Talking late, or talking little?",
    description:
      "A calm guide for parents of quiet 3 and 4 year olds: what varies normally, what deserves a professional look, and what helps at home either way.",
    theme: "Talking together",
    minutes: 5,
    pose: "sad",
    tint: "bg-orange/15",
    paragraphs: [
      { p: "Somewhere at every birthday party there is a parent doing quiet math: that child is narrating a whole movie, mine points and says come. Is this fine? Is this something?" },
      { p: "First, the honest frame. Children spread themselves across a wide normal range, late talkers often catch up completely, and quiet is a temperament as well as a milestone. Also true: some children need help, earlier help works better, and a parent's gut feeling is real information." },
      { h: "When to ask a professional", p: "This article is not a diagnosis, and no article is. As a general guide, talk to your pediatrician or a speech-language professional if your child says very few words by two and a half, is hard for family to understand at three, loses words they used to have at any age, or seems not to understand simple things you say. If your gut says ask, ask. The worst case of asking early is reassurance." },
      { h: "What helps at home, either way", p: "Whether your child is a late bloomer or just an economist with words, the home game is the same. Narrate your day out loud while you do it: the dal is boiling, now the pressure cooker, one whistle, two. Give choices instead of yes-no questions, because red cup or yellow cup demands a word. Read the same book the tenth time without sighing, since repetition is how words set." },
      { p: "Above all, respond to every attempt as if it were a sentence. A point, a sound, a half-word: answer it fully. Children speak more where speaking works." },
      { p: "One caution from us, and it applies to our own product too: no toy replaces a professional when one is needed, and no toy replaces you. Talking toys, songs, and story audio can add more chances to hear and answer language at home. Think of them as extra rounds of practice, never as the coach." },
    ],
  },
  {
    slug: "what-actually-builds-a-sharp-brain",
    title: "What actually builds a sharp brain in the early years",
    description:
      "Past the flashcards and brain-training claims: the four everyday things research keeps pointing at, and how to get more of them.",
    theme: "How children grow",
    minutes: 5,
    pose: "curious",
    tint: "bg-blue/15",
    paragraphs: [
      { p: "Type how to make my child's brain sharp into any search box and an industry answers: apps, flashcards, tonics, courses for three year olds. The volume of it can make an ordinary home feel like not enough." },
      { p: "Here is the comforting, slightly boring truth. The things that build a young brain are old things. Research keeps circling the same four." },
      /* The "aged 3 to 6" below is SOURCED sleep guidance, not our audience
         range. Age passes moved product-facing copy (now 2 to 5 / 2 to 14), but a cited
         age band keeps its real numbers (never-invent-claims). */
      { h: "Conversation, sleep, play, and calm", p: "Conversation, especially the back and forth kind, builds language and thinking at once; researchers count conversational turns, not vocabulary drills. Sleep is when the day's learning gets filed, and children aged 3 to 6 need ten to thirteen hours of it. Play, the unstructured kind where the sofa becomes a ship, is where planning, memory, and self-control get their reps. And a calm, warm home is not a luxury: chronic stress is one of the few things reliably shown to work against a growing brain." },
      { p: "Notice what is not on the list. There is no app on it. Educational toys and brain development toys can help, but only the ones that produce more of the four: a toy that starts a conversation earns its place, a toy that performs at your child does not." },
      { h: "The dinner-table test", p: "A useful filter for anything sold as brain-building: after ten minutes with it, does your child have something to say? Blocks pass the test. A good story passes. A cartoon marathon mostly fails. Judge our talking toy with the same test, and judge everything else with it too." },
      { p: "The families doing this best are not buying more. They are talking more, sleeping on time, leaving room for nonsense games, and keeping the volume of the house low. Sharp grows in that soil." },
    ],
  },
  {
    slug: "how-children-collect-words",
    title: "How children collect words",
    description:
      "Vocabulary is not memorized, it is collected. How children pick up words at home, in any language, without a single worksheet.",
    theme: "Talking together",
    minutes: 4,
    pose: "silly",
    tint: "bg-yellow/15",
    paragraphs: [
      { p: "Nobody taught your child the word auto. Or gravy, or cousin, or the slightly alarming place they learned whatever they said last Tuesday. Words arrive like sand in beach clothes: constantly, invisibly, from everywhere." },
      { p: "Between three and six the collection explodes. Many children add words at a pace that works out to several a day, every day, for years. The question is not how to make a child memorize words. It is how to stand in the sandstorm." },
      { h: "Words stick to feelings and use", p: "Two rules govern which words stay. Words heard in moments that matter stick better than words from lists: paltan learned at a wedding beats any flashcard. And words a child gets to use survive, while words only heard fade. A new word needs a job within a day or two of arriving." },
      { p: "So the home program is simple. Use your good words out loud instead of simplifying everything down. When a big word lands, hand it back in a question: it was chaotic? What was the most chaotic part? And let your child overhear real adult conversation, which has always been the original vocabulary app." },
      { h: "Any language counts", p: "One more thing, because parents in India carry a special worry here: words collected in Telugu or Bangla or Marathi count fully. The brain does not file languages in separate purses that empty each other. A child rich in home-language words has a head start on words in every language after." },
      { p: "Keep the house full of talk worth stealing from. The collection builds itself." },
    ],
  },
  {
    slug: "raising-a-bilingual-child-in-india",
    title: "Raising a bilingual child in India",
    description:
      "English will come. The mother tongue is the one at risk. Why home languages matter for thinking, and how families keep them alive.",
    theme: "Languages at home",
    minutes: 5,
    pose: "joy",
    tint: "bg-blue/15",
    paragraphs: [
      { p: "There is a moment many Indian parents know: your child answers your Kannada in English, and something in you notes it, half proud, half strangely sad." },
      { p: "The pride makes sense. English opens doors here, and every parent knows which exams and interviews wait down the road. But the quiet math many families do, that home language time is time stolen from English, has the research exactly backwards." },
      { h: "The mother tongue is the foundation, not the competitor", p: "Concepts learned in the mother tongue transfer. A child who understands big and small, before and after, why and because in Tamil does not relearn those ideas in English. They relabel them, which is far faster. Strong first languages consistently travel with stronger later languages, not weaker ones." },
      { p: "And in most Indian homes, English has school, screens, and half the world working for it already. It does not need your kitchen too. The language that needs your kitchen is the one only your family can pass on." },
      { h: "What keeps a home language alive", p: "Children keep languages that are useful and loved, and drop languages that are neither. So give the language living jobs: the funny relatives, the food words, the songs, the one grandparent whose stories only exist in it. Speak it without apology, and when your child answers in English, answer back warmly in your language without making it a correction. The war is lost in the moment the language becomes homework." },
      { p: "We are building for exactly these houses. Lumi speaks ten languages so the friend can meet your family where it lives, not drag it toward English. But with or without any toy, the principle holds: the mother tongue is not in the way of your child's future. It is under it." },
    ],
  },
  {
    slug: "should-kids-use-ai",
    title: "Should kids use AI? An honest answer from people who build it",
    description:
      "We build AI for children, and we would not hand a chatbot to a four year old. Where the line is and how to judge anything with AI inside.",
    theme: "AI and childhood",
    minutes: 6,
    pose: "grumpy",
    tint: "bg-orange/15",
    paragraphs: [
      { p: "We should be the last people to ask, or the first: we build AI for children. And our honest answer is one most AI companies will not give you. No, your child should not use AI. Not the AI most people mean by the word." },
      { p: "The chatbots and apps in the news were built for adults. They will talk about anything, they are wrong with total confidence, they are engineered to keep a user engaged, and they will happily fill the hours a childhood is supposed to spend elsewhere. Handing one to a four year old is handing over the open internet with a friendlier face." },
      { h: "The question hiding inside the question", p: "But notice what we are actually afraid of: unlimited content, no adult in the loop, engagement without end, and a machine that talks at a child rather than with them. Those are design choices. Which means they can be designed out." },
      { p: "A tool with AI inside can be built the opposite way: a closed world instead of an open internet, answers filtered for the age of the listener, a parent who can read every word, and no feed, no points, no reason to stay one minute past the fun. At that point the question stops being should kids use AI and becomes the same question you ask about any toy: what does it actually do to the hours it fills?" },
      { h: "The checklist, whoever is selling", p: "So judge anything with AI inside, ours included, on five things: Can it reach the open internet? Is every response filtered for your child's age? Can you read the full history? Does it profit from more minutes? And does it talk with your child, questions and turns, or perform at them? Four good answers is a tool. Fewer is a slot machine with a cartoon on it." },
      { p: "AI near children is not a yes or no. It is a who-built-this and why. Ask that question loudly and often, and make every company answer it in plain words. Here are ours, on our Safety page." },
    ],
  },
  {
    slug: "busy-hands-no-screens",
    title: "Busy hands, no screens",
    description:
      "Screen-free ways to keep a young child genuinely busy at home, including on the days you have to work.",
    theme: "Screen-free living",
    minutes: 5,
    pose: "silly",
    tint: "bg-yellow/15",
    paragraphs: [
      { p: "It is 4pm, your call starts in ten minutes, and a small person is orbiting your desk asking what they can do. The tablet would solve this in four seconds. That is exactly why it feels like cheating." },
      { p: "The screen-free answer is not one magic activity. It is understanding what the screen was providing: a task with no setup, no adult, and no way to fail. Anything with those three properties can compete." },
      { h: "The ten-second setups", p: "Keep a shelf of things that start instantly and end wherever: a bucket of water and a paintbrush to paint the balcony floor, a dabba of rajma to sort by wrinkles, old newspaper to tear into the world's largest salad, a blanket over two chairs that is a house until dinner. The humbler the material, the longer it lasts. Expensive toys have one script. A cardboard box has forty." },
      { h: "Jobs beat games", p: "The secret weapon of small children is that they do not yet know work is work. Being asked to match all the socks, wash the potatoes, or guard the dough while it rises is not a chore to a four year old. It is a promotion. Real jobs hold attention longer than invented games because children can smell the difference." },
      { p: "And for the stretches where you truly cannot be interrupted, line up company that talks: story audio in your language, a grandparent on speaker, a voice that asks questions back. Busy hands last longest when there is a voice keeping the mind company too. Building that voice is our whole project, but the shelf and the socks need no technology at all." },
      { p: "The house does not need to become a preschool. It needs six reliable boredom exits. Build the shelf once, and 4pm gets easier for a year." },
    ],
  },
];
