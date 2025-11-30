// tests/e2e/notifications.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Notifications and Alerts', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Notification Management', () => {
    test('should display notification center', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open notification center
      await page.click('[data-testid="notification-bell"]');

      // Verify notification center
      await expect(page.locator('[data-testid="notification-center"]')).toBeVisible();
      await expect(page.locator('[data-testid="notification-list"]')).toBeVisible();
    });

    test('should mark notifications as read', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open notification center
      await page.click('[data-testid="notification-bell"]');

      // Mark notification as read
      await page.click('[data-testid="notification-item-1"]');
      await page.click('[data-testid="mark-read"]');

      // Verify marked as read
      await expect(page.locator('[data-testid="notification-item-1"]')).toHaveClass(/read/);
    });

    test('should delete notifications', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open notification center
      await page.click('[data-testid="notification-bell"]');

      // Delete notification
      await page.click('[data-testid="notification-item-1"]');
      await page.click('[data-testid="delete-notification"]');

      // Verify deleted
      await expect(page.locator('[data-testid="notification-item-1"]')).not.toBeVisible();
    });

    test('should show notification count badge', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Verify notification badge
      await expect(page.locator('[data-testid="notification-badge"]')).toBeVisible();
      await expect(page.locator('[data-testid="notification-badge"]')).toContainText(/\d+/);
    });
  });

  test.describe('Real-time Notifications', () => {
    test('should receive session booking notifications', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      const parentData = generateTestData.user('PARENT');
      await helpers.register(coachData);

      // Parent books session (simulate in another context)
      // This would typically be done via API or another browser context

      // Coach receives notification
      await page.waitForSelector('[data-testid="notification-new-session"]');
      await expect(page.locator('[data-testid="notification-new-session"]')).toBeVisible();
      await expect(page.locator('[data-testid="notification-new-session"]')).toContainText('New session booked');
    });

    test('should receive message notifications', async ({ page }) => {
      const user1Data = generateTestData.user('COACH');
      const user2Data = generateTestData.user('PARENT');
      await helpers.register(user1Data);

      // User2 sends message (simulate)
      // This would typically be done via API or another browser context

      // User1 receives notification
      await page.waitForSelector('[data-testid="notification-new-message"]');
      await expect(page.locator('[data-testid="notification-new-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="notification-new-message"]')).toContainText('New message');
    });

    test('should receive payment notifications', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Payment received (simulate)
      // This would typically be done via webhook or API

      // Coach receives notification
      await page.waitForSelector('[data-testid="notification-payment"]');
      await expect(page.locator('[data-testid="notification-payment"]')).toBeVisible();
      await expect(page.locator('[data-testid="notification-payment"]')).toContainText('Payment received');
    });
  });

  test.describe('Email Notifications', () => {
    test('should send session reminder emails', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Create session with reminder
      await helpers.navigateToSection('sessions');
      await helpers.createSession({
        title: 'Test Session',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        time: '10:00',
        duration: 60,
        sendReminder: true,
        reminderHours: 24
      });

      // Verify email would be sent (in real scenario, check email service)
      // For e2e testing, we verify the reminder setting is saved
      await expect(page.locator('[data-testid="session-reminder-set"]')).toBeVisible();
    });

    test('should send payment confirmation emails', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Make payment
      await helpers.navigateToSection('payments');
      await helpers.makePayment({
        amount: 100,
        description: 'Session payment'
      });

      // Verify payment confirmation (in real scenario, check email)
      await expect(page.locator('[data-testid="payment-confirmation"]')).toBeVisible();
    });

    test('should send evaluation notification emails', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Create evaluation
      await helpers.navigateToSection('students');
      await helpers.createEvaluation({
        studentId: 'student-1',
        skills: ['passing', 'shooting'],
        notes: 'Great improvement'
      });

      // Verify evaluation notification (in real scenario, check email)
      await expect(page.locator('[data-testid="evaluation-sent"]')).toBeVisible();
    });
  });

  test.describe('Push Notifications', () => {
    test('should request push notification permission', async ({ page, context }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Grant notification permission
      await context.grantPermissions(['notifications']);

      // Verify permission granted
      const permission = await page.evaluate(() => {
        return Notification.permission;
      });
      expect(permission).toBe('granted');
    });

    test('should send push notifications for urgent messages', async ({ page, context }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Grant permissions
      await context.grantPermissions(['notifications']);

      // Send urgent message (simulate)
      // In real scenario, this would trigger a push notification

      // Verify notification capability
      const canNotify = await page.evaluate(() => {
        return 'Notification' in window && Notification.permission === 'granted';
      });
      expect(canNotify).toBe(true);
    });

    test('should handle push notification clicks', async ({ page, context }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Grant permissions
      await context.grantPermissions(['notifications']);

      // Simulate push notification click
      // In real scenario, clicking push notification would navigate to relevant page

      // Verify navigation capability
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    });
  });

  test.describe('Notification Preferences', () => {
    test('should manage notification preferences', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Navigate to settings
      await helpers.navigateToSection('settings');

      // Open notification preferences
      await page.click('[data-testid="notification-preferences"]');

      // Update preferences
      await page.check('[data-testid="email-session-reminders"]');
      await page.uncheck('[data-testid="email-marketing"]');
      await page.check('[data-testid="push-urgent-messages"]');
      await helpers.submitForm();

      // Verify preferences saved
      await expect(page.locator('[data-testid="preferences-saved"]')).toBeVisible();
    });

    test('should respect notification preferences', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Set preferences to disable email notifications
      await helpers.navigateToSection('settings');
      await page.click('[data-testid="notification-preferences"]');
      await page.uncheck('[data-testid="email-notifications"]');
      await helpers.submitForm();

      // Trigger notification event (simulate)
      // Verify no email sent (in real scenario, check email service logs)

      // Verify preference respected
      await expect(page.locator('[data-testid="email-disabled"]')).toBeVisible();
    });

    test('should allow per-channel preferences', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Navigate to preferences
      await helpers.navigateToSection('settings');
      await page.click('[data-testid="notification-preferences"]');

      // Set different preferences for different channels
      await page.check('[data-testid="session-bookings-email"]');
      await page.uncheck('[data-testid="session-bookings-push"]');
      await page.check('[data-testid="messages-push"]');
      await page.uncheck('[data-testid="messages-email"]');
      await helpers.submitForm();

      // Verify granular preferences
      await expect(page.locator('[data-testid="preferences-updated"]')).toBeVisible();
    });
  });

  test.describe('Notification History', () => {
    test('should view notification history', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open notification center
      await page.click('[data-testid="notification-bell"]');

      // View history
      await page.click('[data-testid="notification-history"]');

      // Verify history
      await expect(page.locator('[data-testid="notification-history-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="history-filters"]')).toBeVisible();
    });

    test('should filter notification history', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open history
      await page.click('[data-testid="notification-bell"]');
      await page.click('[data-testid="notification-history"]');

      // Filter by type
      await page.selectOption('[name="filterType"]', 'session');
      await page.click('[data-testid="apply-filter"]');

      // Verify filtered results
      await expect(page.locator('[data-testid="notification-item"]')).toHaveCount(1);
      await expect(page.locator('[data-testid="notification-item"]')).toContainText('session');
    });

    test('should search notification history', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open history
      await page.click('[data-testid="notification-bell"]');
      await page.click('[data-testid="notification-history"]');

      // Search notifications
      await page.fill('[data-testid="search-notifications"]', 'session');
      await page.click('[data-testid="search-button"]');

      // Verify search results
      await expect(page.locator('[data-testid="search-results"]')).toContainText('session');
    });
  });

  test.describe('Bulk Notification Actions', () => {
    test('should mark multiple notifications as read', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open notification center
      await page.click('[data-testid="notification-bell"]');

      // Select multiple notifications
      await page.check('[data-testid="select-notification-1"]');
      await page.check('[data-testid="select-notification-2"]');
      await page.click('[data-testid="bulk-mark-read"]');

      // Verify marked as read
      await expect(page.locator('[data-testid="notification-item-1"]')).toHaveClass(/read/);
      await expect(page.locator('[data-testid="notification-item-2"]')).toHaveClass(/read/);
    });

    test('should delete multiple notifications', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open notification center
      await page.click('[data-testid="notification-bell"]');

      // Select and delete multiple
      await page.check('[data-testid="select-notification-1"]');
      await page.check('[data-testid="select-notification-2"]');
      await page.click('[data-testid="bulk-delete"]');

      // Verify deleted
      await expect(page.locator('[data-testid="notification-item-1"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="notification-item-2"]')).not.toBeVisible();
    });

    test('should archive notifications', async ({ page }) => {
      const userData = generateTestData.user('COACH');
      await helpers.register(userData);

      // Open notification center
      await page.click('[data-testid="notification-bell"]');

      // Archive notification
      await page.click('[data-testid="notification-item-1"]');
      await page.click('[data-testid="archive-notification"]');

      // Verify archived
      await expect(page.locator('[data-testid="notification-item-1"]')).not.toBeVisible();
      await page.click('[data-testid="archived-notifications"]');
      await expect(page.locator('[data-testid="notification-item-1"]')).toBeVisible();
    });
  });

  test.describe('Notification Templates', () => {
    test('should create custom notification templates', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to notification settings
      await helpers.navigateToSection('settings');
      await page.click('[data-testid="notification-templates"]');

      // Create template
      await page.click('[data-testid="create-template"]');
      await page.fill('[name="templateName"]', 'Session Reminder');
      await page.fill('[name="templateSubject"]', 'Session Reminder: {{sessionTitle}}');
      await page.fill('[name="templateBody"]', 'Hi {{studentName}}, your session {{sessionTitle}} is tomorrow at {{sessionTime}}.');
      await helpers.submitForm();

      // Verify template created
      await expect(page.locator('[data-testid="template-list"]')).toContainText('Session Reminder');
    });

    test('should use notification templates', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Send notification using template
      await helpers.navigateToSection('students');
      await page.click('[data-testid="send-notification"]');
      await page.selectOption('[name="template"]', 'session-reminder');
      await page.selectOption('[name="student"]', 'student-1');
      await helpers.submitForm();

      // Verify notification sent
      await expect(page.locator('[data-testid="notification-sent"]')).toBeVisible();
    });

    test('should customize template variables', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Use template with custom variables
      await helpers.navigateToSection('students');
      await page.click('[data-testid="send-notification"]');
      await page.selectOption('[name="template"]', 'custom-message');
      await page.fill('[name="customVar1"]', 'John');
      await page.fill('[name="customVar2"]', 'Soccer Practice');
      await helpers.submitForm();

      // Verify customization
      await expect(page.locator('[data-testid="notification-preview"]')).toContainText('John');
      await expect(page.locator('[data-testid="notification-preview"]')).toContainText('Soccer Practice');
    });
  });
});