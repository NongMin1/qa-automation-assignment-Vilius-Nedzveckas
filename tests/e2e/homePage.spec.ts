import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/BasePage";
import { NAV_MENU_ITEMS } from "../data/menuData";
import { blockRedundantRequests } from "../../utils/networkUtils";

test.describe("Home Page Navigation", () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page, context }) => {
    await blockRedundantRequests(context);
    await page.goto("/");
    basePage = new BasePage(page);
  });

  test.describe("Positive Test Cases", () => {
    test("should load homepage successfully", async ({}) => {
      await expect(basePage.logo).toBeVisible();
      await expect(basePage.mainMenu).toBeVisible();
      await expect(basePage.buyCryptoButton).toBeVisible();
    });

    test.describe("Menu Navigation Test Cases", () => {
      for (const { category, item, expectedUrlPart, isExternal } of NAV_MENU_ITEMS) {
        test(`Should navigate to ${category} > ${item}`, async ({ page, context }) => {
          if (isExternal) {
            const pagePromise = context.waitForEvent("page");
            await basePage.navigateToMenuItem(category, item);
            const newPage = await pagePromise;
            await expect(newPage).toHaveURL(new RegExp(expectedUrlPart, "i"));
          } else {
            await basePage.navigateToMenuItem(category, item);
            await expect(page).toHaveURL(new RegExp(expectedUrlPart, "i"));
          }
        });
      }
    });
  });
});
