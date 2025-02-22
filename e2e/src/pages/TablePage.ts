import { expect, Page } from "@playwright/test";

export default class TablePage { 
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async goto(path: string = '/web/index.php/pim/viewEmployeeList') {
    await this.page.goto(path, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  // public async rightLogin(username: string, password: string) {
  //   await this.page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 5000 });  
  //   await this.page.locator('input[name="username"]').fill(username);
  //   await this.page.locator('input[name="password"]').fill(password);
  //   await this.page.locator('button[type="submit"]').waitFor({ state: 'visible', timeout: 5000 });  
  //   await this.page.locator('button[type="submit"]').click();
  // }

  // public async Crea(username: string, password: string) {
  //   await this.page.getByRole('link', { name: 'PIM' }).click();
  //   await this.page.waitForLoadState('networkidle'); 
  //   await this.page.getByRole('button', { name: ' Add' }).click();
  //   await this.page.waitForLoadState('networkidle'); 
  //   await this.page.getByRole('textbox', { name: 'First Name' }).click();
  //   await this.page.getByRole('textbox', { name: 'First Name' }).fill('Jeremy');
  //   await this.page.getByRole('textbox', { name: 'Last Name' }).fill('Campbell');
  //   await this.page.locator('form').getByRole('textbox').nth(4).click();
  //   await this.page.locator('form').getByRole('textbox').nth(4).fill('03833');
  //   await this.page.locator('form span').click();
  //   await this.page.locator('div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  //   await this.page.locator('div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(username);
  //   await this.page.locator('input[type="password"]').first().click();
  //   await this.page.locator('input[type="password"]').first().fill(password);
  //   await this.page.locator('input[type="password"]').nth(1).click();
  //   await this.page.locator('input[type="password"]').nth(1).fill(password);
  //   await this.page.getByRole('button', { name: 'Save' }).click();
  //   await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/180');
  //   await this.page.waitForLoadState('networkidle'); 
  // }

}