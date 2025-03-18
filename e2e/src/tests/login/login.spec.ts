import { expect, loginTest as test } from "../../fixtures/loginPage.fixture";
import colors from "../../helpers/colorHelper";

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
      test.beforeEach(async ({ defaultUserdata, generatedUser, LoginPage }) => {
        const { link } = LoginPage;
        await LoginPage.login(defaultUserdata.user, defaultUserdata.pass);
        await link.pim!.click();
        await LoginPage.createUserEmployee(generatedUser);
        await link.pim!.click();
      });

      test("Create and Login", { tag: ["@login"] }, async ({ generatedUser, LoginPage }) => {
        await LoginPage.logout();
        await LoginPage.login(generatedUser.username, generatedUser.password);
        await LoginPage.goto("/web/index.php/dashboard/index");
      });

      test("Search, Confirm and Delete", { tag: ["@Search", "@delete"] }, async ({ generatedUser, LoginPage }) => {
        const fullName = `${generatedUser.firstName} ${generatedUser.middleName} ${generatedUser.lastName}`;
        await LoginPage.searchBox.fill(fullName);
        const employeeRow = LoginPage.page.getByText(fullName, { exact: true });
        await expect(employeeRow).toBeVisible({ timeout: 3000 });
        await LoginPage.btn.search!.click();

        await LoginPage.deleteEmployee();

        await LoginPage.searchBox.fill(fullName);
        await expect(employeeRow).toBeHidden();
      });
    });

    test("Invalid credentials", { tag: ["@login"] }, async ({ LoginPage }) => {
      await LoginPage.login("wrong_user", "wrong_password");
      await expect(LoginPage.errorAlert).toContainText("Invalid credentials");
    });

    test.describe("Color Tests", () => {
      test.beforeEach(async ({ LoginPage }) => {
        await LoginPage.btn.submit!.waitFor({ state: "visible" });
      });

      test("Check button text color", { tag: ["@color", "@ui"] }, async ({ LoginPage }) => {
        const textColor = await colors.getColor(LoginPage.btn.submit!);
        expect(textColor).toBe(colors.expectedTextColor());
      });

      test("Check button background color", { tag: ["@color", "@ui"] }, async ({ LoginPage }) => {
        const backgroundColor = await colors.getBackgroundColor(LoginPage.btn.submit!);
        expect(backgroundColor).toBe(colors.expectedBackgroundColor());
      });
    });
  },
);
