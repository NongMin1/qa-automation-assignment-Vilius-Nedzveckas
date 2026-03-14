import { Page, BrowserContext } from "@playwright/test";

export async function blockRedundantRequests(target: Page | BrowserContext) {
  await target.route("**/*.{png,jpg,jpeg,svg}", (route) => route.abort());
  await target.route(/google-analytics/, (route) => route.abort());
}
