import { test, expect } from "@playwright/test";

test.describe("Session Management", () => {
    test("should return to login after 15 minutes of inactivity - same page", async ({ page }) => {
      await page.clock.install({ time: new Date() });
      
      await page.goto("http://localhost:3000/auth/login");
      await page.fill('input[name="email"]', "adultna.org@gmail.com");
      await page.fill('input[name="password"]', "QWEasd123.");
      
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
      
      await page.waitForTimeout(100);
      await page.clock.runFor(15 * 60 * 1000 + 5 * 1000);
      
      // Wait a bit for the redirect to start
      await page.waitForTimeout(1000);
      
      // Check the URL directly
      await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
  });
});