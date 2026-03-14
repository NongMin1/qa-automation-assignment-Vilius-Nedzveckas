import { test, expect } from "@playwright/test";
import { acceptCookies } from "../../helpers/cookies.helper";
import { BasePage } from "../../pages/BasePage";
import { BuyCryptoPage } from "../../pages/BuyCryptoPage";

test.describe("buy crypto tests", () => {
  let basePage: BasePage;
  let buyCryptoPage: BuyCryptoPage;
  const btcAddress = process.env.DUMMY_BTC_ADDRESS || "";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await acceptCookies(page);
    basePage = new BasePage(page);
    buyCryptoPage = new BuyCryptoPage(page);
  });

  test.describe("Positive Test Cases", () => {
    test("Navigation to Checkout page with legacy Crypto key", async ({ page }) => {
      const amount = "200";
      const crypto = "BTC";

      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();

      await buyCryptoPage.selectCrypto(crypto);
      await buyCryptoPage.enterMoneyAmount(amount);
      await buyCryptoPage.enterCryptoAddress(btcAddress);
      await buyCryptoPage.clickContinue();

      await expect(page).toHaveURL(/.*checkout\.simplexcc\.com\/next\/#\/offers/);
      await acceptCookies(page);
      await expect(page.getByText("Credit/Debit card")).toBeVisible();
      await expect(page.getByText("Euro Bank Transfer")).toBeVisible();
    });
  });
});

test.describe("Negative Test Cases", () => {
  test.fixme("Entering an amount below the minimum limit", async ({ page }) => {});
  test.fixme("Entering an amount above the maximum limit", async ({ page }) => {});
  test.fixme("Entering non-numeric characters in the amount field", async ({ page }) => {});
  test.fixme("Selecting an unsupported cryptocurrency", async ({ page }) => {});
});
