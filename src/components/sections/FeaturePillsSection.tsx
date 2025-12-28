"use client";

import { Box, Container, Flex, Text, HStack } from "@chakra-ui/react";

const featurePills = [
  { text: "Screen-Free Fun", icon: "📵" },
  { text: "Voice-Powered Chat", icon: "🎤" },
  { text: "Endless Conversations", icon: "💬" },
  { text: "3+ Ages", icon: "👶" },
  { text: "WiFi Connected Educational Playtime", icon: "📶" },
];

export function FeaturePillsSection() {
  return (
    <Box as="section" py={6} bg="brand.light">
      <Container maxW="1400px">
        <Flex wrap="wrap" justify="center" gap={{ base: 3, md: 4 }}>
          {featurePills.map((feature, index) => (
            <HStack
              key={index}
              bg="white"
              px={{ base: 4, md: 6 }}
              py={3}
              borderRadius="full"
              boxShadow="sm"
              _hover={{
                boxShadow: "md",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
            >
              <Text fontSize={{ base: "lg", md: "xl" }}>{feature.icon}</Text>
              <Text
                fontFamily="body"
                fontSize={{ base: "sm", md: "md" }}
                color="gray.700"
                fontWeight="medium"
              >
                {feature.text}
              </Text>
            </HStack>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}
