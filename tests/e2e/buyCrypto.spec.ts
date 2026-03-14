import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/BasePage";
import { BuyCryptoPage } from "../../pages/BuyCryptoPage";

test.describe("buy crypto tests", () => {
  let basePage: BasePage;
  let buyCryptoPage: BuyCryptoPage;
  const btcAddress = process.env.DUMMY_BTC_ADDRESS || "";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    basePage = new BasePage(page);
    buyCryptoPage = new BuyCryptoPage(page);
  });

  test.describe("Positive Test Cases", () => {
    test("should navigate to Checkout page with legacy Crypto key", async ({ page }) => {
      const amount = "200";
      const crypto = "BTC";

      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();

      await buyCryptoPage.selectCrypto(crypto);
      await buyCryptoPage.enterMoneyAmount(amount);
      await buyCryptoPage.enterCryptoAddress(btcAddress);
      await buyCryptoPage.clickContinue();

      await expect(page).toHaveURL(/.*checkout\.simplexcc\.com\/next\/#\/offers/);
      //TODO need to fix this place
      await buyCryptoPage.acceptCookiesIfPresent();
      await expect(page.getByText("Credit/Debit card")).toBeVisible();
      await expect(page.getByText("Euro Bank Transfer")).toBeVisible();
    });
  });
  //TODO:
  test.describe("Negative Test Cases", () => {
    //TODO:
    test("should display an error when entering an amount below the minimum limit", async ({ page }) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      await buyCryptoPage.selectCrypto("BTC");
      await buyCryptoPage.enterMoneyAmount("10");
      await expect(page.getByText("Minimum amount is")).toBeVisible();
    });
    //TODO:
    test("should display an error when entering an amount above the maximum limit", async ({ page }) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      await buyCryptoPage.selectCrypto("BTC");
      await buyCryptoPage.enterMoneyAmount("200000");
      await expect(page.getByText("Maximum amount is")).toBeVisible();
    });
    //TODO:
    test("should display an error when entering non-numeric characters in the amount field", async ({ page }) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      await buyCryptoPage.selectCrypto("BTC");
      await buyCryptoPage.enterMoneyAmount("abc");
      await buyCryptoPage.clickContinue();
      await expect(page.getByText("Please enter a valid amount")).toBeVisible();
    });
    //TODO:
    test.fixme("should display an error when selecting an unsupported cryptocurrency", async ({ page }) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      // Requires a method to search without selecting, e.g.:
      // await buyCryptoPage.searchCrypto("INVALID_COIN");
      // await expect(page.getByText("No results found")).toBeVisible();
    });
  });
});
