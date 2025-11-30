// tests/e2e/simple.spec.ts
import { test, expect } from '@playwright/test';

test('simple page load test', async ({ page }) => {
  console.log('Navigating to register page...');
  await page.goto('/register');
  console.log('Page title:', await page.title());
  console.log('Page URL:', page.url());

  // Wait a bit and check if any content loads
  await page.waitForTimeout(3000);
  console.log('Page content loaded');

  // Check if the page has any text content
  const bodyText = await page.locator('body').textContent();
  console.log('Body text length:', bodyText?.length || 0);

  // Try to find any loading indicators
  const loadingElements = await page.locator('[data-testid*="loading"], .loading, .spinner').count();
  console.log('Loading elements found:', loadingElements);

  // Check for error messages
  const errorElements = await page.locator('[data-testid*="error"]').count();
  console.log('Error elements found:', errorElements);
});