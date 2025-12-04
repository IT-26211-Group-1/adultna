import { test, expect } from "@playwright/test";

test.describe("Forgot Password Form", () => {
    test("10 minutes idle in forgot password page leads back to login page", async ({ page }) => {
        // Install clock before navigation so timers are controlled
        await page.clock.install({ time: new Date() });

        await page.goto("http://adultna.com/auth/forgot-password");

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

    test("email input field only accepts valid email format", async ({ page }) => {
        await page.goto("http://adultna.com/auth/forgot-password");

        await page.fill('input[name="email"]', "aya.santosgmail.com");
        await page.getByRole("button", { name: "Send OTP" }).click();

        const errorMessage = page.locator('[data-slot="error-message"]');
        await expect(errorMessage.filter({ hasText: "Email is Required" })).toBeVisible({ timeout: 3000 });
    });

    test("blank email input shows required error", async ({ page }) => {
        await page.goto("http://adultna.com/auth/forgot-password");
        await page.fill('input[name="email"]', "");
        await page.getByRole("button", { name: "Send OTP" }).click();

        const errorMessage = page.locator('[data-slot="error-message"]');
        await expect(errorMessage.filter({ hasText: "Email is Required" })).toBeVisible({ timeout: 3000 });
    });

    test("non-existent email shows error message", async ({ page }) => {
        await page.goto("http://adultna.com/auth/forgot-password");
        await page.fill('input[name="email"]', "scarguez0320@gmail.com");
        await page.getByRole("button", { name: "Send OTP" }).click();

        await expect(page.getByText("User not found")).toBeVisible({ timeout: 5000 });
    });

    test("expired OTP is not accepted", async ({ page }) => {
        // Install clock before navigation so timers are controlled
        await page.clock.install({ time: new Date() });

        await page.goto("http://adultna.com/auth/forgot-password");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.getByRole("button", { name: "Send OTP" }).click();

        // Wait for the OTP step to be mounted: wait for the Verify OTP button (stable signal)
        await page.getByRole("button", { name: "Verify OTP" }).click();await page.getByRole('button', { name: 'OTP digit 1 of' }).click();
        await page.getByRole('textbox').fill('123455');
        await page.getByRole('button', { name: 'Verify OTP' }).click();

        await expect(page.getByText("OTP verification failed")).toBeVisible({ timeout: 5000 });
    });

    test("limiting OTP attempts and enforce cooldown period", async ({ page }) => {
        // Install clock before navigation so timers are controlled
        await page.clock.install({ time: new Date() });

        await page.goto("http://adultna.com/auth/forgot-password");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.getByRole("button", { name: "Send OTP" }).click();

        // Wait for the OTP step to be mounted: wait for the Verify OTP button (stable signal)
        await page.getByRole("button", { name: "Verify OTP" }).click();await page.getByRole('button', { name: 'OTP digit 1 of' }).click();
        await page.getByRole('textbox').fill('123455');
        await page.getByRole('button', { name: 'Verify OTP' }).click();
        await page.getByRole('textbox').fill('123455');
        await page.getByRole('button', { name: 'Verify OTP' }).click();
        await page.getByRole('textbox').fill('123455');
        await page.getByRole('button', { name: 'Verify OTP' }).click();

        await expect(page.getByText("Maximum OTP attempts exceeded")).toBeVisible({ timeout: 5000 });
    });
});