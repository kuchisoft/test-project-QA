import { loginTest as test, expect } from "../fixtures/loginPage.fixture";

test("should log in successfully @login", async ({ LoginPage }) => {
  await LoginPage.goto();
  await LoginPage.rightLogin('Admin', 'admin123');
  await expect(LoginPage.page).toHaveURL('/web/index.php/dashboard/index'); 
});

test("should log in, create user and login with that user @login", async ({ LoginPage }) => {
 
  await LoginPage.goto();

  await LoginPage.rightLogin('Admin', 'admin123');

  await LoginPage.CreateUser('jcampbell', 'Password123');

  await LoginPage.rightLogin('jcampbell', 'Password123');

  await LoginPage.goto('/web/index.php/dashboard/index');
 
});

test("should handle invalid credentials @login", async ({ LoginPage }) => {
  await LoginPage.goto();
  await LoginPage.invalidLogin('wrong_user', 'wrong_password');
  await expect(LoginPage.page.locator(".oxd-alert--error")).toContainText("Invalid credentials");
});

test("should check button color @login @ui", async ({ page, LoginPage }) => {
  await LoginPage.goto();
  await page.locator("button[type='submit']").waitFor({ state: 'visible' });
  const buttonColor = await LoginPage.getButtonColor("button[type='submit']");
  expect(buttonColor).toMatch("rgb(255, 123, 29)");
});