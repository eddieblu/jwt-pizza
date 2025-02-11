import { test, expect } from 'playwright-test-coverage';

test('See Franchisee Dashboard', async ({ page }) => {
  // mock route for franchisee login
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'f@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'pizza franchisee', email: 'f@jwt.com', roles: [{ role: 'diner' }, { objectId: 1, role: "franchisee" }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  // mock route for franchise that exists for user 
  await page.route('*/**/api/franchise/*', async (route) => {
    const getFranchiseRes = [{
      "id": 3, "name": "Test Franchise", "admins": [{ "id": 3, "name": "pizza franchisee", "email": "f@jwt.com" }],
      "stores": [{ "id": 4, "name": "SLC", "totalRevenue": 0 }]
    }];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: getFranchiseRes });
  });


  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  //Login as Franchisee
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Check Franchisee login 
  await expect(page.locator('#navbar-dark')).toContainText('Logout');
  await expect(page.locator('#navbar-dark')).toContainText('Franchise');

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  // Check Franchisee Dashboard
  await expect(page.getByRole('list')).toContainText('franchise-dashboard');
  await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise. Your gateway to success.');
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
});

// These are the exact steps I took when clicking through 
// why does the test not work when it runs on its own ?
test('test', async ({ page }) => {
  // await page.goto('http://localhost:5173/');
  // await page.getByRole('link', { name: 'Login' }).click();
  // await page.getByRole('textbox', { name: 'Email address' }).click();
  // await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  // await page.getByRole('textbox', { name: 'Password' }).click();
  // await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  // await page.getByRole('button', { name: 'Login' }).click();
  // await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  // await page.getByRole('button', { name: 'Create store' }).click();
  // await page.getByRole('button', { name: 'Cancel' }).click();
});
