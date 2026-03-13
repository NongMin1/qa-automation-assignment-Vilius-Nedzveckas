import { Page } from "@playwright/test";

export async function acceptCookies(page: Page): Promise<void> {
  const acceptButton = page.getByTestId("onetrust-accept-btn-handler");

  try {
    await acceptButton.waitFor({ state: "visible", timeout: 5000 });
    await acceptButton.click();
  } catch {
    //No cookies found
  }
}
