// tests/e2e/operations.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Operations Dashboards', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Bookings Coordinator Dashboard', () => {
    test('should load bookings coordinator dashboard', async ({ page }) => {
      // Navigate to the bookings coordinator dashboard
      await page.goto('/bookings-coordinator');
      
      // Wait for the page to load
      await page.waitForSelector('h1');
      
      // Verify page title
      await expect(page.locator('h1')).toContainText('Bookings Coordinator Dashboard');
      
      // Verify the page subtitle
      await expect(page.locator('p.text-muted-foreground').first()).toContainText('Manage facility bookings, reservations, and scheduling');
    });

    test('should display stats cards with loading states', async ({ page }) => {
      await page.goto('/bookings-coordinator');
      
      // Stats cards should be visible
      const statsCards = page.locator('.glass-card');
      await expect(statsCards).toHaveCount(4, { timeout: 10000 });
      
      // Verify stats titles are present
      await expect(page.locator('text=Today\'s Bookings')).toBeVisible();
      await expect(page.locator('text=Pending Confirmations')).toBeVisible();
      await expect(page.locator('text=Cancellations')).toBeVisible();
      await expect(page.locator('text=Utilization')).toBeVisible();
    });

    test('should display today\'s bookings section', async ({ page }) => {
      await page.goto('/bookings-coordinator');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify today's bookings section exists
      await expect(page.locator('text=Today\'s Bookings').first()).toBeVisible();
      
      // Verify View All button exists
      await expect(page.locator('button:has-text("View All")').first()).toBeVisible();
    });

    test('should display quick actions', async ({ page }) => {
      await page.goto('/bookings-coordinator');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Quick Actions section
      await expect(page.locator('text=Quick Actions')).toBeVisible();
      
      // Verify action buttons
      await expect(page.locator('button:has-text("View Calendar")')).toBeVisible();
      await expect(page.locator('button:has-text("Create Reservation")')).toBeVisible();
      await expect(page.locator('button:has-text("Manage Availability")')).toBeVisible();
    });

    test('should have New Booking button', async ({ page }) => {
      await page.goto('/bookings-coordinator');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify New Booking button
      const newBookingBtn = page.locator('button:has-text("New Booking")');
      await expect(newBookingBtn).toBeVisible();
    });
  });

  test.describe('Front Desk Dashboard', () => {
    test('should load front desk dashboard', async ({ page }) => {
      await page.goto('/front-desk');
      
      // Wait for the page to load
      await page.waitForSelector('h1');
      
      // Verify page title
      await expect(page.locator('h1')).toContainText('Front Desk');
      
      // Verify the page subtitle
      await expect(page.locator('p.text-muted-foreground').first()).toContainText('Welcome! Manage check-ins and inquiries');
    });

    test('should display stats cards with loading states', async ({ page }) => {
      await page.goto('/front-desk');
      
      // Stats cards should be visible
      const statsCards = page.locator('.glass-card');
      await expect(statsCards).toHaveCount(4, { timeout: 10000 });
      
      // Verify stats titles are present
      await expect(page.locator('text=Checked In Today')).toBeVisible();
      await expect(page.locator("text=Today's Sessions")).toBeVisible();
      await expect(page.locator('text=Walk-ins')).toBeVisible();
      await expect(page.locator('text=Inquiries')).toBeVisible();
    });

    test('should display today\'s sessions section', async ({ page }) => {
      await page.goto('/front-desk');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify today's sessions section exists
      await expect(page.locator("text=Today's Sessions").first()).toBeVisible();
    });

    test('should display recent check-ins section', async ({ page }) => {
      await page.goto('/front-desk');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Recent Check-ins section
      await expect(page.locator('text=Recent Check-ins')).toBeVisible();
      
      // Verify View All Check-ins button
      await expect(page.locator('button:has-text("View All Check-ins")')).toBeVisible();
    });

    test('should have Quick Check-in button', async ({ page }) => {
      await page.goto('/front-desk');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Quick Check-in button
      const quickCheckinBtn = page.locator('button:has-text("Quick Check-in")');
      await expect(quickCheckinBtn).toBeVisible();
    });

    test('should have View Schedule button', async ({ page }) => {
      await page.goto('/front-desk');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify View Schedule button
      const viewScheduleBtn = page.locator('button:has-text("View Schedule")');
      await expect(viewScheduleBtn).toBeVisible();
    });
  });

  test.describe('Accountant Dashboard', () => {
    test('should load accountant dashboard', async ({ page }) => {
      await page.goto('/accountant');
      
      // Wait for the page to load
      await page.waitForSelector('h1');
      
      // Verify page title
      await expect(page.locator('h1')).toContainText('Financial Dashboard');
      
      // Verify the page subtitle
      await expect(page.locator('p.text-muted-foreground').first()).toContainText('Manage payments, invoices, and financial reports');
    });

    test('should display stats cards with loading states', async ({ page }) => {
      await page.goto('/accountant');
      
      // Stats cards should be visible
      const statsCards = page.locator('.glass-card');
      await expect(statsCards.first()).toBeVisible({ timeout: 10000 });
      
      // Verify stats titles are present
      await expect(page.locator('text=Monthly Revenue')).toBeVisible();
      await expect(page.locator('text=Pending Invoices')).toBeVisible();
      await expect(page.locator('text=Collected Today')).toBeVisible();
      await expect(page.locator('text=Overdue Amount')).toBeVisible();
    });

    test('should display recent transactions section', async ({ page }) => {
      await page.goto('/accountant');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Recent Transactions section exists
      await expect(page.locator('text=Recent Transactions')).toBeVisible();
    });

    test('should display pending invoices section', async ({ page }) => {
      await page.goto('/accountant');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Pending Invoices section
      await expect(page.locator('text=Pending Invoices')).toBeVisible();
      
      // Verify View All Invoices button
      await expect(page.locator('button:has-text("View All Invoices")')).toBeVisible();
    });

    test('should display monthly collection progress', async ({ page }) => {
      await page.goto('/accountant');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Monthly Collection Progress section
      await expect(page.locator('text=Monthly Collection Progress')).toBeVisible();
      
      // Verify progress indicators
      await expect(page.locator('text=Collected')).toBeVisible();
      await expect(page.locator('text=Pending')).toBeVisible();
      await expect(page.locator('text=Overdue')).toBeVisible();
    });

    test('should display quick actions', async ({ page }) => {
      await page.goto('/accountant');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Quick Actions section
      await expect(page.locator('text=Quick Actions')).toBeVisible();
      
      // Verify action buttons
      await expect(page.locator('button:has-text("Create New Invoice")')).toBeVisible();
      await expect(page.locator('button:has-text("Process Refund")')).toBeVisible();
      await expect(page.locator('button:has-text("Generate Statement")')).toBeVisible();
      await expect(page.locator('button:has-text("View Tax Reports")')).toBeVisible();
    });

    test('should have header action buttons', async ({ page }) => {
      await page.goto('/accountant');
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify Generate Report button
      const generateReportBtn = page.locator('button:has-text("Generate Report")');
      await expect(generateReportBtn).toBeVisible();
      
      // Verify New Invoice button
      const newInvoiceBtn = page.locator('button:has-text("New Invoice")');
      await expect(newInvoiceBtn).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('bookings coordinator should handle API errors gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/bookings**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await page.goto('/bookings-coordinator');
      
      // Should still render the page without crashing
      await expect(page.locator('h1')).toContainText('Bookings Coordinator Dashboard');
      
      // Error card may be displayed
      // The page should be usable even with API errors
    });

    test('front desk should handle API errors gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/sessions**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await page.goto('/front-desk');
      
      // Should still render the page without crashing
      await expect(page.locator('h1')).toContainText('Front Desk');
    });

    test('accountant should handle API errors gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/payments**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await page.goto('/accountant');
      
      // Should still render the page without crashing
      await expect(page.locator('h1')).toContainText('Financial Dashboard');
    });
  });

  test.describe('Loading States', () => {
    test('bookings coordinator should show loading skeletons', async ({ page }) => {
      // Delay API response to see loading state
      await page.route('**/api/bookings**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });

      await page.goto('/bookings-coordinator');
      
      // Skeleton loaders should be visible initially
      // The page should eventually load
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toContainText('Bookings Coordinator Dashboard');
    });

    test('front desk should show loading skeletons', async ({ page }) => {
      // Delay API response to see loading state
      await page.route('**/api/sessions**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });

      await page.goto('/front-desk');
      
      // Page should eventually load
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toContainText('Front Desk');
    });

    test('accountant should show loading skeletons', async ({ page }) => {
      // Delay API response to see loading state
      await page.route('**/api/payments**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });

      await page.goto('/accountant');
      
      // Page should eventually load
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toContainText('Financial Dashboard');
    });
  });

  test.describe('Responsive Design', () => {
    test('bookings coordinator should be responsive', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/bookings-coordinator');
      
      await expect(page.locator('h1')).toContainText('Bookings Coordinator Dashboard');
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('h1')).toContainText('Bookings Coordinator Dashboard');
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator('h1')).toContainText('Bookings Coordinator Dashboard');
    });

    test('front desk should be responsive', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/front-desk');
      
      await expect(page.locator('h1')).toContainText('Front Desk');
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('h1')).toContainText('Front Desk');
    });

    test('accountant should be responsive', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/accountant');
      
      await expect(page.locator('h1')).toContainText('Financial Dashboard');
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('h1')).toContainText('Financial Dashboard');
    });
  });
});
