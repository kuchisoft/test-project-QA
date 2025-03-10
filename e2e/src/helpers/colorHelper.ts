import { Locator } from "@playwright/test";

export const colors = {
  AppColors: {
    danger: "rgb(220, 53, 69)",
    dark: "rgb(52, 58, 64)",
    info: "rgb(23, 162, 184)",
    light: "rgb(248, 249, 250)",
    primary: "rgb(255, 123, 29)",
    secondary: "rgb(102, 102, 102)",
    success: "rgb(40, 167, 69)",
    warning: "rgb(255, 193, 7)",
    white: "rgb(255, 255, 255)",
  },

  getBackgroundColor: async (locator: Locator): Promise<string> => {
    return locator.evaluate((element) => {
      return window.getComputedStyle(element).backgroundColor;
    });
  },

  getColor: async (locator: Locator): Promise<string> => {
    return locator.evaluate((element) => {
      return window.getComputedStyle(element).color;
    });
  },
};
