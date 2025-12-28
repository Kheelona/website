"use client";

import Link from "next/link";
import { Button, ButtonProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface LinkButtonProps extends Omit<ButtonProps, "asChild" | "variant"> {
  href: string;
  children: ReactNode;
  colorVariant?: "primary" | "secondary" | "outline";
}

export function LinkButton({
  href,
  children,
  size = "md",
  colorVariant = "primary",
  ...props
}: LinkButtonProps) {
  // Color variant-based styling using brand colors
  const variantStyles = {
    primary: {
      bg: "tangerine.500",
      color: "white",
      _hover: {
        bg: "tangerine.600",
        transform: "translateY(-3px)",
        boxShadow: "lg",
      },
    },
    secondary: {
      bg: "skyBlue.400",
      color: "white",
      _hover: {
        bg: "skyBlue.500",
        transform: "translateY(-3px)",
        boxShadow: "lg",
      },
    },
    outline: {
      bg: "transparent",
      color: "tangerine.500",
      border: "2px solid",
      borderColor: "tangerine.500",
      _hover: {
        bg: "tangerine.50",
        transform: "translateY(-3px)",
      },
    },
  };

  return (
    <Button
      asChild
      size={size}
      px={{ base: 6, md: 8 }}
      py={{ base: 3, md: 4 }}
      borderRadius="full"
      fontFamily="body"
      transition="all 0.3s"
      boxShadow={colorVariant === "primary" ? "0 4px 14px rgba(239, 118, 47, 0.4)" : "md"}
      {...variantStyles[colorVariant]}
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
