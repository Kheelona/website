"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "Lumi has completely changed how my daughter learns. She talks to it for hours and her vocabulary has improved significantly!",
    author: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
  },
  {
    quote:
      "Finally, a toy that engages my son without screens. He loves asking Lumi questions and the responses are so appropriate for his age.",
    author: "Rahul Verma",
    location: "Delhi",
    rating: 5,
  },
  {
    quote:
      "The multilingual feature is amazing. My kids are learning Hindi and English at the same time through conversations with Lumi.",
    author: "Anita Patel",
    location: "Bangalore",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      layerStyle="gradient.testimonials"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative quote marks */}
      <Text
        position="absolute"
        top={{ base: "3%", md: "8%" }}
        left={{ base: "5%", md: "12%" }}
        fontSize={{ base: "8xl", md: "12xl" }}
        color="rgba(239, 118, 47, 0.08)"
        fontFamily="serif"
        lineHeight="1"
        userSelect="none"
      >
        "
      </Text>
      <Text
        position="absolute"
        bottom={{ base: "3%", md: "8%" }}
        right={{ base: "5%", md: "12%" }}
        fontSize={{ base: "8xl", md: "12xl" }}
        color="rgba(80, 178, 213, 0.08)"
        fontFamily="serif"
        lineHeight="1"
        transform="rotate(180deg)"
        userSelect="none"
      >
        "
      </Text>

      {/* Decorative circles */}
      <Box
        position="absolute"
        top="15%"
        right="8%"
        w={{ base: "60px", md: "100px" }}
        h={{ base: "60px", md: "100px" }}
        borderRadius="full"
        bg="rgba(80, 178, 213, 0.06)"
      />
      <Box
        position="absolute"
        bottom="20%"
        left="5%"
        w={{ base: "40px", md: "80px" }}
        h={{ base: "40px", md: "80px" }}
        borderRadius="full"
        bg="rgba(239, 118, 47, 0.06)"
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
              Testimonials
            </Text>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              fontFamily="heading"
            >
              <Text as="span" color="gray.800">
                What
              </Text>{" "}
              <Text as="span" color="skyBlue.400">
                Parents Say
              </Text>
            </Heading>
          </VStack>

          {/* Testimonial Card */}
          <Box
            bg="white"
            borderRadius="3xl"
            p={{ base: 8, md: 12 }}
            w="full"
            position="relative"
            boxShadow="xl"
          >
            {/* Quote Badge */}
            <Box
              position="absolute"
              top={{ base: -5, md: -6 }}
              left="50%"
              transform="translateX(-50%)"
              bg="skyBlue.400"
              w={{ base: "50px", md: "60px" }}
              h={{ base: "50px", md: "60px" }}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="lg"
            >
              <Text fontSize={{ base: "2xl", md: "3xl" }} color="white" fontWeight="bold">
                "
              </Text>
            </Box>

            <VStack gap={6} pt={4}>
              {/* Stars */}
              <HStack gap={1}>
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Text key={i} fontSize="xl" color="mutedOrange.400">
                    ★
                  </Text>
                ))}
              </HStack>

              {/* Quote */}
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontFamily="body"
                color="gray.700"
                textAlign="center"
                lineHeight="1.7"
                px={{ base: 0, md: 6 }}
                fontStyle="italic"
              >
                "{testimonials[currentIndex].quote}"
              </Text>

              {/* Author */}
              <VStack gap={1}>
                <Text
                  fontFamily="heading"
                  fontSize={{ base: "lg", md: "xl" }}
                  color="tangerine.500"
                >
                  {testimonials[currentIndex].author}
                </Text>
                <Text
                  fontFamily="body"
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.500"
                >
                  {testimonials[currentIndex].location}
                </Text>
              </VStack>

              {/* Dots indicator */}
              <HStack gap={2} mt={2}>
                {testimonials.map((_, index) => (
                  <Box
                    key={index}
                    w={index === currentIndex ? "28px" : "10px"}
                    h="10px"
                    borderRadius="full"
                    bg={index === currentIndex ? "skyBlue.400" : "gray.200"}
                    cursor="pointer"
                    onClick={() => setCurrentIndex(index)}
                    transition="all 0.3s"
                    _hover={{
                      bg: index === currentIndex ? "skyBlue.400" : "gray.300",
                    }}
                  />
                ))}
              </HStack>
            </VStack>
          </Box>

          {/* Navigation */}
          <Flex gap={4}>
            <IconButton
              aria-label="Previous testimonial"
              onClick={prevTestimonial}
              bg="white"
              color="skyBlue.400"
              borderRadius="full"
              boxShadow="md"
              w={{ base: "50px", md: "56px" }}
              h={{ base: "50px", md: "56px" }}
              _hover={{
                bg: "skyBlue.400",
                color: "white",
                transform: "scale(1.1)",
              }}
              transition="all 0.3s"
            >
              <ChevronLeft size={24} />
            </IconButton>
            <IconButton
              aria-label="Next testimonial"
              onClick={nextTestimonial}
              bg="white"
              color="skyBlue.400"
              borderRadius="full"
              boxShadow="md"
              w={{ base: "50px", md: "56px" }}
              h={{ base: "50px", md: "56px" }}
              _hover={{
                bg: "skyBlue.400",
                color: "white",
                transform: "scale(1.1)",
              }}
              transition="all 0.3s"
            >
              <ChevronRight size={24} />
            </IconButton>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
