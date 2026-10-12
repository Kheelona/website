import { describe, expect, it } from "vitest";
import { isInAppBrowser } from "./in-app-browser";

/* The in-app browsers the store's note is for (B12, G13): Instagram, Facebook (and Messenger, the same FBAN /
 * FB_IAB family) and WhatsApp. Everything else, including Chrome and Safari on the same phones, is not. */

const IN_APP = {
  "Instagram on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 310.0.0.27.110 (iPhone14,5; iOS 17_1; en_IN; en; scale=3.00; 1170x2532; 541635890)",
  "Instagram on Android":
    "Mozilla/5.0 (Linux; Android 13; SM-A536E Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 Instagram 309.1.0.41.113 Android (33/13; 450dpi; 1080x2177; samsung; SM-A536E; a53x; s5e8825; en_IN; 541635863)",
  "Facebook on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.1;FBSS/3;FBID/phone;FBLC/en_GB;FBOP/5]",
  "Facebook on Android":
    "Mozilla/5.0 (Linux; Android 13; SM-A536E Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/442.0.0.33.113;]",
  "Messenger on Android":
    "Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SQ3A.220705.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.5993.111 Mobile Safari/537.36 [FB_IAB/Orca-Android;FBAV/434.0.0.27.115;]",
  "WhatsApp on Android":
    "Mozilla/5.0 (Linux; Android 13; RMX3630 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.43 Mobile Safari/537.36 WhatsApp/2.23.25.83 A",
};

const NOT_IN_APP = {
  "Chrome on Android":
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Safari on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
  "Samsung Internet":
    "Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-A536E) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36",
  "Chrome on a laptop":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "no user agent": "",
};

describe("isInAppBrowser", () => {
  it.each(Object.entries(IN_APP))("%s: yes", (_name, ua) => {
    expect(isInAppBrowser(ua)).toBe(true);
  });

  it.each(Object.entries(NOT_IN_APP))("%s: no", (_name, ua) => {
    expect(isInAppBrowser(ua)).toBe(false);
  });

  it("reads whole tokens only (a word that merely contains one is not an app)", () => {
    expect(isInAppBrowser("Mozilla/5.0 NotInstagramBrowser/1.0")).toBe(false);
    expect(isInAppBrowser("Mozilla/5.0 MyWhatsAppClone/1.0")).toBe(false);
    // A token that only ends the word, or only starts it.
    expect(isInAppBrowser("Mozilla/5.0 NotInstagram/1.0")).toBe(false);
    expect(isInAppBrowser("Mozilla/5.0 XFBAV/1.0")).toBe(false);
    expect(isInAppBrowser("Mozilla/5.0 WhatsAppClone/1.0")).toBe(false);
    expect(isInAppBrowser("Mozilla/5.0 FBANX/1.0")).toBe(false);
  });
});
