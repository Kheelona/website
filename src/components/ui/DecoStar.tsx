// src/components/ui/DecoStar.tsx
interface DecoStarProps {
  /**
   * Position classes like "left-[12%] bottom-[28%]"
   */
  position: string;

  /**
   * Color variant - tangerine or muted-orange
   * @default "tangerine"
   */
  color?: "tangerine" | "muted-orange";

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reusable decorative star element
 * Used for scattered star decorations throughout sections
 * Used in: HeroSection, InteractiveLearning, ParentingGrowth
 */
export function DecoStar({ position, color = "tangerine", className = "" }: DecoStarProps) {
  const baseClass = color === "tangerine" ? "star-tangerine" : "star-muted-orange";
  return <span className={`${baseClass} ${position} ${className}`}>✦</span>;
}
