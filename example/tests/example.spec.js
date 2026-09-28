const { test, expect } = require('@playwright/test');

test('example.com has title', async ({ page }) => {
  await page.goto('https://example.com/');
  await expect(page).toHaveTitle(/Example Domain/);
});

test('example.com heading visible', async ({ page }) => {
  await page.goto('https://example.com/');
  await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
});
