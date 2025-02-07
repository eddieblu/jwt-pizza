import { test, expect } from 'playwright-test-coverage';

test('about', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('main')).toContainText('The secret sauce');
    await expect(page.getByRole('main').getByRole('img').first()).toBeVisible();
    await expect(page.getByRole('list')).toContainText('about');
  });