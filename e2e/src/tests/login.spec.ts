import { loginTest as test, expect } from "../fixtures/loginPage.fixture";

test("should display login page @login", async ({ LoginPage }) => {
  await LoginPage.goto();
  await LoginPage.assertCurrentPage();
});

test("should log in successfully @login @smoke", async ({ LoginPage }) => {
  await LoginPage.goto();
  await LoginPage.login("john_doe", "pass123");
  await expect(LoginPage.page).toHaveURL("/dashboard"); 
});

test("should handle invalid credentials @login @regression", async ({ LoginPage }) => {
  await LoginPage.goto();
  await LoginPage.login("invalidUser", "wrongPassword");
  await expect(LoginPage.page.locator(".error-message")).toContainText("Invalid credentials");
});

test("should check button color @login @ui", async ({ LoginPage }) => {
  await LoginPage.goto();
  const buttonColor = await LoginPage.getButtonColor("button[type='submit']");
  expect(buttonColor).toBe("rgb(0, 128, 0)"); 
});