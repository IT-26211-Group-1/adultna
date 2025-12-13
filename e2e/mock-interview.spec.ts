import { test, expect } from "@playwright/test";

test.describe("Mock Interview Coach", () => {
    test("mock interview page is accessible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to mock interview section
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Mock Interview Coach' }).click();
        await expect(page).toHaveURL(/\/mock-interview\/?$/, { timeout: 15000 });
    });

    test("module selection is possible" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to mock interview section
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Mock Interview Coach' }).click();

        await page.getByRole('button', { name: 'General' }).click();
    });

    test("module selected is reflected" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to mock interview section
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Mock Interview Coach' }).click();

        await page.getByRole('button', { name: 'General' }).click();
        await expect(page.getByText('General')).toBeVisible();
    });

    test("interview progress is restored upon page reload" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to mock interview section
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Mock Interview Coach' }).click();

        await page.getByRole('button', { name: 'General' }).click();
        await page.getByRole('button', { name: 'I\'m Ready!' }).click();

        await page.getByText('Questions 1 of 4').isVisible();
        await page.getByRole('textbox', { name: 'Type your answer here...' }).fill('I am a hardworking individual who is always eager to learn new things and take on new challenges.');
        
        await page.getByRole('button', { name: 'Next' }).click();
        await page.waitForTimeout(15000); //wait for 15 seconds to simulate grading time

        await page.getByText('Questions 2 of 4').isVisible();
        await page.reload();

        await page.getByRole('button', { name: 'I\'m Ready!' }).click();
        await page.getByText('Questions 2 of 4').isVisible();
    });

    test("load time after question is submitted is grading the question time" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to mock interview section
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Mock Interview Coach' }).click();

        await page.getByRole('button', { name: 'General' }).click();
        await page.getByRole('button', { name: 'I\'m Ready!' }).click();

        await page.getByText('Questions 1 of 4').isVisible();
        await page.getByRole('textbox', { name: 'Type your answer here...' }).fill('I am a hardworking individual who is always eager to learn new things and take on new challenges.');
        
        await page.getByRole('button', { name: 'Next' }).click();
        await page.waitForTimeout(10000); //wait for 10 seconds to simulate grading time

        await page.getByText('Questions 2 of 4').isVisible();
    });

    test("validations of character/word count in answer field" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to mock interview section
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Mock Interview Coach' }).click();

        await page.getByRole('button', { name: 'General' }).click();
        await page.getByRole('button', { name: 'I\'m Ready!' }).click();

        await page.getByRole('textbox', { name: 'Type your answer here...' }).fill('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu');
        await expect(page.getByText('500 characters • 73 words')).toBeVisible();
        await expect(page.getByText('Good length')).toBeVisible();
    });
});