import { test, expect } from "@playwright/test";

test.describe("User Profile Management", () => {
    test("notifications can be deleted on dashboard" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //existing notification deletion test steps here
        await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
    });

    test("accepts valid image file formats" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.setInputFiles('input[type="file"]', 'member.jpg');
        await page.getByRole('button', { name: 'Save Changes' }).first().click();
        await page.getByRole('button', { name: 'Yes, Save Changes' }).click();
        await page.waitForTimeout(10000);

        await page.setInputFiles('input[type="file"]', 'icon.jpg');
        await page.getByRole('button', { name: 'Save Changes' }).first().click();
        await page.getByRole('button', { name: 'Yes, Save Changes' }).click();
        await page.waitForTimeout(10000);

    });

    test("validate profile image size limit" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.setInputFiles('input[type="file"]', 'profile.jpg');
        await expect(page.getByText('File size must be less than 2MB')).toBeVisible();    
    });
    
    test("first and last name fields are required" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        await page.waitForTimeout(10000);

        await page.getByRole('textbox', { name: 'First Name*' }).fill('');
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('');
        await page.getByRole('button', { name: 'Save Changes' }).first().click();

        await page.getByText('first Name is required').first().isVisible();
        await page.getByText('last Name is required').first().isVisible();
    });

    test("display name is required" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        await page.waitForTimeout(10000);

        await page.getByRole('textbox', { name: 'Display Name*' }).fill('');
        await page.getByRole('button', { name: 'Save Changes' }).first().click();

        await page.getByText('display Name is required').first().isVisible();
    });

    test("special characters and numbers aren't allowed in name input fields" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();

        await page.getByRole('textbox', { name: 'First Name*' }).fill('(*()*()&987987');
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('(*()*()&987987');
        await page.getByRole('button', { name: 'Save Changes' }).first().click();
        
        await page.getByText('First name can only contain letters, spaces, hyphens, and apostrophes').first().isVisible();
        await page.getByText('Last name can only contain letters, spaces, hyphens, and apostrophes').first().isVisible();
    });

    test("spaces aren't allowed in fields" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        await page.waitForTimeout(10000);

        await page.getByRole('textbox', { name: 'First Name*' }).fill(' Wiles    ');
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('  Nilo   ');
        await page.getByRole('button', { name: 'Save Changes' }).first().click();
        
        await page.getByText('First name cannot start or end with spaces').first().isVisible();
        await page.getByText('Last name cannot start or end with spaces').first().isVisible();

    });

    test("html and script tag sanitization" , async ({ page }) => {
        const randomNum = Math.floor(Math.random() * 10);        
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();

        await page.getByRole('textbox', { name: 'Display Name*' }).fill(`<h1>Loizi</h1>${randomNum}`);        
        await page.getByRole('textbox', { name: 'Display Name*' }).press('Tab');
        await page.getByRole('button', { name: 'Save Changes' }).first().click();
        await page.getByRole('button', { name: 'Yes, Save Changes' }).click();
        await page.waitForTimeout(10000);
        
        await page.getByText('<script>alert("test")</script>').isVisible();
    });

    test("current password cannot be empty" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.getByRole('textbox', { name: 'New Password*' }).fill('qweASD123.');
        await page.getByRole('textbox', { name: 'Confirm Password*' }).fill('qweASD123.');
        await page.getByRole('button', { name: 'Save Changes' }).last().click();
        await page.getByText('Current password is required').first().isVisible();
    });

    test("incorrect current password check" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        await page.waitForTimeout(10000);
        
        await page.getByRole('textbox', { name: 'Current Password*' }).fill('wrongpassword1!');
        await page.getByRole('textbox', { name: 'New Password*' }).fill('qweASD123.');
        await page.getByRole('textbox', { name: 'Confirm Password*' }).fill('qweASD123.');
        
        await page.getByRole('button', { name: 'Save Changes' }).last().click();
        await page.getByRole('button', { name: 'Yes, Update Password' }).click();
        await page.getByRole('button', { name: 'Cancel' }).click();        

        await page.getByText('Current password is incorrect').isVisible();
    });

    test("new password field cannot be empty" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.getByRole('textbox', { name: 'Current Password*' }).fill('wrongpassword1!');
        await page.getByRole('textbox', { name: 'New Password*' }).fill('');
        await page.getByRole('textbox', { name: 'Confirm Password*' }).fill('qweASD123.');
        
        await page.getByText('Password must be at least 8 characters').isVisible();
    });

    test("confirm password field cannot be empty" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.getByRole('textbox', { name: 'Current Password*' }).fill('wrongpassword1!');
        await page.getByRole('textbox', { name: 'New Password*' }).fill('qweASD123.');
        await page.getByRole('textbox', { name: 'Confirm Password*' }).fill('');
        
        await page.getByText('Please confirm your password').isVisible();
    });

    test("new and confirm password must match" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        await page.waitForTimeout(10000);
        
        await page.getByRole('textbox', { name: 'Current Password*' }).fill('wrongpassword1!');
        await page.getByRole('textbox', { name: 'New Password*' }).fill('asdqweQ12!');
        await page.getByRole('textbox', { name: 'Confirm Password*' }).fill('qweASD123.');
        
        await page.getByText('Passwords do not match. Please re-enter your password').first().isVisible();
    });

    test("new password must follow site's standard validations" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        await page.waitForTimeout(10000);
        
        await page.getByRole('textbox', { name: 'Current Password*' }).fill('wrongpassword1!');
        await page.getByRole('textbox', { name: 'New Password*' }).fill('qwerty');
        await page.getByRole('textbox', { name: 'Confirm Password*' }).fill('qwerty');
        
        await page.getByText('Password must be at least 8 characters').first().isVisible();
    });

    test("current password cannot be new password" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        await page.waitForTimeout(10000);
        
        await page.getByRole('textbox', { name: 'Current Password*' }).fill('Lewis123.');
        await page.getByRole('textbox', { name: 'New Password*' }).fill('Lewis123.');
        
        await page.getByText('New password must be different from current password').first().isVisible();
    });

    test("clicking delete account makes delete account modal appear" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.getByRole('button', { name: 'Delete My Account' }).click();
        await page.getByText('Are you sure you want to delete your account?').isVisible();
    });

    test("ensure password input is needed before account deletion" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.getByRole('button', { name: 'Delete My Account' }).click();
        await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeEmpty();
        await page.getByRole('button', { name: 'Delete Account' }).isDisabled();
    });

    test("incorrect password given to delete account modal" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'WIles Forsh lewisdominique.' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.getByRole('button', { name: 'Delete My Account' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Loefo1213!');
        await page.getByRole('button', { name: 'Yes, Delete Account' }).click();

        await page.getByText('Password is incorrect').isVisible();
    });

    test("successful delete account redirects to login" , async ({ page }) => {
        //login with valid account first
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdomnilo@gmail.com");
        await page.fill('input[name="password"]', "Lewis123.");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to user profile settings
        await page.getByRole('button', { name: 'Lewis Nilo lewisdomnilo@gmail.com' }).click();
        await page.getByRole('button', { name: 'Profile Settings' }).click();
        
        await page.getByRole('button', { name: 'Delete My Account' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('Lewis123.');

        await page.getByRole('button', { name: 'Yes, Delete Account' }).click();
        await expect(page).toHaveURL(/\/auth\/login\/?$/, { timeout: 15000 });
    });
});