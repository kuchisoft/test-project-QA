import { expect, Locator, Page } from "@playwright/test";
import * as fs from "fs/promises";
import * as path from "path";

interface ErrorLog {
  message: string;
  timestamp: string;
}

export default class LoginPage {
  readonly addButton: Locator;
  readonly colorButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly deleteButton: Locator;
  readonly employeeIdField: Locator;
  readonly employeeListLink: Locator;
  readonly errorAlert: Locator;
  readonly firstNameInput: Locator;
  readonly formSpanButton: Locator;
  readonly lastNameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginUsernameInput: Locator;
  readonly logoutMenuItem: Locator;
  readonly middleNameInput: Locator;
  readonly page: Page;
  readonly passwordInput: Locator;
  readonly pimLink: Locator;
  readonly RepeatPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
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
    this.middleNameInput = this.page.getByRole("textbox", { name: "Middle Name" });
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
    this.searchButton = this.page.getByRole("button", { name: "Search" });
    this.submitButton = this.page.locator('button[type="submit"]');
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
    await expect(this.submitButton).toBeVisible();
    await this.assertCurrentPage();
  }

  async createEmployee(firstName: string, middleName: string, lastName: string, employeeId: string) {
    await this.addButton.click();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdField.fill(employeeId);
    await this.saveButton.click();
  }

  async createUserEmployee(
    firstName: string,
    middleName: string,
    lastName: string,
    employeeId: string,
    username: string,
    password: string,
  ) {
    await this.addButton.click();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdField.fill(employeeId);
    await this.formSpanButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.RepeatPasswordInput.fill(password);
    await this.saveButton.click();
  }

  async deleteEmployee(firstName: string, lastName: string) {
    const isEmployeeFound = await this.searchEmployee(firstName, lastName);

    if (!isEmployeeFound) {
      const errorData = {
        message: `Employee ${firstName} ${lastName} not found. Skipping deletion.`,
        success: false,
        timestamp: new Date().toISOString(),
      };
      await writeErrorToFile(errorData);
      return errorData;
    }

    try {
      await this.deleteButton.click();
      await this.confirmDeleteButton.click();
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

  async login(username: string, password: string) {
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    await this.submitButton.click();
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
  }

  async searchEmployee(firstName: string, lastName: string): Promise<boolean> {
    const fullName = `${firstName} ${lastName}`;
    try {
      await this.searchBox.fill(fullName);
      const employeeRow = this.page.getByText(fullName, { exact: true });
      await employeeRow.waitFor({ state: "visible", timeout: 5000 });
      await this.searchButton.click();
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
