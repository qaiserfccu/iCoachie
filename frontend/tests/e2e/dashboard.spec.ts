// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Club Admin Dashboard', () => {
    test('should display club overview stats', async ({ page }) => {
      const userData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(userData);

      // Verify dashboard stats
      await helpers.verifyDashboardStats({
        totalStudents: '0',
        activeCoaches: '0',
        upcomingSessions: '0',
        monthlyRevenue: '$0.00',
      });

      // Verify navigation menu
      await expect(page.locator('[data-testid="nav-students"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-coaches"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-sessions"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-payments"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-reports"]')).toBeVisible();
    });

    test('should allow creating new club', async ({ page }) => {
      const userData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(userData);

      // Navigate to club settings
      await helpers.navigateToSection('settings');

      // Create new club
      const clubData = generateTestData.club();
      await page.click('[data-testid="create-club"]');
      await helpers.fillForm({
        '[name="name"]': clubData.name,
        '[name="description"]': clubData.description,
        '[name="location"]': clubData.location,
      });
      await helpers.submitForm();

      // Verify club created
      await expect(page.locator('[data-testid="club-name"]')).toContainText(clubData.name);
    });
  });

  test.describe('Coach Dashboard', () => {
    test('should display coach overview stats', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Verify dashboard stats
      await helpers.verifyDashboardStats({
        myStudents: '0',
        upcomingSessions: '0',
        completedSessions: '0',
        averageRating: 'N/A',
      });

      // Verify navigation menu
      await expect(page.locator('[data-testid="nav-my-students"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-my-sessions"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-evaluations"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-messages"]')).toBeVisible();
    });

    test('should allow updating coach profile', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Navigate to profile
      await helpers.navigateToSection('profile');

      // Update profile
      await page.click('[data-testid="edit-profile"]');
      await helpers.fillForm({
        '[name="specialties"]': 'Soccer, Basketball',
        '[name="experience"]': '5 years',
        '[name="bio"]': 'Experienced coach with passion for youth development',
      });
      await helpers.submitForm();

      // Verify profile updated
      await expect(page.locator('[data-testid="coach-specialties"]')).toContainText('Soccer, Basketball');
    });
  });

  test.describe('Freelancer Dashboard', () => {
    test('should display freelancer overview stats', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);

      // Verify dashboard stats
      await helpers.verifyDashboardStats({
        availableSessions: '0',
        completedSessions: '0',
        totalEarnings: '$0.00',
        averageRating: 'N/A',
      });

      // Verify navigation menu
      await expect(page.locator('[data-testid="nav-available-sessions"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-my-bookings"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-earnings"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-profile"]')).toBeVisible();
    });

    test('should allow setting availability', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);

      // Navigate to availability
      await helpers.navigateToSection('availability');

      // Set availability
      await page.click('[data-testid="add-availability"]');
      await page.selectOption('[name="day"]', 'monday');
      await page.fill('[name="startTime"]', '09:00');
      await page.fill('[name="endTime"]', '17:00');
      await helpers.submitForm();

      // Verify availability set
      await expect(page.locator('[data-testid="availability-list"]')).toContainText('Monday');
    });
  });

  test.describe('Parent Dashboard', () => {
    test('should display parent overview stats', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Verify dashboard stats
      await helpers.verifyDashboardStats({
        myChildren: '0',
        upcomingSessions: '0',
        totalSpent: '$0.00',
        messages: '0',
      });

      // Verify navigation menu
      await expect(page.locator('[data-testid="nav-my-children"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-book-sessions"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-payments"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-messages"]')).toBeVisible();
    });

    test('should allow adding a child', async ({ page }) => {
      const userData = generateTestData.user('PARENT');
      await helpers.register(userData);

      // Navigate to children
      await helpers.navigateToSection('my-children');

      // Add child
      const childData = generateTestData.student();
      await page.click('[data-testid="add-child"]');
      await helpers.fillForm({
        '[name="name"]': childData.name,
        '[name="dateOfBirth"]': childData.dateOfBirth,
        '[name="grade"]': childData.grade,
        '[name="emergencyContact"]': childData.emergencyContact,
        '[name="emergencyPhone"]': childData.emergencyPhone,
        '[name="medicalInfo"]': childData.medicalInfo,
      });
      await helpers.submitForm();

      // Verify child added
      await expect(page.locator('[data-testid="children-list"]')).toContainText(childData.name);
    });
  });

  test.describe('Cross-Role Features', () => {
    test('should show notifications across all roles', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Check notifications
      await page.click('[data-testid="notifications"]');
      await expect(page.locator('[data-testid="notification-list"]')).toBeVisible();
    });

    test('should allow profile updates across all roles', async ({ page }) => {
      const userData = generateTestData.user('FREELANCER');
      await helpers.register(userData);

      // Navigate to profile
      await helpers.navigateToSection('profile');

      // Update profile picture
      await helpers.uploadFile('[data-testid="profile-picture"]', 'test-avatar.jpg');

      // Update contact info
      await page.click('[data-testid="edit-contact"]');
      await helpers.fillForm({
        '[name="phone"]': '+1234567890',
        '[name="address"]': '123 Test Street',
      });
      await helpers.submitForm();

      // Verify updates
      await expect(page.locator('[data-testid="contact-phone"]')).toContainText('+1234567890');
    });
  });
});