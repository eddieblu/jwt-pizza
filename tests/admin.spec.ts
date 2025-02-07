import { test, expect } from 'playwright-test-coverage';

test('See Admin Dashboard', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  // Login as Admin
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Check Admin login 
  await expect(page.locator('#navbar-dark')).toContainText('Admin');
  await expect(page.locator('#navbar-dark')).toContainText('Logout');

  // Check Admin Dashboard
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('list')).toContainText('admin-dashboard');
  await page.getByRole('columnheader', { name: 'Franchise', exact: true }).click();
  await page.getByRole('columnheader', { name: 'Franchisee' }).click();
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
});

test('Create Franchise as Admin', async ({ page }) => {

});