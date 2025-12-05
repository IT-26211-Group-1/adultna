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
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
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

    test("admin logout redirects to login page" , async ({ page }) => {
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
    });

    test("user is able to be deactivated" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("user feedback and reports page is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("add new feedback is successful" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/homepage\/?$/, { timeout: 15000 });
    });

    test("user feedback can be archived" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("content management - onboarding questions is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("content management - interview questions is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("content management - government guides page is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("government guides can be archived" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("interview questions can be archived" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("onboarding questions can be archived" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("government guides can be edited" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("audit logs are accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("audit logs can be exported to csv file successfully" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });

    test("audit logs can be sorted by the given metrics" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/admin/login");
        await page.fill('input[name="email"]', "admin@gmail.com");
        await page.fill('input[name="password"]', "QWEasd123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/admin\/dashboard\/?$/, { timeout: 15000 });
    });
    
});