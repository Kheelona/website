"use client";

import { useEffect } from "react";
import { Box, Container, Heading, Text, VStack, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error("Application error:", error);

    // In production, send to error tracking service
    // if (process.env.NODE_ENV === 'production') {
    //   // Send to Sentry or similar
    // }
  }, [error]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 50%, #FFDAB9 100%)"
      py={16}
      px={4}
    >
      <Container maxW="lg">
        <VStack gap={8} textAlign="center">
          {/* Error illustration */}
          <Box
            w={{ base: "120px", md: "160px" }}
            h={{ base: "120px", md: "160px" }}
            borderRadius="full"
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="xl"
          >
            <Text fontSize={{ base: "5xl", md: "7xl" }}>😢</Text>
          </Box>

          {/* Error message */}
          <VStack gap={4}>
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontFamily="heading"
              color="gray.800"
            >
              Something Went Wrong!
            </Heading>
            <Text fontFamily="body" color="gray.600" fontSize={{ base: "md", md: "lg" }} maxW="md">
              We apologize for the inconvenience. Our team has been notified and is working to fix
              this issue.
            </Text>
          </VStack>

          {/* Action buttons */}
          <VStack gap={4}>
            <Button
              onClick={reset}
              bg="tangerine.500"
              color="white"
              size="lg"
              borderRadius="full"
              fontFamily="body"
              px={10}
              py={6}
              fontSize="lg"
              boxShadow="0 4px 14px rgba(239, 118, 47, 0.4)"
              _hover={{
                bg: "tangerine.600",
                transform: "translateY(-3px)",
                boxShadow: "lg",
              }}
              transition="all 0.3s"
            >
              Try Again
            </Button>
            <Button
              asChild
              variant="ghost"
              color="skyBlue.500"
              fontFamily="body"
              fontSize="md"
              _hover={{
                color: "skyBlue.600",
                textDecoration: "underline",
              }}
            >
              <Link href="/">Go back home</Link>
            </Button>
          </VStack>

          {/* Error details for development */}
          {process.env.NODE_ENV === "development" && error.message && (
            <Box
              mt={8}
              p={4}
              bg="red.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="red.200"
              w="full"
              maxW="lg"
            >
              <Text fontFamily="mono" fontSize="sm" color="red.600" textAlign="left">
                {error.message}
              </Text>
              {error.digest && (
                <Text fontFamily="mono" fontSize="xs" color="gray.500" mt={2}>
                  Error ID: {error.digest}
                </Text>
              )}
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
