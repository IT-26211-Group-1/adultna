import { test, expect } from "@playwright/test";

test.describe("Verifier Dashboard functionalities", () => {
    test("is able to access verifier dashboard" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "verifier@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("able to approve interview questions" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "verifier@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Interview questions bank' }).click();
        await page.locator('tr:nth-child(7) > td:nth-child(11) > .relative > div > .p-1').click();
        await page.getByRole('menuitem', { name: 'Update Status' }).click();
        await page.getByLabel('Status *').selectOption('approved');
        await page.getByRole('button', { name: 'Update Status' }).click();
    });

    test("able to approve guide information" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "verifier@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("able to approve onboarding questions" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "verifier@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("able to add new questions - for question bank" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "verifier@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Interview questions bank' }).click();

        await page.getByRole('button', { name: 'Add Question' }).click();
        await page.getByRole('textbox', { name: 'Question *' }).click();
        await page.getByRole('textbox', { name: 'Question *' }).fill('How would you relate one of your hobbies towards how you conduct yourself professionally?');
        await page.getByLabel('Category *').selectOption('behavioral');
        await page.getByLabel('Industry *').selectOption('general');
        await page.locator('form').getByRole('button', { name: 'Add Question' }).click();
    });

    test("able to add new questions - for onboarding questions" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "verifier@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Onboarding questions' }).click();


        await page.getByRole('button', { name: 'Add Question' }).click();
        await page.getByRole('textbox', { name: 'Question *' }).click();
        await page.getByRole('textbox', { name: 'Question *' }).fill('Which age group do you define yourself belonging to?');
        await page.getByRole('textbox', { name: 'Option Text *' }).click();
        await page.getByRole('textbox', { name: 'Option Text *' }).fill('Young adult');
        await page.getByRole('button', { name: '+ Add Option' }).click();
        await page.locator('#option-text-1').click();
        await page.locator('#option-text-1').fill('Seasoned Adult');
        await page.getByRole('button', { name: '+ Add Option' }).click();
        await page.locator('#option-text-2').click();
        await page.locator('#option-text-2').fill('Geriatric Milennial');
        await page.getByRole('button', { name: 'Create Question' }).click();
    });

    test("able to add new guides" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "verifier@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });


        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Government processes' }).click();
        await page.getByRole('button', { name: 'Add Guide' }).click();
        await page.getByRole('textbox', { name: 'Guide Title *' }).fill('How to Apply for a Business Permit');
        await page.getByRole('textbox', { name: 'Issuing Agency *' }).fill('BPLO');
        await page.getByLabel('Category *').selectOption('permits-licenses');
        await page.getByRole('textbox', { name: 'Processing Time' }).fill('1 week');
        await page.getByRole('textbox', { name: 'Step 1 title' }).fill('Apply in your Local Government Unit');
        await page.getByRole('textbox', { name: 'Requirement name (e.g., Valid' }).fill('Valid ID');
        await page.getByRole('button', { name: 'Create Guide' }).click();
    });
});