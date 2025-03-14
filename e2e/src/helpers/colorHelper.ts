import { Locator } from "@playwright/test";

class Colors {
  expectedBackgroundColor() {
    return this.AppColors.primary;
  }

  expectedTextColor() {
    return this.AppColors.white;
  }

  async getBackgroundColor(element: Locator): Promise<string> {
    return await element.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  }

  async getColor(element: Locator): Promise<string> {
    return await element.evaluate((el) => window.getComputedStyle(el).color);
  }

  get AppColors() {
    return {
      danger: "rgb(220, 53, 69)",
      dark: "rgb(52, 58, 64)",
      info: "rgb(23, 162, 184)",
      light: "rgb(248, 249, 250)",
      primary: "rgb(255, 123, 29)",
      secondary: "rgb(102, 102, 102)",
      success: "rgb(40, 167, 69)",
      warning: "rgb(255, 193, 7)",
      white: "rgb(255, 255, 255)",
    };
  }
}

export default new Colors();
