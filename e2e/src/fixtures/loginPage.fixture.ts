import { test as base } from "@playwright/test";

import LoginPage from "../pages/LoginPage";

type LoginFixtures = {
  LoginPage: LoginPage;
};

export const loginTest = base.extend<LoginFixtures>({
  LoginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    async function fillCredentials(username: string, password: string) {
      await loginPage.loginUsernameInput.fill(username);
      await loginPage.loginPasswordInput.fill(password);
      await loginPage.submitButton.click();
    }

    loginPage.fillCredentials = fillCredentials;

    await use(loginPage);
  },
});

export { expect, test } from "@playwright/test";
