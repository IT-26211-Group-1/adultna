import { test, expect } from "@playwright/test";

test.describe("Cover Letter Helper", () => {
    test("cover letter helped page is accessible" , async ({ page }) => {
        //simulate login of a user
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to cover letter helper
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Cover Letter Helper' }).click();
    });

    test("upload of pdf file is supported" , async ({ page }) => {
        //simulate login of a user
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to cover letter helper
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Cover Letter Helper' }).click();

        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Lewis Dominique Nilo_CV.pdf');
        await page.getByRole('button', { name: 'Generate AI Cover Letter' }).click();
        await page.waitForTimeout(30000);
        await expect(page).toHaveURL(/\/cover-letter\/editor\/?/, {timeout: 15000});
    });

    test("submitting files that are not resumes" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Cover Letter Helper' }).click();

        //click upload button
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('document.pdf');
        await page.getByRole('button', { name: 'Generate AI Cover Letter' }).click();
        await expect(page.getByText('Failed to generate cover letter')).toBeVisible();
    });

    test("selection tone is not required" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Cover Letter Helper' }).click();

        //click upload button
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Lewis Dominique Nilo_CV.pdf');
        await page.getByRole('button', { name: 'Generate AI Cover Letter' }).click();
        await page.waitForTimeout(30000);
        await expect(page).toHaveURL(/\/cover-letter\/editor\/?/, { timeout: 15000 });
    });

    test("verify export to pdf" , async ({ page }) => {
        //simulate login of a user
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to cover letter helper
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Cover Letter Helper' }).click();

        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Lewis Dominique Nilo_CV.pdf');
        await page.getByRole('button', { name: 'Generate AI Cover Letter' }).click();
        await page.waitForTimeout(30000);
        await expect(page).toHaveURL(/\/cover-letter\/editor\/?/, { timeout: 15000 });

        await page.getByRole('button', { name: 'Export PDF' }).click({timeout: 15000});
        await page.waitForTimeout(5000);
        await page.getByText('PDF downloaded successfully!').isVisible();
    });

    test("verify character limits/validations per section" , async ({ page }) => {
        //simulate login of a user
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to cover letter helper
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Cover Letter Helper' }).click();

        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Lewis Dominique Nilo_CV.pdf');
        await page.getByRole('button', { name: 'Generate AI Cover Letter' }).click();
        await page.waitForTimeout(30000);
        await expect(page).toHaveURL(/\/cover-letter\/editor\/?/, { timeout: 15000 });

        await page.getByRole('textbox', { name: 'Introduction' }).fill('A'.repeat(805));
        await page.getByText('Character limit exceeded').isVisible();
        await page.getByRole('textbox', { name: 'Introduction' }).fill('A'.repeat(500));

        await page.getByRole('button', { name: 'Proceed to Body' }).click();
        await page.getByRole('textbox', { name: 'Body' }).fill('A'.repeat(1201));
        await expect(page.getByText('Body is too long. Please')).toBeVisible();
        await page.getByRole('textbox', { name: 'Body' }).fill('A'.repeat(1000));
        
        await page.getByRole('button', { name: 'Proceed to Conclusion' }).click();
        await page.getByRole('textbox', { name: 'Conclusion' }).fill('A'.repeat(605));
        await expect(page.getByText('Conclusion is too long.')).toBeVisible();
        await page.getByRole('textbox', { name: 'Conclusion' }).fill('A'.repeat(500));

        await page.getByRole('button', { name: 'Proceed to Signature' }).click();
        
        await page.getByRole('button', { name: 'Complete Cover Letter' }).click(); 
        await page.waitForTimeout(10000);
        
        await expect(page.getByText('Cover Letter Complete')).toBeVisible();       
    });

    test("verify save to filebox functionality" , async ({ page }) => {
        //simulate login of a user
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to cover letter helper
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Cover Letter Helper' }).click();

        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Lewis Dominique Nilo_CV.pdf');
        await page.getByRole('button', { name: 'Generate AI Cover Letter' }).click();
        await page.waitForTimeout(10000);
        await expect(page).toHaveURL(/\/cover-letter\/editor\/?/, { timeout: 15000 });

        await page.getByRole('textbox', { name: 'Introduction' }).fill('A'.repeat(805));
        await page.getByText('Character limit exceeded').isVisible();
        await page.getByRole('textbox', { name: 'Introduction' }).fill('A'.repeat(500));

        await page.getByRole('button', { name: 'Proceed to Body' }).click();
        await page.getByRole('textbox', { name: 'Body' }).fill('A'.repeat(1201));
        await expect(page.getByText('Body is too long. Please')).toBeVisible();
        await page.getByRole('textbox', { name: 'Body' }).fill('A'.repeat(1000));
        
        await page.getByRole('button', { name: 'Proceed to Conclusion' }).click();
        await page.getByRole('textbox', { name: 'Conclusion' }).fill('A'.repeat(605));
        await expect(page.getByText('Conclusion is too long.')).toBeVisible();
        await page.getByRole('textbox', { name: 'Conclusion' }).fill('A'.repeat(500));

        await page.getByRole('button', { name: 'Proceed to Signature' }).click();
        await page.getByRole('button', { name: 'Complete Cover Letter' }).click(); 

        await page.getByRole('button', { name: 'Save to Filebox' }).click();
        await page.waitForTimeout(7000);
        await expect(page.getByRole('alertdialog', { name: 'Saved to Filebox!' })).toBeVisible();
    });
});