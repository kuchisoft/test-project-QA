import { test as base } from "@playwright/test";

import LoginPage from "../pages/LoginPage";

type LoginFixtures = {
  LoginPage: LoginPage;
};

export const loginTest = base.extend<LoginFixtures>({
  LoginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
