"use client";

import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Drawer,
  Portal,
  CloseButton,
  VStack,
  Button,
  Text,
} from "@chakra-ui/react";
import { Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
  { label: "About", href: "#about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="white"
      boxShadow="sm"
      py={3}
    >
      <Container maxW="1400px" px={{ base: 4, md: 8 }}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image
              src="/images/logo.png"
              alt="Kheelona Logo"
              h={{ base: "40px", md: "50px" }}
              objectFit="contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <HStack
            gap={8}
            display={{ base: "none", md: "flex" }}
            fontFamily="body"
          >
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <Text
                  fontSize="lg"
                  fontWeight={500}
                  color="gray.600"
                  transition="color 0.2s"
                  _hover={{ color: "tangerine.500" }}
                >
                  {link.label}
                </Text>
              </Link>
            ))}
          </HStack>

          {/* CTA Button */}
          <HStack gap={4}>
            <Button
              asChild
              bg="tangerine.500"
              color="white"
              px={{ base: 4, md: 6 }}
              py={{ base: 2, md: 3 }}
              borderRadius="full"
              fontFamily="body"
              fontSize={{ base: "sm", md: "md" }}
              _hover={{
                bg: "tangerine.600",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
            >
              <Link href="/product">Pre-Order now</Link>
            </Button>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open menu"
              variant="ghost"
              onClick={() => setIsOpen(true)}
              size="lg"
            >
              <Menu size={24} />
            </IconButton>
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} placement="end">
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="white" maxW="300px">
              <Drawer.Header borderBottomWidth="1px">
                <Drawer.Title fontFamily="heading" color="tangerine.500">
                  Menu
                </Drawer.Title>
                <Drawer.CloseTrigger asChild position="absolute" top={3} right={3}>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>
                <VStack align="stretch" gap={4} py={4}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Text
                        fontSize="xl"
                        fontFamily="body"
                        color="gray.600"
                        py={2}
                        _hover={{ color: "tangerine.500" }}
                      >
                        {link.label}
                      </Text>
                    </Link>
                  ))}
                  <Button
                    asChild
                    bg="tangerine.500"
                    color="white"
                    w="full"
                    px={6}
                    py={6}
                    borderRadius="full"
                    fontFamily="body"
                    mt={4}
                    _hover={{ bg: "tangerine.600" }}
                  >
                    <Link href="/product">Pre-Order now</Link>
                  </Button>
                </VStack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
}
