import { test, expect } from "@playwright/test";

test.describe("Login Form", () => {
  test("should display login form elements", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "invalid@example.com");
    await page.fill('input[name="password"]', "wrongpassword");

    await page.getByRole("button", { name: "Login" }).click();

    const errorAlert = page.locator('p[role="alert"]').first();
    await expect(errorAlert).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "testuser@example.com");
    await page.fill('input[name="password"]', "correctpassword");

    await page.getByRole("button", { name: "Login" }).click();
  });
});
