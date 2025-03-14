import { Locator, Page } from "@playwright/test";

export default class LinksPage {
  readonly links: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.links = this.page.locator("a");
  }

  async checkLinks(allLinks: Set<string>): Promise<string[]> {
    const brokenLinks: string[] = [];
    const requestOptions = { timeout: 30000 };

    for (const link of allLinks) {
      const response = await this.page.request.get(link, requestOptions).catch(() => {
        brokenLinks.push(`${link} - Failed to fetch`);
        return null;
      });

      if (response && !response.ok()) {
        brokenLinks.push(`${link} - Status: ${response.status()}`);
      }
    }

    return brokenLinks;
  }

  formatLinks(links: string[]): string {
    return links.length > 0 ? links.join("\n") : "None";
  }

  async getAllLinks(): Promise<{ allHrefs: (null | string)[]; invalidLinks: string[]; validLinks: Set<string> }> {
    const allLinks = await this.links.all();
    const allHrefs = await Promise.all(
      allLinks.map(async (link) => {
        return await link.getAttribute("href");
      }),
    );

    const invalidLinks: string[] = [];
    const validLinks = new Set<string>();

    for (const link of allHrefs) {
      if (!link) {
        invalidLinks.push("Empty link found");
        continue;
      }

      if (!link.startsWith("mailto:")) {
        const fullUrl = new URL(link, this.page.url()).href;
        validLinks.add(fullUrl);
      }
    }

    return { allHrefs, invalidLinks, validLinks };
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }
}
