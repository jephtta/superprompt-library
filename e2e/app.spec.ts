import { test, expect } from '@playwright/test';

test.describe('SuperPrompt Library', () => {
  test('shows login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('SuperPrompt Library')).toBeVisible();
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('login page has correct branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Your team\'s AI prompt collection')).toBeVisible();
  });

  test('login button is clickable', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.getByText('Sign in with Google');
    await expect(signInButton).toBeEnabled();
  });

  test('page has dark theme', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('redirects unknown routes to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('redirects search route to login when not authenticated', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });
});
