import { expect, Page } from "@playwright/test";

export default class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async AddEmployeeAndDelete(firstname: string, lastname: string) {
    await this.page.getByRole("link", { name: "PIM" }).click();
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page.getByRole("button", { name: " Add" })).toBeVisible();

    await this.page.getByRole("button", { name: " Add" }).click();
    await expect(this.page.getByRole("textbox", { name: "First Name" })).toBeVisible();

    await this.page.getByRole("textbox", { name: "First Name" }).fill(firstname);
    await this.page.getByRole("textbox", { name: "Last Name" }).fill(lastname);

    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.getByRole("link", { name: "Employee List" }).click();
    await this.page.waitForLoadState("domcontentloaded");

    const searchBox = this.page.getByRole("textbox", { name: "Type for hints..." }).first();
    await searchBox.waitFor();
    await searchBox.fill(`${firstname} ${lastname}`);

    const employeeRow = this.page.getByText(`${firstname} ${lastname}`, { exact: true });
    await expect(employeeRow).toBeVisible();
    await employeeRow.click();

    await this.page.getByRole("button", { name: "Search" }).click();
    await this.page.waitForLoadState("domcontentloaded");

    await this.page.getByRole("button", { name: "" }).click();
    await this.page.getByRole("button", { name: " Yes, Delete" }).click();

    await searchBox.fill(`${firstname} ${lastname}`);
    await expect(this.page.getByText(`${firstname} ${lastname}`, { exact: true })).toBeHidden({ timeout: 10000 });
  }

  public async assertCurrentPage() {
    await expect(this.page).toHaveURL("/web/index.php/auth/login");
  }

  public async CreateUser(username: string, password: string) {
    await this.page.getByRole("link", { name: "PIM" }).click();
    await expect(this.page.getByRole("button", { name: " Add" })).toBeVisible();

    await this.page.getByRole("button", { name: " Add" }).click();
    await expect(this.page.getByRole("textbox", { name: "First Name" })).toBeVisible();

    await this.page.getByRole("textbox", { name: "First Name" }).click();
    await this.page.getByRole("textbox", { name: "First Name" }).fill("Jeremy");
    await this.page.getByRole("textbox", { name: "Last Name" }).fill("Campbell");
    await this.page.locator("form span").click();

    await this.page.locator("div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input").click();
    await this.page.locator("div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input").fill(username);

    await this.page.locator('input[type="password"]').first().click();
    await this.page.locator('input[type="password"]').first().fill(password);
    await this.page.locator('input[type="password"]').nth(1).click();
    await this.page.locator('input[type="password"]').nth(1).fill(password);

    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/180");
    await expect(this.page.locator(".oxd-userdropdown-tab")).toBeVisible();

    await this.page.locator(".oxd-userdropdown-tab").click();
    await expect(this.page.getByRole("menuitem", { name: "Logout" })).toBeVisible();
    await this.page.getByRole("menuitem", { name: "Logout" }).click();
  }

  public async getButtonColor(selector: string): Promise<string> {
    const button = this.page.locator(selector);
    const color = await button.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      let colorValue = computedStyle.backgroundColor;
      if (!colorValue || colorValue === "transparent" || colorValue === "") {
        colorValue = computedStyle.color;
      }
      return colorValue;
    });
    return color;
  }

  public async goto(path = "/web/index.php/auth/login") {
    await this.page.goto(path, { timeout: 60000, waitUntil: "domcontentloaded" });
  }

  public async invalidLogin(username: string, password: string) {
    await this.page.locator('input[name="username"]').waitFor({ state: "visible", timeout: 50000 });
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('button[type="submit"]').waitFor({ state: "visible", timeout: 50000 });
    await this.page.locator('button[type="submit"]').click();
  }

  public async rightLogin(username: string, password: string) {
    await this.page.locator('input[name="username"]').waitFor({ state: "visible", timeout: 50000 });
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('button[type="submit"]').waitFor({ state: "visible", timeout: 50000 });
    await this.page.locator('button[type="submit"]').click();
  }
}
