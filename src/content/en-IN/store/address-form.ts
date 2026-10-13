import type { AddressFormCopy } from "@/components/sections/store/AddressStep/address-step.types";

/**
 * The address form's words (/thanks fold 3; mockup/store-confirmation.html; task 5.16, moved here by task 4.8). A
 * words-only module: the form is a client island and imports this alone, and this imports nothing but its type, so the
 * seller facts and the organisation node the confirmation page reads (confirmation.ts) stay out of the browser bundle
 * (client-words.test.ts). The handler's own failure lines stay where the frozen logic has them.
 */
export const addressForm = {
  labels: {
    line1: "Flat or house, and street",
    line2: "Landmark or area (optional)",
    pincode: "PIN code",
    city: "City or town",
    state: "State",
  },
  statePlaceholder: "Choose your state",
  save: "Save my address",
  saving: "Saving…",
  reassurance:
    "Your order is already safe. This can wait if you are in the middle of something, and the link in your email brings you straight back here.",
  saved: {
    title: "We have your address.",
    before: "That is everything we need. You can change it any time before dispatch: ",
    link: "message us on WhatsApp",
    after: " and we will update it.",
    change: "Change it here instead",
  },
} as const satisfies AddressFormCopy;
