import { test, expect } from "@playwright/test";

test.describe("Waitlist Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Scroll to waitlist section
    await page.evaluate(() => {
      document.getElementById("contact")?.scrollIntoView();
    });
    await page.waitForTimeout(500);
  });

  test("should display validation errors for empty form", async ({ page }) => {
    // Click submit without filling form
    const submitButton = page.getByRole("button", { name: /Join Waitlist/i });
    await submitButton.click();

    // Should show error messages
    await expect(page.getByText(/First name is required/i)).toBeVisible();
    await expect(page.getByText(/Email is required/i)).toBeVisible();
  });

  test("should display validation error for invalid email", async ({ page }) => {
    // Fill first name
    await page.getByPlaceholder("Enter your first name").fill("John");

    // Fill invalid email
    await page.getByPlaceholder("Enter your email").fill("invalid-email");

    // Submit
    const submitButton = page.getByRole("button", { name: /Join Waitlist/i });
    await submitButton.click();

    // Should show email error
    await expect(page.getByText(/Please enter a valid email address/i)).toBeVisible();
  });

  test("should display validation error for invalid phone", async ({ page }) => {
    // Fill first name
    await page.getByPlaceholder("Enter your first name").fill("John");

    // Fill email
    await page.getByPlaceholder("Enter your email").fill("john@example.com");

    // Fill invalid phone
    await page.getByPlaceholder("Enter your phone number").fill("12345");

    // Submit
    const submitButton = page.getByRole("button", { name: /Join Waitlist/i });
    await submitButton.click();

    // Should show phone error
    await expect(page.getByText(/Phone number must be exactly 10 digits/i)).toBeVisible();
  });

  test("should submit successfully with valid data", async ({ page }) => {
    // Fill first name
    await page.getByPlaceholder("Enter your first name").fill("John");

    // Fill email
    await page.getByPlaceholder("Enter your email").fill("john@example.com");

    // Fill phone (optional but valid)
    await page.getByPlaceholder("Enter your phone number").fill("9876543210");

    // Submit
    const submitButton = page.getByRole("button", { name: /Join Waitlist/i });
    await submitButton.click();

    // Should show success message
    await expect(page.getByText(/You're on the list!/i)).toBeVisible({ timeout: 10000 });
  });

  test("should clear error when user starts typing", async ({ page }) => {
    // Submit empty form to trigger errors
    const submitButton = page.getByRole("button", { name: /Join Waitlist/i });
    await submitButton.click();

    // Error should be visible
    await expect(page.getByText(/First name is required/i)).toBeVisible();

    // Start typing in first name field
    await page.getByPlaceholder("Enter your first name").fill("J");

    // Error should be cleared
    await expect(page.getByText(/First name is required/i)).not.toBeVisible();
  });

  test("form should be accessible", async ({ page }) => {
    // Check form fields have proper labels
    const firstNameInput = page.getByPlaceholder("Enter your first name");
    const emailInput = page.getByPlaceholder("Enter your email");

    // Inputs should be inside Field.Root with labels
    await expect(firstNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();

    // Labels should be visible
    await expect(page.getByText("First name", { exact: false })).toBeVisible();
    await expect(page.getByText("Email", { exact: false })).toBeVisible();
  });
});
