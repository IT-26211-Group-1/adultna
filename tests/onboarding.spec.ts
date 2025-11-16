import { test, expect } from "@playwright/test";

test.describe("Onboarding Process", () => {
    test("should see step one of onboarding after registration", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://localhost:3000/auth/login");
        await page.fill('input[name="email"]', "adultna.org@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://localhost:3000/auth/onboarding");
    });

    test("should navigate through onboarding steps", async ({ page }) => {
    });

    test("finishing onboarding redirects to dashboard", async ({ page }) => {
    });

    test("entering a valid display name allows proceeding to next step", async ({ page }) => {
    });

    test("skipping optional steps works correctly", async ({ page }) => {
    });

    test("invalid display name input shows appropriate error message", async ({ page }) => {
    });

    test("leading and trailing spaces in display name are trimmed", async ({ page }) => {
    });

    test("dashboard is inaccessible without completing onboarding", async ({ page }) => {
    });

    test("character limit enforced in display name field", async ({ page }) => {
    });

});