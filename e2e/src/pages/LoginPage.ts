import { expect, Page } from "@playwright/test";

export default class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async assertCurrentPage() {
    await expect(this.page).toHaveURL(/login/); 
  }

  public async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle'); 
  }

  public async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation({ waitUntil: 'networkidle' }); 
  }

  public async getButtonColor(selector: string): Promise<string> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? window.getComputedStyle(element).color : "";
    }, selector);
  }
}