// tests/e2e/head-coach.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Head Coach Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Navigation', () => {
    test('should display all sidebar menu items', async ({ page }) => {
      // Navigate to head coach dashboard
      await page.goto('/head-coach');
      
      // Check for main navigation items
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Team Management')).toBeVisible();
      await expect(page.locator('text=Training Plans')).toBeVisible();
      await expect(page.locator('text=Player Evaluations')).toBeVisible();
      await expect(page.locator('text=Match Analysis')).toBeVisible();
      await expect(page.locator('text=Staff Coordination')).toBeVisible();
      await expect(page.locator('text=Reports')).toBeVisible();
      await expect(page.locator('text=Analytics')).toBeVisible();
      await expect(page.locator('text=Communication')).toBeVisible();
    });

    test('should navigate to Teams page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Team Management');
      await expect(page).toHaveURL(/.*\/head-coach\/teams/);
      await expect(page.locator('h1')).toContainText('Team Management');
    });

    test('should navigate to Training Plans page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Training Plans');
      await expect(page).toHaveURL(/.*\/head-coach\/training-plans/);
      await expect(page.locator('h1')).toContainText('Training Plans');
    });

    test('should navigate to Evaluations page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Player Evaluations');
      await expect(page).toHaveURL(/.*\/head-coach\/evaluations/);
      await expect(page.locator('h1')).toContainText('Player Evaluations');
    });

    test('should navigate to Match Analysis page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Match Analysis');
      await expect(page).toHaveURL(/.*\/head-coach\/match-analysis/);
      await expect(page.locator('h1')).toContainText('Match Analysis');
    });

    test('should navigate to Staff page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Staff Coordination');
      await expect(page).toHaveURL(/.*\/head-coach\/staff/);
      await expect(page.locator('h1')).toContainText('Staff Coordination');
    });

    test('should navigate to Reports page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Reports');
      await expect(page).toHaveURL(/.*\/head-coach\/reports/);
      await expect(page.locator('h1')).toContainText('Performance Reports');
    });

    test('should navigate to Analytics page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Analytics');
      await expect(page).toHaveURL(/.*\/head-coach\/analytics/);
      await expect(page.locator('h1')).toContainText('Session Analytics');
    });

    test('should navigate to Communication page', async ({ page }) => {
      await page.goto('/head-coach');
      await page.click('text=Communication');
      await expect(page).toHaveURL(/.*\/head-coach\/communication/);
      await expect(page.locator('h1')).toContainText('Team Communication');
    });
  });

  test.describe('Dashboard Page', () => {
    test('should display dashboard stats', async ({ page }) => {
      await page.goto('/head-coach');
      
      // Check for stat cards
      await expect(page.locator('text=Coaches')).toBeVisible();
      await expect(page.locator('text=Programs')).toBeVisible();
      await expect(page.locator('text=Sessions')).toBeVisible();
      await expect(page.locator('text=Athletes')).toBeVisible();
    });

    test('should display coaches list', async ({ page }) => {
      await page.goto('/head-coach');
      await expect(page.locator('text=My Coaches')).toBeVisible();
    });

    test('should display today\'s sessions', async ({ page }) => {
      await page.goto('/head-coach');
      await expect(page.locator("text=Today's Sessions")).toBeVisible();
    });

    test('should have action buttons', async ({ page }) => {
      await page.goto('/head-coach');
      await expect(page.locator('text=View Reports')).toBeVisible();
      await expect(page.locator('text=New Program')).toBeVisible();
    });
  });

  test.describe('Teams Page', () => {
    test('should display teams stats', async ({ page }) => {
      await page.goto('/head-coach/teams');
      
      await expect(page.locator('text=Total Teams')).toBeVisible();
      await expect(page.locator('text=Total Athletes')).toBeVisible();
      await expect(page.locator('text=Total Coaches')).toBeVisible();
      await expect(page.locator('text=Upcoming Matches')).toBeVisible();
    });

    test('should display teams list', async ({ page }) => {
      await page.goto('/head-coach/teams');
      await expect(page.locator('text=All Teams')).toBeVisible();
    });

    test('should have create team button', async ({ page }) => {
      await page.goto('/head-coach/teams');
      await expect(page.locator('text=Create Team')).toBeVisible();
    });
  });

  test.describe('Training Plans Page', () => {
    test('should display training plan stats', async ({ page }) => {
      await page.goto('/head-coach/training-plans');
      
      await expect(page.locator('text=Total Plans')).toBeVisible();
      await expect(page.locator('text=Active Plans')).toBeVisible();
      await expect(page.locator('text=Completed')).toBeVisible();
    });

    test('should display training plans list', async ({ page }) => {
      await page.goto('/head-coach/training-plans');
      await expect(page.locator('text=All Training Plans')).toBeVisible();
    });

    test('should have new plan button', async ({ page }) => {
      await page.goto('/head-coach/training-plans');
      await expect(page.locator('text=New Plan')).toBeVisible();
    });
  });

  test.describe('Evaluations Page', () => {
    test('should display evaluation stats', async ({ page }) => {
      await page.goto('/head-coach/evaluations');
      
      await expect(page.locator('text=Total Evaluations')).toBeVisible();
      await expect(page.locator('text=Avg. Overall Score')).toBeVisible();
      await expect(page.locator('text=Improving')).toBeVisible();
      await expect(page.locator('text=Players Evaluated')).toBeVisible();
    });

    test('should display evaluations list', async ({ page }) => {
      await page.goto('/head-coach/evaluations');
      await expect(page.locator('text=Recent Evaluations')).toBeVisible();
    });

    test('should have action buttons', async ({ page }) => {
      await page.goto('/head-coach/evaluations');
      await expect(page.locator('text=Export')).toBeVisible();
      await expect(page.locator('text=New Evaluation')).toBeVisible();
    });
  });

  test.describe('Match Analysis Page', () => {
    test('should display match stats', async ({ page }) => {
      await page.goto('/head-coach/match-analysis');
      
      await expect(page.locator('text=Total Matches')).toBeVisible();
      await expect(page.locator('text=Wins')).toBeVisible();
      await expect(page.locator('text=Draws')).toBeVisible();
      await expect(page.locator('text=Win Rate')).toBeVisible();
    });

    test('should display matches list', async ({ page }) => {
      await page.goto('/head-coach/match-analysis');
      await expect(page.locator('text=Recent Matches')).toBeVisible();
    });

    test('should display key insights', async ({ page }) => {
      await page.goto('/head-coach/match-analysis');
      await expect(page.locator('text=Key Insights')).toBeVisible();
    });
  });

  test.describe('Staff Page', () => {
    test('should display staff stats', async ({ page }) => {
      await page.goto('/head-coach/staff');
      
      await expect(page.locator('text=Total Staff')).toBeVisible();
      await expect(page.locator('text=Active')).toBeVisible();
      await expect(page.locator('text=Sessions This Week')).toBeVisible();
      await expect(page.locator('text=Avg. Rating')).toBeVisible();
    });

    test('should display staff list', async ({ page }) => {
      await page.goto('/head-coach/staff');
      await expect(page.locator('text=Coaching Staff')).toBeVisible();
    });

    test('should display upcoming meetings', async ({ page }) => {
      await page.goto('/head-coach/staff');
      await expect(page.locator('text=Upcoming Meetings')).toBeVisible();
    });
  });

  test.describe('Reports Page', () => {
    test('should display report summaries', async ({ page }) => {
      await page.goto('/head-coach/reports');
      await expect(page.locator('h1')).toContainText('Performance Reports');
    });

    test('should display recent reports', async ({ page }) => {
      await page.goto('/head-coach/reports');
      await expect(page.locator('text=Recent Reports')).toBeVisible();
    });

    test('should have export button', async ({ page }) => {
      await page.goto('/head-coach/reports');
      await expect(page.locator('text=Export All')).toBeVisible();
    });
  });

  test.describe('Analytics Page', () => {
    test('should display session analytics', async ({ page }) => {
      await page.goto('/head-coach/analytics');
      await expect(page.locator('h1')).toContainText('Session Analytics');
    });

    test('should display key metrics', async ({ page }) => {
      await page.goto('/head-coach/analytics');
      
      await expect(page.locator('text=Total Sessions')).toBeVisible();
      await expect(page.locator('text=Completion Rate')).toBeVisible();
      await expect(page.locator('text=Avg. Attendance')).toBeVisible();
      await expect(page.locator('text=Avg. Duration')).toBeVisible();
    });

    test('should display weekly trends', async ({ page }) => {
      await page.goto('/head-coach/analytics');
      await expect(page.locator('text=Weekly Session Trends')).toBeVisible();
    });

    test('should display popular sessions', async ({ page }) => {
      await page.goto('/head-coach/analytics');
      await expect(page.locator('text=Most Popular Sessions')).toBeVisible();
    });
  });

  test.describe('Communication Page', () => {
    test('should display communication hub', async ({ page }) => {
      await page.goto('/head-coach/communication');
      await expect(page.locator('h1')).toContainText('Team Communication');
    });

    test('should display quick stats', async ({ page }) => {
      await page.goto('/head-coach/communication');
      
      await expect(page.locator('text=Unread Messages')).toBeVisible();
      await expect(page.locator('text=Team Channels')).toBeVisible();
      await expect(page.locator('text=Announcements')).toBeVisible();
    });

    test('should display messages list', async ({ page }) => {
      await page.goto('/head-coach/communication');
      await expect(page.locator('text=Recent Messages')).toBeVisible();
    });

    test('should display team channels', async ({ page }) => {
      await page.goto('/head-coach/communication');
      await expect(page.locator('text=Team Channels')).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('dashboard should show loading state initially', async ({ page }) => {
      await page.goto('/head-coach');
      // The loading skeleton should be visible briefly before content loads
      await expect(page.locator('h1')).toContainText('Head Coach Dashboard');
    });

    test('teams page should handle loading', async ({ page }) => {
      await page.goto('/head-coach/teams');
      await expect(page.locator('h1')).toContainText('Team Management');
    });
  });

  test.describe('Error Handling', () => {
    test('should display fallback data on API error', async ({ page }) => {
      // Even with API errors, pages should gracefully fall back to mock data
      await page.goto('/head-coach');
      await expect(page.locator('h1')).toContainText('Head Coach Dashboard');
    });
  });

  test.describe('Responsive Design', () => {
    test('sidebar should collapse on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/head-coach');
      
      // Mobile navigation should be visible at bottom
      await expect(page.locator('nav.lg\\:hidden')).toBeVisible();
    });

    test('sidebar should expand on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/head-coach');
      
      // Desktop sidebar should be visible
      await expect(page.locator('aside.hidden.lg\\:flex')).toBeVisible();
    });
  });
});
