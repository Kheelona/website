import Link from "next/link";
import { FOOTER_LINKS, CONTACT_EMAIL } from "@/config/site";

export function Footer() {
  return (
    // relative z-20: the fixed stage canvas lives inside main (z-10) and
    // covers the viewport, so without a higher stacking level the opaque
    // WebGL sky paints over the footer whenever a scene is on
    <footer className="relative z-20 bg-footer-cocoa py-11 text-[15px] text-white/85">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <span className="font-display text-2xl font-extrabold text-white">
            Kheelona
          </span>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block rounded py-1.5 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-6 text-white/70">
          Wake-word listening. No open internet. You see everything.
        </p>
        {/* V3 (Apple-tier pass): the provenance line. "Designed by Apple in
            California" works because it is a fact stated plainly — this is
            ours, and it is the answer to "who is behind this toy". */}
        <p className="mt-2 text-white/70">Designed by parents in Bengaluru.</p>
        <div className="mt-5 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-5 text-white/60">
          <span>
            For partners and investors:{" "}
            <a
              href="https://kheelona.ai"
              className="inline-block rounded py-1 text-white/80 underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              kheelona.ai
            </a>
          </span>          {CONTACT_EMAIL ? (
            <span>
              {" · "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block rounded py-1 text-white/80 underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              >
                {CONTACT_EMAIL}
              </a>
            </span>
          ) : null}
  
        </div>
      </div>
    </footer>
  );
}
