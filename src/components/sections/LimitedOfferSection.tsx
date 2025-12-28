"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function LimitedOfferSection() {
  // Initialize with null to prevent hydration mismatch
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    mins: number;
    secs: number;
  } | null>(null);

  useEffect(() => {
    // Set initial time only on client side
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    targetDate.setHours(targetDate.getHours() + 8);
    targetDate.setMinutes(targetDate.getMinutes() + 45);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, mins: 0, secs: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / (1000 * 60)) % 60),
        secs: Math.floor((difference / 1000) % 60),
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      bg="linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 50%, #FFDAB9 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        w={{ base: "60px", md: "100px" }}
        h={{ base: "60px", md: "100px" }}
        borderRadius="full"
        bg="rgba(239, 118, 47, 0.1)"
      />
      <Box
        position="absolute"
        bottom="15%"
        left="3%"
        w={{ base: "80px", md: "120px" }}
        h={{ base: "80px", md: "120px" }}
        borderRadius="full"
        bg="rgba(80, 178, 213, 0.1)"
      />
      <Box
        position="absolute"
        top="40%"
        left="10%"
        w={{ base: "40px", md: "60px" }}
        h={{ base: "40px", md: "60px" }}
        borderRadius="full"
        bg="rgba(241, 162, 59, 0.15)"
      />

      {/* Sparkle decorations */}
      <Text
        position="absolute"
        top="15%"
        left="15%"
        fontSize={{ base: "2xl", md: "4xl" }}
        opacity={0.6}
      >
        ✨
      </Text>
      <Text
        position="absolute"
        bottom="20%"
        right="10%"
        fontSize={{ base: "xl", md: "3xl" }}
        opacity={0.5}
      >
        🎉
      </Text>

      <Container maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 8, lg: 12 }}
        >
          {/* Text Content */}
          <VStack
            align={{ base: "center", lg: "flex-start" }}
            textAlign={{ base: "center", lg: "left" }}
            gap={6}
            flex={1}
          >
            {/* Badge */}
            <Box
              bg="tangerine.500"
              color="white"
              px={4}
              py={1}
              borderRadius="full"
              fontFamily="body"
              fontSize="sm"
            >
              Early Bird Special
            </Box>

            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontFamily="heading"
              color="gray.800"
            >
              Limited Time Offer
            </Heading>

            <Flex align="baseline" gap={3} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
              <Text
                fontSize={{ base: "5xl", md: "7xl", lg: "8xl" }}
                fontFamily="heading"
                color="tangerine.500"
                lineHeight="1"
              >
                50%
              </Text>
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontFamily="heading"
                color="skyBlue.400"
              >
                OFF
              </Text>
            </Flex>

            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              fontFamily="body"
              color="gray.600"
              maxW="400px"
            >
              Pre-order Lumi now and get exclusive early bird discount! Limited stocks available.
            </Text>

            {/* Live Countdown Timer */}
            <HStack gap={{ base: 2, md: 4 }} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
              {[
                { value: timeLeft ? String(timeLeft.days).padStart(2, "0") : "--", label: "Days" },
                { value: timeLeft ? String(timeLeft.hours).padStart(2, "0") : "--", label: "Hours" },
                { value: timeLeft ? String(timeLeft.mins).padStart(2, "0") : "--", label: "Mins" },
                { value: timeLeft ? String(timeLeft.secs).padStart(2, "0") : "--", label: "Secs" },
              ].map((item, index) => (
                <HStack key={item.label} gap={{ base: 2, md: 4 }}>
                  <VStack gap={0}>
                    <Box
                      bg="white"
                      px={{ base: 3, md: 4 }}
                      py={2}
                      borderRadius="lg"
                      boxShadow="md"
                      minW={{ base: "50px", md: "60px" }}
                      textAlign="center"
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.05)" }}
                    >
                      <Text
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontFamily="heading"
                        color="tangerine.500"
                      >
                        {item.value}
                      </Text>
                    </Box>
                    <Text
                      fontSize="xs"
                      fontFamily="body"
                      color="gray.500"
                      mt={1}
                    >
                      {item.label}
                    </Text>
                  </VStack>
                  {index < 3 && (
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontFamily="heading"
                      color="tangerine.500"
                      mt={-4}
                    >
                      :
                    </Text>
                  )}
                </HStack>
              ))}
            </HStack>

            <Button
              asChild
              size="lg"
              bg="tangerine.500"
              color="white"
              borderRadius="full"
              fontFamily="body"
              px={8}
              _hover={{
                bg: "tangerine.600",
                transform: "translateY(-3px)",
                boxShadow: "lg",
              }}
              transition="all 0.3s"
            >
              <Link href="/product">Grab the Deal</Link>
            </Button>
          </VStack>

          {/* Product Image */}
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            position="relative"
          >
            {/* Background glow */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w={{ base: "280px", md: "380px", lg: "450px" }}
              h={{ base: "280px", md: "380px", lg: "450px" }}
              borderRadius="full"
              bg="radial-gradient(circle, rgba(80, 178, 213, 0.15) 0%, transparent 70%)"
            />
            <Image
              src="/images/lifestyle/all-colors-flowers.jpg"
              alt="Lumi Family - All Colors with Flowers"
              maxH={{ base: "280px", md: "350px", lg: "420px" }}
              objectFit="cover"
              borderRadius="2xl"
              boxShadow="2xl"
              _hover={{
                transform: "scale(1.03)",
              }}
              transition="transform 0.3s ease"
              position="relative"
              zIndex={1}
            />

            {/* Price tag */}
            <Box
              position="absolute"
              top={{ base: "10px", md: "20px" }}
              right={{ base: "10px", md: "30px" }}
              bg="white"
              px={4}
              py={3}
              borderRadius="xl"
              boxShadow="lg"
              transform="rotate(12deg)"
              zIndex={2}
            >
              <Text
                fontSize="sm"
                fontFamily="body"
                color="gray.400"
                textDecoration="line-through"
              >
                ₹5,999
              </Text>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontFamily="heading"
                color="tangerine.500"
              >
                ₹2,999
              </Text>
            </Box>

            {/* Stock indicator */}
            <Box
              position="absolute"
              bottom={{ base: "10px", md: "20px" }}
              left={{ base: "10px", md: "30px" }}
              bg="tangerine.500"
              color="white"
              px={3}
              py={2}
              borderRadius="lg"
              boxShadow="md"
              zIndex={2}
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                fontFamily="body"
              >
                Limited Stock!
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
