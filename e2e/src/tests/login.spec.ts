import { expect, loginTest as test } from "../fixtures/loginPage.fixture";

test.describe("Login and tables QA Test", () => {
  test("layout", { tag: ["@layout"] }, async ({ LoginPage }) => {
    await LoginPage.confirmLayout();
  });

  test.describe("Login Tests", () => {
    test.beforeEach(async ({ LoginPage }) => {
      await LoginPage.login("Admin", "admin123");
      await LoginPage.pimLink.click();
    });

    test("Create user,logout and login with that user", { tag: ["@login"] }, async ({ LoginPage }) => {
      await LoginPage.createUserEmployee("Jayson", "Pondec", "Lutovic", "09889", "jlutovic", "Password123");

      await LoginPage.logout();

      await LoginPage.login("jlutovic", "Password123");
      await LoginPage.goto("/web/index.php/dashboard/index");
    });

    test("Open page and add record in the table", { tag: ["@input"] }, async ({ LoginPage }) => {
      await LoginPage.createEmployee("James", "Kaziya", "Chadaza", "09870");
    });

    test("Delete record from the table and search", { tag: ["@delete", "@search"] }, async ({ LoginPage }) => {
      await LoginPage.deleteEmployee("James", "Chadaza");

      const isEmployeeFound = await LoginPage.searchEmployee("James", "Chadaza");
      expect(isEmployeeFound).toBe(false);
    });
  });

  test("should handle invalid credentials", { tag: ["@invalidLogin"] }, async ({ LoginPage }) => {
    await LoginPage.login("wrong_user", "wrong_password");
    await expect(LoginPage.errorAlert).toContainText("Invalid credentials");
  });

  test("should check button color", { tag: ["@color", "@ui"] }, async ({ LoginPage }) => {
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
});
