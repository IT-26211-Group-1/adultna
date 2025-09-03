import { test, expect } from "@playwright/test";

test.describe("Register Form", () => {
  test("should display register form elements", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  });
});
