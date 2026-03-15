# Playwright Code Review Standards

When reviewing or generating Playwright test code, adhere strictly to these patterns derived from official Playwright best practices.

## 1. Locators & Selectors

- **Prefer User-Facing Locators:** Always prioritize `getByRole`, `getByText`, `getByLabel`, and `getByPlaceholder`.
- **Avoid Implementation Details:** Reject CSS or XPath selectors (e.g., `.btn-primary` or `//div/span`) unless absolutely necessary for complex elements.
- **Use Test IDs as a Last Resort:** Use `getByTestId` only if user-facing locators are unstable or unavailable.
- **Locators are Lazy:** Do not store the result of a locator in a variable unless it is reused multiple times.

## 2. Best Practices for Assertions

- **Use Web-First Assertions:** Use `expect(locator).toBeVisible()` or `expect(locator).toHaveText()`.
- **Avoid Manual Waiting:** Never use `page.waitForTimeout()`. Rely on Playwright's auto-waiting and web-first assertions.
- **Soft Assertions:** Use `expect.soft()` only for non-critical checks that shouldn't stop the test execution.

## 3. Page Object Model (POM)

- **Encapsulate Locators:** Define locators in the constructor.
- **Action-Oriented Methods:** Methods should represent user actions (e.g., `gotoDashboard()`, `submitLoginForm()`).
- **Assertion Location:** Perform assertions in the test file, not inside the Page Object, to keep POMs reusable.

## 4. Test Structure & Performance

- **Isolated Tests:** Ensure each test is independent. Use `beforeEach` for shared setup.
- **Avoid Conditionals:** Tests should be deterministic. Do not use `if` statements to check if an element exists before clicking.
- **Parallelism:** Ensure tests do not rely on shared state (like a specific database ID) that prevents parallel execution.

## 5. Network & Interception

- **Prefer API Testing for Setup:** Use `request` to seed data or log in via API rather than UI flows to save time.
- **Mocking:** Use `page.route()` to mock external APIs or slow dependencies to keep tests fast and reliable.

## 6. Prohibited Patterns

- NO `page.pause()` in committed code.
- NO hardcoded waits (`waitForTimeout`).
- NO use of `elementHandle` (the `$` or `$$` functions). Use `Locators` instead.
