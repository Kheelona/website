import { describe, it, expect } from "vitest";
import { validateWaitlistForm, WaitlistFormSchema } from "./validation";

describe("WaitlistFormSchema", () => {
  describe("firstName validation", () => {
    it("should reject empty first name", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "",
        email: "test@example.com",
      });
      expect(result.success).toBe(false);
    });

    it("should reject first name with less than 2 characters", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "A",
        email: "test@example.com",
      });
      expect(result.success).toBe(false);
    });

    it("should accept valid first name", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "test@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("should accept first name with spaces and hyphens", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "Mary-Jane O'Brien",
        email: "test@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("should reject first name with numbers", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John123",
        email: "test@example.com",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("should reject empty email", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid email format", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
    });

    it("should accept valid email", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "john@example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("phone validation", () => {
    it("should accept empty phone (optional)", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "test@example.com",
        phone: "",
      });
      expect(result.success).toBe(true);
    });

    it("should accept valid 10-digit phone", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "test@example.com",
        phone: "9876543210",
      });
      expect(result.success).toBe(true);
    });

    it("should reject phone with less than 10 digits", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "test@example.com",
        phone: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("should reject phone with letters", () => {
      const result = WaitlistFormSchema.safeParse({
        firstName: "John",
        email: "test@example.com",
        phone: "12345abcde",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("validateWaitlistForm", () => {
  it("should return success for valid form data", () => {
    const result = validateWaitlistForm({
      firstName: "John",
      email: "john@example.com",
      phone: "9876543210",
    });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeNull();
  });

  it("should return errors for invalid form data", () => {
    const result = validateWaitlistForm({
      firstName: "",
      email: "invalid",
      phone: "123",
    });
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
    expect(result.errors?.firstName).toBeDefined();
    expect(result.errors?.email).toBeDefined();
    expect(result.errors?.phone).toBeDefined();
  });

  it("should return first error message for each field", () => {
    const result = validateWaitlistForm({
      firstName: "",
      email: "",
    });
    expect(result.errors?.firstName).toBe("First name is required");
    expect(result.errors?.email).toBe("Email is required");
  });
});
