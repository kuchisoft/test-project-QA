import { expect, Locator, Page } from "@playwright/test";
import dotenv from "dotenv";
import * as fs from "fs/promises";
import * as path from "path";

dotenv.config();

interface ErrorLog {
  message: string;
  timestamp: string;
}

export default class LoginPage {
  readonly btn: Record<string, Locator>;
  readonly employeeIdField: Locator;
  readonly employeeListLink: Locator;
  readonly errorAlert: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginUsernameInput: Locator;
  readonly logoutMenuItem: Locator;
  readonly middleNameInput: Locator;
  readonly page: Page;
  readonly passwordInput: Locator;
  readonly pimLink: Locator;
  readonly RepeatPasswordInput: Locator;
  readonly searchBox: Locator;
  readonly userDropdown: Locator;
  readonly usernameInput: Locator;

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
    this.pimLink = this.page.getByRole("link", { name: "PIM" });
    this.errorAlert = this.page.locator(".oxd-alert--error");
    this.firstNameInput = this.page.getByRole("textbox", { name: "First Name" });
    this.middleNameInput = this.page.getByRole("textbox", { name: "Middle Name" });
    this.lastNameInput = this.page.getByRole("textbox", { name: "Last Name" });
    this.loginUsernameInput = this.page.getByRole("textbox", { name: "Username" });
    this.loginPasswordInput = this.page.getByRole("textbox", { name: "Password" });
    this.employeeIdField = this.page.locator("form").getByRole("textbox").nth(4);
    this.employeeListLink = this.page.getByRole("link", { name: "Employee List" });
    this.searchBox = this.page.getByRole("textbox", { name: "Type for hints..." }).first();
    this.usernameInput = this.page.locator("div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input");
    this.passwordInput = this.page.locator('input[type="password"]').first();
    this.RepeatPasswordInput = this.page.locator('input[type="password"]').nth(1);
    this.userDropdown = this.page.locator(".oxd-userdropdown-tab");
    this.logoutMenuItem = this.page.getByRole("menuitem", { name: "Logout" });
  }

  async assertCurrentPage() {
    await expect(this.page).toHaveURL("/web/index.php/auth/login");
  }

  async confirmLayout() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveTitle("OrangeHRM");
    await expect(this.loginUsernameInput).toBeVisible();
    await expect(this.loginPasswordInput).toBeVisible();
    await expect(this.btn.submit!).toBeVisible();
    await this.assertCurrentPage();
  }

  async createEmployee(firstName: string, middleName: string, lastName: string, employeeId: string) {
    await this.btn.add!.click();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdField.fill(employeeId);
    await this.btn.save!.click();
  }

  async createUserEmployee(
    firstName: string,
    middleName: string,
    lastName: string,
    employeeId: string,
    username: string,
    password: string,
  ) {
    await this.btn.add!.click();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdField.fill(employeeId);
    await this.btn.formSpan!.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.RepeatPasswordInput.fill(password);
    await this.btn.save!.click();
  }

  async deleteEmployee(firstName: string, middleName: string, lastName: string) {
    const isEmployeeFound = await this.searchEmployee(firstName, middleName, lastName);

    if (!isEmployeeFound) {
      const errorData = {
        message: `Employee ${firstName} ${middleName} ${lastName} not found. Skipping deletion.`,
        success: false,
        timestamp: new Date().toISOString(),
      };
      await writeErrorToFile(errorData);
      return errorData;
    }

    try {
      await this.btn.delete!.click();
      await this.btn.confirmDelete!.click();
      return {
        message: `Employee ${firstName} ${lastName} deleted successfully.`,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorData = {
        error: error instanceof Error ? error.message : String(error),
        message: `Error deleting employee ${firstName} ${lastName}.`,
        success: false,
        timestamp: new Date().toISOString(),
      };
      await writeErrorToFile(errorData);
      return errorData;
    }
  }

  async goto(path = "/web/index.php/auth/login") {
    await this.page.goto(path, { timeout: 60000, waitUntil: "domcontentloaded" });
  }

  async login(username?: string, password?: string) {
    const user = username ?? process.env.APP_USERNAME!;
    const pass = password ?? process.env.APP_PASSWORD!;
    await this.loginUsernameInput.fill(user);
    await this.loginPasswordInput.fill(pass);
    await this.btn.submit!.click();
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
  }

  async searchEmployee(firstName: string, middleName: string, lastName: string): Promise<boolean> {
    const fullName = `${firstName} ${middleName} ${lastName}`;
    try {
      await this.searchBox.fill(fullName);
      const employeeRow = this.page.getByText(fullName, { exact: true });
      await employeeRow.waitFor({ state: "visible", timeout: 3000 });
      await this.btn.search!.click();
      return true;
    } catch (error: unknown) {
      const errorDetails = {
        employee: fullName,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to find employee",
        timestamp: new Date().toISOString(),
      };
      await writeErrorToFile(errorDetails);
      return false;
    }
  }
}

async function writeErrorToFile(errorData: ErrorLog, filename = "../../loginTest-results/delete-search-error-log.json"): Promise<void> {
  const filePath: string = path.join(__dirname, filename);
  const dirPath: string = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });
  const errorString = JSON.stringify(errorData, null, 2) + "\n";
  await fs.appendFile(filePath, errorString, "utf-8");
}
