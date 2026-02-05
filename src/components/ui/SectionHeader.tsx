// src/components/ui/SectionHeader.tsx

interface SectionHeaderProps {
  id?: string;
  subtitle?: string;
  title: string;
  className?: string;
  subtitleClassName?: string;
  titleClassName?: string;
}

/**
 * Reusable section header component
 * Combines subtitle + main heading with consistent styling
 * Used in: WhyChooseUs, ParentingGrowth, WhatsAppCommunity, TrustBadges, etc.
 */
export function SectionHeader({
  id = "",
  subtitle,
  title,
  className = "",
  subtitleClassName = "",
  titleClassName = "",
}: SectionHeaderProps) {
  return (
    <div id={id} className={`mb-6 ${className}`}>
      {subtitle && <p className={`subtitle text-center ${subtitleClassName}`}>{subtitle}</p>}
      <h2
        className={`mb-6 font-heading text-[24px] md:text-[44px] text-stroke-tangerine text-center ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}
