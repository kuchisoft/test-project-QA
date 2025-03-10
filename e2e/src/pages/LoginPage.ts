import { expect, Locator, Page } from "@playwright/test";

import { GeneratedUser } from "../fixtures/generateUser.fixture";

export default class LoginPage {
  readonly btn: Record<string, Locator>;
  readonly employeeIdField: Locator;
  readonly errorAlert: Locator;
  readonly input: Record<string, Locator>;
  readonly link: Record<string, Locator>;
  readonly logoutMenuItem: Locator;
  readonly page: Page;
  readonly searchBox: Locator;
  readonly userDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btn = {
      add: this.page.getByRole("button", { name: " Add" }),
      color: this.page.locator('button[type="submit"]'),
      confirmDelete: this.page.getByRole("button", { name: " Yes, Delete" }),
      delete: this.page.getByRole("button", { name: "" }),
      formSpan: this.page.locator("form span"),
      save: this.page.getByRole("button", { name: "Save" }),
      search: this.page.getByRole("button", { name: "Search" }),
      submit: this.page.locator('button[type="submit"]'),
    };
    this.input = {
      firstName: this.page.getByRole("textbox", { name: "First Name" }),
      lastName: this.page.getByRole("textbox", { name: "Last Name" }),
      loginPassword: this.page.getByRole("textbox", { name: "Password" }),
      loginUsername: this.page.getByRole("textbox", { name: "Username" }),
      middleName: this.page.getByRole("textbox", { name: "Middle Name" }),
      password: this.page.locator('input[type="password"]').first(),
      repeatPassword: this.page.locator('input[type="password"]').nth(1),
      username: this.page.locator("(//input[@class='oxd-input oxd-input--active'])[3]"),
    };
    this.link = {
      employeeList: this.page.getByRole("link", { name: "Employee List" }),
      pim: this.page.getByRole("link", { name: "PIM" }),
    };
    this.errorAlert = this.page.locator(".oxd-alert--error");
    this.employeeIdField = this.page.locator("form").getByRole("textbox").nth(4);
    this.searchBox = this.page.getByRole("textbox", { name: "Type for hints..." }).first();
    this.userDropdown = this.page.locator(".oxd-userdropdown-tab");
    this.logoutMenuItem = this.page.getByRole("menuitem", { name: "Logout" });
  }

  async assertCurrentPage() {
    await expect(this.page).toHaveURL("/web/index.php/auth/login");
  }

  async createEmployee(generatedUser: GeneratedUser): Promise<void> {
    await this.btn.add!.click();
    await this.input.firstName!.fill(generatedUser.firstName);
    await this.input.middleName!.fill(generatedUser.middleName);
    await this.input.lastName!.fill(generatedUser.lastName);
    await this.employeeIdField.fill(generatedUser.employeeId);
    await this.btn.save!.click();
  }

  async createUserEmployee(generatedUser: GeneratedUser): Promise<void> {
    await this.btn.add!.click();
    await this.input.firstName!.fill(generatedUser.firstName);
    await this.input.middleName!.fill(generatedUser.middleName);
    await this.input.lastName!.fill(generatedUser.lastName);
    await this.employeeIdField.fill(generatedUser.employeeId);
    await this.btn.formSpan!.click();
    await this.input.username!.fill(generatedUser.username);
    await this.input.password!.fill(generatedUser.password);
    await this.input.repeatPassword!.fill(generatedUser.password);
    await this.btn.save!.click();
  }

  async deleteEmployee(): Promise<void> {
    await this.btn.delete!.click();
    await this.btn.confirmDelete!.click();
    await expect(this.page.locator('.oxd-toast-content-text:has-text("Successfully Deleted")')).toBeVisible();
  }

  async goto(path = "/web/index.php/auth/login") {
    await this.page.goto(path, { timeout: 60000, waitUntil: "domcontentloaded" });
  }

  async login(username: string, password: string) {
    await this.input.loginUsername!.fill(username);
    await this.input.loginPassword!.fill(password);
    await this.btn.submit!.click();
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
    await expect(this.page.locator('.orangehrm-login-title:has-text("Login")')).toBeVisible();
  }
}
