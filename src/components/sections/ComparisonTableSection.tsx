"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Table,
  Image,
  Flex,
  Float,
  Card,
  Tag,
  HStack,
  Grid,
} from "@chakra-ui/react";
import { Check, X, Minus } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";

const comparisonData = [
  {
    category: "Interaction",
    lumi: "Talks, listens, and replies meaningfully.",
    softToys: "Stays silent. Only imaginary play.",
    screens: "One-way passive watching.",
  },
  {
    category: "Language",
    lumi: "Speaks your mother tongue (Hindi, Tamil, etc.).",
    softToys: "Does not speak.",
    screens: "Mostly English or random content.",
  },
  {
    category: "Growth",
    lumi: "Remembers your child and learns new things.",
    softToys: "Stays the same forever.",
    screens: "Endless scrolling, no real learning.",
  },
  {
    category: "Safety",
    lumi: "100% Screen-free and Child-safe.",
    softToys: "Safe, but gets boring quickly.",
    screens: "High risk of addiction and eye strain.",
  },
  {
    category: "Realism",
    lumi: "A true friend that builds emotional bonds.",
    softToys: "A cuddle buddy, but not a friend.",
    screens: "Isolates the child from the real world.",
  },
];

export function ComparisonTableSection() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      bg="bg.secondary"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box
        layerStyle="decorative.circleSkyBlue"
        top="5%"
        left="3%"
        w={{ base: "80px", md: "150px" }}
        h={{ base: "80px", md: "150px" }}
      />
      <Box
        layerStyle="decorative.circleTangerine"
        bottom="10%"
        right="5%"
        w={{ base: "60px", md: "120px" }}
        h={{ base: "60px", md: "120px" }}
      />

      <Container maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} position="relative" zIndex={2}>
        <VStack gap={{ base: 10, md: 14 }}>
          {/* Section Header with Float for Product Image */}
          <Box position="relative" w="full">
            <VStack gap={4} textAlign="center" w="full">
              <Text textStyle="section.label">Comparison</Text>
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                fontFamily="heading"
              >
                <Text as="span" color="skyBlue.400">
                  Lumi
                </Text>{" "}
                <Text as="span" color="gray.800">
                  vs Others
                </Text>
              </Heading>
              <Text textStyle="section.description" maxW="500px">
                Here&apos;s why Lumi is the future of Educational Toys.
              </Text>
            </VStack>

            {/* Float positioned product image - Desktop only */}
            <Float
              placement="middle-end"
              offsetX={{ base: "0", lg: "-20px", xl: "20px" }}
              display={{ base: "none", lg: "block" }}
            >
              <Image
                src="/images/product-lumi-secondary.png"
                alt="Lumi Toy"
                maxW={{ lg: "160px", xl: "200px" }}
                objectFit="contain"
                filter="drop-shadow(0 10px 20px rgba(0,0,0,0.15))"
                transform="rotate(-5deg)"
              />
            </Float>
          </Box>

          {/* Desktop: Comparison Table */}
          <Box w="full" display={{ base: "none", md: "block" }}>
            <Card.Root bg="white" borderRadius="2xl" boxShadow="xl" overflow="hidden">
              <Card.Body p={0}>
                <Table.Root size="lg" variant="outline">
                  <Table.Header>
                    <Table.Row bg="gray.50">
                      <Table.ColumnHeader
                        fontFamily="body"
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.500"
                        w="18%"
                        py={5}
                        px={6}
                      >
                        Feature
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontFamily="heading"
                        fontSize={{ base: "md", md: "lg" }}
                        color="skyBlue.400"
                        textAlign="center"
                        py={5}
                        px={4}
                      >
                        <VStack gap={1}>
                          <HStack gap={2} justify="center">
                            <Tag.Root
                              size="sm"
                              variant="subtle"
                              bg="skyBlue.100"
                              color="skyBlue.700"
                              borderRadius="full"
                              px={2}
                              py={1}
                            >
                              <Tag.Label fontSize="xs">Best</Tag.Label>
                            </Tag.Root>
                            <Text>Lumi</Text>
                          </HStack>
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            fontFamily="body"
                            fontWeight="normal"
                          >
                            The Future
                          </Text>
                        </VStack>
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontFamily="heading"
                        fontSize={{ base: "md", md: "lg" }}
                        color="gray.500"
                        textAlign="center"
                        py={5}
                        px={4}
                      >
                        <VStack gap={1}>
                          <Text>Soft Toys</Text>
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            fontFamily="body"
                            fontWeight="normal"
                          >
                            The Past
                          </Text>
                        </VStack>
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontFamily="heading"
                        fontSize={{ base: "md", md: "lg" }}
                        color="red.400"
                        textAlign="center"
                        py={5}
                        px={4}
                      >
                        <VStack gap={1}>
                          <HStack gap={2} justify="center">
                            <Tag.Root
                              size="sm"
                              variant="subtle"
                              bg="red.100"
                              color="red.600"
                              borderRadius="full"
                              px={2}
                              py={1}
                            >
                              <Tag.Label fontSize="xs">Avoid</Tag.Label>
                            </Tag.Root>
                            <Text>Screens</Text>
                          </HStack>
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            fontFamily="body"
                            fontWeight="normal"
                          >
                            The Problem
                          </Text>
                        </VStack>
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {comparisonData.map((row, index) => (
                      <Table.Row
                        key={index}
                        _hover={{ bg: "gray.50" }}
                        transition="background 0.2s"
                      >
                        <Table.Cell
                          fontFamily="body"
                          fontWeight="bold"
                          color="tangerine.500"
                          py={5}
                          px={6}
                        >
                          {row.category}
                        </Table.Cell>
                        <Table.Cell
                          fontFamily="body"
                          fontSize={{ base: "sm", md: "md" }}
                          color="gray.700"
                          bg="skyBlue.50"
                          textAlign="center"
                          py={5}
                          px={4}
                        >
                          <Flex align="center" justify="center" gap={3}>
                            <Box
                              bg="skyBlue.400"
                              color="white"
                              borderRadius="full"
                              p={1}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Check size={14} />
                            </Box>
                            <Text>{row.lumi}</Text>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell
                          fontFamily="body"
                          fontSize={{ base: "sm", md: "md" }}
                          color="gray.500"
                          textAlign="center"
                          py={5}
                          px={4}
                        >
                          <Flex align="center" justify="center" gap={3}>
                            <Box
                              bg="gray.300"
                              color="white"
                              borderRadius="full"
                              p={1}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Minus size={14} />
                            </Box>
                            <Text>{row.softToys}</Text>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell
                          fontFamily="body"
                          fontSize={{ base: "sm", md: "md" }}
                          color="gray.500"
                          bg="red.50"
                          textAlign="center"
                          py={5}
                          px={4}
                        >
                          <Flex align="center" justify="center" gap={3}>
                            <Box
                              bg="red.500"
                              color="white"
                              borderRadius="full"
                              p={1}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <X size={14} />
                            </Box>
                            <Text>{row.screens}</Text>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Card.Body>
            </Card.Root>
          </Box>

          {/* Mobile: Card-based comparison */}
          <VStack display={{ base: "flex", md: "none" }} gap={4} w="full">
            {comparisonData.map((row, index) => (
              <Card.Root
                key={index}
                w="full"
                bg="white"
                borderRadius="xl"
                boxShadow="md"
                overflow="hidden"
              >
                <Card.Header bg="tangerine.50" py={3} px={4}>
                  <Text fontFamily="body" fontWeight="bold" color="tangerine.500" fontSize="md">
                    {row.category}
                  </Text>
                </Card.Header>
                <Card.Body p={0}>
                  <Grid templateColumns="1fr" gap={0}>
                    {/* Lumi */}
                    <Box p={4} bg="skyBlue.50" borderBottomWidth="1px" borderColor="gray.100">
                      <HStack gap={2} mb={2}>
                        <Box bg="skyBlue.400" color="white" borderRadius="full" p={1}>
                          <Check size={12} />
                        </Box>
                        <Text fontFamily="heading" fontSize="sm" color="skyBlue.400">
                          Lumi
                        </Text>
                      </HStack>
                      <Text fontFamily="body" fontSize="sm" color="gray.700">
                        {row.lumi}
                      </Text>
                    </Box>

                    {/* Soft Toys */}
                    <Box p={4} borderBottomWidth="1px" borderColor="gray.100">
                      <HStack gap={2} mb={2}>
                        <Box bg="gray.300" color="white" borderRadius="full" p={1}>
                          <Minus size={12} />
                        </Box>
                        <Text fontFamily="heading" fontSize="sm" color="gray.500">
                          Soft Toys
                        </Text>
                      </HStack>
                      <Text fontFamily="body" fontSize="sm" color="gray.500">
                        {row.softToys}
                      </Text>
                    </Box>

                    {/* Screens */}
                    <Box p={4} bg="red.50">
                      <HStack gap={2} mb={2}>
                        <Box bg="red.500" color="white" borderRadius="full" p={1}>
                          <X size={12} />
                        </Box>
                        <Text fontFamily="heading" fontSize="sm" color="red.400">
                          Screens
                        </Text>
                      </HStack>
                      <Text fontFamily="body" fontSize="sm" color="gray.500">
                        {row.screens}
                      </Text>
                    </Box>
                  </Grid>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>

          {/* CTA Button */}
          <LinkButton href="/product" size="lg">
            Choose Lumi
          </LinkButton>
        </VStack>
      </Container>
    </Box>
  );
}
