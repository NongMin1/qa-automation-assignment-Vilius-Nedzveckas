import { Page } from "@playwright/test";

export async function acceptCookies(page: Page): Promise<void> {
  const acceptButton = page.getByRole("button", { name: "Accept All" });

  try {
    await acceptButton.waitFor({ state: "visible", timeout: 5000 });
    await acceptButton.click();
  } catch {
    //No cookies found
  }
}
