"use client";

import Link from "next/link";
import { ReactNode } from "react";

type ColorVariant = "primary" | "secondary" | "outline";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  colorVariant?: ColorVariant;
  className?: string;
}

export function LinkButton({
  href,
  children,
  colorVariant = "primary",
  className = "",
}: LinkButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-6 py-3 md:px-8 md:py-4 font-semibold transition-all duration-300 hover:-translate-y-0.5";

  const variantStyles: Record<ColorVariant, string> = {
    primary:
      "bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:bg-orange-600",
    secondary: "bg-sky-400 text-white shadow-md hover:bg-sky-500",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-50",
  };

  return (
    <Link href={href} className={`${baseStyles} ${variantStyles[colorVariant]} ${className}`}>
      {children}
    </Link>
  );
}
