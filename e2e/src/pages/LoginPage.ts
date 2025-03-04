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
  readonly errorAlert: Locator;
  readonly link: Record<string, Locator>;
  readonly loginInput: Record<string, Locator>;
  readonly logoutMenuItem: Locator;
  readonly page: Page;
  readonly register: Record<string, Locator>;
  readonly searchBox: Locator;
  readonly userDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btn = {
      add: this.page.getByRole("button", { name: " Add" }),
      confirmDelete: this.page.getByRole("button", { name: " Yes, Delete" }),
      delete: this.page.getByRole("button", { name: "" }),
      formSpan: this.page.locator("form span"),
      save: this.page.getByRole("button", { name: "Save" }),
      search: this.page.getByRole("button", { name: "Search" }),
      submit: this.page.locator('button[type="submit"]'),
    };
    this.register = {
      employeeId: this.page.locator("form").getByRole("textbox").nth(4),
      firstName: this.page.getByRole("textbox", { name: "First Name" }),
      lastName: this.page.getByRole("textbox", { name: "Last Name" }),
      middleName: this.page.getByRole("textbox", { name: "Middle Name" }),
      password: this.page.locator('input[type="password"]').first(),
      repeatPassword: this.page.locator('input[type="password"]').nth(1),
      username: this.page.locator("(//input[@class='oxd-input oxd-input--active'])[3]"),
    };
    this.link = {
      employeeList: this.page.getByRole("link", { name: "Employee List" }),
      pim: this.page.getByRole("link", { name: "PIM" }),
    };
    this.loginInput = {
      password: this.page.getByRole("textbox", { name: "Password" }),
      username: this.page.getByRole("textbox", { name: "Username" }),
    };

    this.errorAlert = this.page.locator(".oxd-alert--error");
    this.searchBox = this.page.getByRole("textbox", { name: "Type for hints..." }).first();
    this.userDropdown = this.page.locator(".oxd-userdropdown-tab");
    this.logoutMenuItem = this.page.getByRole("menuitem", { name: "Logout" });
  }

  async assertCurrentPage() {
    await expect(this.page).toHaveURL("/web/index.php/auth/login");
  }

  async confirmLayout() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveTitle("OrangeHRM");
    await expect(this.loginInput.username!).toBeVisible();
    await expect(this.loginInput.password!).toBeVisible();
    await expect(this.btn.submit!).toBeVisible();
    await this.assertCurrentPage();
  }

  async createEmployee(firstName: string, middleName: string, lastName: string, employeeId: string) {
    await this.btn.add!.click();
    await this.register.firstName!.fill(firstName);
    await this.register.middleName!.fill(middleName);
    await this.register.lastName!.fill(lastName);
    await this.register.employeeId!.fill(employeeId);
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
    await this.register.firstName!.fill(firstName);
    await this.register.middleName!.fill(middleName);
    await this.register.lastName!.fill(lastName);
    await this.register.employeeId!.fill(employeeId);
    await this.btn.formSpan!.click();
    await this.register.username!.fill(username);
    await this.register.password!.fill(password);
    await this.register.repeatPassword!.fill(password);
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
    const baseUrl = process.env.DEMOQA ?? "https://opensource-demo.orangehrmlive.com/web/index.php";
    await this.page.goto(`${baseUrl}${path}`, { timeout: 60000, waitUntil: "domcontentloaded" });
  }

  async login(username?: string, password?: string) {
    const user = username ?? process.env.APP_USERNAME!;
    const pass = password ?? process.env.APP_PASSWORD!;
    await this.loginInput.username!.fill(user);
    await this.loginInput.password!.fill(pass);
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
