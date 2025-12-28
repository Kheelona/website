"use client";

import Link from "next/link";
import { Button, ButtonProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface LinkButtonProps extends Omit<ButtonProps, "asChild"> {
  href: string;
  children: ReactNode;
}

export function LinkButton({
  href,
  children,
  size = "md",
  ...props
}: LinkButtonProps) {
  return (
    <Button
      asChild
      size={size}
      bg="tangerine.500"
      color="white"
      px={{ base: 6, md: 8 }}
      py={{ base: 3, md: 4 }}
      borderRadius="full"
      fontFamily="body"
      _hover={{
        bg: "tangerine.600",
        transform: "translateY(-3px)",
        boxShadow: "lg",
      }}
      transition="all 0.3s"
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
