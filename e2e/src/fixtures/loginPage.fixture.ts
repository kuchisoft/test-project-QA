import { mergeTests } from "@playwright/test";

import LoginPage from "../pages/LoginPage";
import { generateUserTest } from "./generateUser.fixture";

type LoginFixtures = {
  LoginPage: LoginPage;
};

export const loginTest = mergeTests(generateUserTest).extend<LoginFixtures>({
  LoginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await use(loginPage);
  },
});

export { expect, test } from "@playwright/test";
