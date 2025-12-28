import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have skip navigation link that works", async ({ page }) => {
    // Focus on the skip link
    await page.keyboard.press("Tab");

    // The skip link should be visible when focused
    const skipLink = page.getByRole("link", { name: /Skip to main content/i });
    await expect(skipLink).toBeFocused();

    // Click the skip link
    await page.keyboard.press("Enter");

    // Main content should be focused
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeFocused();
  });

  test("should scroll to contact section when clicking Contact link", async ({ page }) => {
    await page.getByRole("link", { name: "Contact" }).click();

    // Wait for scroll
    await page.waitForTimeout(500);

    // Contact section should be in view
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeInViewport();
  });

  test("mobile menu should open and close", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Menu button should be visible
    const menuButton = page.getByRole("button", { name: /Open menu/i });
    await expect(menuButton).toBeVisible();

    // Open menu
    await menuButton.click();

    // Drawer should be visible
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();

    // Navigation links should be visible in drawer
    await expect(page.getByRole("dialog").getByText("Shop")).toBeVisible();

    // Close drawer
    const closeButton = page.getByRole("button", { name: /Close/i });
    await closeButton.click();

    // Drawer should be closed
    await expect(drawer).not.toBeVisible();
  });

  test("header should be fixed on scroll", async ({ page }) => {
    const header = page.locator("header");

    // Get initial position
    const initialBox = await header.boundingBox();
    expect(initialBox?.y).toBe(0);

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(100);

    // Header should still be at top
    const afterScrollBox = await header.boundingBox();
    expect(afterScrollBox?.y).toBe(0);
  });
});
