import { test as base } from "@playwright/test";
import * as dotenv from "dotenv";

import LinksPage from "../pages/LinksPage";

dotenv.config();

type LinksFixtures = {
  LinksPage: LinksPage;
};

export const linksTest = base.extend<LinksFixtures>({
  LinksPage: async ({ page }, use) => {
    const linksPage = new LinksPage(page);
    await linksPage.goto(process.env.LINKS_URL!);
    await use(linksPage);
  },
});

export { expect, test } from "@playwright/test";
