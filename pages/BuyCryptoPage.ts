import { Locator, FrameLocator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BuyCryptoPage extends BasePage {
  readonly widgetFrame: FrameLocator;
  readonly cryptoAmountInput: Locator;
  readonly cryptoDropdownTrigger: Locator;
  readonly fiatAmountInput: Locator;
  readonly fiatDropdownTrigger: Locator;
  readonly addressInput: Locator;
  readonly continueButton: Locator;
  readonly erroMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.widgetFrame = page.frameLocator('iframe[src*="/form"]');
    this.cryptoAmountInput = this.widgetFrame.locator("#crypto_amount");
    this.fiatAmountInput = this.widgetFrame.locator("#fiat_amount");
    this.fiatDropdownTrigger = this.widgetFrame.locator("input.fiat-dd");
    this.addressInput = this.widgetFrame.locator("#cryptoAddress");
    this.continueButton = this.widgetFrame.locator("button.simplex-continue-button");
    this.cryptoDropdownTrigger = this.widgetFrame.locator("input.crypto-dd");
    this.erroMessage = this.widgetFrame.locator(".error-tooltip");
  }

  async waitForWidgetToBeReady() {
    const frameElement = this.page.locator('iframe[src*="simplex-affiliates.com"]').first();

    await frameElement.waitFor({ state: "attached" });
    await frameElement.waitFor({ state: "visible", timeout: 20000 });
    await expect(this.fiatAmountInput).toBeVisible({ timeout: 15000 });
  }

  async selectCrypto(crypto: string) {
    const fullValue = await this.cryptoDropdownTrigger.getAttribute("value");
    const currentValue = fullValue?.split(" ")[0];

    if (currentValue !== crypto) {
      await this.cryptoDropdownTrigger.click();
      const option = this.widgetFrame.locator("ul.autocomplete-results li").getByText(crypto, { exact: true });
      await option.click();

      await expect(this.cryptoDropdownTrigger).toHaveAttribute("value", new RegExp(crypto));
    }
  }

  async selectFiatCurrency(currency: string) {
    const fullValue = await this.fiatDropdownTrigger.getAttribute("value");
    const currentValue = fullValue?.split(" ")[0];

    if (currentValue !== currency) {
      await this.fiatDropdownTrigger.click();
      const option = this.widgetFrame.locator("ul.autocomplete-results li").getByText(currency, { exact: true });
      await option.click();
    }
  }

  async enterCryptoAmount(amount: string) {
    await this.cryptoAmountInput.fill(amount);
  }

  async enterMoneyAmount(amount: string) {
    await this.fiatAmountInput.fill(amount);
    await this.fiatAmountInput.press("Tab");
  }

  async enterCryptoAddress(address: string) {
    await this.addressInput.fill(address);
  }

  async clickContinue() {
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
  }
}
