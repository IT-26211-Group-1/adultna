import { test, expect } from "@playwright/test";

test.describe("Filebox module", () => {
    test("filebox page is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();
        await expect(page).toHaveURL(/\/filebox\/?$/, { timeout: 15000 });
    });

    test("upload of pdf file is supported" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: '+ Upload' }).click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Resume2025.pdf');
        await page.getByRole('button', { name: 'Select a category...' }).click();
        await page.getByRole('option', { name: 'Career' }).click();
        await page.getByRole('button', { name: 'Upload' }).last().click();
        
        await expect(page.getByText('Successfully uploaded 1 file')).toBeVisible();
    });

    test("upload of docx/doc file is supported" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: '+ Upload' }).click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('myresume.docx');
        await page.getByRole('button', { name: 'Select a category...' }).click();
        await page.getByRole('option', { name: 'Personal' }).click();
        await page.getByRole('button', { name: 'Upload' }).last().click();
        
        await expect(page.getByText('Successfully uploaded 1 file')).toBeVisible();
    });

    test("batch file upload is supported" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: '+ Upload' }).click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles(['flightdeets.pdf', 'NILO_coverletter.docx']);
        await page.getByRole('button', { name: 'Select a category...' }).click();
        await page.getByRole('option', { name: 'Career' }).click();
        await page.getByRole('button', { name: 'Upload' }).last().click();
        
        await expect(page.getByText('Successfully uploaded 2 files')).toBeVisible();
    });

    test("over the limit of 10mb file validation" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: '+ Upload' }).click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('thesis-2025.pdf');
        
        await expect(page.getByText('max 10 MB')).toBeVisible();
    });

    test("mark document as secured" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: '+ Upload' }).click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('NSO_2001.pdf');
        await page.getByRole('button', { name: 'Select a category...' }).click();
        await page.getByLabel('Personal', { exact: true }).getByText('Personal').click();
        await page.getByLabel('', { exact: true }).check();
        await page.getByRole('button', { name: 'Upload' }).last().click();
        
        await expect(page.getByText('Successfully uploaded 1 file')).toBeVisible();
    });

    test("ask for OTP modal to view secured documents" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        
        await page.getByRole('button', { name: 'Preview file' }).nth(6).click();
        await expect(page.getByText('Secure Document Access')).toBeVisible();

    });

    test("same name/duplicate files are not allowed" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: '+ Upload' }).click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Resume2025.pdf');
        await page.getByRole('button', { name: 'Select a category...' }).click();
        await page.getByRole('option', { name: 'Career' }).click();
        await page.getByRole('button', { name: 'Upload' }).last().click();
        
        await expect(page.getByText('Error: File name already exists')).toBeVisible();
    });

    test("verify cancel upload behavior" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
    });

    test("document archiving - not permanently deleted" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });
        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: 'More Actions' }).first().click();
        await page.getByText('Archive').nth(1).click();
        await page.getByText('Archive').last().click();
        await expect(page.getByText('File archived successfully')).toBeVisible();
    });

    test("rename of files" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to filebox
        await page.getByRole('button', { name: 'Adulting Toolkit' }).click();
        await page.getByRole('link', { name: 'Adulting Filebox' }).click();

        await page.getByRole('button', { name: '+ Upload' }).click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await page.locator('input[type="file"]').setInputFiles('Lewis Dominique Nilo_CV.pdf');
        await page.getByRole('button', { name: 'Select a category...' }).click();
        await page.getByLabel('Career', { exact: true }).getByText('Career').click();
        await page.getByRole('button', { name: 'Upload' }).last().click();
        
        await page.getByRole('button', { name: 'More Actions' }).first().click();
        await page.getByText('Rename').click();
        await page.getByRole('textbox', { name: 'File name' }).click();
        await page.getByRole('textbox', { name: 'File name' }).fill('LDNilo_CV.docx');
        await page.getByRole('button', { name: 'Rename' }).click();
        await expect(page.getByText('File renamed successfully')).toBeVisible();
    });
});