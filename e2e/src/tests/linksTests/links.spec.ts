import { expect, linksTest as test } from "../../fixtures/linksPage.fixture";

test.describe(
  "Links Validation Test",
  {
    annotation: { description: "This test suite validates all links on a website.", type: "test-case" },
  },
  () => {
    test("Check for links", { tag: ["@links"] }, async ({ LinksPage }) => {
      await test.step("Gather all links", async () => {
        const allLinks = await LinksPage.getAllLinks();
        expect(allLinks.size).toBeGreaterThan(0);
      });

      await test.step("Validate links", async () => {
        const allLinks = await LinksPage.getAllLinks();
        const brokenLinks = await LinksPage.checkLinks(allLinks);
        expect(brokenLinks.length).toBe(0);
      });
    });
  },
);
