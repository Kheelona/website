/**
 * The in-app browsers whose UPI payments the store's note is about (B12, G13), by the tokens their apps put in
 * the user agent: `Instagram`; Facebook and Messenger's `FBAN` (iOS), `FB_IAB` and `FBAV` (Android); and
 * `WhatsApp` (its Android in-app browser). Whole tokens only, as the apps write them. Chrome and Safari on the
 * same phones carry none of them.
 */
const IN_APP_TOKEN = /\b(?:Instagram|FBAN|FB_IAB|FBAV|WhatsApp)\b/;

export function isInAppBrowser(userAgent: string): boolean {
  return IN_APP_TOKEN.test(userAgent);
}
