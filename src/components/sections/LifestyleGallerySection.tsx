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

const galleryImages = [
  {
    id: 1,
    src: "/images/lifestyle/all-colors-group-3.jpg",
    alt: "Lumi collection - All three colors together",
    span: { base: 2, md: 2 },
  },
  {
    id: 2,
    src: "/images/lifestyle/lumi-pink-lifestyle.jpg",
    alt: "Lumi Pink in natural setting",
    span: { base: 1, md: 1 },
  },
  {
    id: 3,
    src: "/images/lifestyle/lumi-blue-lifestyle.jpg",
    alt: "Lumi Blue in natural setting",
    span: { base: 1, md: 1 },
  },
  {
    id: 4,
    src: "/images/lifestyle/lumi-green-lifestyle.jpg",
    alt: "Lumi Green in natural setting",
    span: { base: 1, md: 1 },
  },
  {
    id: 5,
    src: "/images/lifestyle/all-colors-flowers.jpg",
    alt: "Lumi collection with flowers",
    span: { base: 1, md: 1 },
  },
];

export function LifestyleGallerySection() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      bg="linear-gradient(180deg, #FDFCFB 0%, #F5F0EB 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Pattern */}
      <Box
        position="absolute"
        top="10%"
        right="-5%"
        w={{ base: "100px", md: "200px" }}
        h={{ base: "100px", md: "200px" }}
        borderRadius="full"
        bg="rgba(239, 118, 47, 0.08)"
      />
      <Box
        position="absolute"
        bottom="15%"
        left="-3%"
        w={{ base: "80px", md: "150px" }}
        h={{ base: "80px", md: "150px" }}
        borderRadius="full"
        bg="rgba(80, 178, 213, 0.08)"
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
              Gallery
            </Text>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontFamily="heading"
            >
              <Text as="span" color="gray.800">
                Meet The
              </Text>{" "}
              <Text as="span" color="skyBlue.400">
                Lumi Family
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="body"
              color="gray.500"
              maxW="600px"
            >
              Adorable, cuddly, and smart - see Lumi in action with our beautiful lifestyle collection
            </Text>
          </VStack>

          {/* Gallery Grid */}
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap={{ base: 3, md: 5 }}
            w="full"
          >
            {galleryImages.map((image) => (
              <Box
                key={image.id}
                gridColumn={{
                  base: `span ${image.span.base}`,
                  md: `span ${image.span.md}`,
                }}
                position="relative"
                overflow="hidden"
                borderRadius="2xl"
                aspectRatio={image.span.md === 2 ? "2/1" : "1/1"}
                boxShadow="lg"
                _hover={{
                  transform: "scale(1.02)",
                  boxShadow: "2xl",
                }}
                transition="all 0.3s ease"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
                {/* Subtle overlay on hover */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)"
                  opacity={0}
                  _hover={{ opacity: 1 }}
                  transition="opacity 0.3s"
                />
              </Box>
            ))}
          </Grid>

          {/* Tagline */}
          <Box
            bg="white"
            px={{ base: 6, md: 10 }}
            py={{ base: 4, md: 6 }}
            borderRadius="full"
            boxShadow="md"
          >
            <Text
              fontSize={{ base: "md", md: "xl" }}
              fontFamily="heading"
              color="gray.700"
              textAlign="center"
            >
              Three Colors.{" "}
              <Text as="span" color="tangerine.500">Endless Adventures.</Text>{" "}
              One Best Friend.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
