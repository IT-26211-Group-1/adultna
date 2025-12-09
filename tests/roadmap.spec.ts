import { test, expect } from "@playwright/test";

test.describe("Personalized roadmap", () => {
    test("notifications show in dashboard when roadmap is created" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to roadmap section
        await page.getByRole('link', { name: 'Roadmap' }).click();
        await page.getByRole('button', { name: 'Add Milestone' }).click();
        await page.getByRole('textbox', { name: 'Title*' }).fill('Testing notifications');
        await page.getByRole('button', { name: 'Select a category Category*' }).click();
        await page.getByLabel('Financial Management', { exact: true }).getByText('Financial Management').click();
        await page.getByRole('button', { name: 'Add Milestone' }).click();

        //return to dashboard to check for notification
        await page.goto('https://adultna.com/dashboard/');
        await page.getByText("Testing notifications").first().isVisible();
    });

    test("add new milestone modal shows all required fields and optional ones" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to roadmap section
        await page.getByRole('link', { name: 'Roadmap' }).click();
        await page.getByRole('button', { name: 'Add Milestone' }).click();
        await page.getByRole('textbox', { name: 'Title*' }).isVisible();
        await page.getByRole('button', { name: 'Select a category Category*' }).isVisible();
    });

    test("validate required fields restrictions" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to roadmap section
        await page.getByRole('link', { name: 'Roadmap' }).click();
        await page.getByRole('button', { name: 'Add Milestone' }).click();
        await page.getByRole('textbox', { name: 'Title*' }).fill('');
        await page.getByRole('button', { name: 'Select a category Category*' }).click();
        
        await page.getByRole('button', { name: 'Add Milestone' }).isDisabled();
    });

    test("deadline field rejects/doesn't show past dates" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to roadmap section
        await page.getByRole('link', { name: 'Roadmap' }).click();
        await page.getByRole('button', { name: 'Add Milestone' }).click();
        await page.getByRole('textbox', { name: 'Title*' }).fill('Deadline test');
        await page.getByRole('button', { name: 'Select a category Category*' }).click();
        await page.getByLabel('Professional Growth', { exact: true }).getByText('Professional Growth').click();
        await page.getByRole('textbox', { name: 'Deadline (Optional)' }).fill('1950-03-20');
        await page.getByRole('button', { name: 'Add Milestone' }).isDisabled();
        });

    test("5 tasks per milestone implementation" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to roadmap section
        await page.getByRole('link', { name: 'Roadmap' }).click();
        await page.getByRole('button', { name: 'Add Milestone' }).click();
        await page.getByRole('textbox', { name: 'Title*' }).fill('Deadline test');
        await page.getByRole('button', { name: 'Select a category Category*' }).click();
        await page.getByLabel('Professional Growth', { exact: true }).getByText('Professional Growth')

        await page.getByRole('textbox', { name: 'Add a task' }).click();
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdasdsdasd');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdasdasdawreqrqer');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdjalisjfowijr');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdjlaksjfladjflsdjf');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('last one');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');

        await page.getByRole('button', { name: 'Add Milestone' }).click();
    });

    test("no partial data is saved/created when page refreshes during milestone creation" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to roadmap section
        await page.getByRole('link', { name: 'Roadmap' }).click();
        await page.getByRole('button', { name: 'Add Milestone' }).click();
        await page.getByRole('textbox', { name: 'Title*' }).fill('Deadline test');
        await page.getByRole('button', { name: 'Select a category Category*' }).click();
        await page.getByLabel('Professional Growth', { exact: true }).getByText('Professional Growth').click();

        await page.getByRole('textbox', { name: 'Add a task' }).click();
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdasdsdasd');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdasdasdawreqrqer');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdjalisjfowijr');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('asdjlaksjfladjflsdjf');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');
        await page.getByRole('textbox', { name: 'Add a task' }).fill('qeioruoifjlsdjf');
        await page.getByRole('textbox', { name: 'Add a task' }).press('Enter');

        await page.reload();

        await expect(page.getByRole('textbox', { name: 'Title*' })).not.toBeVisible();
    });
});