import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('app loads and returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('main page renders without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForSelector('text=SuperPrompt Library');
    expect(errors).toEqual([]);
  });

  test('login page is reachable and shows sign-in CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('page serves valid HTML with root element', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('#root');
    await expect(root).toBeAttached();
    const children = await root.locator('> *').count();
    expect(children).toBeGreaterThan(0);
  });

  test('static assets load successfully', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto('/');
    await page.waitForSelector('text=SuperPrompt Library');
    expect(failedRequests).toEqual([]);
  });
});
