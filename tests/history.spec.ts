import { test, expect } from 'playwright-test-coverage';

test('history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
  await expect(page.getByRole('list')).toContainText('history');
});