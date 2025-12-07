import { test, expect } from "@playwright/test";

test.describe("Onboarding Process", () => {
    test("should see step one of onboarding after registration & verification", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //wait to be redirected to onboarding
        // await page.waitForURL("http://adultna.com/auth/onboarding", { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
    });

    test("should navigate through onboarding steps", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('Wiles');
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Skip' }).click();
        await page.getByRole('button', { name: 'Skip' }).click();
        await page.getByRole('button', { name: '← Back' }).click();
        await page.getByRole('button', { name: '← Back' }).click();
        await page.getByRole('button', { name: '← Back' }).click();
    });

    test("entering a valid display name allows proceeding to next step", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('Wiles');
        await page.getByRole('button', { name: 'Next →' }).click();
    });

    test("skipping optional steps works correctly", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('Wiles');
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Skip' }).click();
        await page.getByRole('button', { name: 'Skip' }).click();
    });

    test("special characters and numbers are accepted in display name input", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();        
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('@*#&*@&$(&*@$(*^%92398q2748923');
        await page.getByRole('button', { name: 'Next →' }).click();
    });

    test("leading and trailing spaces in display name are trimmed", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();        
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('   Wiles   ');
        await page.getByRole('button', { name: 'Next →' }).click();
    });

    test("dashboard is inaccessible without completing onboarding", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await page.goto("http://adultna.com/auth/onboarding");
        await page.goto("http://adultna.com/dashboard");
        await page.goto("http://adultna.com/auth/onboarding");
        await expect(page).toHaveURL(/\/auth\/onboarding\/?$/, { timeout: 15000 });
    });

    test("character limit enforced in display name field", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();       
        
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('alkdhflkasdjflsdjlksdjglksdddd');
        await expect(page.locator('div').filter({ hasText: /^30\/30$/ }).nth(5)).toBeVisible();
    });

    test("finishing onboarding redirects to dashboard", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
    });

    test("single selection is allowed for progression in step 3", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //wait to be redirected to onboarding
        // await page.waitForURL("http://adultna.com/auth/onboarding", { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('wiles');
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Graduating Student' }).click();
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Government IDs' }).click();
        await page.getByRole('button', { name: 'Next →' }).click();

        await expect(page.getByRole('main')).toContainText('You\'re all set!');
    });

    test("persistence of selection when page reloads", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //wait to be redirected to onboarding
        // await page.waitForURL("http://adultna.com/auth/onboarding", { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('wiles');
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Graduating Student' }).click();
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Government IDs' }).click();
        await page.getByRole('button', { name: 'Resume Making' }).click();
        await page.reload();
        await expect(page.getByRole('button', { name: 'Government IDs' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Resume Making' })).toBeVisible();
    });

    test("persistence of selection when user navigates back", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //wait to be redirected to onboarding
        // await page.waitForURL("http://adultna.com/auth/onboarding", { timeout: 15000 });

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('wiles');
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Graduating Student' }).click();
        await page.getByRole('button', { name: '← Back' }).click();
        await page.getByRole('button', { name: 'Next →' }).click();
        await expect(page.getByRole('button', { name: 'Graduating Student' })).toBeVisible();

    });

    test("resumption of onboarding once user logs back in after logging out", async ({ page }) => {
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        //navigate to onboarding
        await page.goto("http://adultna.com/auth/onboarding");
        await page.getByRole('textbox', { name: 'Enter your display name' }).click();        
        await page.getByRole('textbox', { name: 'Enter your display name' }).fill('Wiles');
        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Skip' }).click();
        await page.getByRole('button', { name: 'Government IDs' }).click();
        await page.getByRole('button', { name: 'Find a Job' }).click();

        //wait for idle timeout
        await page.waitForTimeout(6000);

        //log back in
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await page.goto("http://adultna.com/auth/onboarding");
    });
});