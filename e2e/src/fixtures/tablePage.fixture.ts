import { test as base } from "@playwright/test";
import TablePage from "../pages/TablePage";

type TableFixtures = {
  TablePage: TablePage;
};

export const tableTest = base.extend<TableFixtures>({
  TablePage: async ({ page }, use) => {
    const tablePage = new TablePage(page);
    await tablePage.goto();
    await use(tablePage);
  },
});

export { expect } from "@playwright/test";