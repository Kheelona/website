import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the homepage successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Kheelona/);
  });

  test("should display the header with logo", async ({ page }) => {
    const logo = page.getByAltText("Kheelona Logo");
    await expect(logo).toBeVisible();
  });

  test("should display the hero section", async ({ page }) => {
    const heroHeading = page.getByRole("heading", { level: 1 });
    await expect(heroHeading).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Shop" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("should have a pre-order button", async ({ page }) => {
    const preOrderButton = page.getByRole("link", { name: /Pre-Order/i }).first();
    await expect(preOrderButton).toBeVisible();
  });

  test("should display the products section", async ({ page }) => {
    const productsHeading = page.getByRole("heading", { name: /Choose Your Lumi/i });
    await expect(productsHeading).toBeVisible();
  });

  test("should display testimonials section", async ({ page }) => {
    const testimonialsHeading = page.getByRole("heading", { name: /What Parents Say/i });
    await expect(testimonialsHeading).toBeVisible();
  });

  test("should display waitlist form", async ({ page }) => {
    const waitlistHeading = page.getByRole("heading", { name: /First to Know/i });
    await expect(waitlistHeading).toBeVisible();
  });

  test("should display footer", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
  });
});
