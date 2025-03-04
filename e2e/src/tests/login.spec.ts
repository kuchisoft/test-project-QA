import { mergeTests } from "@playwright/test";

import { generateUserTest } from "../fixtures/generateUser.fixture";
import { expect, loginTest } from "../fixtures/loginPage.fixture";

export const test = mergeTests(generateUserTest, loginTest);

test.describe(
  "Login and tables QA Test",
  {
    annotation: { description: "This test suite is for login and tables QA test.", type: "test-case" },
  },
  () => {
    test("layout", { tag: ["@layout"] }, async ({ LoginPage }) => {
      await LoginPage.confirmLayout();
    });

    test.describe("Login Tests", () => {
      test.beforeEach(async ({ LoginPage }) => {
        await LoginPage.login("Admin", "admin123");
        const { pimLink } = LoginPage;
        await pimLink.click();
      });

      test(
        "Create and Login",
        { annotation: { description: "Create user,logout and login with that user", type: "Create" } },
        async ({ generatedUser, LoginPage }) => {
          await LoginPage.createUserEmployee(
            generatedUser.firstName,
            generatedUser.middleName,
            generatedUser.lastName,
            generatedUser.employeeId,
            generatedUser.username,
            generatedUser.password,
          );
          await LoginPage.logout();

          await LoginPage.login(generatedUser.username, generatedUser.password);
          await LoginPage.goto("/web/index.php/dashboard/index");
        },
      );

      test.describe("Search and delete employee", () => {
        test.beforeEach(async ({ generatedUser, LoginPage }) => {
          const { pimLink } = LoginPage;
          await LoginPage.createEmployee(
            generatedUser.firstName,
            generatedUser.middleName,
            generatedUser.lastName,
            generatedUser.employeeId,
          );
          await pimLink.click();
        });

        test("Search and confirm", { tag: ["@search"] }, async ({ generatedUser, LoginPage }) => {
          const isEmployeeFound = await LoginPage.searchEmployee(generatedUser.firstName, generatedUser.middleName, generatedUser.lastName);
          expect(isEmployeeFound).toBe(true);
        });

        test("Delete and confirm", { tag: ["@delete"] }, async ({ generatedUser, LoginPage }) => {
          await LoginPage.deleteEmployee(generatedUser.firstName, generatedUser.middleName, generatedUser.lastName);

          const isEmployeeFound = await LoginPage.searchEmployee(generatedUser.firstName, generatedUser.middleName, generatedUser.lastName);
          expect(isEmployeeFound).toBe(false);
        });
      });
    });

    test("Invalid credentials", { tag: ["@invalidLogin"] }, async ({ LoginPage }) => {
      await LoginPage.login("wrong_user", "wrong_password");
      await expect(LoginPage.errorAlert).toContainText("Invalid credentials");
    });

    test("Check button color", { tag: ["@color", "@ui"] }, async ({ LoginPage }) => {
      await LoginPage.btn.submit!.waitFor({ state: "visible" });
      const buttonColor = await LoginPage.btn.color!.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        let colorValue = computedStyle.backgroundColor;
        if (!colorValue || colorValue === "transparent" || colorValue === "") {
          colorValue = computedStyle.color;
        }
        return colorValue;
      });
      const expectedColor = "rgb(255, 123, 29)";
      expect.soft(buttonColor).toBe(expectedColor);
    });
  },
);
