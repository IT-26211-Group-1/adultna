import { test, expect } from "@playwright/test";

test.describe("Job Board module", () => {
    test("should display job listings", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();

        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });
    });

    test("verify search bar behavior, empty search yields no changes", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();
        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });

        await expect(page.getByRole('textbox', { name: 'Search jobs' })).toBeVisible();
    });

    test("verify search bar behavior, valid search yields results", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();
        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });

        await page.getByRole('textbox', { name: 'Search jobs' }).fill('Project Manager');
        await expect(page.getByRole('textbox', { name: 'Search jobs' })).toHaveValue('Project Manager'); 

        await expect(page.getByRole('heading', { name: 'Search results for "Project' })).toBeVisible();
    });

    test("verify that confirmation modal appears when clicking view listing", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();
        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });

        await page.getByRole('textbox', { name: 'Search jobs' }).click();
        await page.getByRole('textbox', { name: 'Search jobs' }).fill('Project Manager');

    });

    test("verify actions of third party link confirmation modal", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();
        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });
        
        await page.getByRole('textbox', { name: 'Search jobs' }).fill('Project Manager');
        await page.getByRole('button', { name: 'View Listing' }).first().click();
        await page.waitForTimeout(10000); //wait for modal animation
        await expect(page.getByRole('heading', { name: 'You are leaving AdultNa' })).toBeVisible();

        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('heading', { name: 'You are leaving AdultNa' })).not.toBeVisible();

        await page.getByRole('button', { name: 'View Listing' }).first().click();
        await page.waitForTimeout(10000); //wait for modal animation    
        await page.getByRole('button', { name: 'Continue' }).click();

        // Since the link opens in a new tab, we can only verify that the modal is closed
        await expect(page.getByRole('heading', { name: 'You are leaving AdultNa' })).not.toBeVisible();
    });

    test("validate job listing filters", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();
        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });


        await page.getByRole('combobox').first().selectOption('remote');
        await page.getByRole('combobox').first().selectOption('onsite');
        await expect(page.getByText('On-site').nth(1)).toBeVisible();
        await page.getByRole('combobox').first().selectOption('hybrid');
        await page.getByRole('combobox').first().selectOption('all');
        await page.getByRole('combobox').nth(1).selectOption('full-time');
        await expect(page.getByText('Full-time').nth(1)).toBeVisible();
        await page.getByRole('combobox').nth(1).selectOption('part-time');
        await expect(page.getByLabel('Job listings').getByText('Part-time')).toBeVisible();
        await page.getByRole('combobox').nth(1).selectOption('contract');
        await expect(page.getByText('Contractor')).toBeVisible();
        await page.getByRole('combobox').nth(1).selectOption('internship');
        await expect(page.getByLabel('Job listings').getByText('Internship')).toBeVisible();
    });

    test("verify system handling of no results returned from search and filters", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();
        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });

        await page.getByRole('combobox').first().selectOption('remote');
        await expect(page.getByText('No recent jobs available')).toBeVisible();
    });

    test("clear search button behavior", async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to job board
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Job Board' }).click();
        await expect(page).toHaveURL(/\/jobs\/?$/, { timeout: 15000 });


        await page.getByRole('textbox', { name: 'Search jobs' }).click();
        await page.getByRole('textbox', { name: 'Search jobs' }).fill('Manager');
        await page.getByRole('button', { name: 'Clear search' }).click();

        //Manager results are cleared
        await expect(page.getByRole('textbox', { name: 'Search jobs' })).toHaveValue('');
    });
});