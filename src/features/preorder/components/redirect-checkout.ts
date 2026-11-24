import { isInAppBrowser } from "@/components/ui/InAppBrowserNote/in-app-browser";

/** Which browsers should pay by Razorpay's redirect flow instead of its in-page window (D070 / B2, K-172).
 *
 *  The in-page window reports a payment to a `handler` function, and that function is not supported in a WebView
 *  (Razorpay's own docs): an in-app browser that hands the parent to a UPI app, or drops the page while they are away,
 *  never calls it, so the order was paid (the webhook saw it) and the parent never reached the address step. With a
 *  `callback_url` Razorpay posts the result to OUR server instead (src/app/store/pay/return/route.ts), which does not
 *  depend on the page being alive.
 *
 *  Only where the page cannot be trusted to survive: the apps whose user agents say so. Regular Safari, Chrome,
 *  Samsung Internet and Firefox keep the proven window and handler. The tokens are the store's in-app note's
 *  (Instagram, Facebook and Messenger, WhatsApp) plus `LinkedInApp`, written `[LinkedInApp]` on iOS, and the Android
 *  WebView marker `; wv)`, which every Android app's embedded browser carries and Chrome itself does not. An iOS app
 *  whose WKWebView says nothing cannot be told from Safari, and keeps the window; the recovery on the store page is
 *  what catches it. */
const ANDROID_WEBVIEW = /;\s*wv\)/;
const LINKEDIN = /\bLinkedInApp\b/;

export function prefersRedirectCheckout(userAgent: string | null | undefined): boolean {
  const ua = typeof userAgent === "string" ? userAgent : "";
  return isInAppBrowser(ua) || LINKEDIN.test(ua) || ANDROID_WEBVIEW.test(ua);
}

/** Where Razorpay posts the result, on the host the parent is on (a test store on another host returns to itself). */
export function payReturnUrl(origin: string): string {
  return `${origin}/pay/return`;
}
