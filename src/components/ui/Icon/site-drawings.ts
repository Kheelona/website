import type { IconName, IconPath } from "@/assets/icons.generated";
import { WHATSAPP_GLYPH } from "@/assets/whatsapp-logo.generated";

/**
 * The DS icons whose drawing the site replaces, with the path it draws instead: one, the founder's (D064 item 3, task
 * Q2.4). `whatsapp-logo` is Wikimedia Commons' WhatsApp.svg in one colour (src/assets/whatsapp-logo.generated.ts), on
 * the DS grid and in the DS glyph's square, so every WhatsApp link and button that names the DS icon (help lines,
 * /contact, the store and /thanks through Button) shows the real logo. The DS set itself stays as delivered
 * (icons.generated.ts, test/guards/generated-icons.test.ts). Read by `Icon`, and by the tests that compare the build with
 * the approved mockup, which inlines the DS drawing (test/support/mockup-compare.ts, test/e2e/support/deviations.ts).
 * No icon map and no React here: a client island or a Playwright helper may import it.
 */
export const SITE_DRAWINGS: Readonly<Partial<Record<IconName, IconPath>>> = { "whatsapp-logo": WHATSAPP_GLYPH };
