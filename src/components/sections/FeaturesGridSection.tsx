"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Grid,
  Image,
} from "@chakra-ui/react";
import { LinkButton } from "@/components/ui/LinkButton";

const features = [
  { name: "Curiosity", image: "/images/features/curiosity.png", color: "#50B2D5" },
  { name: "Bed Time Stories", image: "/images/features/bedtime-stories.png", color: "#EF762F" },
  { name: "Language Skills", image: "/images/features/language-skills.png", color: "#F1A23B" },
  { name: "Creativity", image: "/images/features/creativity.png", color: "#50B2D5" },
  { name: "Vocab", image: "/images/features/vocab.png", color: "#EF762F" },
  { name: "Emotional Health", image: "/images/features/emotional-health.png", color: "#F1A23B" },
  { name: "Discipline", image: "/images/features/discipline.png", color: "#50B2D5" },
  { name: "Manners", image: "/images/features/manners.png", color: "#EF762F" },
];

export function FeaturesGridSection() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      bg="white"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="-5%"
        w={{ base: "150px", md: "300px" }}
        h={{ base: "150px", md: "300px" }}
        borderRadius="full"
        bg="rgba(80, 178, 213, 0.04)"
      />
      <Box
        position="absolute"
        bottom="5%"
        left="-5%"
        w={{ base: "120px", md: "250px" }}
        h={{ base: "120px", md: "250px" }}
        borderRadius="full"
        bg="rgba(239, 118, 47, 0.04)"
      />

      <Container maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
        <VStack gap={{ base: 10, md: 14 }}>
          {/* Section Header */}
          <VStack gap={4} textAlign="center">
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="body"
              color="tangerine.500"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              The Features
            </Text>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              fontFamily="heading"
            >
              <Text as="span" color="gray.800">
                What Lumi can do for
              </Text>{" "}
              <Text as="span" color="skyBlue.400">
                your child?
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="body"
              color="gray.500"
              maxW="600px"
            >
              Lumi is an AI Friend that helps in improving essential skills
            </Text>
          </VStack>

          {/* Features Grid */}
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={{ base: 4, md: 6 }}
            w="full"
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                position="relative"
                borderRadius="2xl"
                overflow="hidden"
                bg="linear-gradient(135deg, #F8FBFC 0%, #EEF6F9 100%)"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "xl",
                }}
                transition="all 0.3s"
                cursor="pointer"
                role="group"
              >
                {/* Feature Image */}
                <Box position="relative" pb="130%">
                  <Image
                    src={feature.image}
                    alt={feature.name}
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    h="full"
                    objectFit="cover"
                    _groupHover={{
                      transform: "scale(1.05)",
                    }}
                    transition="transform 0.4s"
                  />

                  {/* Gradient Overlay */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="60%"
                    bgGradient="linear(to-t, blackAlpha.800, blackAlpha.300, transparent)"
                  />

                  {/* Feature Name */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={4}
                    textAlign="center"
                  >
                    <Text
                      fontFamily="heading"
                      fontSize={{ base: "md", md: "lg", lg: "xl" }}
                      color="white"
                      textShadow="1px 1px 3px rgba(0,0,0,0.5)"
                    >
                      {feature.name}
                    </Text>
                  </Box>

                  {/* Hover accent */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="4px"
                    bg={feature.color}
                    transform="scaleX(0)"
                    _groupHover={{
                      transform: "scaleX(1)",
                    }}
                    transition="transform 0.3s"
                  />
                </Box>
              </Box>
            ))}
          </Grid>

          {/* CTA Button */}
          <LinkButton href="/product" size="lg">
            Explore All Features
          </LinkButton>
        </VStack>
      </Container>
    </Box>
  );
}
