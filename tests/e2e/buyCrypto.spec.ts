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
  //Positive TC's
  test("Navigation to Checkout page with legacy Crypto key", async ({ page }) => {
    const amount = "200";
    const crypto = "BTC";

    await basePage.clickBuyCrypto();
    await buyCryptoPage.selectCrypto(crypto);
    await buyCryptoPage.enterMoneyAmount(amount);
    await buyCryptoPage.enterCryptoAddress(btcAddress);
    await buyCryptoPage.clickContinue();

    await expect(page).toHaveURL(/.*checkout\.simplexcc\.com\/next\/#\/offers/);
    await expect(page.getByText("Credit/Debit card")).toBeVisible();
    await expect(page.getByText("Euro Bank Transfer")).toBeVisible();
    await expect(page.getByText("Google Pay")).toBeVisible();
    await expect(page.getByText("Credit or Debit Card")).toBeVisible();
  });
});

//Negative TC's
test("TODO", async ({ page }) => {
  // Implement negative test cases such as:
  // - Entering an amount below the minimum limit
  // - Entering an amount above the maximum limit
  // - Entering non-numeric characters in the amount field
  // - Selecting an unsupported cryptocurrency
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `screenshots/${testInfo.title}.png`,
    });
  }
});
