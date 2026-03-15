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
