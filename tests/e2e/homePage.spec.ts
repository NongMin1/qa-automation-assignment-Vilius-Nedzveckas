import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/BasePage";

test.describe("buy crypto tests", () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    basePage = new BasePage(page);
  });

  test.describe("Positive Test Cases", () => {
    test("should load homepage successfully", async ({ page }) => {
      await expect(page.locator("img[alt*='logo' i]").first()).toBeVisible();
      await expect(page.getByRole("navigation")).toBeVisible();
      await expect(basePage.buyCryptoButton).toBeVisible();
    });

    test("should navigate using main menu", async ({ page }) => {
      const menuItem = "About";
      const initialUrl = page.url();

      const menuLink = page.getByRole("link", { name: menuItem });
      await expect(menuLink).toBeVisible();
      await menuLink.click();

      await expect(page).not.toHaveURL(initialUrl);
      await expect(page.getByRole("heading", { name: new RegExp(menuItem, "i") })).toBeVisible();
    });
  });
});
