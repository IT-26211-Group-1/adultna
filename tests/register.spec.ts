import { test, expect } from "@playwright/test";

test.describe("Register Form", () => {
  test("should display register form elements", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator(
        "text=/required|cannot be empty|please confirm|please enter|password must be/i",
      ).first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("should show error for mismatched passwords", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");

    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "DifferentPassword123.");

    await page.getByRole("button", { name: "Register" }).click();

    // Should show password mismatch error
    await expect(
      page.locator("text=/passwords do not match|must match/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("should register successfully with test reCAPTCHA", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");

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
    await page.goto("http://localhost:3000/auth/register");

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
    await page.goto("http://localhost:3000/auth/register");

    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "   QWEasd123.  ");
    await page.fill('input[name="confirmPassword"]', "   DifferentPassword123.  ");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/password cannot contain spaces/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("can't register with an already used email", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "scarguez0320@gmail.com");
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

  test("cannot register without accepting terms and conditions", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "QWEasd123.");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/you must accept the terms and conditions/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("no special characters in name fields", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");
    await page.fill('input[name="firstName"]', "T@est!");
    await page.fill('input[name="lastName"]', "Us#er$");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "QWEasd123.");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/name can only contain letters, spaces, hyphens, and apostrophes/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("names must be at least 2 characters long", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");
    await page.fill('input[name="firstName"]', "A");
    await page.fill('input[name="lastName"]', "B");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.fill('input[name="confirmPassword"]', "QWEasd123.");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/name must be at least 2 characters/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test("password strength requirements", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/register");
    await page.fill('input[name="firstName"]', "Test");
    await page.fill('input[name="lastName"]', "User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "QWE.");
    await page.fill('input[name="confirmPassword"]', "QWE.");
    await page.getByRole("button", { name: "Register" }).click();

    await expect(
      page.locator("text=/password must be at least 8 characters long/i").first(),
    ).toBeVisible({ timeout: 3000 });
  });

  // // not yet implemented
  // test("register with slow internet connection", async ({ page }) => {
  //   // Simulate slow network
  //   await page.route("**/*", (route) => {
  //     setTimeout(() => route.continue(), 5000); // 3 seconds delay
  //   });

  //   await page.goto("http://localhost:3000/auth/register");
  //   await page.fill('input[name="firstName"]', "Slow");;
  //   await page.fill('input[name="lastName"]', "Connection");
  //   await page.fill('input[name="email"]', `slow.connection+${Date.now()}@example.com`);
  //   await page.fill('input[name="password"]', "SlowPassword123.");
  //   await page.fill('input[name="confirmPassword"]', "SlowPassword123.");

  //   await page.getByLabel("I accept the terms and conditions").click();

  //   // Click Register to trigger captcha
  //   await page.getByRole("button", { name: "Register" }).click();
  //   const recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
  //   await recaptchaFrame.getByRole('checkbox', { name: "I'm not a robot" }).click();
  //   // Small wait for the token to be generated
  //   await page.waitForTimeout(1000);
  //   await page.getByRole("button", { name: "Register" }).click();

  //   // if registration request exceeds timeout, user will see error message 'Try Again'
  //   await expect(page.locator("text=Try Again")).toBeVisible({ timeout: 20000 });

  //   await expect(page).toHaveURL(/\/auth\/verify-email\/?$/, { timeout: 20000 });
  // });

  // make this a standard, per page must check its load time
  test("register page loads within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("http://localhost:3000/auth/register");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000); // 10 seconds
  });
});
