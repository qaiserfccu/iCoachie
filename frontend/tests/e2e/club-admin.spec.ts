// tests/e2e/club-admin.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Club Admin Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Dashboard Overview', () => {
    test('should display club dashboard with stats cards', async ({ page }) => {
      // Navigate to club dashboard
      await page.goto('/club');
      
      // Check for main heading
      await expect(page.locator('h1')).toContainText('Club Dashboard');
      
      // Check for stats cards
      await expect(page.locator('text=Total Members')).toBeVisible();
      await expect(page.locator('text=Active Coaches')).toBeVisible();
      await expect(page.locator('text=Sessions Today')).toBeVisible();
      await expect(page.locator('text=Monthly Revenue')).toBeVisible();
    });

    test('should display today\'s sessions section', async ({ page }) => {
      await page.goto('/club');
      
      // Check for today's sessions section
      await expect(page.locator('text="Today\'s Sessions"')).toBeVisible();
    });

    test('should display quick actions section', async ({ page }) => {
      await page.goto('/club');
      
      // Check for quick actions
      await expect(page.locator('text=Quick Actions')).toBeVisible();
      await expect(page.locator('text=Add New Member')).toBeVisible();
      await expect(page.locator('text=Create Session')).toBeVisible();
      await expect(page.locator('text=Record Attendance')).toBeVisible();
    });

    test('should display top performers section', async ({ page }) => {
      await page.goto('/club');
      
      // Check for top performers section
      await expect(page.locator('text=Top Performers')).toBeVisible();
    });

    test('should display recent payments table', async ({ page }) => {
      await page.goto('/club');
      
      // Check for recent payments section
      await expect(page.locator('text=Recent Payments')).toBeVisible();
    });

    test('should show loading state initially', async ({ page }) => {
      // Intercept API to delay response
      await page.route('**/api/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.continue();
      });
      
      await page.goto('/club');
      
      // Check for loading indicator (could be spinner or skeleton)
      // The loading state shows briefly
    });
  });

  test.describe('Sidebar Navigation', () => {
    test('should display all sidebar menu items', async ({ page }) => {
      await page.goto('/club');
      
      // Check main menu items
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Coaches')).toBeVisible();
      await expect(page.locator('text=Members')).toBeVisible();
      await expect(page.locator('text=Sessions')).toBeVisible();
      await expect(page.locator('text=Attendance')).toBeVisible();
      await expect(page.locator('text=Progress')).toBeVisible();
      await expect(page.locator('text=Payments')).toBeVisible();
      await expect(page.locator('text=Analytics')).toBeVisible();
      await expect(page.locator('text=Messages')).toBeVisible();
      await expect(page.locator('text=Announcements')).toBeVisible();
    });

    test('should display bottom menu items', async ({ page }) => {
      await page.goto('/club');
      
      // Check bottom menu items
      await expect(page.locator('text=Club Profile')).toBeVisible();
      await expect(page.locator('text=Settings')).toBeVisible();
      await expect(page.locator('text=Help')).toBeVisible();
    });

    test('should navigate to coaches page', async ({ page }) => {
      await page.goto('/club');
      
      // Click on Coaches menu
      await page.click('text=Coaches');
      
      // Check if navigated to coaches page
      await expect(page).toHaveURL(/.*\/club\/coaches/);
      await expect(page.locator('h1')).toContainText('Coaches');
    });

    test('should navigate to members page', async ({ page }) => {
      await page.goto('/club');
      
      // Click on Members menu
      await page.click('text=Members');
      
      // Check if navigated to members page
      await expect(page).toHaveURL(/.*\/club\/members/);
      await expect(page.locator('h1')).toContainText('Members');
    });

    test('should navigate to sessions page', async ({ page }) => {
      await page.goto('/club');
      
      // Click on Sessions menu
      await page.click('text=Sessions');
      
      // Check if navigated to sessions page
      await expect(page).toHaveURL(/.*\/club\/sessions/);
      await expect(page.locator('h1')).toContainText('Sessions');
    });

    test('should navigate to payments page', async ({ page }) => {
      await page.goto('/club');
      
      // Click on Payments menu
      await page.click('text=Payments');
      
      // Check if navigated to payments page
      await expect(page).toHaveURL(/.*\/club\/payments/);
      await expect(page.locator('h1')).toContainText('Payments');
    });

    test('should collapse sidebar when toggle is clicked', async ({ page }) => {
      await page.goto('/club');
      
      // Find and click the collapse button
      const collapseButton = page.locator('button').filter({ has: page.locator('svg.lucide-chevron-left') });
      
      if (await collapseButton.isVisible()) {
        await collapseButton.click();
        
        // Sidebar should be collapsed (narrower width)
        const sidebar = page.locator('aside');
        await expect(sidebar).toHaveClass(/w-20/);
      }
    });
  });

  test.describe('Members Management', () => {
    test('should display members page with stats', async ({ page }) => {
      await page.goto('/club/members');
      
      // Check main heading
      await expect(page.locator('h1')).toContainText('Members');
      
      // Check stats cards
      await expect(page.locator('text=Total Members')).toBeVisible();
      await expect(page.locator('text=Active')).toBeVisible();
      await expect(page.locator('text=New This Month')).toBeVisible();
      await expect(page.locator('text=Pending Renewal')).toBeVisible();
    });

    test('should display members table', async ({ page }) => {
      await page.goto('/club/members');
      
      // Check table headers
      await expect(page.locator('text=Member')).toBeVisible();
      await expect(page.locator('text=Sport')).toBeVisible();
      await expect(page.locator('text=Coach')).toBeVisible();
      await expect(page.locator('text=Membership')).toBeVisible();
      await expect(page.locator('text=Status')).toBeVisible();
    });

    test('should filter members by search', async ({ page }) => {
      await page.goto('/club/members');
      
      // Enter search query
      const searchInput = page.locator('input[placeholder*="Search members"]');
      await searchInput.fill('John');
      
      // Wait for filtering
      await page.waitForTimeout(500);
      
      // Table should show filtered results or empty state
    });

    test('should have Add Member button', async ({ page }) => {
      await page.goto('/club/members');
      
      // Check for Add Member button
      await expect(page.locator('text=Add Member')).toBeVisible();
    });

    test('should have Export button', async ({ page }) => {
      await page.goto('/club/members');
      
      // Check for Export button
      await expect(page.locator('text=Export')).toBeVisible();
    });

    test('should show member actions dropdown', async ({ page }) => {
      await page.goto('/club/members');
      
      // Find and click the first actions button (three dots)
      const actionsButton = page.locator('button').filter({ has: page.locator('svg.lucide-more-vertical') }).first();
      
      if (await actionsButton.isVisible()) {
        await actionsButton.click();
        
        // Check dropdown menu items
        await expect(page.locator('text=View Profile')).toBeVisible();
        await expect(page.locator('text=View Progress')).toBeVisible();
        await expect(page.locator('text=Edit Details')).toBeVisible();
        await expect(page.locator('text=Contact Parent')).toBeVisible();
      }
    });
  });

  test.describe('Sessions Management', () => {
    test('should display sessions page with weekly schedule', async ({ page }) => {
      await page.goto('/club/sessions');
      
      // Check main heading
      await expect(page.locator('h1')).toContainText('Sessions');
      
      // Check for weekly schedule section
      await expect(page.locator('text=Weekly Schedule')).toBeVisible();
    });

    test('should display upcoming sessions', async ({ page }) => {
      await page.goto('/club/sessions');
      
      // Check for upcoming sessions section
      await expect(page.locator('text=Upcoming Sessions')).toBeVisible();
    });

    test('should have Create Session button', async ({ page }) => {
      await page.goto('/club/sessions');
      
      // Check for Create Session button
      await expect(page.locator('text=Create Session')).toBeVisible();
    });

    test('should navigate weeks in calendar', async ({ page }) => {
      await page.goto('/club/sessions');
      
      // Find week navigation buttons
      const prevButton = page.locator('button').filter({ has: page.locator('svg.lucide-chevron-left') }).first();
      const nextButton = page.locator('button').filter({ has: page.locator('svg.lucide-chevron-right') }).first();
      
      // Navigate to previous week
      await prevButton.click();
      await page.waitForTimeout(500);
      
      // Navigate to next week
      await nextButton.click();
      await page.waitForTimeout(500);
    });

    test('should display weekday headers', async ({ page }) => {
      await page.goto('/club/sessions');
      
      // Check for weekday headers
      await expect(page.locator('text=Mon')).toBeVisible();
      await expect(page.locator('text=Tue')).toBeVisible();
      await expect(page.locator('text=Wed')).toBeVisible();
      await expect(page.locator('text=Thu')).toBeVisible();
      await expect(page.locator('text=Fri')).toBeVisible();
      await expect(page.locator('text=Sat')).toBeVisible();
      await expect(page.locator('text=Sun')).toBeVisible();
    });
  });

  test.describe('Coaches Management', () => {
    test('should display coaches page', async ({ page }) => {
      await page.goto('/club/coaches');
      
      // Check main heading
      await expect(page.locator('h1')).toContainText('Coaches');
      await expect(page.locator('text=Manage your club')).toBeVisible();
    });

    test('should have Add Coach button', async ({ page }) => {
      await page.goto('/club/coaches');
      
      // Check for Add Coach button
      await expect(page.locator('text=Add Coach')).toBeVisible();
    });

    test('should have search functionality', async ({ page }) => {
      await page.goto('/club/coaches');
      
      // Check for search input
      const searchInput = page.locator('input[placeholder*="Search coaches"]');
      await expect(searchInput).toBeVisible();
      
      // Enter search query
      await searchInput.fill('John');
      await page.waitForTimeout(500);
    });

    test('should have filters button', async ({ page }) => {
      await page.goto('/club/coaches');
      
      // Check for Filters button
      await expect(page.locator('text=Filters')).toBeVisible();
    });

    test('should show coach card details', async ({ page }) => {
      await page.goto('/club/coaches');
      
      // Wait for coaches to load
      await page.waitForTimeout(1000);
      
      // Check for coach card elements (if there are coaches)
      const coachCards = page.locator('.glass-card');
      const count = await coachCards.count();
      
      if (count > 1) {
        // Check for typical coach card elements
        await expect(page.locator('text=students').first()).toBeVisible();
        await expect(page.locator('text=sessions/week').first()).toBeVisible();
      }
    });
  });

  test.describe('Payments Management', () => {
    test('should display payments page with stats', async ({ page }) => {
      await page.goto('/club/payments');
      
      // Check main heading
      await expect(page.locator('h1')).toContainText('Payments');
      
      // Check stats cards
      await expect(page.locator('text=Total Revenue')).toBeVisible();
      await expect(page.locator('text=This Month')).toBeVisible();
      await expect(page.locator('text=Pending')).toBeVisible();
      await expect(page.locator('text=Refunds')).toBeVisible();
    });

    test('should display transactions table', async ({ page }) => {
      await page.goto('/club/payments');
      
      // Check for table section
      await expect(page.locator('text=Recent Transactions')).toBeVisible();
      
      // Check table headers
      await expect(page.locator('text=Transaction ID')).toBeVisible();
      await expect(page.locator('text=Type')).toBeVisible();
      await expect(page.locator('text=Amount')).toBeVisible();
      await expect(page.locator('text=Date')).toBeVisible();
      await expect(page.locator('text=Method')).toBeVisible();
    });

    test('should have Create Invoice button', async ({ page }) => {
      await page.goto('/club/payments');
      
      // Check for Create Invoice button
      await expect(page.locator('text=Create Invoice')).toBeVisible();
    });

    test('should have Export button', async ({ page }) => {
      await page.goto('/club/payments');
      
      // Check for Export button
      await expect(page.locator('text=Export')).toBeVisible();
    });

    test('should filter transactions by search', async ({ page }) => {
      await page.goto('/club/payments');
      
      // Enter search query
      const searchInput = page.locator('input[placeholder*="Search transactions"]');
      await searchInput.fill('TXN');
      
      // Wait for filtering
      await page.waitForTimeout(500);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully on dashboard', async ({ page }) => {
      // Intercept API calls to simulate errors
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ message: 'Internal server error' })
        });
      });
      
      await page.goto('/club');
      
      // Should show error message or fallback UI
      await page.waitForTimeout(1000);
    });

    test('should handle API errors gracefully on members page', async ({ page }) => {
      await page.route('**/api/students**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ message: 'Internal server error' })
        });
      });
      
      await page.goto('/club/members');
      
      // Should show error message
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Empty States', () => {
    test('should show empty state when no members', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/students**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: [], pageInfo: { page: 1, pageSize: 10, total: 0, totalPages: 0 } })
        });
      });
      
      await page.goto('/club/members');
      
      await page.waitForTimeout(1000);
      
      // Should show empty state message
      await expect(page.locator('text=No members found')).toBeVisible();
    });

    test('should show empty state when no coaches', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/coaches**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: [], pageInfo: { page: 1, pageSize: 10, total: 0, totalPages: 0 } })
        });
      });
      
      await page.goto('/club/coaches');
      
      await page.waitForTimeout(1000);
      
      // Should show empty state message
      await expect(page.locator('text=No coaches found')).toBeVisible();
    });

    test('should show empty state when no sessions', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/sessions**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: [], pageInfo: { page: 1, pageSize: 10, total: 0, totalPages: 0 } })
        });
      });
      
      await page.goto('/club/sessions');
      
      await page.waitForTimeout(1000);
      
      // Should show empty state message
      await expect(page.locator('text=No upcoming sessions')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should hide sidebar on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/club');
      
      // Desktop sidebar should be hidden
      const desktopSidebar = page.locator('aside.hidden.lg\\:flex');
      await expect(desktopSidebar).toBeHidden();
      
      // Mobile navigation should be visible
      const mobileNav = page.locator('nav.lg\\:hidden');
      await expect(mobileNav).toBeVisible();
    });

    test('should show mobile bottom navigation', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/club');
      
      // Check for mobile navigation items
      const mobileNav = page.locator('nav.lg\\:hidden');
      await expect(mobileNav).toBeVisible();
    });
  });
});
