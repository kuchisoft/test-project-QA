import { linksTest as test } from "../fixtures/linksPage.fixture";

test.describe(
  "Links Validation Test",
  {
    annotation: { description: "This test suite validates all links on a website.", type: "test-case" },
  },
  () => {
    test("Check for links", { tag: ["@links"] }, async ({ LinksPage }, testInfo) => {
      await test.step("Gather all links", async () => {
        const { allHrefs } = await LinksPage.getAllLinks();
        await testInfo.attach("all-links-text", {
          body: allHrefs.join("\n"),
          contentType: "text/plain",
        });
      });

      await test.step("Validate links", async () => {
        const { invalidLinks, validLinks } = await LinksPage.getAllLinks();
        const brokenLinks = await LinksPage.checkLinks(validLinks);

        await testInfo.attach("broken-links-text", {
          body: brokenLinks.join("\n"),
          contentType: "text/plain",
        });
        await testInfo.attach("invalid-links-text", {
          body: invalidLinks.join("\n"),
          contentType: "text/plain",
        });
      });
    });
  },
);
