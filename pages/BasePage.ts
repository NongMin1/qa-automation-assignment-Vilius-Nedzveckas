import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly buyCryptoButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.buyCryptoButton = page.getByRole("link", { name: "Buy Crypto" });
  }

  // Actions
  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async click(locator: Locator) {
    await locator.click();
  }

  async fill(locator: Locator, text: string) {
    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async waitForElementToBeVisible(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: timeout });
  }

  async clickBuyCrypto() {
    await this.buyCryptoButton.click();
  }
}
