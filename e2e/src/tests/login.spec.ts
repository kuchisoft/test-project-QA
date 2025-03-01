import { expect, loginTest as test } from "../fixtures/loginPage.fixture";

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.goto();
});

test.describe("Login Page", () => {
  test("layout", async ({ LoginPage, page }) => {
    const { loginPasswordInput, loginUsernameInput, submitButton } = LoginPage;

    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveTitle("OrangeHRM");
    await expect(loginUsernameInput).toBeVisible();
    await expect(loginPasswordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    await LoginPage.assertCurrentPage();
  });

  test("should log in, create user,logout and login with that user", { tag: ["@login"] }, async ({ LoginPage }) => {
    await LoginPage.fillCredentials("Admin", "admin123");

    await LoginPage.pimLink.click();
    await expect(LoginPage.addButton).toBeVisible();

    await LoginPage.addButton.click();
    await expect(LoginPage.firstNameInput).toBeVisible();

    await LoginPage.firstNameInput.fill("Jayson");
    await LoginPage.lastNameInput.fill("Lutovic");

    await LoginPage.employeeIdField.click();
    await LoginPage.employeeIdField.fill("09880");
    await LoginPage.formSpanButton.click();

    await LoginPage.usernameInput.fill("jlutovic");
    await LoginPage.passwordInput.fill("Password123");
    await LoginPage.RepeatPasswordInput.fill("Password123");

    await LoginPage.saveButton.click();

    await expect(LoginPage.userDropdown).toBeVisible();

    await LoginPage.userDropdown.click();
    await expect(LoginPage.logoutMenuItem).toBeVisible();
    await LoginPage.logoutMenuItem.click();

    await LoginPage.fillCredentials("jlutovic", "Password123");
    await LoginPage.goto("/web/index.php/dashboard/index");
  });

  test("should handle invalid credentials", { tag: ["@login"] }, async ({ LoginPage }) => {
    await LoginPage.fillCredentials("wrong_user", "wrong_password");
    await expect(LoginPage.errorAlert).toContainText("Invalid credentials");
  });

  test("should check button color", { tag: ["@login", "@ui"] }, async ({ LoginPage }) => {
    await LoginPage.submitButton.waitFor({ state: "visible" });
    const buttonColor = await LoginPage.colorButton.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      let colorValue = computedStyle.backgroundColor;
      if (!colorValue || colorValue === "transparent" || colorValue === "") {
        colorValue = computedStyle.color;
      }
      return colorValue;
    });
    expect.soft(buttonColor).toMatch("rgb(255, 123, 29)");
  });

  test("Open page and add record in the table", { tag: ["@input"] }, async ({ LoginPage }) => {
    await LoginPage.fillCredentials("Admin", "admin123");
    await LoginPage.pimLink.click();
    await LoginPage.page.waitForLoadState("domcontentloaded");
    await expect(LoginPage.addButton).toBeVisible();
    await LoginPage.addButton.click();

    await expect(LoginPage.firstNameInput).toBeVisible();
    await LoginPage.firstNameInput.fill("James");
    await LoginPage.lastNameInput.fill("Chadaza");

    await LoginPage.employeeIdField.click();
    await LoginPage.employeeIdField.fill("03544");
    await LoginPage.saveButton.click();
  });

  test("Delete record from the table and search", { tag: ["@delete", "@search"] }, async ({ LoginPage }) => {
    await LoginPage.fillCredentials("Admin", "admin123");
    await LoginPage.pimLink.click();
    await LoginPage.searchBox.fill("James Chadaza");

    const employeeRow = LoginPage.page.getByText("James Chadaza", { exact: true });
    await expect(employeeRow).toBeVisible({ timeout: 5000 });

    await LoginPage.page.getByRole("button", { name: "Search" }).click();

    await LoginPage.deleteButton.click();
    await LoginPage.confirmDeleteButton.click();

    await LoginPage.searchBox.fill("James Chadaza");
    await expect(employeeRow).toBeHidden({ timeout: 10000 });
  });
});
