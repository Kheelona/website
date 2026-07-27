import { cn } from "@/lib/cn";

/** The typing conversation demo (revamp M2): generalizes the R11
 *  HeroConversation contract to any exchange. Server component, pure CSS
 *  choreography: the BASE state is the finished conversation, so no-JS,
 *  crawlers, reduced-motion, and phones all see it at rest; bubbles animate
 *  in (staggered) only for motion-friendly desktop visitors
 *  (.chat-demo-bubble in globals.css). Lumi's quoted toy speech keeps its
 *  natural contractions — same exemption class as Kheelu lines. */
export type ChatTurn = { who: "child" | "lumi"; text: string };

/** The founder-picked moon exchange (wireframe copy.json). */
export const MOON_EXCHANGE: readonly ChatTurn[] = [
  { who: "child", text: "Lumi, why is the moon following us?" },
  {
    who: "lumi",
    text: "It looks that way, doesn't it? The moon is very far away. Where are you off to?",
  },
  { who: "child", text: "To grandma's house!" },
  { who: "lumi", text: "Then the moon gets to meet her too." },
] as const;

export function ChatDemo({
  turns = MOON_EXCHANGE,
  className,
}: {
  turns?: readonly ChatTurn[];
  className?: string;
}) {
  return (
    <div
      role="log"
      aria-label="A sample conversation between a child and Lumi"
      className={cn(
        "flex flex-col gap-2.5 rounded-(--radius-card-lg) border border-line-soft bg-white/75 p-5",
        className,
      )}
    >
      {turns.map((t, i) => (
        <div
          key={i}
          className={cn(
            "chat-demo-bubble max-w-[92%] rounded-(--radius-card) px-4 py-3",
            t.who === "child" ? "self-start bg-cream" : "ml-auto self-end bg-cool",
          )}
          style={{ animationDelay: `${0.6 + i * 0.9}s` }}
        >
          <p className="mb-0.5 text-[12px] font-bold uppercase tracking-wider text-ink-muted">
            {t.who === "child" ? "Your child" : "Lumi"}
          </p>
          <p className="text-[16px] leading-snug text-ink">{t.text}</p>
        </div>
      ))}
    </div>
  );
}
