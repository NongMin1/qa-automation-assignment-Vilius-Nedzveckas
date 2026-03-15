import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const project = config.projects[0];
  const { baseURL, storageState } = project.use;

  if (!baseURL || typeof storageState !== "string") {
    throw new Error("`baseURL` and `storageState` must be configured in playwright.config.ts for global setup.");
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL);
  const acceptButton = page.getByRole("button", { name: "Accept All" });

  await acceptButton.click({ timeout: 5000 }).catch(() => console.log("Cookie banner not found, continuing..."));

  await page.context().storageState({ path: storageState });
  await browser.close();
}

export default globalSetup;
