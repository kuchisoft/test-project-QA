import { expect, Page } from "@playwright/test";

export default class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async assertCurrentPage() {
    await expect(this.page).toHaveURL("/login");
  }

  public async goto() {
    await this.page.goto("/login");
  }
}
