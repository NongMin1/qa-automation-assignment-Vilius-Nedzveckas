import { test, expect } from "@playwright/test";
import { BuyCryptoPage } from "../../pages/BuyCryptoPage";
import { BUY_CRYPTO_DATA } from "../data/buyCryptoData";

test.describe("buy crypto tests", () => {
  let buyCryptoPage: BuyCryptoPage;
  const btcAddress = process.env.DUMMY_BTC_ADDRESS || "";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    buyCryptoPage = new BuyCryptoPage(page);
    await buyCryptoPage.navigateToWidget(BUY_CRYPTO_DATA.fiat);
    await expect(buyCryptoPage.fiatAmountInput).toBeVisible();
  });

  test.describe("Positive Test Cases", () => {
    test.only("should navigate to Checkout page with legacy Crypto key", async ({ page }) => {
      //DOES IT HELP? How to solve problem in GitHub Actions where the test gets stuck on walletconnect request?
      //TODO - headless and headed works locally. In CI it gets stuck on walletconnect request. https://pulse.walletconnect.org/e?projectId={someid} ends with Status code = 400.
      //Payload response: Bad Request - Missing origin header.
      test.setTimeout(60000);
      const amount = BUY_CRYPTO_DATA.amounts.valid;
      const crypto = BUY_CRYPTO_DATA.crypto;

      await buyCryptoPage.selectCrypto(crypto);
      await buyCryptoPage.enterMoneyAmount(amount);

      await test.step("Enter crypto address (Masked)", async () => {
        await buyCryptoPage.maskAddressInput();
        await buyCryptoPage.enterCryptoAddress(btcAddress);

        await test.info().attach("masked-address-screenshot", {
          body: await page.screenshot({ mask: [buyCryptoPage.addressInput] }),
          contentType: "image/png",
        });
      });

      await buyCryptoPage.clickContinue();

      await buyCryptoPage.loadingSpinner.waitFor({ state: "hidden", timeout: 30000 });
      await expect(page).toHaveURL(/.*simplexcc\.com.*/, { timeout: 60000 });

      await expect(page.getByText("Credit/Debit card")).toBeVisible({ timeout: 15000 });
      await expect(page.getByText("Euro Bank Transfer")).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe("Negative Test Cases", () => {
    test("should display an error when entering an amount below the minimum limit", async ({}) => {
      await buyCryptoPage.enterMoneyAmount(BUY_CRYPTO_DATA.amounts.min);
      await expect(buyCryptoPage.errorMessage).toContainText(/The Euro amount must be between/);
    });

    test("should display an error when entering an amount above the maximum limit", async ({}) => {
      await buyCryptoPage.enterMoneyAmount(BUY_CRYPTO_DATA.amounts.max);
      await expect(buyCryptoPage.errorMessage).toContainText(/The Euro amount must be between/);
    });

    test("should display an error when entering non-numeric characters in the amount field", async ({}) => {
      await buyCryptoPage.enterMoneyAmount(BUY_CRYPTO_DATA.amounts.invalid);
      await buyCryptoPage.clickContinue();
      await expect(buyCryptoPage.errorMessage).toContainText(/Please enter Euro amount/);
    });

    test("should display an error when entering non-numeric characters in the crypto amount field", async ({}) => {
      await buyCryptoPage.enterCryptoAmount(BUY_CRYPTO_DATA.amounts.invalid);
      await expect(buyCryptoPage.errorMessage).toContainText(/Please enter Bitcoin amount/);
    });

    test.fixme("should display an error when entering an invalid crypto address", async ({ page }) => {
      await buyCryptoPage.enterMoneyAmount(BUY_CRYPTO_DATA.amounts.valid);
      await buyCryptoPage.enterCryptoAddress(BUY_CRYPTO_DATA.invalidAddress);
      await buyCryptoPage.clickContinue();
      const responsePromise = page.waitForResponse((resp) => resp.request().method() === "POST" && resp.url().includes("pulse.walletconnect"));

      const response = await responsePromise;
      const responseBody = await response.json();

      expect(response.status()).toBe(400);
      expect(responseBody.isAddressValid).toBe(false);

      await expect(buyCryptoPage.errorMessage).toContainText(/No error message appears. TODO add valid error message/i);
    });
  });
});
