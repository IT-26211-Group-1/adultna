import { test, expect } from "@playwright/test";

test.describe("Login Form", () => {
  test("should be able to login with valid credentials", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "QWEasd123.");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
    });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "1nvAl3d@example.com");
    await page.fill('input[name="password"]', "wrongpassword");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid Credentials")).toBeVisible();
  });

  test("user that does not exist cannot log in", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "nonexistentuser@example.com");
    await page.fill('input[name="password"]', "somepassword");

    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid Credentials")).toBeVisible();
  });

  test("email and password fields should be required", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "");
    await page.fill('input[name="password"]', "");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Email is required" })).toBeVisible();
    await expect(errorMessages.filter({ hasText: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" })).toBeVisible();
  });

  test("email and password fields should have required formats", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "short");

    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
    await expect(errorMessages.filter({ hasText: "Password must be at least 8 characters long" })).toBeVisible();
  });

  test("user can't login without a password", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "");

    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" })).toBeVisible();
  });

  test("user can't login without an email", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "");
    await page.fill('input[name="password"]', "QWEasd123.");

    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Email is required" })).toBeVisible();
  });

  test("unverified users cannot log in", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "liambc@gmail.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Email not verified")).toBeVisible();
  });

  test("missing @ character is not accepted in email", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "invalidemail.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
  });

  test("missing .com is not accepted in email", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "invalidemail@");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
  });

  test("can't login if password is less than 8 characters", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "short");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Password must be at least 8 characters long" })).toBeVisible();
  });

  test("login can't be done with correct email but wrong password", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "WrongPassword123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid Credentials")).toBeVisible();
  });

  test("login doesn't accept SQL injection attempts", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "DROP TABLE users;");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
  });

  test("login doesn't accept script injection attempts", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "<script>alert('hack');</script>");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();  
  });

  test("login doesn't accept leading and trailing spaces in email and password fields", async ({ page }) => {
    await page.goto("http://adultna.com/auth/login");
    await page.fill('input[name="email"]', "  lewisdomnilo@gmail.com  ");
    await page.fill('input[name="password"]', "  Lewis123.  ");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid Credentials")).toBeVisible();
  });

  test("dashboard is inaccessible without login", async ({ page }) => {
    await page.goto("http://adultna.com/dashboard/");
    await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
  });

  // make this a standard, per page must check its load time
  test("login page loads within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("http://adultna.com/auth/login");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000); // 10 seconds
  });

});