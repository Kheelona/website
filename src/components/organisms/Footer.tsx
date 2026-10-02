import Link from "next/link";
import {
  FOOTER_LINKS,
  CONTACT_EMAIL,
  LEGAL_ENTITY,
  REGISTERED_ADDRESS_LINE,
  GSTIN,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";

/** The mockup's footer (redesign 2026-10): wordmark and provenance, the link
 *  grid, and the seller of record. Fixed ink in both themes.
 *
 *  The mockup also prints a grievance officer; that line waits until one is
 *  appointed (Technical-Todo.md, DPDP), rather than shipping a blank. */
export function Footer() {
  return (
    <footer className="bg-footer-cocoa pb-[calc(40px+env(safe-area-inset-bottom,0px))] pt-10 text-[15px] leading-[1.7] text-[#e9e4f0]">
      <div className="kh-wrap grid gap-6 min-[900px]:grid-cols-[1.2fr_1fr_1.4fr]">
        <div className="flex flex-col gap-2">
          <span className="font-display text-[25px] font-semibold text-[#fbf6ee]">Kheelona</span>
          <span>Made in Bengaluru.</span>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-9 items-center text-[#e9e4f0] underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-[#f2b441]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          {LEGAL_ENTITY} · {REGISTERED_ADDRESS_LINE} · GSTIN {GSTIN}
          <br />
          <a href={SUPPORT_WHATSAPP_HREF} className="text-[#e9e4f0] underline underline-offset-4">
            WhatsApp {SUPPORT_WHATSAPP_DISPLAY}
          </a>
          {CONTACT_EMAIL ? (
            <>
              {" · "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#e9e4f0] underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
            </>
          ) : null}
          <br />
          Partners and investors:{" "}
          <a href="https://kheelona.ai" className="text-[#e9e4f0] underline underline-offset-4">
            kheelona.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
