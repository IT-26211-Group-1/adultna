import { test, expect } from "@playwright/test";

test.describe("Build A Resume", () => {
    test("can successfully select a resume template", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Modern Two-column design with' }).click();
        await page.getByRole('button', { name: 'Reverse-Chronological' }).click();
        await page.getByRole('button', { name: 'Hybrid Date-based layout with' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();

        await expect(page).toHaveURL(/\/resume-builder\/editor\/?/, { timeout: 15000 });
    });
    
    test("clicking add DOB button would reveal DOB field", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();

        await page.getByRole('button', { name: '+ Date of Birth' }).click();
        await expect(page.getByRole('group', { name: 'Birth date' })).toBeVisible();
    });

    test("clicking add LinkedIn button would reveal LinkedIn field", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();
        
        await page.getByRole('button', { name: '+ LinkedIn' }).click();
        await expect(page.locator('div').filter({ hasText: /^LinkedIn$/ }).nth(2)).toBeVisible();
    });

    test("clicking add Portfolio/Website button would reveal Portfolio/Website field", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();
        
        await page.getByRole('button', { name: '+ Portfolio/Website' }).click();
        await expect(page.locator('div').filter({ hasText: /^Portfolio$/ }).nth(2)).toBeVisible();
    });

    test("validation on first name and last name input field", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();


        await page.getByRole('textbox', { name: 'First Name*' }).click();
        await page.getByRole('textbox', { name: 'First Name*' }).fill('*@$&*(#&%(*&@#*()(*');
        await page.getByRole('textbox', { name: 'Last Name*' }).click();
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('#**&%(*#&(*@&#*');
        await page.locator('.flex-1.overflow-y-auto').click();
        await expect(page.getByText('First name must contain only')).toBeVisible();
        await page.getByText('Last name must contain only').click();
    });

    test("city and region validations", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();


        await page.getByRole('textbox', { name: 'City' }).click();
        await page.getByRole('textbox', { name: 'City' }).fill('29837498237oiweuroiweutowieuroiquerpq93u40923502984092832938402938402938402938rweuriwoeutoiweutoiweurowieur');
        await page.getByRole('textbox', { name: 'City' }).press('Tab');
        await expect(page.getByText('City must be less than 80')).toBeVisible();
        await page.getByRole('textbox', { name: 'Region' }).click();
        await page.getByRole('textbox', { name: 'Region' }).fill('owieruowuer0923840928340928350982409582093809quirioweurowieurwioeurowieuroiweuroiweurp9134982309482309850294852093840923uroweiurioweut');
        await page.getByRole('textbox', { name: 'Region' }).press('Tab');
        await expect(page.getByText('Region must be less than 100')).toBeVisible();
    });

    test("valid website(s) fields for linkedin and portfolio", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });


        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();
        await page.getByRole('button', { name: '+ LinkedIn' }).click();
        await page.getByRole('textbox', { name: 'LinkedIn' }).click();
        await page.getByRole('textbox', { name: 'LinkedIn' }).fill('www.domapsodjaoijf.com');
        await page.getByRole('textbox', { name: 'LinkedIn' }).press('Tab');
        await expect(page.getByText('Please enter a valid LinkedIn')).toBeVisible();
        
        await page.getByRole('button', { name: '+ Portfolio/Website' }).click();
        await page.getByRole('textbox', { name: 'Portfolio' }).click();
        await page.getByRole('textbox', { name: 'Portfolio' }).fill('qiruoiueoiqu.com');
        await page.getByRole('textbox', { name: 'Portfolio' }).press('Tab');
        await expect(page.getByText('Please enter a valid portfolio URL')).toBeVisible();
    });

    test("email input field validation, standard site validations", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();


        await page.getByRole('textbox', { name: 'Email*' }).click();
        await page.getByRole('textbox', { name: 'Email*' }).fill('SKDJKLSJD@&$*(&)(@@');
        await page.locator('.flex-1.overflow-y-auto').click();
        await expect(page.getByText('Please enter a valid email')).toBeVisible();

        await page.getByRole('textbox', { name: 'Email*' }).dblclick();
        await page.getByRole('textbox', { name: 'Email*' }).press('ControlOrMeta+a');
        await page.getByRole('textbox', { name: 'Email*' }).fill('lewisgmail.com');
        await page.locator('.w-full.h-full.flex.items-center').click();
        await expect(page.getByText('Please enter a valid email')).toBeVisible();
        await page.getByRole('textbox', { name: 'Email*' }).dblclick();
        await page.getByRole('textbox', { name: 'Email*' }).fill('lewis@gmail.com');
    });

    test("leading/trailing spaces not accepted in required fields", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();


        await page.getByRole('textbox', { name: 'First Name*' }).click();
        await page.getByRole('textbox', { name: 'First Name*' }).fill('    Lewis   ');
        await page.getByRole('textbox', { name: 'Last Name*' }).click();
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('   Nilo   ');
        await page.locator('.w-full.h-full.flex.items-center').click();
        await expect(page.getByText('First name cannot have')).toBeVisible();
        await expect(page.getByText('Last name cannot have leading')).toBeVisible();
    });

    test("phone number set format, cannot be empty", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();

        await page.getByRole('textbox', { name: 'Phone*' }).click();
        
        await page.locator('.relative.flex.w-full.flex-auto').click();
        await expect(page.getByText('Phone number is required')).toBeVisible();
    });

    test("continue button is disabled until required fields are filled", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();
        await page.locator('.w-full.h-full.flex.items-center').click();

        await expect(page.getByRole('textbox', { name: 'First Name*' })).toBeEmpty();
        await expect(page.getByRole('textbox', { name: 'Last Name*' })).toBeEmpty();
        await expect(page.getByRole('textbox', { name: 'Email*' })).toBeEmpty();
        await expect(page.getByRole('textbox', { name: 'Phone*' })).toBeEmpty();

        //assert continue button is disabled
        await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
    });

    test("job title input field validation", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();

        await page.getByRole('textbox', { name: 'First Name*' }).fill('Lewis');
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('Nilo');
        await page.getByRole('textbox', { name: 'Email*' }).fill('lewis@gmail.com');
        await page.getByRole('textbox', { name: 'Phone*' }).fill('9922334455');
        
        await page.waitForTimeout(5000);
        await page.getByRole('button', { name: 'Edit resume title' }).click();
        await page.getByRole('textbox', { name: 'Enter resume title' }).fill('My Resume');
        await page.getByRole('button', { name: 'Save title' }).click();
        await page.getByRole('button', { name: 'Continue' }).click();

        await page.getByRole('button', { name: 'Add Another Work Experience' }).click();
        await page.getByRole('textbox', { name: 'Job Title*' }).first().fill('@*&$(*&$(*@&39820198');        
        await expect(page.getByText('Job title must contain only')).toBeVisible();
    });

    test("start date validation and end date validation, start date cannot be after end date", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();

        await page.getByRole('textbox', { name: 'First Name*' }).fill('Lewis');
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('Nilo');
        await page.getByRole('textbox', { name: 'Email*' }).fill('lewis@gmail.com');
        await page.getByRole('textbox', { name: 'Phone*' }).fill('9922334455');
        
        await page.waitForTimeout(5000);
        await page.getByRole('button', { name: 'Edit resume title' }).click();
        await page.getByRole('textbox', { name: 'Enter resume title' }).fill('My Resume');
        await page.getByRole('button', { name: 'Save title' }).click();
        await page.getByRole('button', { name: 'Continue' }).click();

        await page.getByRole('button', { name: 'Add Another Work Experience' }).click();
        await page.getByRole('textbox', { name: 'Job Title*' }).first().fill('@*&$(*&$(*@&39820198');        
        await page.reload({timeout: 30000});
        
        await page.getByRole('spinbutton', { name: 'month, Start Date*' }).fill('12');
        await page.getByRole('spinbutton', { name: 'day, Start Date*' }).fill('20');
        await page.getByRole('spinbutton', { name: 'year, Start Date*' }).fill('2025');

        await page.getByRole('spinbutton', { name: 'month, End Date' }).fill('12');
        await page.getByRole('spinbutton', { name: 'day, End Date' }).fill('15');
        await page.getByRole('spinbutton', { name: 'year, End Date' }).fill('2025');

        await expect(page.getByText('End date cannot be earlier')).toBeVisible();
    });

    test("save to filebox button behavior", async ({ page }) => {
        //simulate login of a user who is verified but hasn't gone through onboarding
        await page.goto("http://adultna.com/auth/login");
        await page.fill('input[name="email"]', "lewisdominique.nilo.cics@ust.edu.ph");
        await page.fill('input[name="password"]', "Lewis123.");

        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL(/\/dashboard\/?$/, { timeout: 15000 });

        //navigate to resume builder
        await page.getByRole('button', { name: 'Career Center' }).click();
        await page.getByRole('link', { name: 'Resume Builder' }).click();
        await page.getByRole('button', { name: 'Build a Resume Choose from' }).click();
        await page.getByRole('button', { name: 'Skill-based Centered layout' }).click();
        await page.getByRole('button', { name: 'Continue with Skill-based' }).click();

        await page.getByRole('textbox', { name: 'First Name*' }).fill('Lewis');
        await page.getByRole('textbox', { name: 'Last Name*' }).fill('Nilo');
        await page.getByRole('textbox', { name: 'Email*' }).fill('lewis@gmail.com');
        await page.getByRole('textbox', { name: 'Phone*' }).fill('9922334455');
        
        await page.waitForTimeout(5000);
        await page.getByRole('button', { name: 'Edit resume title' }).click();
        await page.getByRole('textbox', { name: 'Enter resume title' }).fill('My Resume');
        await page.getByRole('button', { name: 'Save title' }).click();
        await page.getByRole('button', { name: 'Continue' }).click();

        await page.getByRole('button', { name: 'Skip Work Experience' }).click();
        await page.getByRole('button', { name: 'Skip Education' }).click();
        await page.getByRole('button', { name: 'Skip Certifications' }).click();
        await page.getByRole('button', { name: 'Skip Skills' }).click();
        await page.getByRole('button', { name: 'Complete Resume' }).click();

        await page.reload();
        await page.getByRole('button', { name: 'Complete Resume' }).click();

        await page.getByRole('button', { name: 'Save to Filebox' }).click();
        await page.waitForTimeout(7000);
        await expect(page.getByRole('alertdialog', { name: 'Saved to Filebox!' })).toBeVisible();
    });
});