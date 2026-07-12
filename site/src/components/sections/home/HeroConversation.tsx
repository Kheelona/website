import { cn } from "@/lib/cn";

/** R11 hero device (founder pick: "show the conversation"): the hero
 *  DEMONSTRATES Lumi with one real exchange instead of describing it.
 *  The dialogue is the founder-shipped moon exchange from /products/lumi
 *  (Lumi's reply trimmed by one sentence for hero space — sanctioned
 *  deviation, copy-reference R11). Product speech keeps its natural
 *  contractions like the /products/lumi demo — quoted character speech,
 *  same register as the KheeluSays exemption.
 *  Server component on purpose: the entrance is pure CSS (globals.css
 *  .convo-*), so nothing hydrates next to the LCP image, and the SSR HTML
 *  carries the full exchange for crawlers, no-JS, and reduced-motion. */
const EXCHANGE = [
  { who: "Your child", text: "Lumi, why is the moon following us?" },
  {
    who: "Lumi",
    text: "It looks that way, doesn't it? The moon is very far away. Where are you off to?",
  },
] as const;

export function HeroConversation({ className }: { className?: string }) {
  return (
    <div
      role="log"
      aria-label="A sample conversation between a child and Lumi"
      className={cn(
        "flex flex-col gap-2.5 rounded-(--radius-card-lg) border border-line-soft bg-white/75 p-5",
        className,
      )}
    >
      <div className="convo-bubble-1 max-w-[92%] self-start rounded-(--radius-card) bg-cream px-4 py-3">
        <p className="mb-0.5 text-[12px] font-bold uppercase tracking-wider text-ink-muted">
          {EXCHANGE[0].who}
        </p>
        <p className="text-[16px] leading-snug text-ink">{EXCHANGE[0].text}</p>
      </div>
      <div className="relative">
        {/* transient typing dots — absolute so the reply's slot never
            shifts; ends hidden in every mode (globals.css) */}
        <div
          aria-hidden="true"
          className="convo-dots absolute right-0 top-0 flex items-center gap-1 rounded-(--radius-card) bg-cool px-4 py-3"
        >
          <span className="convo-dot h-1.5 w-1.5 rounded-full bg-ink-muted" />
          <span className="convo-dot h-1.5 w-1.5 rounded-full bg-ink-muted" />
          <span className="convo-dot h-1.5 w-1.5 rounded-full bg-ink-muted" />
        </div>
        <div className="convo-bubble-2 ml-auto max-w-[92%] rounded-(--radius-card) bg-cool px-4 py-3">
          <p className="mb-0.5 text-[12px] font-bold uppercase tracking-wider text-ink-muted">
            {EXCHANGE[1].who}
          </p>
          <p className="text-[16px] leading-snug text-ink">{EXCHANGE[1].text}</p>
        </div>
      </div>
    </div>
  );
}
