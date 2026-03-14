import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly mainMenu: Locator;
  readonly buyCryptoButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator("header").getByAltText("Simplex");
    this.mainMenu = page.locator("#menu-main-menu");
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

  async navigateToMenuItem(category: string, menuItem: string) {
    const parentMenu = this.page.locator("#menu-main-menu").getByRole("link", { name: category });
    await parentMenu.hover();

    const subItem = this.page.locator("#menu-main-menu").getByRole("link", { name: menuItem });
    await subItem.click();
  }
}
