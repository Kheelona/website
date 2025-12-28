"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  List,
  Splitter,
  HStack,
} from "@chakra-ui/react";
import { MoveHorizontal } from "lucide-react";
import { useState } from "react";
import { LinkButton } from "@/components/ui/LinkButton";

const lumiWayBenefits = [
  "Multi language conversations that encourage children to speak freely.",
  "Screen-free, thoughtful play that reduces digital dependency",
  "Helps children express feelings and build emotional confidence",
  "Boosts vocabulary, verbal skills, and language exposure",
  "Grows with your child through evolving conversations",
];

const oldWayDrawbacks = [
  "The toy entertains, but doesn't actually engage or listen.",
  "Fun for five minutes, then ends up in the donation pile.",
  "Relies on loud noises and screens instead of imagination.",
  "Doesn't help the child express how they feel.",
  "It can't be used in new ways, so the child outgrows it fast.",
];

export function BeforeAfterSection() {
  const [sizes, setSizes] = useState([50, 50]);

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      bg="#F5F9FB"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="20%"
        right="5%"
        w={{ base: "80px", md: "150px" }}
        h={{ base: "80px", md: "150px" }}
        borderRadius="full"
        bg="rgba(80, 178, 213, 0.08)"
      />
      <Box
        position="absolute"
        bottom="15%"
        left="3%"
        w={{ base: "60px", md: "100px" }}
        h={{ base: "60px", md: "100px" }}
        borderRadius="full"
        bg="rgba(241, 162, 59, 0.08)"
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
              Lumi vs Others
            </Text>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              fontFamily="heading"
            >
              <Text as="span" color="gray.800">
                Why settle for less?
              </Text>{" "}
              <Text as="span" color="skyBlue.400">
                Upgrade to Lumi
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="body"
              color="gray.500"
            >
              Drag the slider to compare
            </Text>
          </VStack>

          {/* Interactive Splitter Comparison - Desktop */}
          <Box
            display={{ base: "none", lg: "block" }}
            w="full"
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="2xl"
          >
            <Splitter.Root
              panels={[
                { id: "lumi", minSize: 20 },
                { id: "old", minSize: 20 },
              ]}
              size={sizes}
              onResize={(details) => setSizes(details.size)}
              minH="500px"
            >
              {/* Lumi Way Panel */}
              <Splitter.Panel id="lumi">
                <Box
                  h="full"
                  layerStyle="gradient.lumiWay"
                  p={{ base: 6, md: 8 }}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Decorative */}
                  <Box
                    position="absolute"
                    top="-20px"
                    right="-20px"
                    w="100px"
                    h="100px"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                  />

                  <VStack align="flex-start" gap={6} h="full">
                    <VStack align="flex-start" gap={2}>
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontFamily="body"
                        color="whiteAlpha.800"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        The Smart Choice
                      </Text>
                      <Heading
                        as="h3"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontFamily="heading"
                        color="white"
                      >
                        Lumi Way
                      </Heading>
                    </VStack>

                    <List.Root gap={4}>
                      {lumiWayBenefits.map((benefit, index) => (
                        <List.Item
                          key={index}
                          display="flex"
                          alignItems="flex-start"
                          gap={3}
                        >
                          <Box
                            as="span"
                            bg="white"
                            color="skyBlue.400"
                            borderRadius="full"
                            w="24px"
                            h="24px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                            mt={1}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            ✓
                          </Box>
                          <Text
                            fontFamily="body"
                            color="white"
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            {benefit}
                          </Text>
                        </List.Item>
                      ))}
                    </List.Root>
                  </VStack>
                </Box>
              </Splitter.Panel>

              {/* Resize Trigger with Product Image */}
              <Splitter.ResizeTrigger
                id="lumi:old"
                bg="white"
                w="80px"
                _hover={{ bg: "gray.50" }}
                transition="background 0.2s"
              >
                <VStack gap={2} py={4}>
                  <Image
                    src="/images/before-after-toy.png"
                    alt="Lumi Toy"
                    maxH="120px"
                    objectFit="contain"
                    filter="drop-shadow(0 5px 15px rgba(0,0,0,0.2))"
                  />
                  <HStack gap={1} color="gray.500">
                    <MoveHorizontal size={20} />
                  </HStack>
                  <Text
                    fontSize="xs"
                    fontFamily="body"
                    color="gray.500"
                    textAlign="center"
                  >
                    Drag
                  </Text>
                </VStack>
              </Splitter.ResizeTrigger>

              {/* Old Way Panel */}
              <Splitter.Panel id="old">
                <Box
                  h="full"
                  layerStyle="gradient.oldWay"
                  p={{ base: 6, md: 8 }}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Decorative */}
                  <Box
                    position="absolute"
                    bottom="-20px"
                    left="-20px"
                    w="100px"
                    h="100px"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                  />

                  <VStack align="flex-start" gap={6} h="full">
                    <VStack align="flex-start" gap={2}>
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontFamily="body"
                        color="whiteAlpha.800"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        The Old Approach
                      </Text>
                      <Heading
                        as="h3"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontFamily="heading"
                        color="white"
                      >
                        Old Way
                      </Heading>
                    </VStack>

                    <List.Root gap={4}>
                      {oldWayDrawbacks.map((drawback, index) => (
                        <List.Item
                          key={index}
                          display="flex"
                          alignItems="flex-start"
                          gap={3}
                        >
                          <Box
                            as="span"
                            bg="white"
                            color="mutedOrange.400"
                            borderRadius="full"
                            w="24px"
                            h="24px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                            mt={1}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            ✗
                          </Box>
                          <Text
                            fontFamily="body"
                            color="white"
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            {drawback}
                          </Text>
                        </List.Item>
                      ))}
                    </List.Root>
                  </VStack>
                </Box>
              </Splitter.Panel>
            </Splitter.Root>
          </Box>

          {/* Mobile Stacked View */}
          <VStack display={{ base: "flex", lg: "none" }} gap={6} w="full">
            {/* Lumi Way Card */}
            <Box
              w="full"
              layerStyle="gradient.lumiWay"
              borderRadius="3xl"
              p={{ base: 6, md: 8 }}
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-20px"
                right="-20px"
                w="100px"
                h="100px"
                borderRadius="full"
                bg="whiteAlpha.100"
              />

              <VStack align="flex-start" gap={6}>
                <VStack align="flex-start" gap={2}>
                  <Text
                    fontSize="xs"
                    fontFamily="body"
                    color="whiteAlpha.800"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    The Smart Choice
                  </Text>
                  <Heading
                    as="h3"
                    fontSize="2xl"
                    fontFamily="heading"
                    color="white"
                  >
                    Lumi Way
                  </Heading>
                </VStack>

                <List.Root gap={4}>
                  {lumiWayBenefits.map((benefit, index) => (
                    <List.Item
                      key={index}
                      display="flex"
                      alignItems="flex-start"
                      gap={3}
                    >
                      <Box
                        as="span"
                        bg="white"
                        color="skyBlue.400"
                        borderRadius="full"
                        w="24px"
                        h="24px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        mt={1}
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        ✓
                      </Box>
                      <Text fontFamily="body" color="white" fontSize="sm">
                        {benefit}
                      </Text>
                    </List.Item>
                  ))}
                </List.Root>
              </VStack>
            </Box>

            {/* Mobile Image */}
            <Image
              src="/images/before-after-toy.png"
              alt="Lumi Toy"
              maxH="150px"
              objectFit="contain"
              filter="drop-shadow(0 10px 20px rgba(0,0,0,0.1))"
            />

            {/* Old Way Card */}
            <Box
              w="full"
              layerStyle="gradient.oldWay"
              borderRadius="3xl"
              p={{ base: 6, md: 8 }}
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                bottom="-20px"
                left="-20px"
                w="100px"
                h="100px"
                borderRadius="full"
                bg="whiteAlpha.100"
              />

              <VStack align="flex-start" gap={6}>
                <VStack align="flex-start" gap={2}>
                  <Text
                    fontSize="xs"
                    fontFamily="body"
                    color="whiteAlpha.800"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    The Old Approach
                  </Text>
                  <Heading
                    as="h3"
                    fontSize="2xl"
                    fontFamily="heading"
                    color="white"
                  >
                    Old Way
                  </Heading>
                </VStack>

                <List.Root gap={4}>
                  {oldWayDrawbacks.map((drawback, index) => (
                    <List.Item
                      key={index}
                      display="flex"
                      alignItems="flex-start"
                      gap={3}
                    >
                      <Box
                        as="span"
                        bg="white"
                        color="mutedOrange.400"
                        borderRadius="full"
                        w="24px"
                        h="24px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        mt={1}
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        ✗
                      </Box>
                      <Text fontFamily="body" color="white" fontSize="sm">
                        {drawback}
                      </Text>
                    </List.Item>
                  ))}
                </List.Root>
              </VStack>
            </Box>
          </VStack>

          {/* CTA Button */}
          <LinkButton href="/product" size="lg">
            Choose Lumi Today
          </LinkButton>
        </VStack>
      </Container>
    </Box>
  );
}
