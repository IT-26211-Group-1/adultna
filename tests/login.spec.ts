import { test, expect } from "@playwright/test";

test.describe("Login Form", () => {
  test("should login with valid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "adultna.org@gmail.com");
    await page.fill('input[name="password"]', "QWEasd123.");

    await page.getByRole("button", { name: "Login" }).click();
    await page.goto("http://localhost:3000/dashboard");
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "1nvAl3d@example.com");
    await page.fill('input[name="password"]', "wrongpassword");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Login failed")).toBeVisible();
  });

  test("email and password fields should be required", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("email and password fields should have required formats", async ({ page }) => {
    await page.goto("http://localhost:3000/auth/login");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "short");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid email format")).toBeVisible();
    await expect(page.getByText("Password must be at least 8 characters long")).toBeVisible();
  });

  

});