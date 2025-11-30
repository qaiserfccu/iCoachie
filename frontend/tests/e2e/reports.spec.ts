// tests/e2e/reports.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Reports and Analytics', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Club Admin Reports', () => {
    test('should generate attendance reports', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Generate attendance report
      await page.click('[data-testid="attendance-report"]');
      await page.fill('[name="startDate"]', '2024-01-01');
      await page.fill('[name="endDate"]', '2024-01-31');
      await page.click('[data-testid="generate-report"]');

      // Verify report generated
      await expect(page.locator('[data-testid="report-results"]')).toBeVisible();
      await expect(page.locator('[data-testid="attendance-chart"]')).toBeVisible();
    });

    test('should generate financial reports', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Generate financial report
      await page.click('[data-testid="financial-report"]');
      await page.selectOption('[name="reportType"]', 'monthly-revenue');
      await page.click('[data-testid="generate-report"]');

      // Verify financial data
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="expense-breakdown"]')).toBeVisible();
    });

    test('should export reports to PDF', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Generate report first
      await helpers.navigateToSection('reports');
      await page.click('[data-testid="attendance-report"]');
      await page.click('[data-testid="generate-report"]');

      // Export to PDF
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="export-pdf"]');
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/report.*\.pdf/);
    });

    test('should show coach performance metrics', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View coach performance
      await page.click('[data-testid="coach-performance"]');

      // Verify metrics
      await expect(page.locator('[data-testid="coach-ratings"]')).toBeVisible();
      await expect(page.locator('[data-testid="session-completion"]')).toBeVisible();
      await expect(page.locator('[data-testid="student-satisfaction"]')).toBeVisible();
    });
  });

  test.describe('Coach Reports', () => {
    test('should view student progress reports', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View student progress
      await page.click('[data-testid="student-progress"]');
      await page.selectOption('[name="studentId"]', 'student-1');

      // Verify progress data
      await expect(page.locator('[data-testid="progress-timeline"]')).toBeVisible();
      await expect(page.locator('[data-testid="skill-development"]')).toBeVisible();
    });

    test('should generate session reports', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Generate session report
      await page.click('[data-testid="session-report"]');
      await page.selectOption('[name="sessionId"]', 'session-1');

      // Verify session data
      await expect(page.locator('[data-testid="attendance-summary"]')).toBeVisible();
      await expect(page.locator('[data-testid="performance-notes"]')).toBeVisible();
    });

    test('should track coach statistics', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View coach stats
      await page.click('[data-testid="my-statistics"]');

      // Verify statistics
      await expect(page.locator('[data-testid="sessions-coached"]')).toBeVisible();
      await expect(page.locator('[data-testid="average-rating"]')).toBeVisible();
      await expect(page.locator('[data-testid="student-improvement"]')).toBeVisible();
    });
  });

  test.describe('Parent Reports', () => {
    test('should view child progress reports', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View child progress
      await page.click('[data-testid="child-progress"]');
      await page.selectOption('[name="childId"]', 'child-1');

      // Verify progress data
      await expect(page.locator('[data-testid="skill-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="attendance-record"]')).toBeVisible();
      await expect(page.locator('[data-testid="coach-feedback"]')).toBeVisible();
    });

    test('should view payment history reports', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View payment history
      await page.click('[data-testid="payment-history"]');

      // Verify payment data
      await expect(page.locator('[data-testid="payment-timeline"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-spent"]')).toBeVisible();
    });

    test('should compare child performance', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Compare children
      await page.click('[data-testid="compare-children"]');

      // Verify comparison data
      await expect(page.locator('[data-testid="performance-comparison"]')).toBeVisible();
      await expect(page.locator('[data-testid="skill-comparison"]')).toBeVisible();
    });
  });

  test.describe('Freelancer Reports', () => {
    test('should view earnings reports', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View earnings report
      await page.click('[data-testid="earnings-report"]');

      // Verify earnings data
      await expect(page.locator('[data-testid="monthly-earnings"]')).toBeVisible();
      await expect(page.locator('[data-testid="session-rates"]')).toBeVisible();
      await expect(page.locator('[data-testid="client-feedback"]')).toBeVisible();
    });

    test('should track session statistics', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View session stats
      await page.click('[data-testid="session-statistics"]');

      // Verify statistics
      await expect(page.locator('[data-testid="sessions-completed"]')).toBeVisible();
      await expect(page.locator('[data-testid="average-rating"]')).toBeVisible();
      await expect(page.locator('[data-testid="repeat-clients"]')).toBeVisible();
    });
  });

  test.describe('Advanced Analytics', () => {
    test('should show trend analysis', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to analytics
      await helpers.navigateToSection('analytics');

      // View trends
      await page.click('[data-testid="trend-analysis"]');

      // Verify trend data
      await expect(page.locator('[data-testid="attendance-trends"]')).toBeVisible();
      await expect(page.locator('[data-testid="revenue-trends"]')).toBeVisible();
      await expect(page.locator('[data-testid="enrollment-trends"]')).toBeVisible();
    });

    test('should generate custom reports', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Create custom report
      await page.click('[data-testid="custom-report"]');
      await page.check('[data-testid="include-attendance"]');
      await page.check('[data-testid="include-finances"]');
      await page.check('[data-testid="include-evaluations"]');
      await page.fill('[name="dateRange"]', 'last-3-months');
      await page.click('[data-testid="generate-custom"]');

      // Verify custom report
      await expect(page.locator('[data-testid="custom-report-results"]')).toBeVisible();
    });

    test('should export data to CSV', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Generate report first
      await helpers.navigateToSection('reports');
      await page.click('[data-testid="attendance-report"]');
      await page.click('[data-testid="generate-report"]');

      // Export to CSV
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="export-csv"]');
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/report.*\.csv/);
    });

    test('should show real-time dashboard metrics', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to dashboard
      await page.goto('/dashboard');

      // Verify real-time updates
      await expect(page.locator('[data-testid="live-attendance"]')).toBeVisible();
      await expect(page.locator('[data-testid="live-revenue"]')).toBeVisible();

      // Wait for potential updates
      await page.waitForTimeout(5000); // Allow time for real-time updates
    });
  });

  test.describe('Report Scheduling', () => {
    test('should schedule automated reports', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Schedule report
      await page.click('[data-testid="schedule-report"]');
      await page.selectOption('[name="reportType"]', 'weekly-attendance');
      await page.selectOption('[name="frequency"]', 'weekly');
      await page.selectOption('[name="dayOfWeek"]', 'monday');
      await page.fill('[name="recipients"]', 'admin@example.com');
      await helpers.submitForm();

      // Verify scheduled
      await expect(page.locator('[data-testid="scheduled-reports"]')).toContainText('weekly-attendance');
    });

    test('should manage scheduled reports', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Edit scheduled report
      await page.click('[data-testid="scheduled-reports"]');
      await page.click('[data-testid="edit-schedule-1"]');
      await page.selectOption('[name="frequency"]', 'monthly');
      await helpers.submitForm();

      // Verify updated
      await expect(page.locator('[data-testid="scheduled-reports"]')).toContainText('monthly');
    });
  });

  test.describe('Data Visualization', () => {
    test('should display interactive charts', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // View chart
      await page.click('[data-testid="attendance-chart"]');

      // Interact with chart
      await page.click('[data-testid="chart-legend"]');
      await page.hover('[data-testid="chart-data-point"]');

      // Verify interactivity
      await expect(page.locator('[data-testid="tooltip"]')).toBeVisible();
    });

    test('should allow chart customization', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to reports
      await helpers.navigateToSection('reports');

      // Customize chart
      await page.click('[data-testid="customize-chart"]');
      await page.selectOption('[name="chartType"]', 'bar');
      await page.check('[data-testid="show-trendline"]');
      await page.fill('[name="chartTitle"]', 'Custom Attendance Chart');
      await helpers.submitForm();

      // Verify customization
      await expect(page.locator('[data-testid="chart-title"]')).toContainText('Custom Attendance Chart');
    });

    test('should export charts as images', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Generate chart first
      await helpers.navigateToSection('reports');
      await page.click('[data-testid="attendance-report"]');
      await page.click('[data-testid="generate-report"]');

      // Export chart
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="export-chart"]');
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/chart.*\.(png|jpg|svg)/);
    });
  });
});