import { test, expect } from "@playwright/test";

test.describe("Forgot Password Form", () => {
    test("10 minutes idle in forgot password page leads back to login page", async ({ page }) => {
        // Install clock before navigation so timers are controlled
        await page.clock.install({ time: new Date() });

        await page.goto("http://localhost:3000/auth/forgot-password");

        await page.fill('input[name="email"]', "adultna.org@gmail.com");
        await page.getByRole("button", { name: "Send OTP" }).click();

        // Wait for the OTP step to be mounted: wait for the Verify OTP button (stable signal)
        const verifyBtn = page.getByRole("button", { name: "Verify OTP" });
        await expect(verifyBtn).toBeVisible({ timeout: 5000 });

        // Advance time by 10 minutes + small buffer so the timeout fires
        await page.clock.runFor(10 * 60 * 1000 + 2000);

        // Wait for navigation to happen and assert it
        await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });

        // Assert the inactivity toast is visible (use an assertion, not .isVisible() alone)
        await expect(page.getByText("You've been inactive for 10 minutes. Please try again.")).toBeVisible({ timeout: 5000 });
    });
});