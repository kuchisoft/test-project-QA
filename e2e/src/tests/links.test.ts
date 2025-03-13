import fs from "fs";

import { linksTest as test } from "../fixtures/linksPage.fixture";

test.describe(
  "Links Validation Test",
  {
    annotation: { description: "This test suite validates all links on a website.", type: "test-case" },
  },
  () => {
    test.beforeEach(() => {
      test.info().annotations.push({
        description: new Date().toISOString(),
        type: "Start",
      });
    });
    test("Check for broken links", { tag: ["@links"] }, async ({ LinksPage }, testInfo) => {
      await LinksPage.goto();

      await test.step("Gather all links", async () => {
        const { invalidLinks, validLinks } = await LinksPage.getAllLinks();
        console.log(`Found ${validLinks.size} valid links and ${invalidLinks.length} invalid links`);
      });

      await test.step("Validate links", async () => {
        const { invalidLinks, validLinks } = await LinksPage.getAllLinks();
        const brokenLinks = await LinksPage.checkLinks(validLinks);

        const invalidLinksSection = "=== INVALID LINKS ===\n" + LinksPage.formatLinks(invalidLinks) + "\n\n";
        const brokenLinksSection = "=== BROKEN LINKS ===\n" + LinksPage.formatLinks(brokenLinks) + "\n\n";
        const reportContent = invalidLinksSection + brokenLinksSection;

        const outputFile = "test-results/links-report.txt";
        fs.writeFileSync(outputFile, reportContent, "utf8");

        await testInfo.attach("links-report.txt", {
          contentType: "text/plain",
          path: outputFile,
        });
        console.log(`Link validation complete. Found ${invalidLinks.length} invalid links and ${brokenLinks.length} broken links.`);
      });
    });

    test.afterEach(() => {
      test.info().annotations.push({
        description: new Date().toISOString(),
        type: "End",
      });
    });
  },
);
