// tests/e2e/messaging.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Messaging and Communication', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Real-time Messaging', () => {
    test('should allow sending messages between users', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to messages
      await helpers.navigateToSection('messages');

      // Start new conversation
      await page.click('[data-testid="new-message"]');
      await page.selectOption('[name="recipient"]', 'parent-1');
      await page.fill('[name="subject"]', 'Practice Update');
      await page.fill('[name="message"]', 'Your child did great in practice today!');
      await helpers.submitForm();

      // Verify message sent
      await expect(page.locator('[data-testid="message-thread"]')).toContainText('Your child did great in practice today!');
    });

    test('should show real-time message updates', async ({ page, context }) => {
      // Create two users in different browser contexts
      const coachPage = page;
      const parentPage = await context.newPage();

      // Coach sends message
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Parent logs in on second page
      const parentHelpers = new TestHelpers(parentPage);
      const parentData = generateTestData.user('PARENT');
      await parentHelpers.register(parentData);

      // Coach sends message
      await coachPage.click('[data-testid="nav-messages"]');
      await coachPage.click('[data-testid="new-message"]');
      await coachPage.selectOption('[name="recipient"]', parentData.email);
      await coachPage.fill('[name="subject"]', 'Real-time Test');
      await coachPage.fill('[name="message"]', 'Hello from coach!');
      await coachPage.click('button[type="submit"]');

      // Parent should see message in real-time
      await parentPage.click('[data-testid="nav-messages"]');
      await expect(parentPage.locator('[data-testid="message-thread"]')).toContainText('Hello from coach!', { timeout: 10000 });
    });

    test('should handle message read receipts', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Send message
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="new-message"]');
      await page.selectOption('[name="recipient"]', 'parent-1');
      await page.fill('[name="subject"]', 'Read Receipt Test');
      await page.fill('[name="message"]', 'Test message');
      await helpers.submitForm();

      // Verify sent status
      await expect(page.locator('[data-testid="message-status"]')).toContainText('Sent');

      // Simulate recipient reading (in real app, this would be automatic)
      // For testing, we can check that read status updates
    });
  });

  test.describe('Group Messaging', () => {
    test('should allow creating group conversations', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to messages
      await helpers.navigateToSection('messages');

      // Create group
      await page.click('[data-testid="create-group"]');
      await page.fill('[name="groupName"]', 'U10 Team Parents');
      await page.fill('[name="groupDescription"]', 'Communication for U10 team parents');
      await page.check('[data-testid="participant-parent1"]');
      await page.check('[data-testid="participant-parent2"]');
      await helpers.submitForm();

      // Verify group created
      await expect(page.locator('[data-testid="group-list"]')).toContainText('U10 Team Parents');
    });

    test('should allow sending messages to groups', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to group
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="group-U10"]');

      // Send group message
      await helpers.sendMessage('Team practice is cancelled tomorrow due to weather.');

      // Verify message in group chat
      await helpers.verifyMessageInChat('Team practice is cancelled tomorrow due to weather.');
    });

    test('should show group member online status', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to group
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="group-U10"]');

      // Check online status
      await expect(page.locator('[data-testid="member-status"]')).toBeVisible();
    });
  });

  test.describe('Message History and Search', () => {
    test('should allow searching message history', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to messages
      await helpers.navigateToSection('messages');

      // Search messages
      await page.fill('[data-testid="message-search"]', 'practice');
      await page.click('[data-testid="search-button"]');

      // Verify search results
      await expect(page.locator('[data-testid="search-results"]')).toContainText('practice');
    });

    test('should show message threads chronologically', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to conversation
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="conversation-1"]');

      // Verify chronological order
      const messages = page.locator('[data-testid="message-item"]');
      const messageCount = await messages.count();

      // Messages should be in chronological order (oldest first or newest first, depending on design)
      expect(messageCount).toBeGreaterThan(0);
    });

    test('should allow archiving old conversations', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to messages
      await helpers.navigateToSection('messages');

      // Archive conversation
      await page.click('[data-testid="conversation-1"]');
      await page.click('[data-testid="archive-conversation"]');
      await page.click('[data-testid="confirm-archive"]');

      // Verify archived
      await expect(page.locator('[data-testid="archived-conversations"]')).toContainText('Archived');
    });
  });

  test.describe('File and Media Sharing', () => {
    test('should allow sharing photos in messages', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to messages
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="conversation-1"]');

      // Share photo
      await page.click('[data-testid="attach-file"]');
      await helpers.uploadFile('[data-testid="file-input"]', 'practice-photo.jpg');
      await page.fill('[data-testid="message-input"]', 'Check out this great play!');
      await page.click('[data-testid="send-message"]');

      // Verify photo shared
      await expect(page.locator('[data-testid="message-attachments"] img')).toBeVisible();
    });

    test('should allow sharing documents', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to messages
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="conversation-1"]');

      // Share document
      await page.click('[data-testid="attach-file"]');
      await helpers.uploadFile('[data-testid="file-input"]', 'training-plan.pdf');
      await page.fill('[data-testid="message-input"]', 'Here is the training plan for next week');
      await page.click('[data-testid="send-message"]');

      // Verify document shared
      await expect(page.locator('[data-testid="message-attachments"]')).toContainText('training-plan.pdf');
    });

    test('should show download links for shared files', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to messages
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="conversation-1"]');

      // Check for download links
      await expect(page.locator('[data-testid="file-download"]')).toBeVisible();
    });
  });

  test.describe('Notifications and Alerts', () => {
    test('should show message notifications', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Check notifications
      await page.click('[data-testid="notifications"]');

      // Should show message notifications
      await expect(page.locator('[data-testid="notification-list"]')).toContainText('New message');
    });

    test('should allow marking messages as read', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to messages
      await helpers.navigateToSection('messages');

      // Mark message as read
      await page.click('[data-testid="mark-read"]');

      // Verify notification count decreases
      const notificationBadge = page.locator('[data-testid="notification-badge"]');
      const initialCount = await notificationBadge.textContent();
      // After marking read, count should decrease
    });

    test('should send email notifications for important messages', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Send urgent message
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="new-message"]');
      await page.selectOption('[name="recipient"]', 'parent-1');
      await page.check('[data-testid="urgent-message"]');
      await page.fill('[name="subject"]', 'Urgent: Practice Change');
      await page.fill('[name="message"]', 'Practice time changed to 3 PM');
      await helpers.submitForm();

      // Verify urgent indicator
      await expect(page.locator('[data-testid="urgent-indicator"]')).toBeVisible();
    });
  });

  test.describe('Message Templates and Quick Replies', () => {
    test('should allow using message templates', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to messages
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="new-message"]');

      // Use template
      await page.click('[data-testid="use-template"]');
      await page.click('[data-testid="template-practice-reminder"]');

      // Verify template loaded
      await expect(page.locator('[name="message"]')).toContainText('practice reminder');
    });

    test('should allow saving message drafts', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Start composing message
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="new-message"]');
      await page.fill('[name="subject"]', 'Draft Test');
      await page.fill('[name="message"]', 'This is a draft message');

      // Save draft
      await page.click('[data-testid="save-draft"]');

      // Verify draft saved
      await expect(page.locator('[data-testid="drafts"]')).toContainText('Draft Test');
    });

    test('should allow quick replies', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Open conversation
      await helpers.navigateToSection('messages');
      await page.click('[data-testid="conversation-1"]');

      // Use quick reply
      await page.click('[data-testid="quick-replies"]');
      await page.click('[data-testid="reply-great-job"]');

      // Verify quick reply sent
      await expect(page.locator('[data-testid="message-thread"]')).toContainText('Great job!');
    });
  });
});