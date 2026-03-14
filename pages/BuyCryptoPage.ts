import { Locator, FrameLocator, Page, expect } from "@playwright/test";

export class BuyCryptoPage {
  readonly page: Page;
  readonly widgetFrame: FrameLocator;
  readonly cryptoAmountInput: Locator;
  readonly cryptoDropdownTrigger: Locator;
  readonly fiatAmountInput: Locator;
  readonly addressInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.widgetFrame = page.frameLocator('iframe[src*="/form"]');
    this.cryptoAmountInput = this.widgetFrame.locator("#crypto_amount");
    this.fiatAmountInput = this.widgetFrame.locator("#fiat_amount");
    this.addressInput = this.widgetFrame.locator("#cryptoAddress");
    this.continueButton = this.widgetFrame.locator("button.simplex-continue-button");
    this.cryptoDropdownTrigger = this.widgetFrame.locator("input.crypto-dd");
  }

  async waitForWidgetToBeReady() {
    const frameElement = this.page.locator('iframe[src*="simplex-affiliates.com"]').first();
    await frameElement.waitFor({ state: "attached" });

    await this.page.waitForFunction(() => {
      const frame = document.querySelector('iframe[src*="simplex-affiliates.com"]') as HTMLIFrameElement;
      return frame?.contentWindow?.location.href !== "about:blank";
    });

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
