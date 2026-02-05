// src/components/ui/ListItemWithIcon.tsx

interface ListItemWithIconProps {
  /**
   * Icon component or element to display
   */
  icon: React.ReactNode;

  /**
   * Text content of the list item
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes to apply to the list item
   */
  className?: string;

  /**
   * CSS classes for the icon wrapper
   */
  iconClassName?: string;
}

/**
 * Reusable list item with icon component
 * Handles layout, spacing, and icon sizing consistently
 * Used in: WhyChooseUs (both Lumi Way and Old Way lists)
 */
export function ListItemWithIcon({
  icon,
  children,
  className = "",
  iconClassName = "",
}: ListItemWithIconProps) {
  return (
    <li className={`list-item ${className}`}>
      <div className={`icon-list-with-margin ${iconClassName}`}>{icon}</div>
      <span>{children}</span>
    </li>
  );
}
