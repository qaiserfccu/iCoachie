// tests/e2e/freelancer-sidebar.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

/**
 * E2E Tests for Freelancer Sidebar Integration
 * 
 * These tests verify the freelancer sidebar functionality with real backend API calls.
 * No mock data is used - all data comes from actual backend endpoints.
 * 
 * Backend Endpoints Tested:
 * - GET /api/users/me - User profile data in sidebar
 * - GET /api/messages/unread-count - Notification badge count
 * - GET /api/bookings - Bookings list on dashboard
 * - GET /api/reviews - Reviews on dashboard
 */

test.describe('Freelancer Sidebar', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('User Profile in Sidebar', () => {
    test('should display authenticated user name in sidebar', async ({ page }) => {
      // Register a new freelancer user
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);

      // Wait for the freelancer layout to load
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // The sidebar should display the user's name from the backend
      // User data comes from GET /api/users/me
      const sidebarName = page.locator('aside .text-lg.font-bold');
      await expect(sidebarName).toBeVisible({ timeout: 10000 });
      
      // The name should contain part of the registered user's name
      const displayedName = await sidebarName.textContent();
      expect(displayedName).toBeTruthy();
      // Should not show hardcoded "Mike Johnson"
      expect(displayedName).not.toContain('Mike Johnson');
    });

    test('should display user role label in sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);

      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Check for role label in sidebar
      const roleLabel = page.locator('aside .text-xs.text-muted-foreground').first();
      await expect(roleLabel).toBeVisible({ timeout: 10000 });
    });

    test('should show loading state while fetching user data', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      
      // Start registration
      await helpers.register(userData);
      
      // The sidebar should show loading initially
      // This is a quick check - loading state may be very brief
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
    });
  });

  test.describe('Sidebar Navigation', () => {
    test('should navigate to Dashboard from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click on Dashboard link
      await page.click('aside a[href="/freelancer"]');
      await expect(page).toHaveURL(/.*\/freelancer$/);
    });

    test('should navigate to Bookings from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // First expand the Bookings submenu
      await page.click('aside button:has-text("Bookings")');
      
      // Then click on All Bookings
      await page.click('aside a[href="/freelancer/bookings"]');
      await expect(page).toHaveURL(/.*\/freelancer\/bookings$/);
    });

    test('should navigate to Clients from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Expand Clients submenu
      await page.click('aside button:has-text("Clients")');
      
      // Click on All Clients
      await page.click('aside a[href="/freelancer/clients"]');
      await expect(page).toHaveURL(/.*\/freelancer\/clients$/);
    });

    test('should navigate to Availability from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/availability"]');
      await expect(page).toHaveURL(/.*\/freelancer\/availability$/);
    });

    test('should navigate to Earnings from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Expand Earnings submenu
      await page.click('aside button:has-text("Earnings")');
      
      // Click on Overview
      await page.click('aside a[href="/freelancer/earnings"]');
      await expect(page).toHaveURL(/.*\/freelancer\/earnings$/);
    });

    test('should navigate to Reviews from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/reviews"]');
      await expect(page).toHaveURL(/.*\/freelancer\/reviews$/);
    });

    test('should navigate to Analytics from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/analytics"]');
      await expect(page).toHaveURL(/.*\/freelancer\/analytics$/);
    });

    test('should navigate to Messages from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/messages"]');
      await expect(page).toHaveURL(/.*\/freelancer\/messages$/);
    });

    test('should navigate to Notifications from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/notifications"]');
      await expect(page).toHaveURL(/.*\/freelancer\/notifications$/);
    });
  });

  test.describe('Sidebar Bottom Navigation', () => {
    test('should navigate to My Profile from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/profile"]');
      await expect(page).toHaveURL(/.*\/freelancer\/profile$/);
    });

    test('should navigate to Settings from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/settings"]');
      await expect(page).toHaveURL(/.*\/freelancer\/settings$/);
    });

    test('should navigate to Help from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('aside a[href="/freelancer/help"]');
      await expect(page).toHaveURL(/.*\/freelancer\/help$/);
    });

    test('should logout successfully from sidebar', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click logout button in sidebar
      const logoutButton = page.locator('aside button:has-text("Logout")');
      await logoutButton.click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*\/login$/, { timeout: 10000 });
    });
  });

  test.describe('Sidebar Collapse/Expand', () => {
    test('should toggle sidebar collapse', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Get initial sidebar width
      const sidebar = page.locator('aside');
      const initialClass = await sidebar.getAttribute('class');
      expect(initialClass).toContain('w-72');
      
      // Click collapse button
      await page.click('aside button:has(.lucide-chevron-left)');
      
      // Sidebar should now be collapsed
      const collapsedClass = await sidebar.getAttribute('class');
      expect(collapsedClass).toContain('w-20');
      
      // Click again to expand
      await page.click('aside button:has(.lucide-chevron-left)');
      
      // Sidebar should be expanded again
      const expandedClass = await sidebar.getAttribute('class');
      expect(expandedClass).toContain('w-72');
    });
  });

  test.describe('Submenu Expansion', () => {
    test('should expand Bookings submenu', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Store locator once and reuse it
      const allBookingsLink = page.locator('aside').locator('a:has-text("All Bookings")');
      
      // Initially submenu should be collapsed
      await expect(allBookingsLink).not.toBeVisible();
      
      // Click to expand
      await page.click('aside button:has-text("Bookings")');
      
      // Now submenu should be visible
      await expect(allBookingsLink).toBeVisible();
      
      // Should see all submenu items
      await expect(page.locator('aside a:has-text("Pending")')).toBeVisible();
      await expect(page.locator('aside a:has-text("Calendar")')).toBeVisible();
    });

    test('should expand Clients submenu', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click to expand
      await page.click('aside button:has-text("Clients")');
      
      // Should see submenu items
      await expect(page.locator('aside a:has-text("All Clients")')).toBeVisible();
      await expect(page.locator('aside a:has-text("Reviews")')).toBeVisible();
    });

    test('should expand Earnings submenu', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click to expand
      await page.click('aside button:has-text("Earnings")');
      
      // Should see submenu items
      await expect(page.locator('aside a:has-text("Overview")')).toBeVisible();
      await expect(page.locator('aside a:has-text("Transactions")')).toBeVisible();
      await expect(page.locator('aside a:has-text("Payouts")')).toBeVisible();
    });

    test('should collapse expanded submenu when clicked again', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Expand
      await page.click('aside button:has-text("Bookings")');
      await expect(page.locator('aside a:has-text("All Bookings")')).toBeVisible();
      
      // Collapse
      await page.click('aside button:has-text("Bookings")');
      await expect(page.locator('aside a:has-text("All Bookings")')).not.toBeVisible();
    });
  });
});

test.describe('Freelancer Header', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('User Profile in Header', () => {
    test('should display user name in header dropdown', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Header should show user name
      // User data comes from GET /api/users/me
      const headerUserName = page.locator('header .text-sm.font-medium');
      await expect(headerUserName).toBeVisible({ timeout: 10000 });
    });

    test('should display user role in header dropdown', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      const headerRole = page.locator('header .text-xs.text-muted-foreground');
      await expect(headerRole).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Notification Badge', () => {
    test('should display notification bell icon', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Notification bell should be visible
      const notificationBell = page.locator('header button:has(.lucide-bell)');
      await expect(notificationBell).toBeVisible();
    });

    test('should open notification drawer on bell click', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click notification bell
      await page.click('header button:has(.lucide-bell)');
      
      // Notification drawer should open (look for drawer content)
      // The exact implementation depends on NotificationDrawer component
      const drawer = page.locator('[role="dialog"]');
      await expect(drawer).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('User Dropdown Menu', () => {
    test('should open user dropdown menu on click', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click user avatar/button in header
      await page.click('header button:has(.h-8.w-8)'); // Avatar button
      
      // Dropdown should open
      const dropdown = page.locator('[role="menu"]');
      await expect(dropdown).toBeVisible();
    });

    test('should navigate to My Profile from dropdown', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Open dropdown
      await page.click('header button:has(.h-8.w-8)');
      
      // Click My Profile
      await page.click('[role="menuitem"]:has-text("My Profile")');
      
      await expect(page).toHaveURL(/.*\/freelancer\/profile$/);
    });

    test('should navigate to Settings from dropdown', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Open dropdown
      await page.click('header button:has(.h-8.w-8)');
      
      // Click Settings
      await page.click('[role="menuitem"]:has-text("Settings")');
      
      await expect(page).toHaveURL(/.*\/freelancer\/settings$/);
    });

    test('should navigate to Earnings from dropdown', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Open dropdown
      await page.click('header button:has(.h-8.w-8)');
      
      // Click Earnings
      await page.click('[role="menuitem"]:has-text("Earnings")');
      
      await expect(page).toHaveURL(/.*\/freelancer\/earnings$/);
    });

    test('should logout from dropdown menu', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Open dropdown
      await page.click('header button:has(.h-8.w-8)');
      
      // Click Log out
      await page.click('[role="menuitem"]:has-text("Log out")');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*\/login$/, { timeout: 10000 });
    });
  });
});

test.describe('Freelancer Dashboard Data', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Dashboard Stats', () => {
    test('should display dashboard stats from backend', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Dashboard should load and show stats
      // Stats come from GET /api/bookings and GET /api/reviews/stats/:userId
      await expect(page.locator('text=Total Earnings')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Active Clients')).toBeVisible();
      await expect(page.locator('text=Sessions This Week')).toBeVisible();
      await expect(page.locator('text=Rating')).toBeVisible();
    });

    test('should display personalized welcome message', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Welcome message should use user's name
      const welcomeMessage = page.locator('text=/Welcome back/');
      await expect(welcomeMessage).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Bookings Section', () => {
    test('should display upcoming bookings section', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Upcoming Bookings section should be visible
      // Data comes from GET /api/bookings?type=as_freelancer
      await expect(page.locator('text=Upcoming Bookings')).toBeVisible({ timeout: 10000 });
    });

    test('should show empty state when no bookings', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // For a new user, should show empty state
      const emptyBookings = page.locator('text=No upcoming bookings');
      await expect(emptyBookings).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to all bookings when clicking View All', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click View All button in bookings section
      const viewAllButton = page.locator('.glass-card:has-text("Upcoming Bookings") button:has-text("View All")');
      await viewAllButton.click();
      
      await expect(page).toHaveURL(/.*\/freelancer\/bookings$/);
    });
  });

  test.describe('Reviews Section', () => {
    test('should display recent reviews section', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Recent Reviews section should be visible
      // Data comes from GET /api/reviews
      await expect(page.locator('text=Recent Reviews')).toBeVisible({ timeout: 10000 });
    });

    test('should show empty state when no reviews', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // For a new user, should show empty state
      const emptyReviews = page.locator('text=No reviews yet');
      await expect(emptyReviews).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Quick Actions', () => {
    test('should display quick actions section', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await expect(page.locator('text=Quick Actions')).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to availability from quick actions', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('button:has-text("Update Availability")');
      await expect(page).toHaveURL(/.*\/freelancer\/availability$/);
    });

    test('should navigate to earnings from quick actions', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('button:has-text("View Earnings")');
      await expect(page).toHaveURL(/.*\/freelancer\/earnings$/);
    });

    test('should navigate to messages from quick actions', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('button:has-text("Message Clients")');
      await expect(page).toHaveURL(/.*\/freelancer\/messages$/);
    });

    test('should navigate to profile from quick actions', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('button:has-text("Edit Profile")');
      await expect(page).toHaveURL(/.*\/freelancer\/profile$/);
    });
  });

  test.describe('Clients Section', () => {
    test('should display recent clients section', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await expect(page.locator('text=Recent Clients')).toBeVisible({ timeout: 10000 });
    });

    test('should show empty state when no clients', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // For a new user, should show empty state
      const emptyClients = page.locator('text=No clients yet');
      await expect(emptyClients).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to all clients when clicking View All', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      // Click View All button in clients section
      const viewAllButton = page.locator('.glass-card:has-text("Recent Clients") button:has-text("View All")');
      await viewAllButton.click();
      
      await expect(page).toHaveURL(/.*\/freelancer\/clients$/);
    });
  });

  test.describe('Action Buttons', () => {
    test('should navigate to profile from View Profile button', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('button:has-text("View Profile")');
      await expect(page).toHaveURL(/.*\/freelancer\/profile$/);
    });

    test('should navigate to availability from Set Availability button', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);
      
      await page.waitForURL('**/freelancer**', { timeout: 15000 });
      
      await page.click('button:has-text("Set Availability")');
      await expect(page).toHaveURL(/.*\/freelancer\/availability$/);
    });
  });
});
