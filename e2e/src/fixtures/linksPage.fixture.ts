import { test as base } from "@playwright/test";

import LinksPage from "../pages/LinksPage";

type LinksFixtures = {
  LinksPage: LinksPage;
};

export const linksTest = base.extend<LinksFixtures>({
  LinksPage: async ({ page }, use) => {
    const linksPage = new LinksPage(page);
    await use(linksPage);
  },
});

export { expect, test } from "@playwright/test";
