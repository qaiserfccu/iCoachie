// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Authentication', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should allow club admin to register and login', async ({ page }) => {
    const userData = generateTestData.user('CLUB_ADMIN');

    // Register
    await helpers.register(userData);

    // Verify dashboard access
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Wait for user data to load and check role
    await page.waitForSelector('[data-testid="user-role"]');
    await expect(page.locator('[data-testid="user-role"]')).toContainText('Club Admin');

    // Logout
    await helpers.logout();

    // Login again
    await helpers.login(userData.email, userData.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should allow coach to register and login', async ({ page }) => {
    const userData = generateTestData.user('COACH');

    // Register
    await helpers.register(userData);

    // Verify dashboard access
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-role"]')).toContainText('Coach');

    // Logout and login again
    await helpers.logout();
    await helpers.login(userData.email, userData.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should allow freelancer to register and login', async ({ page }) => {
    const userData = generateTestData.user('FREELANCER');

    // Register
    await helpers.register(userData);

    // Verify dashboard access
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-role"]')).toContainText('Freelancer');

    // Logout and login again
    await helpers.logout();
    await helpers.login(userData.email, userData.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should allow parent to register and login', async ({ page }) => {
    const userData = generateTestData.user('PARENT');

    // Register
    await helpers.register(userData);

    // Verify dashboard access
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-role"]')).toContainText('Parent');

    // Logout and login again
    await helpers.logout();
    await helpers.login(userData.email, userData.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should prevent login with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Try to login with wrong password
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page).toHaveURL('/login'); // Should stay on login page
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should allow password reset request', async ({ page }) => {
    await page.goto('/forgot-password');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Password reset email sent');
  });

  test('should validate email format during registration', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.selectOption('select[name="role"]', 'PARENT');
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });

  test('should validate password strength during registration', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak');
    await page.selectOption('select[name="role"]', 'PARENT');
    await page.click('button[type="submit"]');

    // Should show password strength error
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    const userData = generateTestData.user('PARENT');

    // Register first user
    await helpers.register(userData);

    // Logout
    await helpers.logout();

    // Try to register with same email
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Another User');
    await page.fill('input[name="email"]', userData.email);
    await page.fill('input[name="password"]', 'DifferentPassword123!');
    await page.selectOption('select[name="role"]', 'PARENT');
    await page.click('button[type="submit"]');

    // Should show duplicate email error
    await expect(page.locator('[data-testid="email-error"]')).toContainText('already exists');
  });
});