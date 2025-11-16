import { test, expect } from "@playwright/test";

test.describe("Login Form", () => {
  test("should be able to login with valid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "QWEasd123.");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
    });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "1nvAl3d@example.com");
    await page.fill('input[name="password"]', "wrongpassword");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Login failed")).toBeVisible();
  });

  test("user that does not exist cannot log in", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "nonexistentuser@example.com");
    await page.fill('input[name="password"]', "somepassword");

    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Login failed")).toBeVisible();
  });

  // test("email and password fields should be required", async ({ page }) => {
  //   await page.goto("http://localhost:3000/auth/login");
  //   await page.getByRole("button", { name: "Login" }).click();

  //   await expect(page.getByText("Email is required")).toBeVisible();
  //   await expect(page.getByText("Password is required")).toBeVisible();
  // });

  test("email and password fields should have required formats", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "short");

    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
    await expect(errorMessages.filter({ hasText: "Password must be at least 8 characters long" })).toBeVisible();
  });

  // // not yet implemented
  // test("user can't login without a password", async ({ page }) => {
  //   await page.goto("http://localhost:3000/auth/login");
  //   await page.fill('input[name="email"]', "adultna.org@gmail.com");
  //   await page.fill('input[name="password"]', "");

  //   await page.getByRole("button", { name: "Login" }).click();

  //   const errorMessages = page.locator('[data-slot="error-message"]');
  //   await expect(errorMessages.filter({ hasText: "Password is required" })).toBeVisible();
  // });

  // // not yet implemented
  // test("user can't login without an email", async ({ page }) => {
  //   await page.goto("http://localhost:3000/auth/login");
  //   await page.fill('input[name="email"]', "");
  //   await page.fill('input[name="password"]', "QWEasd123.");

  //   await page.getByRole("button", { name: "Login" }).click();

  //   const errorMessages = page.locator('[data-slot="error-message"]');
  //   await expect(errorMessages.filter({ hasText: "Email is required" })).toBeVisible();
  // });

  test("unverified users cannot log in", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "scarguez0320@gmail.com");
    await page.fill('input[name="password"]', "scarguez123!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Please verify your email before logging in.")).toBeVisible();
  });

  test("missing @ character is not accepted in email", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "invalidemail.com");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
  });

  test("missing .com is not accepted in email", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "invalidemail@");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
  });

  test("can't login if password is less than 8 characters", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "short");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Password must be at least 8 characters long" })).toBeVisible();
  });

  test("login can't be done with correct email but wrong password", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "WrongPassword123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Login failed - Invalid Credentials")).toBeVisible();
  });

  test("login doesn't accept SQL injection attempts", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "DROP TABLE users;");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();
  });

  test("login doesn't accept script injection attempts", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "<script>alert('hack');</script>");
    await page.fill('input[name="password"]', "QWEasd123.");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessages = page.locator('[data-slot="error-message"]');
    await expect(errorMessages.filter({ hasText: "Invalid Email Format" })).toBeVisible();  
  });

  // // not yet implemented
  // test("login button is disabled until required fields are filled", async ({ page }) => {
  //   await page.goto("http://localhost:3000/auth/login");
  //   const loginButton = page.getByRole("button", { name: "Login" });
  //   await expect(loginButton).toBeDisabled();
  //   await page.fill('input[name="email"]', "user@example.com");
  //   await page.fill('input[name="password"]', "QWEasd123.");
  //   await expect(loginButton).toBeEnabled();
  // });

  test("login trims leading and trailing spaces in email and password fields", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "  user@example.com  ");
    await page.fill('input[name="password"]', "  QWEasd123.  ");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
  });

  test("dashboard is inaccessible without login", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard");
    await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
  });

  // make this a standard, per page must check its load time
  test("login page loads within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("http://localhost:3000/auth/login");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000); // 10 seconds
  });

});