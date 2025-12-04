import { test, expect } from "@playwright/test";

test.describe("Register Form", () => {
  test("should display register form elements", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");

    await page.fill('input[name="firstName"]', "");
    await page.fill('input[name="lastName"]', "");
    await page.fill('input[name="email"]', "");
    await page.fill('input[name="password"]', "");
    await page.fill('input[name="confirmPassword"]', "");

    await page.getByLabel("I accept the terms and conditions").click();

    await expect(
      page.locator(
        "text=/required|cannot be empty|please confirm|please enter|password must be /i",
      ).first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("should show error for mismatched passwords", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");

    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "DifferentPassword123.");

    await page.getByLabel("I accept the terms and conditions").click();

    await page.getByRole("button", { name: "Register" }).click();

    // Should show password mismatch error
    await expect(
      page.locator("text=/passwords do not match|must match/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("should register successfully with test reCAPTCHA", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");

    await page.fill('input[name="firstName"]', "Sample");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', `sample.user+${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "SamplePassword123.");
    await page.fill('input[name="confirmPassword"]', "SamplePassword123.");

    await page.getByLabel("I accept the terms and conditions").click();

    // Click Register to trigger captcha
    await page.getByRole("button", { name: "Register" }).click();

    const recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
    await recaptchaFrame.getByRole('checkbox', { name: "I'm not a robot" }).click();

    // Small wait for the token to be generated
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Register" }).click();

    await expect(page).toHaveURL(/\/auth\/verify-email\/?$/, { timeout: 20000 });
  });

  test("trimmed leading and trailing spaces in name and email fields", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");

    await page.fill('input[name="firstName"]', "   Test  ");
    await page.fill('input[name="lastName"]', "  User   ");
    await page.fill('input[name="email"]', `   sample.user+${Date.now()}@example.com   `);
    await page.fill('input[name="password"]', "SamplePassword123.");
    await page.fill('input[name="confirmPassword"]', "SamplePassword123.");

    await expect(
      page.locator("text=/cannot start or end with spaces/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("no spaces in password fields", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");

    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "   QWEasd123.  ");
    await page.fill('input[name="confirmPassword"]', "   DifferentPassword123.  ");

    await page.getByLabel("I accept the terms and conditions").click();

    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByText("Password cannot contain spaces")).toBeVisible();

  });

  test("can't register with an already used email", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "QWEasd123.");

    await page.getByLabel("I accept the terms and conditions").click();

    await page.getByRole("button", { name: "Register" }).click();
    const recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
    await recaptchaFrame.getByRole('checkbox', { name: "I'm not a robot" }).click();

    // Small wait for the token to be generated
    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/email is already registered!/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("register button is disabled until terms are accepted", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");

    // fill required fields so validation doesn't block the button
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test+disabledcheck@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "QWEasd123.");

    const registerBtn = page.getByRole("button", { name: "Register" });

    await expect(registerBtn).toBeDisabled();

    await page.getByLabel("I accept the terms and conditions").check();
    await expect(registerBtn).toBeEnabled();

    await page.getByLabel("I accept the terms and conditions").uncheck();
    await expect(registerBtn).toBeDisabled();
});

  test("no special characters in name fields", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");
    await page.fill('input[name="firstName"]', "T@est!");
    await page.fill('input[name="lastName"]', "Us#er$");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "QWEasd123.");

    await page.getByLabel("I accept the terms and conditions").click();

    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/name can only contain letters, spaces, hyphens, and apostrophes/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("names must be at least 2 characters long", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");
    await page.fill('input[name="firstName"]', "A");
    await page.fill('input[name="lastName"]', "B");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "QWEasd123.");

    await page.getByLabel("I accept the terms and conditions").click();


    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/name must be at least 2 characters/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("password strength requirements", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWE.");
    await page.fill('input[name="confirmPassword"]', "QWE.");

    await page.getByLabel("I accept the terms and conditions").click();
    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/password must be at least 8 characters long/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("user should be able to register with their google account", async ({ page }) => {
    await page.goto("http://localhost:3001/auth/register");
    await page.getByRole("button", { name: "Continue with Google" }).click();

    await page.fill('input[type="Email"]', "whistlestrife@gmail.com");
    await page.getByRole("button", { name: "Next" }).click();

    await page.fill('input[type="Password"]', "lewdominique0320");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page).toHaveURL(/\/auth\/google\/?$/, { timeout: 20000 });

    await page.getByRole("button", { name: "Authorize & Continue" }).click();
  });

  // make this a standard, per page must check its load time
  test("register page loads within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("http://localhost:3001/auth/register");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000); // 10 seconds
  });
});