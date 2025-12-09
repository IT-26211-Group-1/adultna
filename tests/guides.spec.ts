import { test, expect } from "@playwright/test";

test.describe("GovGuides module", () => {
    test("guides page is rendered" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();

        await page.getByRole('link', { name: 'GovGuides' }).click();
        await expect(page).toHaveURL(/\/gov-guides\/?/, { timeout: 15000 });
    });

    test("guides page loads in less than 15 seconds" , async ({ page }) => {
        const start = Date.now();
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();

        await page.getByRole('link', { name: 'GovGuides' }).click();
        await expect(page).toHaveURL(/\/gov-guides\/?/, { timeout: 15000 });
        const loadTime = Date.now() - start;
        expect(loadTime).toBeLessThan(15000); // 10 seconds
    });

    test("verify search functionality" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'GovGuides' }).click();

        await page.getByRole('textbox', { name: 'Search government processes' }).fill('Passport');
        await expect(page.getByRole('main')).toContainText('How to apply for a Passport for New Applicants');
    });

    test("search supports partial keywords" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'GovGuides' }).click();

        await page.getByRole('textbox', { name: 'Search government processes' }).fill('Pass');
        await expect(page.getByRole('main')).toContainText('How to apply for a Passport for New Applicants');
    });

    test("verify case insensitive search" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'GovGuides' }).click();

        await page.getByRole('textbox', { name: 'Search government processes' }).fill('pass');
        await expect(page.getByRole('main')).toContainText('How to apply for a Passport for New Applicants');

        await page.getByRole('textbox', { name: 'Search government processes' }).fill('PASS');
        await expect(page.getByRole('main')).toContainText('How to apply for a Passport for New Applicants');

        await page.getByRole('textbox', { name: 'Search government processes' }).fill('pASS');
        await expect(page.getByRole('main')).toContainText('How to apply for a Passport for New Applicants');
    });

    test("validate category filter" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'GovGuides' }).click();

        await page.getByRole('combobox').selectOption('identification');
        await expect(page.locator('div').filter({ hasText: /^Government IDs$/ })).toBeVisible();
    });

    test("verify message display when no guide is found" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'GovGuides' }).click();

        await page.getByRole('textbox', { name: 'Search government processes' }).fill('Marriage License for Cats');
        await expect(page.getByRole('main')).toContainText('No guides found matching your criteria.');
    });

    test("language alternatives available" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to guides page
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'GovGuides' }).click();


        await page.getByRole('button', { name: 'Change language' }).click();
        await page.getByText('Filipino').click();
        await page.waitForTimeout(5000); //wait for language to switch
        await expect(page.locator('h1')).toContainText('Ang iyong gabay sa pag-adulting sa Pilipinas!');
    });
});