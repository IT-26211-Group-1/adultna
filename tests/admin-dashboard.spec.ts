import { test, expect } from "@playwright/test";

test.describe("Admin dashboard", () => {
    test("user accounts not allowed" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await page.getByText("Invalid credentials.").isVisible();
    });

    test("admin login with invalid credentials shows error" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await page.getByText("Invalid credentials.").isVisible();
    });

    test("admin login with valid credentials redirects to admin dashboard" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("user management page is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('link', { name: 'User Management' }).click();

        await expect(page).toHaveURL(/\/admin\/accounts\/?$/, { timeout: 15000 });
    });

    test("user feedback and reports page is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await page.getByRole('link', { name: 'User Feedback & Report' }).click();

        await expect(page).toHaveURL(/\/admin\/feedback\/?$/, { timeout: 15000 });
    });

    test("add new feedback is successful" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });


        await page.getByRole('link', { name: 'User Feedback & Report' }).click();
        await page.getByRole('button', { name: 'Add Feedback' }).click();
        await page.getByRole('textbox', { name: 'Title *' }).click();
        await page.getByRole('textbox', { name: 'Title *' }).fill('Browser request permission isn\'t coming out');
        await page.getByRole('textbox', { name: 'Description *' }).click();
        await page.getByRole('textbox', { name: 'Description *' }).fill('When I\'m about to use the mock interview coach, and I wanna use the dictation feature, the pop up to ask for mic permission isn\'t coming out so I end up not using it.');
        await page.getByLabel('Type *').selectOption('report');
        await page.getByLabel('Related Feature *').selectOption('mock_interview_coach');
        await page.getByRole('button', { name: 'Create Feedback' }).click();

        await page.getByText('Feedback created successfully').isVisible();
    });

    test("content management - onboarding questions is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Onboarding questions' }).click();
        await expect(page).toHaveURL(/\/admin\/content\/onboarding\/?$/, { timeout: 15000 });
    });

    test("content management - interview questions is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Interview questions bank' }).click();
        await expect(page).toHaveURL(/\/admin\/content\/questions\/?$/, { timeout: 15000 });
    });

    test("content management - government guides page is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Government processes' }).click();
        await expect(page).toHaveURL(/\/admin\/content\/guides\/?$/, { timeout: 15000 });
    });

    test("government guides can be edited" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Content Management' }).click();
        await page.getByRole('link', { name: 'Government processes' }).click();
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
        await page.getByRole('menuitem', { name: 'Edit Guide' }).click();
        await page.getByRole('textbox', { name: 'Guide Title *' }).fill('How to apply for A New Passport for New Applicants');
        await page.getByRole('button', { name: 'Update Guide' }).click();
        await page.getByText('Guide updated successfully').isVisible();
    });

    test("audit logs are accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('link', { name: 'Audit Logs' }).click();
        await expect(page).toHaveURL(/\/admin\/logs\/?$/, { timeout: 15000 });
    });

    test("audit logs can be sorted by the given metrics" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('link', { name: 'Audit Logs' }).click();

        await page.getByRole('button', { name: 'Last 30 Days' }).click();
        await page.getByRole('button', { name: 'Last 90 Days' }).click();
        await page.getByRole('button', { name: 'Today' }).click();
        await page.getByRole('button', { name: 'Last 7 Days' }).click();
    });
    
});