// tests/e2e/sessions.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Session Management', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Club Admin Session Management', () => {
    test('should allow club admin to create training sessions', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to sessions
      await helpers.navigateToSection('sessions');

      // Create session
      const sessionData = generateTestData.session();
      await helpers.createSession(sessionData);

      // Verify session created
      await expect(page.locator('[data-testid="sessions-table"]')).toContainText(sessionData.title);
    });

    test('should allow scheduling recurring sessions', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to sessions
      await helpers.navigateToSection('sessions');

      // Create recurring session
      await page.click('[data-testid="create-session"]');
      await page.check('[data-testid="recurring-session"]');
      await helpers.fillForm({
        '[name="title"]': 'Weekly Training',
        '[name="description"]': 'Regular weekly training session',
        '[name="startDate"]': '2024-01-01',
        '[name="endDate"]': '2024-12-31',
        '[name="frequency"]': 'weekly',
        '[name="time"]': '10:00',
        '[name="duration"]': '90',
      });
      await helpers.submitForm();

      // Verify recurring sessions created
      await expect(page.locator('[data-testid="sessions-table"]')).toContainText('Weekly Training');
    });

    test('should allow assigning coaches to sessions', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to sessions
      await helpers.navigateToSection('sessions');

      // Create session first
      const sessionData = generateTestData.session();
      await helpers.createSession(sessionData);

      // Assign coach
      const rows = await helpers.getTableRows('[data-testid="sessions-table"]');
      await helpers.clickTableAction('[data-testid="sessions-table"]', 0, 'assign-coach');

      await page.selectOption('[name="coachId"]', 'coach-1');
      await helpers.submitForm();

      // Verify coach assigned
      await expect(page.locator('[data-testid="session-coach"]')).toContainText('Coach Name');
    });

    test('should allow viewing session attendance reports', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to sessions
      await helpers.navigateToSection('sessions');

      // Click on session
      await page.click('[data-testid="session-row"]:first-child');

      // View attendance
      await page.click('[data-testid="view-attendance"]');
      await expect(page.locator('[data-testid="attendance-report"]')).toBeVisible();
    });
  });

  test.describe('Coach Session Management', () => {
    test('should allow coach to view assigned sessions', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to my sessions
      await helpers.navigateToSection('my-sessions');

      // Verify sessions list
      await expect(page.locator('[data-testid="sessions-table"]')).toBeVisible();
    });

    test('should allow coach to mark attendance', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to session
      await helpers.navigateToSection('my-sessions');
      await page.click('[data-testid="session-row"]:first-child');

      // Mark attendance
      await page.click('[data-testid="mark-attendance"]');
      await page.check('[data-testid="student-present-1"]');
      await page.check('[data-testid="student-present-2"]');
      await helpers.submitForm();

      // Verify attendance recorded
      await helpers.waitForToast('Attendance recorded successfully');
    });

    test('should allow coach to create session notes', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to session
      await helpers.navigateToSection('my-sessions');
      await page.click('[data-testid="session-row"]:first-child');

      // Add notes
      await page.click('[data-testid="add-notes"]');
      await page.fill('[data-testid="session-notes"]', 'Great session today! Students showed excellent effort.');
      await helpers.submitForm();

      // Verify notes saved
      await expect(page.locator('[data-testid="session-notes-display"]')).toContainText('Great session today!');
    });

    test('should allow coach to upload session photos', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to session
      await helpers.navigateToSection('my-sessions');
      await page.click('[data-testid="session-row"]:first-child');

      // Upload photos
      await page.click('[data-testid="upload-photos"]');
      await helpers.uploadFile('[data-testid="photo-upload"]', 'session-photo1.jpg');
      await helpers.uploadFile('[data-testid="photo-upload"]', 'session-photo2.jpg');
      await helpers.submitForm();

      // Verify photos uploaded
      await expect(page.locator('[data-testid="photo-gallery"] img')).toHaveCount(2);
    });
  });

  test.describe('Parent Session Management', () => {
    test('should allow parent to view child sessions', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to sessions
      await helpers.navigateToSection('book-sessions');

      // View available sessions
      await expect(page.locator('[data-testid="available-sessions"]')).toBeVisible();
    });

    test('should allow parent to book sessions for child', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to book sessions
      await helpers.navigateToSection('book-sessions');

      // Select session
      await page.click('[data-testid="session-card"]:first-child');
      await page.click('[data-testid="book-session"]');

      // Confirm booking
      await helpers.submitForm();

      // Verify booking
      await helpers.waitForToast('Session booked successfully');
      await expect(page.locator('[data-testid="my-bookings"]')).toContainText('Booked');
    });

    test('should allow parent to cancel session booking', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to my bookings
      await helpers.navigateToSection('my-bookings');

      // Cancel booking
      await page.click('[data-testid="booking-row"]:first-child [data-testid="cancel-booking"]');
      await page.click('[data-testid="confirm-cancel"]');

      // Verify cancellation
      await helpers.waitForToast('Booking cancelled successfully');
    });

    test('should show session reminders', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Check notifications
      await page.click('[data-testid="notifications"]');

      // Should show upcoming session reminders
      await expect(page.locator('[data-testid="notification-list"]')).toContainText('upcoming session');
    });
  });

  test.describe('Freelancer Session Management', () => {
    test('should allow freelancer to view available sessions', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to available sessions
      await helpers.navigateToSection('available-sessions');

      // Verify sessions list
      await expect(page.locator('[data-testid="available-sessions"]')).toBeVisible();
    });

    test('should allow freelancer to apply for sessions', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to available sessions
      await helpers.navigateToSection('available-sessions');

      // Apply for session
      await page.click('[data-testid="session-card"]:first-child [data-testid="apply-session"]');
      await page.fill('[data-testid="application-message"]', 'I would love to coach this session!');
      await helpers.submitForm();

      // Verify application submitted
      await helpers.waitForToast('Application submitted successfully');
    });

    test('should allow freelancer to view accepted bookings', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to my bookings
      await helpers.navigateToSection('my-bookings');

      // Verify accepted sessions
      await expect(page.locator('[data-testid="accepted-bookings"]')).toBeVisible();
    });
  });

  test.describe('Session Calendar and Scheduling', () => {
    test('should display sessions in calendar view', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to calendar
      await helpers.navigateToSection('calendar');

      // Verify calendar view
      await expect(page.locator('[data-testid="calendar-view"]')).toBeVisible();
      await expect(page.locator('[data-testid="calendar-events"]')).toBeVisible();
    });

    test('should allow filtering sessions by date range', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to sessions
      await helpers.navigateToSection('sessions');

      // Filter by date
      await page.fill('[data-testid="date-from"]', '2024-01-01');
      await page.fill('[data-testid="date-to"]', '2024-01-31');
      await page.click('[data-testid="apply-filter"]');

      // Verify filtered results
      const rows = await helpers.getTableRows('[data-testid="sessions-table"]');
      // All sessions should be within January 2024
    });

    test('should allow filtering sessions by type', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to sessions
      await helpers.navigateToSection('sessions');

      // Filter by type
      await helpers.applyFilter('type', 'Training');

      // Verify filtered results
      const rows = await helpers.getTableRows('[data-testid="sessions-table"]');
      for (let i = 0; i < await rows.count(); i++) {
        await expect(rows.nth(i)).toContainText('Training');
      }
    });

    test('should show session conflicts', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to create session
      await helpers.navigateToSection('sessions');
      await page.click('[data-testid="create-session"]');

      // Try to create conflicting session
      await helpers.fillForm({
        '[name="title"]': 'Conflicting Session',
        '[name="date"]': '2024-01-01',
        '[name="time"]': '10:00', // Same time as existing session
        '[name="duration"]': '60',
      });
      await helpers.submitForm();

      // Should show conflict warning
      await expect(page.locator('[data-testid="conflict-warning"]')).toBeVisible();
    });
  });
});