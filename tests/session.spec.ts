import { test, expect } from "@playwright/test";

test.describe("session management", () => {
    test("should return to login after 15 minutes of inactivity", async ({ page, context }) => {
        await page.clock.install();
        
        await page.goto("http://localhost:3000/auth/login");
        await page.fill('input[name="email"]', "adultna.org@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
        
        // Fast-forward 15 minutes
        await page.clock.fastForward(15 * 60 * 1000);
        
        // await page.reload(); // to trigger a check; disbabled for now
        await expect(page).toHaveURL(/\/auth\/login\/?$/);
    });
});