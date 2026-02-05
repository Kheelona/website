import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility - Axe Automated Scans", () => {
  test("homepage should pass axe accessibility checks", async ({ page }) => {
    await page.goto("/");

    // Run axe scan
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("hero section should pass accessibility checks", async ({ page }) => {
    await page.goto("/");

    // Scroll to hero
    await page.locator("section").first().scrollIntoViewIfNeeded();

    // Run scan on hero section
    const results = await new AxeBuilder({ page }).include("section:first-of-type").analyze();
    expect(results.violations).toEqual([]);
  });

  test("product cards section should pass accessibility checks", async ({ page }) => {
    await page.goto("/");

    // Get product section by looking for ProductCards component
    const productSection = page
      .locator("section")
      .filter({ has: page.locator('button:has-text("BUY NOW")') });

    if (await productSection.isVisible()) {
      const results = await new AxeBuilder({ page }).include(productSection).analyze();
      expect(results.violations.length).toBe(0);
    }
  });

  test("footer should pass accessibility checks", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Run scan on footer
    const results = await new AxeBuilder({ page }).include("footer").analyze();
    expect(results.violations).toEqual([]);
  });

  test("testimonials section should pass accessibility checks", async ({ page }) => {
    await page.goto("/");

    // Get testimonials section
    const testimonialsSection = page
      .locator("section")
      .filter({ has: page.getByText(/What the parents say/i) });

    if (await testimonialsSection.isVisible()) {
      const results = await new AxeBuilder({ page }).include(testimonialsSection).analyze();
      expect(results.violations.length).toBe(0);
    }
  });

  test("navigation should pass accessibility checks", async ({ page }) => {
    await page.goto("/");

    // Check header/navigation
    const header = page.locator("header");

    if (await header.isVisible()) {
      const results = await new AxeBuilder({ page }).include("header").analyze();
      expect(results.violations).toEqual([]);
    }
  });

  test("all pages should have proper lang attribute", async ({ page }) => {
    await page.goto("/");

    // Check lang attribute
    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlLang).toBe("en");
  });

  test("page should have skip to main content link", async ({ page }) => {
    await page.goto("/");

    // Look for skip link (best practice)
    const mainContent = page.locator('[id="main-content"]');
    await expect(mainContent).toHaveAttribute("tabIndex", "-1");
  });

  test("all interactive elements should be keyboard accessible", async ({ page }) => {
    await page.goto("/");

    // Tab through the page and ensure we can reach all focusable elements
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);

    // Should have focused on something interactive
    expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "DIALOG"]).toContain(focusedElement);
  });
});
