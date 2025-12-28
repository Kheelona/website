import { Box, Container, Heading, Text, VStack, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(135deg, #E8F7FB 0%, #C5ECF5 50%, #9DDEED 100%)"
      py={16}
      px={4}
    >
      <Container maxW="lg">
        <VStack gap={8} textAlign="center">
          {/* 404 illustration */}
          <VStack gap={2}>
            <Text
              fontSize={{ base: "8xl", md: "10xl" }}
              fontFamily="heading"
              color="skyBlue.400"
              lineHeight="1"
            >
              404
            </Text>
            <Box
              w={{ base: "100px", md: "140px" }}
              h={{ base: "100px", md: "140px" }}
              borderRadius="full"
              bg="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="xl"
            >
              <Text fontSize={{ base: "4xl", md: "6xl" }}>🔍</Text>
            </Box>
          </VStack>

          {/* Message */}
          <VStack gap={4}>
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontFamily="heading"
              color="gray.800"
            >
              Page Not Found
            </Heading>
            <Text fontFamily="body" color="gray.600" fontSize={{ base: "md", md: "lg" }} maxW="md">
              Oops! Looks like Lumi couldn&apos;t find this page. It might have been moved or
              doesn&apos;t exist anymore.
            </Text>
          </VStack>

          {/* Action buttons */}
          <VStack gap={4}>
            <Button
              asChild
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
              <Link href="/">Go Home</Link>
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
              <Link href="/#contact">Contact Support</Link>
            </Button>
          </VStack>

          {/* Fun message */}
          <Text fontFamily="body" color="gray.400" fontSize="sm" fontStyle="italic">
            Even Lumi sometimes gets lost exploring!
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
