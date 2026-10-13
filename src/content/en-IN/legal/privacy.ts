import type { LegalPage, RichTextString } from "@/content/types";
import { DEFAULT_OG } from "../organization";
import { GRIEVANCE_ACK_HOURS, GRIEVANCE_RESOLUTION, RETENTION_LINE, RETENTION_MONTHS } from "../policies";
import { seller } from "../seller";

/**
 * The privacy policy, `/privacy` (task 5.11; structure §5 row privacy.html): the approved mockup
 * `mockup/pages/privacy.html` (D046) word for word, in its order, as wiki/site/pages/privacy.md words it, rendered by
 * LegalTemplate's `reference` family. A draft for the founder's approval (D029): the template shows the draft note and
 * the production build refuses the page until `status` is "approved" with the real date.
 *
 * - **Every measuring tool in a block of its own, never a count** (privacy.md section 5): the live page had to retire a
 *   count of its tools four times. A tool that is added or removed on the site changes this list in the same commit
 *   (test/analytics-tags.test.ts reads the rendered page, block by block).
 * - **Kheelona's own model** (D035): what is used, by whom, why and where, that it is on by default, that a parent turns
 *   it off with a switch in the parent app and what happens to what was already used, in the founder's words (D055
 *   item 12).
 * - **The founder's page facts** (D055 items 7, 8 and 13-24, D054 item 12; task 6.7), each in the place of the
 *   placeholder it fills: "Last updated" is his date; what the parent app keeps; consent; what a one-tap delete does not
 *   reach; how long each thing is kept; the breach line; every recipient's region (D047, `vercel.json`, and each
 *   provider's own published documents, cited in privacy.md section 7). Off the page: the providers' names and any "on
 *   request" line, parent alerts (off in v1, B34), the security-practices detail, the paid orders' period, the other
 *   PostHog events and the complaint reference (the template's, legal/shared.ts).
 * - **Where orders are stored** is one value, below: the Sydney region D047 records, as the founder left the move
 *   question unanswered (D055 item 24); once he says the store is in Mumbai, the main session writes India there
 *   (ADR-009, architecture §15.6).
 * - **Shared facts are read, never retyped:** the entity, registered office, support number, WhatsApp address and email
 *   from seller.ts; the retention period and the complaint promise from policies.ts (D020, D032). The grievance and
 *   seller cards render from seller.ts through LegalTemplate; the close's help line is the template's (seller.help).
 * - The cookie names and lives are the code's (src/lib/campaign.ts, src/lib/click-id.ts,
 *   src/lib/store/thanks-session.ts), written here as the page's words and checked against the code by this module's
 *   test, so a renamed cookie fails until the sentence describing it is read again.
 */

/** Where Supabase stores orders: Australia (Sydney, D047) until the founder says the store has moved (D055 item 24,
 *  ADR-009). */
export const ORDER_DATA_LOCATION: RichTextString = "Australia";

const { phone, tel, whatsapp, email } = seller.support;
/** The support links as the approved page prints them, the number kept whole on one line (`mk-nowrap`). */
const PHONE = `{nowrap:[${phone}](${tel})}`;
const EMAIL = `[${email}](mailto:${email})`;
const WHATSAPP = `[WhatsApp](${whatsapp})`;

export const privacyPage = {
  slug: "privacy",
  meta: {
    title: "Kheelona privacy policy, in plain words",
    description: `How Kheelona handles your data and your child’s: what we collect, every tool we use, ${RETENTION_MONTHS} months for conversations, and how to opt out or delete.`,
    og: DEFAULT_OG,
  },
  status: "draft",
  /* "Last updated", the founder's date (D055 item 8). The page stays a draft until he signs it off (D029). */
  approvedOn: "2026-10-14",
  hero: {
    eyebrow: "Privacy policy",
    title: "Privacy, in {hand:plain words.}",
    lead: "What we collect on kheelona.com, in our store, through Kheelu and in its parent app; why; who else handles it; and what you can do about it.",
  },
  /* Fold 2: eight promises, Kheelu Blue icons (privacy.md, the icon hints). */
  summary: {
    kind: "trust",
    title: "The {hand:short version.}",
    items: [
      {
        icon: "shield-check",
        title: "We don’t sell your data.",
        body: "Your child’s data is never used to advertise to your child. Kheelu and the parent app show no ads.",
      },
      {
        icon: "microphone",
        title: "Kheelu only listens when someone presses its button.",
        body: "A light shows while it listens, and it switches itself off after about a minute of quiet.",
      },
      {
        icon: "lock-simple",
        title: "Outside providers only produce the reply.",
        body: "Trusted speech and AI providers, on servers in India, process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI.",
      },
      {
        icon: "sliders-horizontal",
        title: "Our own model learns, unless you turn it off.",
        body: "Kheelona’s own model learns from your child’s voice recordings and conversation transcripts. It’s on by default. You can turn it off with a switch in the parent app.",
      },
      {
        icon: "chat-circle-dots",
        title: "You can read and delete every conversation.",
        body: `Delete any of them in one tap. We delete transcripts automatically after ${RETENTION_MONTHS} months.`,
      },
      {
        icon: "chart-line-up",
        title: "This website measures visits.",
        body: "We use analytics and advertising tools, all [named below](#measuring). One of them, the Meta Pixel, follows visits to other sites. There is no cookie banner today.",
      },
      {
        icon: "currency-inr",
        title: "Card, UPI and bank details go to Razorpay.",
        body: "They never reach us.",
      },
      {
        icon: "envelope-simple",
        title: `We acknowledge every complaint within ${GRIEVANCE_ACK_HOURS} hours.`,
        body: `And we resolve it within ${GRIEVANCE_RESOLUTION}.`,
      },
    ],
  },
  parts: [
    /* Section 1 · Who we are. */
    {
      id: "who",
      title: "Who we are, and what this page covers.",
      contents: "Who we are",
      blocks: [
        {
          kind: "p",
          text: `${seller.legalName} (“Kheelona”, “we”) makes Kheelu and runs kheelona.com, our store at store.kheelona.com and the Kheelu parent app. This page explains how we handle personal data in all four places: what we collect, why, who else handles it, how long we keep it, and the choices and rights you have.`,
        },
        {
          kind: "p",
          text: `Our registered office is at ${seller.addressLine}. You can reach us on ${WHATSAPP} or by phone at ${PHONE}, or at ${EMAIL}.`,
        },
        {
          kind: "p",
          text: "Kheelu is made for children aged 3 to 7. This website, our store and the parent app are meant for parents and other adults, not for children.",
        },
      ],
    },
    /* Section 2 · Kheelu, the parent app and your child's voice: the answer-first block P1 (D018, D020, D036). */
    {
      id: "kheelu",
      title: "Kheelu, the parent app and your child’s voice.",
      answer: `We don’t sell your data. Trusted speech and AI providers, on servers in India, process your child’s voice only to produce Kheelu’s reply; they don’t keep it or train on it, and our contracts say so. Kheelona’s own model learns from conversations unless you turn this off. Conversations stay in your parent app for ${RETENTION_MONTHS} months, then they’re deleted automatically.`,
      blocks: [
        { kind: "h3", text: "When Kheelu listens." },
        {
          kind: "p",
          text: "Kheelu has no wake word, so it never listens for one. Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after about a minute of quiet. A light on Kheelu shows whenever it’s listening. Until the next press, nothing is heard, recorded or sent.",
        },
        {
          kind: "p",
          text: "While the light is on, Kheelu hears whoever is speaking near it, so a brother, sister, friend or grown-up in the room can end up in a conversation too. You can read and delete any conversation in the parent app.",
        },
        { kind: "h3", text: "Where your child’s voice goes." },
        {
          kind: "p",
          text: "In AI mode, Kheelu uses your home Wi‑Fi. To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so. “Trusted” means we chose them carefully; it is not a certification.",
        },
        /* The providers are not named, and the page makes no "on request" line (D055 item 16). */
        { kind: "p", text: "Kheelu cannot browse the internet. It has no camera, so it takes no photos or video." },
        { kind: "h3", text: "What we keep, and why." },
        {
          kind: "list",
          items: [
            {
              lead: "Conversation transcripts:",
              text: "the words of each conversation, written out. We keep them so you can read them in the parent app and so Kheelu can remember earlier conversations with your child.",
            },
            {
              lead: "Voice recordings:",
              text: "used to train Kheelona’s own model ([next section](#training)). Besides Kheelu’s reply and that training, we use them for nothing else.",
            },
            {
              lead: "Your child’s age:",
              text: "you enter it in the parent app when you set Kheelu up, and you can change it later. Every reply passes an age-graded safety layer set to that age.",
            },
            {
              lead: "The weekly report and the new-word count",
              text: "in the parent app, worked out from your child’s conversations.",
            },
            /* No alerts line: parent alerts are off in v1 (B34, final by D054 item 23). D055 item 14 below. */
            { lead: "Your child’s first name:", text: "the parent app asks for it." },
            {
              lead: "Your parent-app account and Kheelu’s setup:",
              text: "your phone number. You sign in with it and a one-time code. The account also keeps Kheelu’s serial or device ID, the name of the Wi‑Fi network Kheelu joins (not its password), and your phone’s model and operating system.",
            },
          ],
        },
        { kind: "h3", text: "Your consent." },
        {
          kind: "p",
          text: "A parent or guardian sets Kheelu up in the parent app. Setting Kheelu up in the parent app is how a parent or guardian agrees to this policy. A separate consent step, with a check that you are the parent or guardian, comes before May 2027.",
        },
      ],
    },
    /* Section 3 · Kheelona's own model: D035, here and on /terms only, never on customer pages. */
    {
      id: "training",
      title: "Kheelona’s own model learns from conversations.",
      contents: "Kheelona’s own model",
      blocks: [
        {
          kind: "p",
          text: "Our outside speech and AI providers never train on your child’s voice. Kheelona’s own AI model does learn from conversations, and here is exactly how.",
        },
        {
          kind: "list",
          items: [
            { lead: "What it uses:", text: "your child’s voice recordings and the transcripts of their conversations with Kheelu." },
            { lead: "Who uses it:", text: "Kheelona, to train our own model. We don’t sell it." },
            { lead: "Why:", text: "to make Kheelu better at understanding and answering children aged 3 to 7." },
            { lead: "Where:", text: "India, on Google Cloud." },
            {
              lead: "It’s on by default.",
              text: "You can turn it off at any time, with a switch in the parent app. From then on, your child’s conversations are not used to train our model. We take them out of our training data. A model already trained keeps what it learned, but they are never used again.",
            },
            "Turning it off changes nothing else about how Kheelu or the parent app works.",
          ],
        },
      ],
    },
    /* Section 4 · When you pre-order: the store form's fields exactly (checkout.md); if the form changes, this does too. */
    {
      id: "store",
      title: "When you pre-order on our store.",
      contents: "When you pre-order",
      blocks: [
        {
          kind: "p",
          text: "Before you pay, we ask for four things: your name, your WhatsApp number, your email address and your child’s age. After you pay, we ask for your delivery address.",
        },
        {
          kind: "p",
          text: "We use your WhatsApp number and email to tell you about your own order: the confirmation, the balance payment link and any change to the delivery date. Your address is how your Kheelu reaches you. We ask your child’s age because Kheelu is made for children aged 3 to 7, and it helps us plan for the right ages. We don’t ask for your child’s name, school or photo.",
        },
        {
          kind: "p",
          text: "When you tick the box at checkout, you accept the pre-order terms and the refund policy, and agree to hear about your own order on WhatsApp. The box is never ticked for you, and we store the time you ticked it.",
        },
        {
          kind: "p",
          text: "If you start a pre-order and don’t pay, the details you entered are still saved, as an unpaid order. We keep them until you ask us to delete them.",
        },
        {
          kind: "p",
          text: "Your browser also tells us a few things: the page or advertisement that brought you, your device and browser, and your network address (IP address). If you have a Meta cookie on your device, we read the identifier in it. We keep these with your order, so we can tell which of our pages and advertisements work.",
        },
        { kind: "h3", text: "Paying." },
        {
          kind: "p",
          text: "Razorpay, an Indian payment company, takes your payment on its own secure form. Your card number, UPI ID and bank details go to Razorpay, never to us. We receive a payment reference and the amount. Razorpay’s form sets its own cookies while you pay.",
        },
      ],
    },
    /* Section 5 · How we measure visits: one block per tool, every tool of the tracking inventory that touches a
     * visitor, never a count of them. */
    {
      id: "measuring",
      title: "How we measure visits and advertising.",
      contents: "How we measure visits",
      blocks: [
        {
          kind: "p",
          text: "We measure how people use this website and our store, so we can see which parts help you decide and which advertisements are worth paying for. These tools run on kheelona.com and store.kheelona.com, and they load as soon as you open a page.",
        },
        {
          kind: "tools",
          tools: [
            {
              name: "Vercel Web Analytics",
              blocks: [{ kind: "p", text: "Counts page views. It sets no cookies and does not follow you to other sites." }],
            },
            {
              name: "Ahrefs Web Analytics",
              blocks: [{ kind: "p", text: "Counts page views. It sets no cookies and does not follow you to other sites." }],
            },
            {
              name: "Google Analytics",
              blocks: [
                {
                  kind: "p",
                  text: "Counts visits and the steps of a pre-order: starting the form, being asked to correct an answer (which answers, never what you typed), opening and closing the payment window, a payment that fails (with Razorpay’s code for why), paying, and saving your address. It is told your order number and the amount paid. It sets cookies in your browser to tell a returning visit from a new one. Google keeps this data for 14 months.",
                },
              ],
            },
            {
              name: "Meta Pixel",
              blocks: [
                {
                  kind: "p",
                  text: "From Meta, the company behind Facebook, Instagram and WhatsApp. It sets a cookie and does follow you to other sites. It tells Meta which pages you looked at, and whether you pre-ordered and for how much. It’s how we know whether an advertisement brought someone here, and how you may later see a Kheelona advertisement on Facebook or Instagram. Meta’s script also reads what it recognises on our forms and sends it as one-way codes, never in readable form.",
                },
              ],
            },
            {
              name: "Meta Conversions API",
              blocks: [
                {
                  kind: "p",
                  text: "When a pre-order is paid, our own server reports it to Meta: one-way codes of your email, phone number and first name, together with your network address, your browser, the identifiers in Meta’s cookie on your device, the amount and the order number. A one-way code lets Meta check whether you match an account it already knows; it is not your details themselves.",
                },
              ],
            },
            {
              name: "PostHog",
              blocks: [
                {
                  kind: "p",
                  text: "Records which buttons and links you tap, and a replay of your screen as you move through the site, so we can find the places where the pre-order form confuses people. It is told the same steps of a pre-order as Google Analytics. It also tells us when something breaks or loads slowly. Anything you type is hidden before the recording leaves your browser, and nothing is recorded on the order confirmation page. PostHog also receives your network address, which tells us your country. It does not follow you to other sites and is never used to advertise to you. It stores what it collects on servers in the United States.",
                },
                {
                  kind: "p",
                  text: "When you pre-order, we store the anonymous identifier PostHog gave your browser alongside your order, so we can see that a visit turned into an order. It identifies a browser, not a person, and we don’t ask PostHog to build a profile from it. Our server also tells PostHog when a pre-order is paid, with the order number, the amount and the campaign that brought you.",
                },
              ],
            },
            {
              name: "Our own cookies",
              blocks: [
                {
                  kind: "list",
                  items: [
                    { lead: "kh_utm", text: "remembers which campaign brought you, for as long as your visit lasts." },
                    {
                      lead: "kh_fbclid",
                      text: "remembers which advertisement click brought you, for as long as your visit lasts. Meta can match that click back to your account, which is how an advertisement gets credited with a sale. We cannot, and we never learn who you are on Meta.",
                    },
                    { lead: "kh_order", text: "lets the confirmation page show your order, for 2 hours." },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    /* Section 6 · Your choices: the consent choice before the DPDP consent duties (D042). */
    {
      id: "choices",
      title: "Your choices about cookies and tracking.",
      blocks: [
        {
          kind: "p",
          text: "We don’t show a cookie banner today: the tools above load when you open a page. Before the consent duties of India’s Digital Personal Data Protection Act, 2023 apply in May 2027, we will add a choice, so you can say yes or no to our analytics and advertising tools.",
        },
        { kind: "p", text: "Until then, here is what works." },
        {
          kind: "list",
          items: [
            {
              lead: "Your browser can block",
              text: "the tools that load from another company’s address, and most of the Meta Pixel. Private browsing, an ad blocker or turning off third-party cookies all help, and none of them stop the site or the store from working.",
            },
            {
              lead: "What blocking can’t stop.",
              text: "PostHog reports through our own address, so an ad blocker usually can’t tell it apart from the site itself. And the report our server sends to Meta when a pre-order is paid comes from us, not from your browser.",
            },
            { lead: "You can turn off personalised advertising", text: "in your own Facebook or Instagram settings." },
            { lead: "You can ask us to delete your details", text: "at any time (see [Deleting, and your other rights](#rights))." },
          ],
        },
      ],
    },
    /* Section 7 · Everyone who handles your data: one stacked row each on phones, the table on laptops. Every region is
     * sourced (D055 items 16 and 24; privacy.md section 7 notes): the providers' servers in India (D020 item 6);
     * conversations and the parent app with Kheelona on Google Cloud in India (D047); Supabase, ORDER_DATA_LOCATION;
     * the store's server code in Mumbai (vercel.json, bom1); Razorpay, Resend, Google, Meta and Ahrefs from each
     * provider's own published documents; PostHog's US cloud. */
    {
      id: "who-else",
      title: "Everyone who handles your data, and where.",
      contents: "Everyone who handles your data",
      blocks: [
        { kind: "p", text: "Each of these companies does one job for us." },
        {
          kind: "recipients",
          label: "Everyone who handles your data, and where",
          headings: { who: "Who", what: "What they do for us", where: "Where" },
          keys: { what: "What:", where: "Where:" },
          rows: [
            { who: "Speech and AI providers", what: "Turn your child’s voice into Kheelu’s reply", where: "Servers in India" },
            {
              who: "Kheelona, on Google Cloud",
              what: "Stores conversations, your child’s age and your parent-app account",
              where: "India",
            },
            { who: "Razorpay", what: "Takes your payment", where: "India" },
            { who: "Supabase", what: "Stores your order", where: ORDER_DATA_LOCATION },
            { who: "Resend", what: "Sends our order emails", where: "United States" },
            {
              who: "Vercel",
              what: "Hosts this website and the store, and runs the store’s server code; Vercel Web Analytics",
              where: "India (Mumbai) for the store’s server code",
            },
            { who: "Google", what: "Google Analytics", where: "Google data centres around the world" },
            {
              who: "Meta",
              what: "Meta Pixel and Conversions API; WhatsApp, when you message or call us",
              where: "The United States and other countries",
            },
            { who: "PostHog", what: "Taps, screen replays and errors on this site", where: "United States" },
            { who: "Ahrefs", what: "Counts page views", where: "United States" },
          ],
        },
        {
          kind: "p",
          text: "Inside Kheelona, only our team can read your order. We also share data when Indian law requires it, for example with tax authorities or in answer to a lawful order.",
        },
      ],
    },
    /* Section 8 · How long we keep things: the answer-first block RT1, the retention line as every page prints it. */
    {
      id: "keep",
      title: "How long we keep things.",
      answer: `${RETENTION_LINE} The speech and AI providers that help Kheelu reply keep none of it.`,
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "Conversation transcripts:", text: `${RETENTION_MONTHS} months, then deleted automatically, unless you delete them sooner.` },
            { lead: "Voice recordings:", text: `${RETENTION_MONTHS} months, the same as transcripts.` },
            {
              lead: "If you close your parent-app account:",
              text: `we keep your child’s conversations and recordings until their ${RETENTION_MONTHS} months end.`,
            },
            { lead: "Orders you’ve paid for:", text: "as long as Indian tax law requires, even after a refund." },
            { lead: "Unpaid orders:", text: "we keep them until you ask us to delete them." },
            { lead: "Google Analytics:", text: "14 months." },
            { lead: "PostHog:", text: "screen recordings for 30 days." },
            { lead: "Meta", text: "keeps what it receives under its own policy." },
            { lead: "Our cookies:", text: "kh_utm and kh_fbclid for as long as your visit lasts; kh_order for 2 hours." },
          ],
        },
      ],
    },
    /* Section 9 · Deleting, and your other rights (D017; the request promise extends D032's, a drafter's addition). */
    {
      id: "rights",
      title: "Deleting, and your other rights.",
      blocks: [
        { kind: "h3", text: "Deleting a conversation." },
        {
          kind: "p",
          /* What a one-tap delete does not reach, said plainly (D055 item 17); no line on servers or backups. */
          text: "In the parent app, you can delete any conversation in one tap. It disappears from your app straight away. It is not removed from Kheelu’s memory, or from the data our model trains on.",
        },
        { kind: "h3", text: "Asking us." },
        { kind: "p", text: "You can ask us to:" },
        {
          kind: "list",
          items: [
            "show you the personal data we hold about you and your child, and tell you who we have shared it with;",
            "correct anything that is wrong or out of date;",
            "delete your details or your child’s;",
            "withdraw a consent you gave, as easily as you gave it;",
            "from May 2027, when the DPDP Act’s duties apply, name someone who can use these rights for you if you die or can no longer act for yourself.",
          ],
        },
        {
          kind: "p",
          text: `Write to ${EMAIL}, or message or call ${PHONE}. Tell us your order number, or the email or phone number on your order or your parent-app account, so we can find your data. If you have an open pre-order, deleting your details means cancelling it, so we refund you at the same time.`,
        },
        {
          kind: "p",
          text: `We acknowledge every request within ${GRIEVANCE_ACK_HOURS} hours and answer it within ${GRIEVANCE_RESOLUTION}. If you’re not happy with our answer, contact our [grievance officer](#contact) (below). From May 2027, you can also complain to the Data Protection Board of India.`,
        },
      ],
    },
    /* Section 10 · What we never do. */
    {
      id: "never",
      title: "What we never do.",
      blocks: [
        {
          kind: "list",
          items: [
            "We never sell your data, and we never sell your child’s data.",
            "We never use your child’s data to advertise to your child. Kheelu and the parent app show no ads.",
            "We never use what you type into the pre-order form to profile your child.",
            "Kheelu cannot browse the internet, and it has no camera.",
          ],
        },
        {
          kind: "p",
          text: "We do advertise Kheelu to parents on Facebook and Instagram, and the Meta tools above are how we measure that.",
        },
      ],
    },
    /* Section 11 · Keeping data safe: no written security policy yet, so the two confirmed lines and the founder's breach
     * sentence (D055 items 22 and 23). */
    {
      id: "security",
      title: "Keeping data safe.",
      blocks: [
        {
          kind: "p",
          text: "Payments happen on Razorpay’s own form, so card, UPI and bank details never reach us. Only our team can read your order.",
        },
        {
          kind: "p",
          text: "If your data is ever exposed, we tell you without delay, and the Data Protection Board as the law requires.",
        },
      ],
    },
    /* Section 12 · Films of real families (D040). */
    {
      id: "films",
      title: "Films of real families.",
      blocks: [
        {
          kind: "p",
          text: `The films on this website show pilot families, filmed with their permission. A parent gave written consent for every child who appears. If you or your child appear in one of our films and you want it taken down, write to ${EMAIL}.`,
        },
      ],
    },
    /* Section 13 · Which law applies: SPDI now, the DPDP Act from May 2027; no compliance claim. */
    {
      id: "law",
      title: "Which law applies, and changes to this page.",
      contents: "Which law applies",
      blocks: [
        {
          kind: "p",
          text: "Today, this policy follows India’s Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. Most duties of India’s Digital Personal Data Protection Act, 2023 and its Rules of 2025 apply from May 2027. We are preparing for them, including the choice about our analytics and advertising tools described above.",
        },
        {
          kind: "p",
          text: "When we change this page, we update the date at the top. If a change affects how we use data you have already given us, we tell you by email or WhatsApp before it takes effect.",
        },
      ],
    },
    /* Section 14 · Questions and complaints: the grievance block (D032) and the seller card, both from seller.ts. */
    {
      id: "contact",
      title: "Questions and complaints.",
      blocks: [
        {
          kind: "p",
          text: `For anything about your data, write to ${EMAIL}, or message or call us on ${WHATSAPP} at ${PHONE}.`,
        },
        { kind: "grievance" },
        { kind: "seller", lead: "Who we are:" },
      ],
    },
  ],
  /* The close: no pre-order button and no tracking value (strategy §5, policy row), the link back to the product page
   * and the related policies; the help line is the template's. */
  close: {
    actions: [{ label: "Meet Kheelu", href: "/products/kheelu" }],
    also: {
      label: "Also read:",
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Refunds", href: "/refund" },
        { label: "Shipping", href: "/shipping" },
        { label: "Safety", href: "/safety" },
      ],
    },
  },
} satisfies LegalPage;
