"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Tag,
  Image,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

const features = [
  { text: "AI Powered", icon: "🤖" },
  { text: "No screens", icon: "📵" },
  { text: "Child Safe", icon: "🛡️" },
  { text: "10+ Languages", icon: "🌍" },
];

export function HeroSection() {
  return (
    <Box
      as="section"
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      overflow="hidden"
      pt={{ base: "100px", md: "80px" }}
      pb={{ base: 10, md: 0 }}
      layerStyle="gradient.hero"
    >
      {/* Background Video (optional enhancement) */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        overflow="hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.45,
          }}
        >
          <source src="/videos/lumi-promo.mp4" type="video/mp4" />
        </video>
      </Box>

      {/* Overlay for better text readability */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        layerStyle="gradient.heroOverlay"
        zIndex={1}
      />

      <Container maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} position="relative" zIndex={2}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 8, lg: 12 }}
        >
          {/* Left Content */}
          <VStack
            align={{ base: "center", lg: "flex-start" }}
            gap={6}
            maxW={{ base: "100%", lg: "55%" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontFamily="heading"
              color="white"
              lineHeight="1.1"
              textShadow="2px 2px 4px rgba(0,0,0,0.3)"
            >
              Can your toy{" "}
              <Text as="span" color="mutedOrange.400">
                talk
              </Text>{" "}
              ?
            </Heading>

            <HStack gap={2} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                fontFamily="heading"
                color="white"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
              >
                Meet
              </Heading>
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                fontFamily="heading"
                color="tangerine.500"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
              >
                LUMI !
              </Heading>
            </HStack>

            <Text
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color="white"
              fontFamily="body"
              textShadow="1px 1px 2px rgba(0,0,0,0.3)"
              maxW="500px"
            >
              Hii.. Friend - The Most Intelligent Toy for your Kid
            </Text>

            {/* Feature Pills - Using Chakra UI Tag */}
            <HStack flexWrap="wrap" gap={3} justify={{ base: "center", lg: "flex-start" }}>
              {features.map((feature) => (
                <Tag.Root
                  key={feature.text}
                  size="lg"
                  variant="solid"
                  bg="white"
                  color="gray.800"
                  borderRadius="full"
                  boxShadow="md"
                  px={4}
                  py={2}
                >
                  <Tag.StartElement>{feature.icon}</Tag.StartElement>
                  <Tag.Label fontFamily="body" fontSize={{ base: "sm", md: "md" }}>
                    {feature.text}
                  </Tag.Label>
                </Tag.Root>
              ))}
            </HStack>

            {/* CTA Button - Using Chakra UI Button */}
            <Button
              asChild
              size="lg"
              bg="tangerine.500"
              color="white"
              borderRadius="full"
              fontFamily="body"
              px={{ base: 6, md: 8 }}
              py={{ base: 3, md: 4 }}
              boxShadow="0 4px 14px rgba(239, 118, 47, 0.4)"
              _hover={{
                bg: "tangerine.600",
                transform: "translateY(-3px)",
                boxShadow: "lg",
              }}
              transition="all 0.3s"
            >
              <Link href="/product">Pre-Order now</Link>
            </Button>
          </VStack>

          {/* Right - Product Image */}
          <Box
            display={{ base: "block", lg: "block" }}
            maxW={{ base: "320px", md: "400px", lg: "500px" }}
            position="relative"
            className="float-animation"
          >
            <Image
              src="/images/lifestyle/all-colors-group-2.jpg"
              alt="Lumi family - AI-powered talking toys in Pink, Blue, and Green"
              w="full"
              h="auto"
              objectFit="contain"
              borderRadius="2xl"
              filter="drop-shadow(0 20px 40px rgba(0,0,0,0.3))"
              _hover={{
                transform: "scale(1.03)",
              }}
              transition="transform 0.5s ease"
            />
            {/* Decorative badges - Using Chakra UI Tag */}
            <Tag.Root
              position="absolute"
              top={{ base: "-10px", md: "-15px" }}
              right={{ base: "-10px", md: "-15px" }}
              size="md"
              variant="solid"
              bg="tangerine.500"
              color="white"
              borderRadius="full"
              boxShadow="lg"
              transform="rotate(15deg)"
              className="pulse-animation"
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
            >
              <Tag.Label fontFamily="body" fontSize={{ base: "xs", md: "sm" }}>
                3 Colors!
              </Tag.Label>
            </Tag.Root>
            <Tag.Root
              position="absolute"
              bottom={{ base: "-10px", md: "-15px" }}
              left={{ base: "-10px", md: "-15px" }}
              size="md"
              variant="solid"
              bg="skyBlue.400"
              color="white"
              borderRadius="full"
              boxShadow="lg"
              transform="rotate(-10deg)"
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
            >
              <Tag.Label fontFamily="body" fontSize={{ base: "xs", md: "sm" }}>
                AI Powered!
              </Tag.Label>
            </Tag.Root>
          </Box>
        </Flex>

        {/* Scroll Indicator */}
        <Box
          position="absolute"
          bottom={{ base: "20px", md: "40px" }}
          left="50%"
          transform="translateX(-50%)"
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          alignItems="center"
          gap={2}
          className="bounce-arrow"
        >
          <Text
            fontFamily="body"
            fontSize="sm"
            color="whiteAlpha.800"
          >
            Scroll to explore
          </Text>
          <Box
            w="30px"
            h="50px"
            border="2px solid"
            borderColor="whiteAlpha.600"
            borderRadius="full"
            position="relative"
          >
            <Box
              position="absolute"
              top="8px"
              left="50%"
              transform="translateX(-50%)"
              w="6px"
              h="10px"
              bg="white"
              borderRadius="full"
              animation="bounce 1.5s ease-in-out infinite"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
