import { test, expect } from "@playwright/test";

test.describe("Session Management", () => {
    test("should return to login after 15 minutes of inactivity - same page", async ({ page }) => {
      // 1. Increase timeout to 60 seconds (or more) for this specific test
      test.setTimeout(60000); 

      // Initialize clock at a specific timestamp for consistency
      await page.clock.install({ time: new Date('2024-01-01T10:00:00') });
      
      await page.goto("http://adultna.com/auth/login");
      await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
      await page.fill('input[name="password"]', "Lewis123.");
      
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
      
      // 2. Fast forward time
      // Using a slightly larger buffer than 5 seconds ensures specific 
      // interval checks (e.g., usually 1s or 10s checks) are definitely caught.
      await page.clock.runFor(15 * 60 * 1000 + 30 * 1000);
      
      // 3. Trigger a state change if necessary
      // Sometimes apps only check expiry on user action or focus. 
      // If the redirect doesn't happen automatically, uncomment the line below:
      await page.mouse.move(100, 100); 

      // Check the URL directly
      await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
    });

    test("logout leads back to login page", async ({ page }) => {
      //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

      //perform logout
      await page.getByRole('button', { name: 'Lewis Nilo lewisdomnilo@gmail' }).click();
      await page.getByRole('button', { name: 'Logout' }).click();
      await page.getByRole('button', { name: 'Sign Out' }).click();

      await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
    });

    test("dashboard is inaccessible after logout, back button doesn't take user back", async ({ page }) => {
      //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

      //perform logout
      await page.getByRole('button', { name: 'Lewis Nilo lewisdomnilo@gmail' }).click();
      await page.getByRole('button', { name: 'Logout' }).click();
      await page.getByRole('button', { name: 'Sign Out' }).click();

      await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
      //try to go back to dashboard
      await page.goBack();
      await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
    });
});