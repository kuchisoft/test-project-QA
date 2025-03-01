import { expect, Locator, Page } from "@playwright/test";

export default class LoginPage {
  readonly addButton: Locator;
  readonly colorButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly deleteButton: Locator;
  readonly employeeIdField: Locator;
  readonly employeeListLink: Locator;
  readonly errorAlert: Locator;
  public fillCredentials!: (username: string, password: string) => Promise<void>;
  readonly firstNameInput: Locator;
  readonly formSpanButton: Locator;
  readonly lastNameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginUsernameInput: Locator;
  readonly logoutMenuItem: Locator;
  readonly page: Page;
  readonly passwordInput: Locator;
  readonly pimLink: Locator;
  readonly RepeatPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly searchBox: Locator;
  readonly submitButton: Locator;
  readonly userDropdown: Locator;
  readonly usernameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pimLink = this.page.getByRole("link", { name: "PIM" });
    this.addButton = this.page.getByRole("button", { name: " Add" });
    this.errorAlert = this.page.locator(".oxd-alert--error");
    this.colorButton = this.page.locator('button[type="submit"]');
    this.firstNameInput = this.page.getByRole("textbox", { name: "First Name" });
    this.lastNameInput = this.page.getByRole("textbox", { name: "Last Name" });
    this.loginUsernameInput = this.page.getByRole("textbox", { name: "Username" });
    this.loginPasswordInput = this.page.getByRole("textbox", { name: "Password" });
    this.formSpanButton = this.page.locator("form span");
    this.saveButton = this.page.getByRole("button", { name: "Save" });
    this.employeeIdField = this.page.locator("form").getByRole("textbox").nth(4);
    this.employeeListLink = this.page.getByRole("link", { name: "Employee List" });
    this.searchBox = this.page.getByRole("textbox", { name: "Type for hints..." }).first();
    this.deleteButton = this.page.getByRole("button", { name: "" });
    this.confirmDeleteButton = this.page.getByRole("button", { name: " Yes, Delete" });
    this.usernameInput = this.page.locator("div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input");
    this.passwordInput = this.page.locator('input[type="password"]').first();
    this.RepeatPasswordInput = this.page.locator('input[type="password"]').nth(1);
    this.submitButton = this.page.locator('button[type="submit"]');
    this.userDropdown = this.page.locator(".oxd-userdropdown-tab");
    this.logoutMenuItem = this.page.getByRole("menuitem", { name: "Logout" });
  }
  public async assertCurrentPage() {
    await expect(this.page).toHaveURL("/web/index.php/auth/login");
  }

  public async goto(path = "/web/index.php/auth/login") {
    await this.page.goto(path, { timeout: 60000, waitUntil: "domcontentloaded" });
  }
}
