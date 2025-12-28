"use client";

import { Component, ReactNode } from "react";
import { Box, Container, Heading, Text, VStack, Button } from "@chakra-ui/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you would send this to an error tracking service like Sentry
    // if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    //   // Send to error tracking service
    // }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          py={16}
          px={4}
        >
          <Container maxW="md">
            <VStack gap={6} textAlign="center">
              <Text fontSize="6xl">🔧</Text>
              <Heading
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontFamily="heading"
                color="gray.800"
              >
                Oops! Something went wrong
              </Heading>
              <Text fontFamily="body" color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                We encountered an unexpected error. Please try again or contact support if the
                problem persists.
              </Text>
              <Button
                onClick={this.handleRetry}
                bg="tangerine.500"
                color="white"
                size="lg"
                borderRadius="full"
                fontFamily="body"
                px={8}
                _hover={{
                  bg: "tangerine.600",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s"
              >
                Try Again
              </Button>
            </VStack>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
