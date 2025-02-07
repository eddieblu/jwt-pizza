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
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: [] });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  // Login as Admin
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to Admin dashboard
  await page.getByRole('link', { name: 'Admin' }).click();

  // Click Add Franchise button 
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('heading')).toContainText('Create franchise');

  // RE ROUTE
  await page.unroute('*/**/api/franchise');
  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() == 'POST') {
      const createFranchiseReq = { "name": "pizzaPocket", "admins": [{ "email": "f@jwt.com" }] };
      const createFranchiseRes = { "name": "pizzaPocket", "admins": [{ "email": "f@jwt.com", "id": 4, "name": "pizza franchisee" }], "id": 1 };
      expect(route.request().postDataJSON()).toMatchObject(createFranchiseReq);
      await route.fulfill({ json: createFranchiseRes });
    } else if (route.request().method() == 'GET') {
      const getFranchiseRes = [{ "name": "pizzaPocket", "admins": [{ "email": "f@jwt.com", "id": 4, "name": "pizza franchisee" }], "id": 1, "stores": [{ "id": 1, "name": "SLC", "totalRevenue": 0 }] }];
      await route.fulfill({ json: getFranchiseRes });
    }
  });

  // Create Franchise
  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('pizzaPocket');
  await page.getByPlaceholder('franchisee admin email').click();
  await page.getByPlaceholder('franchisee admin email').fill('f@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  // Check Franchise was created 
  await expect(page.getByRole('table')).toContainText('pizzaPocket');

  // Routing for Delete store
  await page.route('*/**/api/franchise/*/store/*', async (route) => {
    const deleteStoreRes = { "message": "store deleted" };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: deleteStoreRes });
  });

  // Routing for Delete franchise
  await page.route('*/**/api/franchise/*', async (route) => {
    const deleteFranchiseRes = { "message": "franchise deleted" };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: deleteFranchiseRes });
  });

  // Delete Store
  await expect(page.getByRole('table')).toContainText('SLC');
  await page.getByRole('row', { name: 'SLC 0 ₿ Close' }).getByRole('button').click();
  await expect(page.getByRole('list')).toContainText('close-store');
  await page.getByRole('button', { name: 'Close' }).click();
  
  // Delete Franchise
  await expect(page.getByRole('table')).toContainText('pizzaPocket');
  await page.getByRole('row', { name: 'pizzaPocket pizza' }).getByRole('button').click();
  await expect(page.getByRole('list')).toContainText('close-franchise');
  await page.getByRole('button', { name: 'Close' }).click();
});