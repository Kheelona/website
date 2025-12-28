"use client";

import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Text,
  Image,
  Input,
  Button,
  Separator,
  Grid,
} from "@chakra-ui/react";
import Link from "next/link";

const footerLinks = [
  { text: "Privacy Policy", url: "/privacy-policy" },
  { text: "Accessibility Statement", url: "/accessibility" },
  { text: "Shipping Policy", url: "/shipping-policy" },
  { text: "Terms & Conditions", url: "/terms-conditions" },
  { text: "Refund Policy", url: "/refund-policy" },
];

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/kheelona",
    icon: "📸",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/kheelona",
    icon: "📘",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/kheelona",
    icon: "🐦",
  },
];

export function Footer() {
  return (
    <Box as="footer" bg="#1a1a1a" color="white" pt={{ base: 12, md: 16 }} pb={6}>
      <Container maxW="1400px">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "1.5fr 1fr 1fr 1.5fr",
          }}
          gap={{ base: 10, md: 8 }}
          mb={12}
        >
          {/* Logo and Description */}
          <VStack align="flex-start" gap={6}>
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Kheelona Logo"
                h="60px"
                objectFit="contain"
                filter="brightness(0) invert(1)"
              />
            </Link>
            <Text fontFamily="body" color="gray.400" fontSize="sm" maxW="300px">
              Kheelona creates AI-powered educational toys that help children learn, grow, and
              develop essential skills through play.
            </Text>
            <HStack gap={4}>
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                  <Box
                    bg="whiteAlpha.100"
                    p={2}
                    borderRadius="full"
                    transition="background 0.2s"
                    _hover={{ bg: "whiteAlpha.200" }}
                  >
                    <Text fontSize="xl">{social.icon}</Text>
                  </Box>
                </Link>
              ))}
            </HStack>
          </VStack>

          {/* Quick Links */}
          <VStack align="flex-start" gap={4}>
            <Text fontFamily="heading" fontSize="xl" color="tangerine.500">
              Quick Links
            </Text>
            <VStack align="flex-start" gap={2}>
              {footerLinks.slice(0, 3).map((link) => (
                <Link key={link.text} href={link.url}>
                  <Text
                    fontFamily="body"
                    color="gray.400"
                    fontSize="sm"
                    transition="color 0.2s"
                    _hover={{ color: "skyBlue.400" }}
                  >
                    {link.text}
                  </Text>
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Legal */}
          <VStack align="flex-start" gap={4}>
            <Text fontFamily="heading" fontSize="xl" color="tangerine.500">
              Legal
            </Text>
            <VStack align="flex-start" gap={2}>
              {footerLinks.slice(3).map((link) => (
                <Link key={link.text} href={link.url}>
                  <Text
                    fontFamily="body"
                    color="gray.400"
                    fontSize="sm"
                    transition="color 0.2s"
                    _hover={{ color: "skyBlue.400" }}
                  >
                    {link.text}
                  </Text>
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Newsletter */}
          <VStack align="flex-start" gap={4}>
            <Text fontFamily="heading" fontSize="xl" color="tangerine.500">
              Subscribe to Our Newsletter
            </Text>
            <VStack w="full" gap={3}>
              <Input
                placeholder="Enter Your Email"
                bg="whiteAlpha.100"
                border="none"
                borderRadius="xl"
                fontFamily="body"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  bg: "whiteAlpha.200",
                  boxShadow: "0 0 0 1px",
                  boxShadowColor: "skyBlue.400",
                }}
              />
              <Button
                w="full"
                bg="tangerine.500"
                color="white"
                px={6}
                py={5}
                borderRadius="xl"
                fontFamily="body"
                _hover={{ bg: "tangerine.600" }}
              >
                Subscribe
              </Button>
            </VStack>
            <VStack align="flex-start" gap={2} mt={4}>
              <Text fontFamily="body" color="gray.400" fontSize="sm">
                Contact Us: +91 9896597969
              </Text>
              <HStack>
                <Text fontFamily="body" color="gray.400" fontSize="sm">
                  Mail ID:{" "}
                </Text>
                <Link href="mailto:connect@kheelona.com">
                  <Text
                    fontFamily="body"
                    color="skyBlue.400"
                    fontSize="sm"
                    _hover={{ textDecoration: "underline" }}
                  >
                    connect@kheelona.com
                  </Text>
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </Grid>

        <Separator borderColor="whiteAlpha.200" />

        {/* Copyright */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          pt={6}
          gap={4}
        >
          <Text fontFamily="body" color="gray.500" fontSize="sm">
            © 2026 by Kheelona. All rights reserved.
          </Text>
          <Text fontFamily="body" color="gray.500" fontSize="sm">
            Made with ❤️ in India
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
