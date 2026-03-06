import { test, expect } from '@playwright/test';

test.describe('Login Page — Unauthenticated', () => {
  test('should display app title and tagline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('SuperPrompt Library')).toBeVisible();
    await expect(
      page.getByText('Your team\'s AI prompt collection')
    ).toBeVisible();
  });

  test('should show sign-in button that is enabled', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.getByText('Sign in with Google');
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();
  });

  test('should apply dark theme to html element', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should render book icon on login page', async ({ page }) => {
    await page.goto('/');
    const icon = page.locator('svg').first();
    await expect(icon).toBeVisible();
  });
});

test.describe('Auth Boundaries — Route Protection', () => {
  test('should redirect /admin to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('should redirect /search to login when not authenticated', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('should redirect unknown routes to login when not authenticated', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('should redirect deeply nested routes to login when not authenticated', async ({ page }) => {
    await page.goto('/admin/prompts/123');
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });
});

test.describe('Page Structure — Unauthenticated', () => {
  test('should not show navigation links when logged out', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Library' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Search' })).not.toBeVisible();
  });

  test('should not show sign-out option when logged out', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sign out')).not.toBeVisible();
  });

  test('should render login card centered on page', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.rounded-xl').first();
    await expect(card).toBeVisible();
  });
});
