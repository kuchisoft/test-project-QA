import { expect, loginTest as test } from "../fixtures/loginPage.fixture";

test.describe(
  "Login and tables QA Test",
  {
    annotation: { description: "This test suite is for login and tables QA test.", type: "test-case" },
  },
  () => {
    test("layout", { tag: ["@layout"] }, async ({ LoginPage, page }) => {
      const { btn, input } = LoginPage;
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveTitle("OrangeHRM");
      await expect(input.loginUsername!).toBeVisible();
      await expect(input.loginPassword!).toBeVisible();
      await expect(btn.submit!).toBeVisible();
      await LoginPage.assertCurrentPage();
    });

    test.describe("Login Tests", () => {
      test.beforeEach(async ({ defaultUserdata, LoginPage }) => {
        const { link } = LoginPage;

        await LoginPage.login(defaultUserdata.user, defaultUserdata.pass);
        await link.pim!.click();
      });

      test("Create and Login", { tag: ["@Create"] }, async ({ generatedUser, LoginPage }) => {
        await LoginPage.createUserEmployee(generatedUser);
        await LoginPage.logout();

        await LoginPage.login(generatedUser.username, generatedUser.password);
        await LoginPage.goto("/web/index.php/dashboard/index");
      });

      test.describe("Search and delete employee", () => {
        test.beforeEach(async ({ generatedUser, LoginPage }) => {
          const { link } = LoginPage;
          await LoginPage.createEmployee(generatedUser);
          await link.pim!.click();
        });

        test("Search and confirm", { tag: ["@search"] }, async ({ generatedUser, LoginPage }): Promise<void> => {
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
