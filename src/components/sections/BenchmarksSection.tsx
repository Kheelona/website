"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Grid,
  Flex,
  Image,
} from "@chakra-ui/react";
import { LinkButton } from "@/components/ui/LinkButton";

const benchmarks = [
  {
    icon: "🔒",
    title: "Chat Privacy",
    description: "No one can hear what you say.",
    color: "#50B2D5",
  },
  {
    icon: "🌍",
    title: "10+ Languages",
    description: "Speaks your regional language",
    color: "#EF762F",
  },
  {
    icon: "📵",
    title: "No Screens",
    description: "Proven reduction in screen time.",
    color: "#F1A23B",
  },
];

export function BenchmarksSection() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      position="relative"
      overflow="hidden"
      layerStyle="gradient.benchmarks"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        w={{ base: "100px", md: "200px" }}
        h={{ base: "100px", md: "200px" }}
        borderRadius="full"
        bg="whiteAlpha.100"
      />
      <Box
        position="absolute"
        bottom="15%"
        right="10%"
        w={{ base: "80px", md: "150px" }}
        h={{ base: "80px", md: "150px" }}
        borderRadius="full"
        bg="whiteAlpha.100"
      />
      <Box
        position="absolute"
        top="50%"
        right="30%"
        w={{ base: "40px", md: "80px" }}
        h={{ base: "40px", md: "80px" }}
        borderRadius="full"
        bg="whiteAlpha.50"
      />

      <Container maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 10, lg: 12 }}
        >
          {/* Content */}
          <VStack
            align={{ base: "center", lg: "flex-start" }}
            textAlign={{ base: "center", lg: "left" }}
            gap={8}
            flex={1}
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              gap={4}
            >
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontFamily="body"
                color="whiteAlpha.800"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                The Benchmarks
              </Text>
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                fontFamily="heading"
                color="white"
              >
                Why choose{" "}
                <Text as="span" color="tangerine.500">
                  Kheelona?
                </Text>
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontFamily="body"
                color="whiteAlpha.900"
                maxW="500px"
              >
                We set the standard for safe, engaging, and educational AI toys
              </Text>
            </VStack>

            {/* Benchmark Items */}
            <Grid
              templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
              gap={4}
              w="full"
            >
              {benchmarks.map((item, index) => (
                <Box
                  key={index}
                  bg="white"
                  borderRadius="2xl"
                  p={6}
                  textAlign="center"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl",
                  }}
                  transition="all 0.3s"
                  position="relative"
                  overflow="hidden"
                >
                  {/* Accent bar */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="4px"
                    bg={item.color}
                  />

                  <VStack gap={3}>
                    <Box
                      bg={`${item.color}15`}
                      w="60px"
                      h="60px"
                      borderRadius="xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="2xl">{item.icon}</Text>
                    </Box>
                    <Heading
                      as="h3"
                      fontSize={{ base: "lg", md: "xl" }}
                      fontFamily="heading"
                      color="gray.800"
                    >
                      {item.title}
                    </Heading>
                    <Text
                      fontFamily="body"
                      color="gray.600"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {item.description}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </Grid>

            {/* CTA Button */}
            <LinkButton
              href="/product"
              size="lg"
              bg="white"
              color="skyBlue.400"
              _hover={{
                bg: "gray.100",
                transform: "translateY(-3px)",
              }}
            >
              Learn More
            </LinkButton>
          </VStack>

          {/* Product Image */}
          <Box
            flex={1}
            display={{ base: "none", lg: "flex" }}
            justifyContent="center"
            position="relative"
          >
            {/* Glow effect */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="350px"
              h="350px"
              borderRadius="full"
              bg="radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
            />
            <Image
              src="/images/product-lumi-main.png"
              alt="Lumi Toy"
              maxH="450px"
              objectFit="contain"
              filter="drop-shadow(0 20px 40px rgba(0,0,0,0.3))"
              position="relative"
              zIndex={1}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
