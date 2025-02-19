import { expect, Page } from "@playwright/test";

export default class TablePage { 
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async goto() {
    await this.page.goto("/tables"); 
  }

  public async addRecord(recordData: Record<string, string>) {
    for (const [field, value] of Object.entries(recordData)) {
      await this.page.fill(`input[name="${field}"]`, value);
    }
    await this.page.click('button[type="submit"]');
  }

  public async deleteRecord(name: string) {
    await this.page.click(`text=${name}`);
    await this.page.click('button[data-action="delete"]');
  }

  public async verifyRecordExists(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
  }

  public async verifyRecordDeleted(name: string) {
    await expect(this.page.locator(`text=${name}`)).not.toBeVisible();
  }
}