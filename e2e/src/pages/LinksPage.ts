import { expect, Locator, Page } from "@playwright/test";

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
      const response = await this.page.request.get(link, requestOptions).catch(() => null);
      if (!response) {
        brokenLinks.push(`${link} - Failed to fetch`);
        expect.soft(false, `${link} is not OK`).toBeTruthy();
        continue;
      }

      if (!response.ok()) {
        brokenLinks.push(`${link} - Status: ${response.status()}`);
        expect.soft(false, `${link} is not OK`).toBeTruthy();
      }
    }

    return brokenLinks;
  }

  formatLinks(links: string[]): string {
    return links.length > 0 ? links.join("\n") : "None";
  }

  async getAllLinks(): Promise<Set<string>> {
    const allLinks = await this.links.all();
    const allHrefs = await Promise.all(
      allLinks.map(async (link) => {
        return await link.getAttribute("href");
      }),
    );

    const allValidHrefs = allHrefs.reduce((links, link) => {
      expect.soft(link, `Link ${link} is not valid`).toBeTruthy();

      if (link && !link.startsWith("mailto:")) {
        links.add(new URL(link, this.page.url()).href);
      }
      return links;
    }, new Set<string>());

    return allValidHrefs;
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }
}
