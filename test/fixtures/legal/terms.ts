import { DEFAULT_OG } from "@/content/en-IN/organization";
import { placeholder } from "@/lib/content/placeholder";
import type { LegalPage } from "@/layouts/LegalTemplate/legal-template.types";

/* Fixture content for the legal template's parity run (task 4.3; structure §1 "test/fixtures/legal/"): every word of
 * mockup/pages/terms.html (the approved Gate A page, D046), copied into the content shape, so the template can be
 * compared with the mockup before the real terms module exists (task 5.1x writes that from wiki/site/pages/terms.md).
 * Never shipped: nothing in src/ imports it except the template's own test and story. */
export const termsFixture = {
  slug: "terms",
  meta: {
    title: "Kheelu pre-order terms · Kheelona",
    description: "Kheelu pre-order terms: ₹4,999 (incl. GST), reserved with a refundable ₹499 advance. Paying, delivery, cancelling, returns and using Kheelu.",
    og: DEFAULT_OG,
  },
  status: "draft",
  approvedOn: placeholder(null, "the date the founder approves this text"),
  hero: {
    eyebrow: "Terms",
    title: "Pre-order terms, in {hand:plain words.}",
    lead: "What you pay and when, how to cancel, when Kheelu arrives, and the rules for using Kheelu and its parent app. A fair deal should survive being written clearly.",
  },
  summary: {
    kind: "points",
    title: "The {hand:short version.}",
    points: [
      {
        lead: "What you pay.",
        text: "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
      },
      {
        lead: "Changed your mind before dispatch?",
        text: "Cancel any time for a full refund, no reason needed. We start it within 2 working days.",
      },
      {
        lead: "When it comes.",
        text: "{delivery}, anywhere in India. Delivery is included.",
      },
      {
        lead: "After delivery.",
        text: "7-day returns, no questions asked, and a 6-month warranty on manufacturing defects.",
      },
      {
        lead: "Paying.",
        text: "UPI, card or net banking, through Razorpay. No payment fees. Nothing recurring.",
      },
      {
        lead: "Who it’s for.",
        text: "You must be 18 or over to pre-order. Kheelu is made for children aged 3 to 7.",
      },
      {
        lead: "Our own model.",
        text: "Kheelona’s own model learns from your child’s conversations unless you turn it off.",
      },
      {
        lead: "A toy, not a therapy.",
        text: "Indian law applies, and you can always file a consumer complaint where you live.",
      },
    ],
  },
  groups: [
    {
      label: "Your pre-order",
      eyebrow: "Part one · Your pre-order",
    },
    {
      label: "Using Kheelu",
      eyebrow: "Part two · Using Kheelu",
    },
    {
      label: "The legal part",
      eyebrow: "Part three · The legal part",
    },
  ],
  parts: [
    {
      id: "scope",
      title: "What these terms cover.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "These terms are an agreement between you and Kheelona Robotics Private Limited (“Kheelona”, “we”). Part one covers a pre-order placed on our store at store.kheelona.com. Part two covers using Kheelu and its parent app. Our [Privacy](/privacy), [Refunds](/refund) and [Shipping](/shipping) pages are part of these terms too.",
        },
        {
          kind: "p",
          text: "When you tick the box at checkout, you accept these terms and our refund policy.",
        },
      ],
    },
    {
      id: "who-can",
      title: "Who can pre-order.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "You must be 18 or over to pre-order. You need an Indian mobile number for WhatsApp and a delivery address in India: we don’t ship outside India yet.",
        },
        {
          kind: "p",
          text: "Each pre-order is for one Kheelu. If you want more than one, for siblings or as a gift, message us on [WhatsApp](https://wa.me/919187546483) at {nowrap:[+91 91875 46483](tel:+919187546483)} and we’ll sort it out with you.",
        },
      ],
    },
    {
      id: "preorder",
      title: "What a pre-order is.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "A pre-order reserves one Kheelu for you. Pre-orders are served first, in the order they were placed.",
        },
        {
          kind: "p",
          text: "In the box: the Kheelu plush toy, a charger and a quick-start card. Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app.",
        },
        {
          kind: "p",
          text: "When your payment goes through, you see a confirmation page, and we email you a confirmation with your order number.",
        },
      ],
    },
    {
      id: "price",
      title: "The price.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "While the first 500 units last, counted by paid pre-orders, Kheelu costs {price:headline} in total (incl. GST). You reserve yours for {price:token} today, refundable until dispatch, and pay the remaining {price:balance} before delivery. The advance is part of the {price:headline}, not on top of it.",
        },
        {
          kind: "p",
          text: "After that, Kheelu costs {price:full} (incl. GST), paid in full when you order, with no advance and no balance.",
        },
        {
          kind: "p",
          text: "Your price is fixed on the day you pre-order. It does not move afterwards, in either direction.",
        },
        {
          kind: "p",
          text: "Prices include GST. Delivery anywhere in India is included, so the price is the whole cost of Kheelu arriving at your door. Nothing is collected at the door.",
        },
        {
          kind: "p",
          text: "Every order gets a GST invoice. {ph:which GST documents you get and when, for example a receipt voucher for the advance and a tax invoice at dispatch, as our CA sets them up}",
        },
        {
          kind: "p",
          text: "{ph:the price breakup (taxable value, GST rate and amount, delivery ₹0), once our CA confirms the HSN code and the GST rate}",
        },
      ],
    },
    {
      id: "payment",
      title: "Paying.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "You can pay by UPI, debit or credit card, or net banking. Razorpay takes the payment on its own secure form: your card number, UPI ID and bank details go to Razorpay, never to us.",
        },
        {
          kind: "p",
          text: "No payment fees. Nothing recurring. Nothing is ever charged automatically, and we don’t keep your card.",
        },
        {
          kind: "p",
          text: "The {price:balance} balance is paid by a payment link we send you on WhatsApp and by email before dispatch. We dispatch a reserved Kheelu once the balance is paid.",
        },
        {
          kind: "p",
          text: "If a payment goes wrong, tell us first and we’ll sort it out. You can also raise a dispute (a chargeback) with your bank or card issuer. Razorpay’s own help is at [razorpay.com/support](https://razorpay.com/support/).",
        },
      ],
    },
    {
      id: "cancel",
      title: "Cancelling before dispatch.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "You can cancel at any time before your Kheelu is dispatched, and we refund everything you’ve paid: the whole advance, or the whole price if you paid in full. No fee, no deduction, and you don’t have to tell us why.",
        },
        {
          kind: "p",
          text: "To cancel, message or call us on {nowrap:[+91 91875 46483](tel:+919187546483)}, or email [hello@kheelona.com](mailto:hello@kheelona.com), with your order number. We start your refund within 2 working days of your request; your bank takes {nowrap:5-7} working days. The money goes back to the card, UPI ID or account you paid from.",
        },
        {
          kind: "p",
          text: "If you don’t pay the balance, we remind you twice over two weeks. After that, we release your Kheelu and refund your advance in full.",
        },
        {
          kind: "p",
          text: "All the detail is on our [Refunds](/refund) page.",
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "{delivery}. We deliver anywhere in India and send you a tracking link when your Kheelu ships. You can change your address any time before dispatch.",
        },
        {
          kind: "p",
          text: "If the delivery date moves, you hear it from us first, your price stays exactly as it is, and you can cancel for a full refund at that point, even if you were happy to wait before. If we cannot supply your Kheelu at all, you get back everything you’ve paid.",
        },
        {
          kind: "p",
          text: "Before dispatch, details such as specifications can still change while we finish testing and certification. Your price and your money can’t change without your say.",
        },
        {
          kind: "p",
          text: "All the detail is on our [Shipping](/shipping) page.",
        },
      ],
    },
    {
      id: "returns",
      title: "Returns, faulty units and warranty.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          lead: "Changed your mind?",
          text: "Return Kheelu within 7 days of delivery, no questions asked. Opened is fine. Just send back everything that came in the box, undamaged.",
        },
        {
          kind: "p",
          lead: "Faulty, damaged or not as described?",
          text: "You can have a replacement or a full refund. If it arrives faulty, tell us within 7 days of receiving it.",
        },
        {
          kind: "p",
          lead: "Warranty.",
          text: "6-month warranty on manufacturing defects. It doesn’t cover drops, water damage or misuse. If a defect shows up after the first 7 days, we repair it, or replace it if the repair fails.",
        },
        {
          kind: "p",
          text: "We arrange the pickup, free, for returns we accept, faulty units and warranty claims. Once your Kheelu reaches us and qualifies for return, your refund is processed within 7 working days.",
        },
        {
          kind: "p",
          text: "No exchanges: return it within 7 days and order again.",
        },
        {
          kind: "p",
          text: "All the detail is on our [Refunds](/refund) page.",
        },
      ],
    },
    {
      id: "ages",
      title: "Who Kheelu is for.",
      group: "Using Kheelu",
      blocks: [
        {
          kind: "p",
          text: "Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. For 3-year-olds, we advise having a grown-up nearby.",
        },
        {
          kind: "p",
          text: "When you set Kheelu up, you enter your child’s age in the parent app. Every reply passes an age-graded safety layer set to that age. You can change it later.",
        },
      ],
    },
    {
      id: "account",
      title: "The parent app.",
      group: "Using Kheelu",
      blocks: [
        {
          kind: "p",
          text: "The parent app is for parents and guardians. The person who sets it up must be 18 or over and looks after the account.",
        },
        {
          kind: "p",
          text: "In the app, you can read every conversation and delete any of them in one tap. Conversations are deleted automatically after 36 months.",
        },
        {
          kind: "p",
          text: "How we handle your child’s data is on our [Privacy](/privacy) page, which is part of these terms.",
        },
      ],
    },
    {
      id: "training",
      title: "Conversations and Kheelona’s own model.",
      group: "Using Kheelu",
      blocks: [
        {
          kind: "p",
          text: "Kheelona’s own AI model learns from your child’s voice recordings and conversation transcripts. This is on by default, and you can turn it off at any time: {ph:how a parent turns training off, for example a setting in the parent app}. Our outside speech and AI providers never train on your child’s voice.",
        },
        {
          kind: "p",
          text: "The full detail, including what happens when you turn it off, is on our [Privacy](/privacy#training) page.",
        },
      ],
    },
    {
      id: "toy",
      title: "A toy, not a therapy.",
      group: "Using Kheelu",
      blocks: [
        {
          kind: "p",
          text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
        },
        {
          kind: "p",
          text: "Kheelu uses AI to understand and answer your child. Its stories and answers come from a curated, closed content library, and every reply passes an age-graded safety layer. We test it before launch by trying to make it say unsafe things, and when it isn’t sure, it says it doesn’t know rather than guess. Even so, an answer can sometimes be wrong. Kheelu doesn’t replace you: stay close, and read its conversations in the parent app.",
        },
      ],
    },
    {
      id: "images",
      title: "Images on this website.",
      group: "Using Kheelu",
      blocks: [
        {
          kind: "p",
          text: "This website may use AI-generated images, including pictures of children and families. They are illustrations, not photos of our customers. Our films are different: they show real pilot families, filmed with their permission.",
        },
      ],
    },
    {
      id: "law",
      title: "Your rights, the law and the courts.",
      group: "The legal part",
      blocks: [
        {
          kind: "p",
          text: "These terms are governed by Indian law, and the courts at Bengaluru have jurisdiction. This does not limit your right to file a consumer complaint where you live, under the Consumer Protection Act, 2019.",
        },
        {
          kind: "p",
          text: "Nothing in these terms takes away your rights as a consumer, or your right to complain to the Data Protection Board of India once the Digital Personal Data Protection Act’s duties apply in May 2027.",
        },
        {
          kind: "p",
          text: "If any part of this page is unclear enough to argue about, we will read it the way a careful parent would, not the way a lawyer would like us to.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms.",
      group: "The legal part",
      blocks: [
        {
          kind: "p",
          text: "When these terms change, we update the date at the top. A change never touches the price or the refund promise of an order you’ve already placed without your say. If a change affects your order, we tell you first.",
        },
      ],
    },
    {
      id: "contact",
      title: "Who you’re buying from, and complaints.",
      group: "The legal part",
      blocks: [
        {
          kind: "seller",
          lead: "Seller:",
        },
        {
          kind: "card",
          lead: "Customer care:",
          text: "[WhatsApp](https://wa.me/919187546483) or call {nowrap:[+91 91875 46483](tel:+919187546483)}, or email [hello@kheelona.com](mailto:hello@kheelona.com).",
        },
        {
          kind: "grievance",
        },
      ],
    },
  ],
  close: {
    actions: [
      {
        label: "Meet Kheelu",
        href: "/products/kheelu",
      },
    ],
    also: {
      label: "Also read:",
      links: [
        {
          label: "Privacy",
          href: "/privacy",
        },
        {
          label: "Refunds",
          href: "/refund",
        },
        {
          label: "Shipping",
          href: "/shipping",
        },
      ],
    },
  },
} satisfies LegalPage;
