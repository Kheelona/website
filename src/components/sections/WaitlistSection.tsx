"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  HStack,
  Flex,
  Image,
  Field,
} from "@chakra-ui/react";
import { useState } from "react";
import { validateWaitlistForm, type WaitlistFormData } from "@/lib/validation";

type FormErrors = Partial<Record<keyof WaitlistFormData, string>>;

export function WaitlistSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateWaitlistForm(formData);
    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange =
    (field: keyof WaitlistFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const inputStyles = {
    size: "lg" as const,
    bg: "gray.50",
    borderRadius: "xl",
    fontFamily: "body",
    border: "2px solid",
    borderColor: "gray.100",
    _focus: {
      borderColor: "skyBlue.400",
      bg: "white",
    },
    _hover: {
      borderColor: "gray.200",
    },
  };

  return (
    <Box
      as="section"
      id="contact"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      layerStyle="gradient.waitlist"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        w={{ base: "80px", md: "150px" }}
        h={{ base: "80px", md: "150px" }}
        borderRadius="full"
        bg="rgba(239, 118, 47, 0.06)"
        aria-hidden="true"
      />
      <Box
        position="absolute"
        bottom="15%"
        left="3%"
        w={{ base: "60px", md: "120px" }}
        h={{ base: "60px", md: "120px" }}
        borderRadius="full"
        bg="rgba(80, 178, 213, 0.06)"
        aria-hidden="true"
      />

      <Container maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
        <Flex direction={{ base: "column", lg: "row" }} align="center" gap={{ base: 10, lg: 12 }}>
          {/* Image - Desktop only */}
          <Box flex={1} display={{ base: "none", lg: "block" }} position="relative">
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="350px"
              h="350px"
              borderRadius="full"
              bg="radial-gradient(circle, rgba(80, 178, 213, 0.1) 0%, transparent 70%)"
              aria-hidden="true"
            />
            <Image
              src="/images/lifestyle/all-colors-group-3.jpg"
              alt="Lumi Family - All three colors"
              maxH="400px"
              objectFit="cover"
              borderRadius="2xl"
              boxShadow="xl"
              position="relative"
              zIndex={1}
              _hover={{
                transform: "scale(1.02)",
              }}
              transition="transform 0.3s ease"
            />
          </Box>

          {/* Form Area */}
          <VStack gap={8} flex={1} w="full">
            {/* Section Header */}
            <VStack
              gap={4}
              textAlign={{ base: "center", lg: "left" }}
              align={{ base: "center", lg: "flex-start" }}
              w="full"
            >
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontFamily="body"
                color="tangerine.500"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Join the Waitlist
              </Text>
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                fontFamily="heading"
              >
                <Text as="span" color="gray.800">
                  Be the
                </Text>{" "}
                <Text as="span" color="skyBlue.400">
                  First to Know
                </Text>
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} fontFamily="body" color="gray.500">
                Get notified when we start selling!
              </Text>
            </VStack>

            {/* Form */}
            {isSubmitted ? (
              <Box
                bg="white"
                border="2px solid"
                borderColor="skyBlue.400"
                borderRadius="2xl"
                p={8}
                textAlign="center"
                boxShadow="lg"
                w="full"
                role="status"
                aria-live="polite"
              >
                <Text fontSize="5xl" mb={4} aria-hidden="true">
                  🎉
                </Text>
                <Heading as="h3" fontSize="2xl" fontFamily="heading" color="skyBlue.500" mb={2}>
                  You&apos;re on the list!
                </Heading>
                <Text fontFamily="body" color="gray.600">
                  We&apos;ll notify you when Lumi is available for purchase!
                </Text>
              </Box>
            ) : (
              <Box
                as="form"
                onSubmit={handleSubmit}
                w="full"
                bg="white"
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
                boxShadow="xl"
              >
                <VStack gap={5}>
                  {/* First Name */}
                  <Field.Root w="full" invalid={!!errors.firstName} required>
                    <Field.Label fontFamily="body" color="gray.600" fontSize="sm">
                      First name
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange("firstName")}
                      placeholder="Enter your first name"
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      {...inputStyles}
                    />
                    {errors.firstName && (
                      <Field.ErrorText id="firstName-error">{errors.firstName}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Phone */}
                  <Field.Root w="full" invalid={!!errors.phone}>
                    <Field.Label fontFamily="body" color="gray.600" fontSize="sm">
                      Phone
                      <Field.RequiredIndicator
                        fallback={
                          <Text as="span" color="gray.400" fontSize="xs" ml={1}>
                            (optional)
                          </Text>
                        }
                      />
                    </Field.Label>
                    <HStack>
                      <Box
                        bg="gray.50"
                        px={4}
                        py={3}
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.100"
                        fontFamily="body"
                        color="gray.600"
                        aria-label="Country code"
                      >
                        +91
                      </Box>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange("phone")}
                        placeholder="Enter your phone number"
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        {...inputStyles}
                      />
                    </HStack>
                    {errors.phone && (
                      <Field.ErrorText id="phone-error">{errors.phone}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Email */}
                  <Field.Root w="full" invalid={!!errors.email} required>
                    <Field.Label fontFamily="body" color="gray.600" fontSize="sm">
                      Email
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      placeholder="Enter your email"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...inputStyles}
                    />
                    {errors.email && (
                      <Field.ErrorText id="email-error">{errors.email}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    bg="tangerine.500"
                    color="white"
                    borderRadius="full"
                    fontFamily="body"
                    fontSize="lg"
                    py={7}
                    mt={2}
                    loading={isSubmitting}
                    _hover={{
                      bg: "tangerine.600",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.3s"
                  >
                    Join Waitlist
                  </Button>

                  <Text fontSize="xs" fontFamily="body" color="gray.400" textAlign="center">
                    We respect your privacy. No spam, ever.
                  </Text>
                </VStack>
              </Box>
            )}
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}
