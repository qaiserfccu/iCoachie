// tests/e2e/students.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Student Management', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Club Admin Student Management', () => {
    test('should allow club admin to add students', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to students
      await helpers.navigateToSection('students');

      // Add student
      const studentData = generateTestData.student();
      await page.click('[data-testid="add-student"]');
      await helpers.fillForm({
        '[name="name"]': studentData.name,
        '[name="dateOfBirth"]': studentData.dateOfBirth,
        '[name="grade"]': studentData.grade,
        '[name="emergencyContact"]': studentData.emergencyContact,
        '[name="emergencyPhone"]': studentData.emergencyPhone,
        '[name="medicalInfo"]': studentData.medicalInfo,
      });
      await helpers.submitForm();

      // Verify student added
      await expect(page.locator('[data-testid="students-table"]')).toContainText(studentData.name);
    });

    test('should allow bulk student import', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to students
      await helpers.navigateToSection('students');

      // Import CSV
      await page.click('[data-testid="import-students"]');
      await helpers.uploadFile('[data-testid="csv-upload"]', 'students.csv');
      await helpers.submitForm();

      // Verify import success
      await helpers.waitForToast('Students imported successfully');
    });

    test('should allow assigning students to coaches', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Add student first
      await helpers.navigateToSection('students');
      const studentData = generateTestData.student();
      await page.click('[data-testid="add-student"]');
      await helpers.fillForm({
        '[name="name"]': studentData.name,
        '[name="dateOfBirth"]': studentData.dateOfBirth,
        '[name="grade"]': studentData.grade,
      });
      await helpers.submitForm();

      // Assign to coach
      const rows = await helpers.getTableRows('[data-testid="students-table"]');
      await helpers.clickTableAction('[data-testid="students-table"]', 0, 'assign-coach');

      await page.selectOption('[name="coachId"]', 'coach-1'); // Assuming coach exists
      await helpers.submitForm();

      // Verify assignment
      await expect(page.locator('[data-testid="student-coach"]')).toContainText('Coach Name');
    });

    test('should allow viewing student progress reports', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to students
      await helpers.navigateToSection('students');

      // Click on student
      await page.click('[data-testid="student-row"]:first-child');

      // View progress
      await page.click('[data-testid="view-progress"]');
      await expect(page.locator('[data-testid="progress-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="evaluation-history"]')).toBeVisible();
    });
  });

  test.describe('Coach Student Management', () => {
    test('should allow coach to view assigned students', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to my students
      await helpers.navigateToSection('my-students');

      // Verify students list
      await expect(page.locator('[data-testid="students-table"]')).toBeVisible();
    });

    test('should allow coach to create student evaluations', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to students
      await helpers.navigateToSection('my-students');

      // Click on student
      await page.click('[data-testid="student-row"]:first-child');

      // Create evaluation
      await page.click('[data-testid="create-evaluation"]');
      const evalData = generateTestData.evaluation();
      await helpers.fillForm({
        '[name="skills"]': evalData.skills.toString(),
        '[name="attitude"]': evalData.attitude.toString(),
        '[name="effort"]': evalData.effort.toString(),
        '[name="comments"]': evalData.comments,
      });
      await helpers.submitForm();

      // Verify evaluation created
      await expect(page.locator('[data-testid="evaluation-list"]')).toContainText(evalData.comments);
    });

    test('should allow coach to track student attendance', async ({ page }) => {
      const coachData = generateTestData.user('COACH');
      await helpers.register(coachData);

      // Navigate to session
      await helpers.navigateToSection('my-sessions');
      await page.click('[data-testid="session-row"]:first-child');

      // Mark attendance
      await page.click('[data-testid="mark-attendance"]');
      await page.check('[data-testid="student-present-1"]');
      await helpers.submitForm();

      // Verify attendance recorded
      await expect(page.locator('[data-testid="attendance-recorded"]')).toBeVisible();
    });
  });

  test.describe('Parent Student Management', () => {
    test('should allow parent to view child progress', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Add child first
      await helpers.navigateToSection('my-children');
      const childData = generateTestData.student();
      await page.click('[data-testid="add-child"]');
      await helpers.fillForm({
        '[name="name"]': childData.name,
        '[name="dateOfBirth"]': childData.dateOfBirth,
      });
      await helpers.submitForm();

      // View child progress
      await page.click('[data-testid="child-progress"]');
      await expect(page.locator('[data-testid="progress-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="recent-evaluations"]')).toBeVisible();
    });

    test('should allow parent to view child attendance', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to child
      await helpers.navigateToSection('my-children');
      await page.click('[data-testid="child-row"]:first-child');

      // View attendance
      await page.click('[data-testid="view-attendance"]');
      await expect(page.locator('[data-testid="attendance-calendar"]')).toBeVisible();
    });

    test('should allow parent to communicate with coach', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to messages
      await helpers.navigateToSection('messages');

      // Start conversation with coach
      await page.click('[data-testid="new-message"]');
      await page.selectOption('[name="recipient"]', 'coach-1');
      await page.fill('[name="subject"]', 'Question about practice');
      await page.fill('[name="message"]', 'How is my child progressing?');
      await helpers.submitForm();

      // Verify message sent
      await expect(page.locator('[data-testid="message-thread"]')).toContainText('How is my child progressing?');
    });
  });

  test.describe('Student Search and Filtering', () => {
    test('should allow searching students by name', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to students
      await helpers.navigateToSection('students');

      // Search for student
      await helpers.search('John Doe');

      // Verify search results
      const rows = await helpers.getTableRows('[data-testid="students-table"]');
      await expect(rows).toHaveCount(1);
    });

    test('should allow filtering students by grade', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to students
      await helpers.navigateToSection('students');

      // Filter by grade
      await helpers.applyFilter('grade', '5th Grade');

      // Verify filtered results
      const rows = await helpers.getTableRows('[data-testid="students-table"]');
      // All visible rows should be 5th grade
      for (let i = 0; i < await rows.count(); i++) {
        await expect(rows.nth(i)).toContainText('5th Grade');
      }
    });

    test('should allow filtering students by coach', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to students
      await helpers.navigateToSection('students');

      // Filter by coach
      await helpers.applyFilter('coach', 'Coach Smith');

      // Verify filtered results
      const rows = await helpers.getTableRows('[data-testid="students-table"]');
      // All visible rows should have Coach Smith assigned
      for (let i = 0; i < await rows.count(); i++) {
        await expect(rows.nth(i)).toContainText('Coach Smith');
      }
    });
  });
});