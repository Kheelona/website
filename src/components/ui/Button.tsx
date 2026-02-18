// src/components/ui/Button.tsx
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "link-round" | "green";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  /**
   * Visual variant/style of the button
   * @default "primary"
   */
  variant?: ButtonVariant;

  /**
   * Size variant
   * @default "md"
   */
  size?: ButtonSize;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reusable button component with multiple variants
 * Ensures consistency across all CTA buttons
 * Replaces inline button styling throughout components
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const getVariantClasses = (): string => {
    switch (variant) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "link-round":
        return "btn-link-round";
      case "green":
        return "btn-green";
      default:
        return "btn-primary";
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-10 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  // For primary and secondary, size is built into variant
  const sizeClass = variant === "primary" || variant === "secondary" ? "" : getSizeClasses();

  return (
    <button
      className={`${getVariantClasses()} ${sizeClass} ${className} cursor-pointer font-bold transition-colors duration-300`}
      {...props}
    >
      {children}
    </button>
  );
}
