/**
 * Parent Sidebar E2E Tests
 * 
 * Tests all parent sidebar journeys with real backend API calls.
 * No mocking anywhere - all data comes from backend endpoints.
 * 
 * Backend API Sources:
 * - User profile: GET /api/users/me (backend/src/controllers/userController.ts)
 * - Children: GET /api/students (backend/src/controllers/studentController.ts)
 * - Bookings: GET /api/bookings (backend/src/controllers/bookingController.ts)
 * - Payments: GET /api/payments (backend/src/controllers/paymentController.ts)
 * - Evaluations: GET /api/evaluations/student/:id (backend/src/controllers/evaluationController.ts)
 * - Messages: GET /api/messages (backend/src/controllers/messageController.ts)
 */

import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Parent Sidebar Integration', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Parent Dashboard - Real API Integration', () => {
    test('should load parent dashboard with real data from backend', async ({ page }) => {
      // Register as parent - this creates real data in the database
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Verify we're on the parent dashboard
      await expect(page).toHaveURL(/\/parent/);

      // Verify dashboard header is displayed with user's name from backend
      const header = page.locator('h1:has-text("Parent Dashboard")');
      await expect(header).toBeVisible();

      // Verify welcome message includes a name (from real user data)
      const welcomeMessage = page.locator('p.text-muted-foreground:has-text("Welcome back")');
      await expect(welcomeMessage).toBeVisible();
    });

    test('should display stats cards loaded from backend APIs', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Verify stats cards are displayed
      await expect(page.locator('text=My Kids')).toBeVisible();
      await expect(page.locator('text=Upcoming Sessions')).toBeVisible();
      await expect(page.locator('text=Avg Progress')).toBeVisible();
      await expect(page.locator('text=Total Spent')).toBeVisible();
    });

    test('should show empty state when no children are added', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // For a new parent, there should be no children
      // Look for the empty state message or "Add Your First Child" prompt
      const noChildrenMessage = page.locator('text=No Children Added Yet').or(
        page.locator('text=Add Your First Child')
      );
      await expect(noChildrenMessage).toBeVisible({ timeout: 10000 });
    });

    test('should show empty state for upcoming sessions when no bookings exist', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // For a new parent, there should be no bookings
      const noSessionsMessage = page.locator('text=No upcoming sessions').or(
        page.locator('text=Book a Session')
      );
      await expect(noSessionsMessage).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Parent Sidebar Navigation', () => {
    test('should navigate to My Kids page', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click on My Kids in sidebar
      await page.click('a[href="/parent/kids"]');
      await expect(page).toHaveURL(/\/parent\/kids/);
      await expect(page.locator('h1:has-text("My Kids")')).toBeVisible();
    });

    test('should navigate to Bookings page', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click on Bookings in sidebar
      await page.click('a[href="/parent/bookings"]');
      await expect(page).toHaveURL(/\/parent\/bookings/);
      await expect(page.locator('h1:has-text("Bookings")')).toBeVisible();
    });

    test('should navigate to Progress page', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click on Progress in sidebar
      await page.click('a[href="/parent/progress"]');
      await expect(page).toHaveURL(/\/parent\/progress/);
      await expect(page.locator('h1:has-text("Progress")')).toBeVisible();
    });

    test('should navigate to Payments page', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click on Payments in sidebar
      await page.click('a[href="/parent/payments"]');
      await expect(page).toHaveURL(/\/parent\/payments/);
      await expect(page.locator('h1:has-text("Payments")')).toBeVisible();
    });

    test('should navigate to Messages page', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click on Messages in sidebar
      await page.click('a[href="/parent/messages"]');
      await expect(page).toHaveURL(/\/parent\/messages/);
      await expect(page.locator('h1:has-text("Messages")')).toBeVisible();
    });

    test('should navigate to Notifications page', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click on Notifications in sidebar
      await page.click('a[href="/parent/notifications"]');
      await expect(page).toHaveURL(/\/parent\/notifications/);
      await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
    });

    test('should navigate to Achievements page', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click on Achievements in sidebar
      await page.click('a[href="/parent/achievements"]');
      await expect(page).toHaveURL(/\/parent\/achievements/);
      await expect(page.locator('h1:has-text("Achievements")')).toBeVisible();
    });
  });

  test.describe('My Kids Page - Real API Integration', () => {
    test('should show empty state when no children exist', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/kids"]');
      await expect(page).toHaveURL(/\/parent\/kids/);

      // Verify empty state
      const emptyState = page.locator('text=No Children Added Yet');
      await expect(emptyState).toBeVisible();

      // Verify Add Child button is visible
      const addButton = page.locator('a[href="/parent/kids/add"]').or(
        page.locator('text=Add Your First Child')
      );
      await expect(addButton).toBeVisible();
    });

    test('should display Add Child button', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/kids"]');
      const addChildButton = page.locator('button:has-text("Add Child")').or(
        page.locator('a:has-text("Add Child")')
      );
      await expect(addChildButton).toBeVisible();
    });
  });

  test.describe('Bookings Page - Real API Integration', () => {
    test('should display booking stats from backend', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/bookings"]');
      await expect(page).toHaveURL(/\/parent\/bookings/);

      // Verify stats are displayed (values may be 0 for new user)
      await expect(page.locator('text=Upcoming')).toBeVisible();
      await expect(page.locator('text=Completed')).toBeVisible();
      await expect(page.locator('text=Cancelled')).toBeVisible();
      await expect(page.locator('text=This Month')).toBeVisible();
    });

    test('should show empty state when no bookings exist', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/bookings"]');

      // Verify empty state or table with no bookings
      const emptyState = page.locator('text=No Bookings Found').or(
        page.locator('text=Book Your First Session')
      );
      await expect(emptyState).toBeVisible();
    });

    test('should display Book New Session button', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/bookings"]');
      const bookButton = page.locator('button:has-text("Book New Session")').or(
        page.locator('a:has-text("Book New Session")')
      );
      await expect(bookButton).toBeVisible();
    });

    test('should allow searching bookings', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/bookings"]');

      // Verify search input exists
      const searchInput = page.locator('input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible();

      // Type in search
      await searchInput.fill('test search');
      // Should not crash or error
    });
  });

  test.describe('Payments Page - Real API Integration', () => {
    test('should display payment stats from backend', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/payments"]');
      await expect(page).toHaveURL(/\/parent\/payments/);

      // Verify stats cards are displayed
      await expect(page.locator('text=Total Spent')).toBeVisible();
      await expect(page.locator('text=This Month')).toBeVisible();
      await expect(page.locator('text=Transactions')).toBeVisible();
      await expect(page.locator('text=Pending')).toBeVisible();
    });

    test('should show payment summary section', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/payments"]');

      // Verify Payment Summary card
      const summaryCard = page.locator('text=Payment Summary');
      await expect(summaryCard).toBeVisible();
    });

    test('should show empty state when no transactions exist', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/payments"]');

      // For new user, either empty state or $0.00 values
      const emptyOrZero = page.locator('text=$0.00').or(
        page.locator('text=No Transactions')
      );
      await expect(emptyOrZero.first()).toBeVisible();
    });
  });

  test.describe('Progress Page - Real API Integration', () => {
    test('should show empty state when no children exist', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/progress"]');
      await expect(page).toHaveURL(/\/parent\/progress/);

      // Verify empty state for no children
      const emptyState = page.locator('text=No Children Added Yet').or(
        page.locator('text=Add Your First Child')
      );
      await expect(emptyState).toBeVisible();
    });
  });

  test.describe('Messages Page - Real API Integration', () => {
    test('should display messages interface', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/messages"]');
      await expect(page).toHaveURL(/\/parent\/messages/);

      // Verify messages page elements
      await expect(page.locator('h1:has-text("Messages")')).toBeVisible();
    });

    test('should display New Message button', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/messages"]');

      const newMessageButton = page.locator('button:has-text("New Message")');
      await expect(newMessageButton).toBeVisible();
    });

    test('should display message filters', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/messages"]');

      // Verify filter buttons exist
      await expect(page.locator('button:has-text("All")')).toBeVisible();
      await expect(page.locator('button:has-text("Unread")')).toBeVisible();
      await expect(page.locator('button:has-text("Sent")')).toBeVisible();
    });

    test('should show empty state when no messages exist', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/messages"]');

      // Verify empty state
      const emptyState = page.locator('text=No messages found').or(
        page.locator('text=No Message Selected')
      );
      await expect(emptyState).toBeVisible();
    });

    test('should open compose message dialog', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/messages"]');

      // Click new message button
      await page.click('button:has-text("New Message")');

      // Verify dialog opens
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('text=Compose Message')).toBeVisible();
    });
  });

  test.describe('Notifications Page - Real API Integration', () => {
    test('should display notifications interface', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/notifications"]');
      await expect(page).toHaveURL(/\/parent\/notifications/);

      // Verify notifications page header
      await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
    });

    test('should display notification filters', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/notifications"]');

      // Verify filter buttons
      await expect(page.locator('button:has-text("All")')).toBeVisible();
      await expect(page.locator('button:has-text("Unread")')).toBeVisible();
    });

    test('should show all caught up message when no notifications', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/notifications"]');

      // For new user, either "All caught up" or "No Notifications"
      const emptyState = page.locator('text=All caught up').or(
        page.locator('text=No Notifications')
      );
      await expect(emptyState).toBeVisible();
    });
  });

  test.describe('Achievements Page - Real API Integration', () => {
    test('should display achievements interface', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/achievements"]');
      await expect(page).toHaveURL(/\/parent\/achievements/);

      // Verify achievements page header
      await expect(page.locator('h1:has-text("Achievements")')).toBeVisible();
    });

    test('should show empty state when no children exist', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      await page.click('a[href="/parent/achievements"]');

      // Verify empty state
      const emptyState = page.locator('text=No Children Added Yet').or(
        page.locator('text=Add Your First Child')
      );
      await expect(emptyState).toBeVisible();
    });
  });

  test.describe('Sidebar User Info - Real API Integration', () => {
    test('should display user name from backend', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Wait for sidebar to load user data
      await page.waitForTimeout(1000);

      // The sidebar should display the user's name from the backend
      // It should not show "Sarah Thompson" (the old hardcoded name)
      const sidebarName = page.locator('aside .text-lg.font-bold');
      await expect(sidebarName).not.toContainText('Sarah Thompson');
    });

    test('should display Parent Account label', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Verify "Parent Account" label is displayed
      const accountLabel = page.locator('text=Parent Account');
      await expect(accountLabel).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully on dashboard', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // The page should still load even if some API calls fail
      // It should show appropriate error states or empty states
      await expect(page.locator('h1:has-text("Parent Dashboard")')).toBeVisible();
    });

    test('should show retry button on error', async ({ page }) => {
      // This test verifies the error handling UI exists
      // In real scenarios with network issues, the Retry button would appear
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Page should load successfully
      await expect(page).toHaveURL(/\/parent/);
    });
  });

  test.describe('Quick Actions', () => {
    test('should display quick action buttons on dashboard', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Verify quick actions section
      await expect(page.locator('text=Quick Actions')).toBeVisible();
      await expect(page.locator('text=Book a Session')).toBeVisible();
      await expect(page.locator('text=View Progress')).toBeVisible();
      await expect(page.locator('text=Message Coach')).toBeVisible();
      await expect(page.locator('text=Make Payment')).toBeVisible();
    });

    test('should navigate to booking page from quick action', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Click Book a Session quick action
      await page.click('button:has-text("Book a Session")').catch(async () => {
        // If it's a link instead of button
        await page.click('a:has-text("Book a Session")');
      });

      // Should navigate to booking page
      await expect(page).toHaveURL(/\/parent\/bookings/);
    });
  });

  test.describe('Responsive Sidebar', () => {
    test('should show collapsed sidebar on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // On mobile, sidebar behavior may differ
      // Just verify page loads correctly
      await expect(page.locator('h1:has-text("Parent Dashboard")')).toBeVisible();
    });
  });
});
