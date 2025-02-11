import { test, expect } from 'playwright-test-coverage';


test('login as diner', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'd@jwt.com', password: 'a' };
        const loginRes = { user: { id: 3, name: 'pizza diner', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    // route for get orders
    await page.route('*/**/api/order', async (route) => {
        const getOrdersRes = { "dinerId": 4, "orders": [{ "id": 1, "franchiseId": 1, "storeId": 1, "date": "2024-06-05T05:14:40.000Z", "items": [{ "id": 1, "menuId": 1, "description": "Veggie", "price": 0.05 }] }], "page": 1 };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: getOrdersRes });
    });

    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();

    // Login 
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    // Check login
    await expect(page.locator('#navbar-dark')).toContainText('Logout');

    // Navigate to Diner Dashboard
    await page.getByRole('link', { name: 'pd' }).click();

    // Check diner dashboard
    await expect(page.getByRole('list')).toContainText('diner-dashboard');
    await expect(page.getByRole('main')).toContainText('d@jwt.com');
    await expect(page.locator('tbody')).toContainText('0.05 ₿');
});
