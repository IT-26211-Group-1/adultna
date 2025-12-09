import { test, expect } from "@playwright/test";
import path from 'path';

test.describe("Resume Grader module", () => {
    test("verify that resume grader page is accessible", async ({ page }) => {
        //simulate login of a user 
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume grader
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Grade Resume' }).click();
        await page.waitForTimeout(5000);
        await expect(page).toHaveURL(/resume-builder\/\?tab=grade/, { timeout: 15000 });    
});

    test("verify that pdf file can be submitted for grading", async ({ page }) => {
        //simulate login of a user 
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Grade Resume' }).click();
        await page.waitForTimeout(5000);

    });
    
    test("job description is optional", async ({ page }) => {
        //simulate login of a user 
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Grade Resume' }).click();
        await page.waitForTimeout(5000);

        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.setInputFiles('input[type="file"]', 'Lewis Dominique Nilo_CV.pdf');
        await page.getByRole('button', { name: 'Grade My Resume', exact: true }).click();
        await page.getByText('Resume Analysis Complete').isVisible();
    });

    test("job description field input validation character limit", async ({ page }) => {
        //simulate login of a user 
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Grade Resume' }).click();
        await page.waitForTimeout(5000);

        await page.getByRole('textbox', { name: 'Paste the job description' }).fill('A'.repeat(5001));

        await page.getByText('5,000 / 5,000 characters');
        
    });
});