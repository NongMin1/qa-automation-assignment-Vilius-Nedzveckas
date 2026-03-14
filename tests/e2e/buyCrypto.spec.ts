import { test } from "@playwright/test";
import { acceptCookies } from "../../helpers/cookies.helper";
import { BasePage } from "../../pages/BasePage";
test.describe("search tests", () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await acceptCookies(page);
    basePage = new BasePage(page);
  });

  test("TODO", async ({ page }) => {
    //TODO add some tests here
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`Console error: ${msg.text()}`);
      }
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/${testInfo.title}.png`,
      });
    }
  });
});
