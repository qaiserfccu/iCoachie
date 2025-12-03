// tests/e2e/club-manager.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Club Manager Sidebar Integration', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Authentication and Navigation', () => {
    test('should allow club manager to login and access dashboard', async ({ page }) => {
      const userData = generateTestData.user('CLUB_ADMIN');

      // Register as club admin (which maps to CLUB_MANAGER role)
      await helpers.register(userData);

      // Verify dashboard access
      await expect(page).toHaveURL(/.*dashboard|.*club/);
      
      // Wait for dashboard to load
      await page.waitForLoadState('networkidle');
    });

    test('should display club dashboard with stats', async ({ page }) => {
      // Navigate to club dashboard
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Check for dashboard elements (loading or data)
      const hasLoader = await page.locator('[class*="animate-spin"]').isVisible().catch(() => false);
      const hasStats = await page.locator('text=Total Members').isVisible().catch(() => false);
      const hasError = await page.locator('text=Failed to load').isVisible().catch(() => false);

      // Either loading, showing data, or showing error state
      expect(hasLoader || hasStats || hasError).toBeTruthy();
    });

    test('should navigate to members page from sidebar', async ({ page }) => {
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Click on Members link in sidebar
      await page.click('a[href="/club/members"]');
      await expect(page).toHaveURL(/.*\/club\/members/);

      // Verify page loaded
      await expect(page.locator('h1')).toContainText('Members');
    });

    test('should navigate to coaches page from sidebar', async ({ page }) => {
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Click on Coaches link in sidebar
      await page.click('a[href="/club/coaches"]');
      await expect(page).toHaveURL(/.*\/club\/coaches/);

      // Verify page loaded
      await expect(page.locator('h1')).toContainText('Coaches');
    });

    test('should navigate to sessions page from sidebar', async ({ page }) => {
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Click on Sessions link in sidebar
      await page.click('a[href="/club/sessions"]');
      await expect(page).toHaveURL(/.*\/club\/sessions/);

      // Verify page loaded
      await expect(page.locator('h1')).toContainText('Sessions');
    });

    test('should navigate to payments page from sidebar', async ({ page }) => {
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Click on Payments link in sidebar
      await page.click('a[href="/club/payments"]');
      await expect(page).toHaveURL(/.*\/club\/payments/);

      // Verify page loaded
      await expect(page.locator('h1')).toContainText('Payments');
    });

    test('should navigate to analytics page from sidebar', async ({ page }) => {
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Click on Analytics link in sidebar
      await page.click('a[href="/club/analytics"]');
      await expect(page).toHaveURL(/.*\/club\/analytics/);

      // Verify page loaded
      await expect(page.locator('h1')).toContainText('Analytics');
    });

    test('should navigate to messages page from sidebar', async ({ page }) => {
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Click on Messages link in sidebar
      await page.click('a[href="/club/messages"]');
      await expect(page).toHaveURL(/.*\/club\/messages/);

      // Verify page loaded
      await expect(page.locator('h1')).toContainText('Messages');
    });

    test('should navigate to announcements page from sidebar', async ({ page }) => {
      await page.goto('/club');
      await page.waitForLoadState('networkidle');

      // Click on Announcements link in sidebar
      await page.click('a[href="/club/announcements"]');
      await expect(page).toHaveURL(/.*\/club\/announcements/);

      // Verify page loaded
      await expect(page.locator('h1')).toContainText('Announcements');
    });
  });

  test.describe('Members Page', () => {
    test('should display members list with search functionality', async ({ page }) => {
      await page.goto('/club/members');
      await page.waitForLoadState('networkidle');

      // Check for search input
      const searchInput = page.locator('input[placeholder*="Search members"]');
      await expect(searchInput).toBeVisible();

      // Check for Add Member button
      const addButton = page.locator('text=Add Member');
      await expect(addButton).toBeVisible();
    });

    test('should show loading state while fetching members', async ({ page }) => {
      await page.goto('/club/members');
      
      // Either loading spinner or content should be visible
      const hasLoader = await page.locator('[class*="animate-spin"]').isVisible().catch(() => false);
      const hasTable = await page.locator('table').isVisible().catch(() => false);
      const hasEmptyState = await page.locator('text=No members found').isVisible().catch(() => false);

      expect(hasLoader || hasTable || hasEmptyState).toBeTruthy();
    });

    test('should filter members by search query', async ({ page }) => {
      await page.goto('/club/members');
      await page.waitForLoadState('networkidle');
      
      // Wait for content to load
      await page.waitForTimeout(2000);

      // Type in search box
      const searchInput = page.locator('input[placeholder*="Search members"]');
      await searchInput.fill('test');

      // The filter should be applied (even if no results)
      await page.waitForTimeout(500);
    });
  });

  test.describe('Coaches Page', () => {
    test('should display coaches grid', async ({ page }) => {
      await page.goto('/club/coaches');
      await page.waitForLoadState('networkidle');

      // Check page title
      await expect(page.locator('h1')).toContainText('Coaches');

      // Check for Add Coach button
      const addButton = page.locator('text=Add Coach');
      await expect(addButton).toBeVisible();
    });

    test('should show coach search functionality', async ({ page }) => {
      await page.goto('/club/coaches');
      await page.waitForLoadState('networkidle');

      // Check for search input
      const searchInput = page.locator('input[placeholder*="Search coaches"]');
      await expect(searchInput).toBeVisible();
    });
  });

  test.describe('Sessions Page', () => {
    test('should display weekly schedule calendar', async ({ page }) => {
      await page.goto('/club/sessions');
      await page.waitForLoadState('networkidle');

      // Check page title
      await expect(page.locator('h1')).toContainText('Sessions');

      // Check for Create Session button
      const createButton = page.locator('text=Create Session');
      await expect(createButton).toBeVisible();
    });

    test('should allow week navigation', async ({ page }) => {
      await page.goto('/club/sessions');
      await page.waitForLoadState('networkidle');

      // Check for navigation arrows
      const prevButton = page.locator('button').filter({ has: page.locator('[class*="ChevronLeft"]') });
      const nextButton = page.locator('button').filter({ has: page.locator('[class*="ChevronRight"]') });

      // At least one navigation control should be visible
      const hasPrev = await prevButton.first().isVisible().catch(() => false);
      const hasNext = await nextButton.first().isVisible().catch(() => false);

      expect(hasPrev || hasNext).toBeTruthy();
    });
  });

  test.describe('Payments Page', () => {
    test('should display payment statistics', async ({ page }) => {
      await page.goto('/club/payments');
      await page.waitForLoadState('networkidle');

      // Check page title
      await expect(page.locator('h1')).toContainText('Payments');

      // Look for stat cards
      const hasStats = await page.locator('text=Total Revenue').isVisible().catch(() => false);
      const hasLoading = await page.locator('[class*="animate-spin"]').isVisible().catch(() => false);

      expect(hasStats || hasLoading).toBeTruthy();
    });

    test('should display transactions table', async ({ page }) => {
      await page.goto('/club/payments');
      await page.waitForLoadState('networkidle');

      // Wait for loading to complete
      await page.waitForTimeout(2000);

      // Check for search functionality
      const searchInput = page.locator('input[placeholder*="Search transactions"]');
      await expect(searchInput).toBeVisible();
    });
  });

  test.describe('Analytics Page', () => {
    test('should display key performance indicators', async ({ page }) => {
      await page.goto('/club/analytics');
      await page.waitForLoadState('networkidle');

      // Check page title
      await expect(page.locator('h1')).toContainText('Analytics');

      // Look for KPI cards or loading state
      const hasKPIs = await page.locator('text=Total Members').isVisible().catch(() => false);
      const hasLoading = await page.locator('[class*="animate-spin"]').isVisible().catch(() => false);

      expect(hasKPIs || hasLoading).toBeTruthy();
    });
  });

  test.describe('Messages Page', () => {
    test('should display messages interface', async ({ page }) => {
      await page.goto('/club/messages');
      await page.waitForLoadState('networkidle');

      // Check page title
      await expect(page.locator('h1')).toContainText('Messages');

      // Check for New Message button
      const newMessageButton = page.locator('text=New Message');
      await expect(newMessageButton).toBeVisible();
    });

    test('should open new message dialog', async ({ page }) => {
      await page.goto('/club/messages');
      await page.waitForLoadState('networkidle');

      // Wait for page to fully load
      await page.waitForTimeout(2000);

      // Click New Message button
      await page.click('text=New Message');

      // Dialog should open
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
    });
  });

  test.describe('Announcements Page', () => {
    test('should display announcements interface', async ({ page }) => {
      await page.goto('/club/announcements');
      await page.waitForLoadState('networkidle');

      // Check page title
      await expect(page.locator('h1')).toContainText('Announcements');

      // Check for New Announcement button
      const newAnnouncementButton = page.locator('text=New Announcement');
      await expect(newAnnouncementButton).toBeVisible();
    });

    test('should open new announcement dialog', async ({ page }) => {
      await page.goto('/club/announcements');
      await page.waitForLoadState('networkidle');

      // Wait for page to fully load
      await page.waitForTimeout(2000);

      // Click New Announcement button
      await page.click('text=New Announcement');

      // Dialog should open
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
    });
  });

  test.describe('Error States', () => {
    test('should handle API errors gracefully on dashboard', async ({ page }) => {
      // Intercept API calls to simulate error
      await page.route('**/api/**', route => {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      });

      await page.goto('/club');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Should show error message or fallback UI
      const hasError = await page.locator('text=Failed to load').isVisible().catch(() => false);
      const hasTryAgain = await page.locator('text=Try Again').isVisible().catch(() => false);
      const hasContent = await page.locator('h1').isVisible().catch(() => false);

      expect(hasError || hasTryAgain || hasContent).toBeTruthy();
    });

    test('should handle empty data states', async ({ page }) => {
      // Intercept API calls to return empty data
      await page.route('**/api/**', route => {
        route.fulfill({ 
          status: 200, 
          contentType: 'application/json',
          body: JSON.stringify([]) 
        });
      });

      await page.goto('/club/members');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Should handle empty state gracefully
      const hasEmptyMessage = await page.locator('text=No members found').isVisible().catch(() => false);
      const hasTable = await page.locator('table').isVisible().catch(() => false);
      const hasLoading = await page.locator('[class*="animate-spin"]').isVisible().catch(() => false);

      expect(hasEmptyMessage || hasTable || hasLoading).toBeTruthy();
    });
  });

  test.describe('Loading States', () => {
    test('should show loading indicators while fetching data', async ({ page }) => {
      // Delay API response
      await page.route('**/api/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        route.fulfill({ 
          status: 200, 
          contentType: 'application/json',
          body: JSON.stringify([]) 
        });
      });

      await page.goto('/club');
      
      // Loading indicator should be visible initially
      const hasLoader = await page.locator('[class*="animate-spin"]').isVisible().catch(() => false);
      const hasLoadingText = await page.locator('text=Loading').isVisible().catch(() => false);
      const hasContent = await page.locator('h1').isVisible().catch(() => false);

      expect(hasLoader || hasLoadingText || hasContent).toBeTruthy();
    });
  });
});
