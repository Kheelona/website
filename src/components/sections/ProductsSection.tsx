"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Tag,
  Grid,
  Flex,
} from "@chakra-ui/react";
import { LinkButton } from "@/components/ui/LinkButton";

const colorVariants = [
  {
    id: "pink",
    name: "Lumi Pink",
    color: "#FFB5BA",
    image: "/images/products/lumi-pink-1.jpg",
    lifestyleImage: "/images/lifestyle/lumi-pink-lifestyle.jpg",
  },
  {
    id: "blue",
    name: "Lumi Blue",
    color: "#87CEEB",
    image: "/images/products/lumi-blue/front.png",
    lifestyleImage: "/images/lifestyle/lumi-blue-lifestyle.jpg",
  },
  {
    id: "green",
    name: "Lumi Green",
    color: "#98D8AA",
    image: "/images/products/lumi-green/front.png",
    lifestyleImage: "/images/lifestyle/lumi-green-lifestyle.jpg",
  },
];

const productInfo = {
  description: "Your child's first AI friend",
  badge: "Beta Launch",
  regularPrice: "5,999",
  salePrice: "2,999",
  currency: "INR",
  features: ["Voice Powered", "10+ Languages", "Screen-Free"],
  url: "/product",
};

export function ProductsSection() {
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]);

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      bg="white"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="5%"
        left="-5%"
        w={{ base: "150px", md: "250px" }}
        h={{ base: "150px", md: "250px" }}
        borderRadius="full"
        bg="rgba(80, 178, 213, 0.05)"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-3%"
        w={{ base: "100px", md: "180px" }}
        h={{ base: "100px", md: "180px" }}
        borderRadius="full"
        bg="rgba(239, 118, 47, 0.05)"
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
              Shop Now
            </Text>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontFamily="heading"
            >
              <Text as="span" color="gray.800">
                Choose Your
              </Text>{" "}
              <Text as="span" color="skyBlue.400">
                Lumi
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="body"
              color="gray.500"
              maxW="500px"
            >
              Meet Lumi - Available in 3 adorable colors! Pick your child&apos;s perfect AI companion.
            </Text>
          </VStack>

          {/* Product Display */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            bg="linear-gradient(135deg, #F8FBFC 0%, #EEF6F9 100%)"
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="xl"
            maxW="1100px"
            w="full"
          >
            {/* Product Image Section */}
            <Box
              position="relative"
              flex={{ base: "none", lg: 1.2 }}
              p={{ base: 6, md: 10 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={6}
            >
              <Tag.Root
                position="absolute"
                top={6}
                left={6}
                size="md"
                variant="solid"
                bg="tangerine.500"
                color="white"
                borderRadius="full"
                boxShadow="md"
                px={4}
                py={2}
              >
                <Tag.Label fontFamily="body" fontSize="sm">
                  {productInfo.badge}
                </Tag.Label>
              </Tag.Root>

              {/* Main Product Image */}
              <Box position="relative" w="full" display="flex" justifyContent="center">
                <Image
                  src={selectedColor.image}
                  alt={selectedColor.name}
                  maxH={{ base: "280px", md: "350px" }}
                  objectFit="contain"
                  filter="drop-shadow(0 15px 30px rgba(0,0,0,0.15))"
                  transition="all 0.4s ease"
                />
              </Box>

              {/* Color Selector */}
              <VStack gap={3}>
                <Text
                  fontSize="sm"
                  fontFamily="body"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Choose Color
                </Text>
                <HStack gap={4}>
                  {colorVariants.map((variant) => (
                    <Box
                      key={variant.id}
                      as="button"
                      w={{ base: "40px", md: "50px" }}
                      h={{ base: "40px", md: "50px" }}
                      borderRadius="full"
                      bg={variant.color}
                      border="3px solid"
                      borderColor={selectedColor.id === variant.id ? "tangerine.500" : "transparent"}
                      boxShadow={selectedColor.id === variant.id ? "0 0 0 3px rgba(239, 118, 47, 0.3)" : "md"}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        transform: "scale(1.1)",
                        boxShadow: "lg",
                      }}
                      onClick={() => setSelectedColor(variant)}
                      title={variant.name}
                    />
                  ))}
                </HStack>
              </VStack>
            </Box>

            {/* Product Info Section */}
            <VStack
              p={{ base: 6, md: 10 }}
              gap={5}
              align="flex-start"
              flex={{ base: "none", lg: 1 }}
              justify="center"
              bg="white"
            >
              <Heading
                as="h3"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontFamily="heading"
                color="skyBlue.400"
                transition="all 0.3s"
              >
                {selectedColor.name}
              </Heading>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontFamily="body"
                color="gray.600"
              >
                {productInfo.description}
              </Text>

              {/* Features - Using Chakra UI Tag */}
              <HStack gap={2} flexWrap="wrap">
                {productInfo.features.map((feature) => (
                  <Tag.Root
                    key={feature}
                    size="sm"
                    variant="subtle"
                    bg="gray.100"
                    color="gray.600"
                    borderRadius="full"
                    boxShadow="sm"
                    px={3}
                    py={1}
                  >
                    <Tag.Label fontFamily="body" fontSize="xs">
                      {feature}
                    </Tag.Label>
                  </Tag.Root>
                ))}
              </HStack>

              {/* Price */}
              <Box>
                <HStack gap={3} align="baseline">
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontFamily="body"
                    color="gray.400"
                    textDecoration="line-through"
                  >
                    ₹{productInfo.regularPrice}
                  </Text>
                  <Text
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontFamily="heading"
                    color="tangerine.500"
                  >
                    ₹{productInfo.salePrice}
                  </Text>
                </HStack>
                <Text
                  fontSize="xs"
                  fontFamily="body"
                  color="skyBlue.500"
                  mt={1}
                >
                  Save ₹3,000 with early bird discount!
                </Text>
              </Box>

              <LinkButton href={productInfo.url} size="lg">
                Pre-Order {selectedColor.name}
              </LinkButton>
            </VStack>
          </Flex>

          {/* All Colors Preview */}
          <Box w="full" maxW="1100px">
            <Image
              src="/images/lifestyle/all-colors-group-1.jpg"
              alt="All Lumi colors - Pink, Blue, and Green"
              w="full"
              h={{ base: "200px", md: "300px", lg: "400px" }}
              objectFit="cover"
              borderRadius="2xl"
              boxShadow="xl"
            />
            <Text
              mt={4}
              textAlign="center"
              fontSize={{ base: "sm", md: "md" }}
              fontFamily="body"
              color="gray.500"
            >
              Available in Pink, Blue & Green - Collect them all!
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
