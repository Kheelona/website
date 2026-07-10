import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/site";

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
                  <Link href={l.href} className="transition-colors hover:text-white">
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
        <div className="mt-5 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-5 text-white/60">
          <span>
            For partners and investors:{" "}
            <a
              href="https://kheelona.ai"
              className="text-white/80 underline transition-colors hover:text-white"
            >
              kheelona.ai
            </a>
          </span>
          {/* TODO(claims-contact): add the contact email here once the founder
              confirms it. Never render a "pending" note publicly. */}
        </div>
      </div>
    </footer>
  );
}
