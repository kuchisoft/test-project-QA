import { loginTest as test } from "../fixtures/loginPage.fixture";

test("layout", async ({ LoginPage }) => {
  await LoginPage.assertCurrentPage();
});
