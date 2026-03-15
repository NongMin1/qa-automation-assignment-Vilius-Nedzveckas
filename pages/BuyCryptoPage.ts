import { Locator, FrameLocator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BuyCryptoPage extends BasePage {
  readonly widgetFrame: FrameLocator;
  readonly cryptoAmountInput: Locator;
  readonly cryptoDropdownTrigger: Locator;
  readonly fiatAmountInput: Locator;
  readonly fiatDropdownTrigger: Locator;
  readonly addressInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.widgetFrame = page.frameLocator('iframe[src*="/form"]');
    this.cryptoAmountInput = this.widgetFrame.locator('input[name="crypto_amount"]');
    this.fiatAmountInput = this.widgetFrame.locator('input[name="fiat_amount"]');
    this.fiatDropdownTrigger = this.widgetFrame.locator("input.fiat-dd");
    this.addressInput = this.widgetFrame.locator('input[name="cryptoAddress"]');
    this.continueButton = this.widgetFrame.locator("button.simplex-continue-button");
    this.cryptoDropdownTrigger = this.widgetFrame.locator("input.crypto-dd");
    this.errorMessage = this.widgetFrame.locator("div.error-tooltip");
  }

  async navigateToWidget(fiat: string) {
    await this.clickBuyCrypto();
    await this.selectFiatCurrency(fiat);
  }

  private async selectFromDropdown(trigger: Locator, value: string) {
    const fullValue = await trigger.getAttribute("value");
    const currentValue = fullValue?.split(" ")[0];

    if (currentValue !== value) {
      await trigger.click();
      await trigger.fill(value);
      const option = this.widgetFrame.getByText(value);
      await option.waitFor({ state: "visible" });
      await option.click();
    }
  }

  async selectCrypto(crypto: string) {
    await this.selectFromDropdown(this.cryptoDropdownTrigger, crypto);
  }

  async selectFiatCurrency(currency: string) {
    await this.selectFromDropdown(this.fiatDropdownTrigger, currency);
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
    await this.continueButton.waitFor({ state: "visible" });
    await this.continueButton.click();
  }
}
