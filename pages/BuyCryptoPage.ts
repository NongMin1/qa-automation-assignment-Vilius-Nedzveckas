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

  async navigateToWidget(fiat: string) {
    await this.clickBuyCrypto();
    await this.waitForWidgetToBeReady();
    await this.selectFiatCurrency(fiat);
  }

  async waitForWidgetToBeReady() {
    const frameElement = this.page.locator('iframe[src*="simplex-affiliates.com"]').first();

    await frameElement.waitFor({ state: "attached" });
    await frameElement.waitFor({ state: "visible", timeout: 20000 });
    await expect(this.fiatAmountInput).toBeVisible({ timeout: 15000 });
  }

  private async selectFromDropdown(trigger: Locator, value: string) {
    const fullValue = await trigger.getAttribute("value");
    const currentValue = fullValue?.split(" ")[0];

    if (currentValue !== value) {
      await trigger.click();
      await trigger.fill(value);
      const option = this.widgetFrame.locator("ul.autocomplete-results li").getByText(value, { exact: true });
      await option.waitFor({ state: "visible" });
      await option.click();
    }
  }

  async selectCrypto(crypto: string) {
    await this.selectFromDropdown(this.cryptoDropdownTrigger, crypto);
    await expect(this.cryptoDropdownTrigger).toHaveAttribute("value", new RegExp(crypto));
  }

  async selectFiatCurrency(currency: string) {
    await this.selectFromDropdown(this.fiatDropdownTrigger, currency);
    await expect(this.fiatDropdownTrigger).toHaveAttribute("value", new RegExp(currency));
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
