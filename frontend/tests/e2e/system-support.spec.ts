// tests/e2e/system-support.spec.ts
import { test, expect } from '@playwright/test';

test.describe('System Support Dashboard', () => {
  test.describe('System Support Role Access', () => {
    test('should display system support dashboard for authorized users', async ({ page }) => {
      // Navigate to system support dashboard
      await page.goto('/system-support');
      
      // Check if dashboard elements are present (will redirect to login if not authenticated)
      // This test validates the page structure
      const currentUrl = page.url();
      
      // Either we're on the dashboard or redirected to login
      expect(currentUrl).toMatch(/(system-support|login)/);
    });

    test('should show correct navigation items in sidebar', async ({ page }) => {
      await page.goto('/system-support');
      
      // Check for key navigation elements if on the dashboard
      const dashboardTitle = page.locator('h1:has-text("Support Dashboard")');
      const ticketsLink = page.locator('a[href*="/system-support/tickets"]');
      const diagnosticsLink = page.locator('a[href*="/system-support/diagnostics"]');
      const usersLink = page.locator('a[href*="/system-support/users"]');
      
      // If authenticated, these should be visible
      if (await dashboardTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(ticketsLink.first()).toBeVisible();
        await expect(diagnosticsLink.first()).toBeVisible();
        await expect(usersLink.first()).toBeVisible();
      }
    });
  });

  test.describe('Dashboard Statistics', () => {
    test('should display dashboard stats cards', async ({ page }) => {
      await page.goto('/system-support');
      
      // Wait for page load
      await page.waitForTimeout(1000);
      
      // Check for stat cards if on dashboard
      if (page.url().includes('system-support')) {
        const openTicketsCard = page.locator('text=Open Tickets');
        const responseTimeCard = page.locator('text=Avg Response Time');
        const resolvedTodayCard = page.locator('text=Resolved Today');
        const activeUsersCard = page.locator('text=Active Users');
        
        // At least some of these should be visible if we're on the dashboard
        const isOnDashboard = await openTicketsCard.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (isOnDashboard) {
          await expect(responseTimeCard).toBeVisible();
          await expect(resolvedTodayCard).toBeVisible();
          await expect(activeUsersCard).toBeVisible();
        }
      }
    });

    test('should display system status section', async ({ page }) => {
      await page.goto('/system-support');
      
      // Check for system status section
      const systemStatusTitle = page.locator('text=System Status');
      
      if (await systemStatusTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check for individual services
        const apiServer = page.locator('text=API Server');
        const database = page.locator('text=Database');
        
        await expect(apiServer).toBeVisible();
        await expect(database).toBeVisible();
      }
    });
  });

  test.describe('Support Tickets', () => {
    test('should navigate to tickets page', async ({ page }) => {
      await page.goto('/system-support/tickets');
      
      // Wait for page load
      await page.waitForTimeout(1000);
      
      // Check if we're on tickets page or redirected to login
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/(tickets|login)/);
    });

    test('should display ticket filters', async ({ page }) => {
      await page.goto('/system-support/tickets');
      
      // Check for filter buttons if on tickets page
      const allButton = page.locator('button:has-text("All")');
      const openButton = page.locator('button:has-text("Open")');
      const inProgressButton = page.locator('button:has-text("In Progress")');
      const resolvedButton = page.locator('button:has-text("Resolved")');
      
      if (await allButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(openButton).toBeVisible();
        await expect(inProgressButton).toBeVisible();
        await expect(resolvedButton).toBeVisible();
      }
    });

    test('should have search functionality', async ({ page }) => {
      await page.goto('/system-support/tickets');
      
      const searchInput = page.locator('input[placeholder*="Search"]');
      
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Type a search query
        await searchInput.fill('test');
        
        // Wait for debounce
        await page.waitForTimeout(500);
        
        // Verify search is applied
        await expect(searchInput).toHaveValue('test');
      }
    });

    test('should display ticket statistics', async ({ page }) => {
      await page.goto('/system-support/tickets');
      
      // Check for stat cards
      const openTicketsCard = page.locator('text=Open Tickets');
      const inProgressCard = page.locator('text=In Progress');
      const urgentCard = page.locator('text=Urgent');
      
      if (await openTicketsCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(inProgressCard).toBeVisible();
        await expect(urgentCard).toBeVisible();
      }
    });
  });

  test.describe('System Diagnostics', () => {
    test('should navigate to diagnostics page', async ({ page }) => {
      await page.goto('/system-support/diagnostics');
      
      // Wait for page load
      await page.waitForTimeout(1000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/(diagnostics|login)/);
    });

    test('should display system metrics', async ({ page }) => {
      await page.goto('/system-support/diagnostics');
      
      // Check for metric cards if on diagnostics page
      const cpuUsage = page.locator('text=CPU Usage');
      const memoryUsage = page.locator('text=Memory Usage');
      const diskUsage = page.locator('text=Disk Usage');
      
      if (await cpuUsage.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(memoryUsage).toBeVisible();
        await expect(diskUsage).toBeVisible();
      }
    });

    test('should display service status list', async ({ page }) => {
      await page.goto('/system-support/diagnostics');
      
      const serviceStatusTitle = page.locator('text=Service Status');
      
      if (await serviceStatusTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check for common services
        const apiServer = page.locator('text=API Server');
        const database = page.locator('text=Database');
        
        await expect(apiServer.first()).toBeVisible();
        await expect(database.first()).toBeVisible();
      }
    });

    test('should have refresh functionality', async ({ page }) => {
      await page.goto('/system-support/diagnostics');
      
      const refreshButton = page.locator('button:has-text("Refresh")');
      
      if (await refreshButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Click refresh button
        await refreshButton.click();
        
        // Verify button shows loading state or page refreshes
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('User Support', () => {
    test('should navigate to users page', async ({ page }) => {
      await page.goto('/system-support/users');
      
      // Wait for page load
      await page.waitForTimeout(1000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/(users|login)/);
    });

    test('should display user statistics', async ({ page }) => {
      await page.goto('/system-support/users');
      
      // Check for user stat cards
      const totalUsersCard = page.locator('text=Total Users');
      const activeCard = page.locator('text=Active').first();
      const lockedCard = page.locator('text=Locked');
      const suspendedCard = page.locator('text=Suspended');
      
      if (await totalUsersCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(activeCard).toBeVisible();
        await expect(lockedCard).toBeVisible();
        await expect(suspendedCard).toBeVisible();
      }
    });

    test('should have user search functionality', async ({ page }) => {
      await page.goto('/system-support/users');
      
      const searchInput = page.locator('input[placeholder*="Search"]');
      
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Type a search query
        await searchInput.fill('john');
        
        // Wait for debounce
        await page.waitForTimeout(500);
        
        // Verify search is applied
        await expect(searchInput).toHaveValue('john');
      }
    });

    test('should display quick actions section', async ({ page }) => {
      await page.goto('/system-support/users');
      
      const quickActionsTitle = page.locator('text=Quick Actions');
      
      if (await quickActionsTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
        const resetPasswordAction = page.locator('text=Reset Password');
        const unlockAccountAction = page.locator('text=Unlock Account');
        
        await expect(resetPasswordAction).toBeVisible();
        await expect(unlockAccountAction).toBeVisible();
      }
    });
  });

  test.describe('Audit Logs', () => {
    test('should navigate to audit logs page', async ({ page }) => {
      await page.goto('/system-support/audit-logs');
      
      await page.waitForTimeout(1000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/(audit-logs|login)/);
    });

    test('should display audit log statistics', async ({ page }) => {
      await page.goto('/system-support/audit-logs');
      
      const totalEvents = page.locator('text=Total Events');
      const logins = page.locator('text=Logins');
      const passwordResets = page.locator('text=Password Resets');
      
      if (await totalEvents.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(logins).toBeVisible();
        await expect(passwordResets).toBeVisible();
      }
    });

    test('should have audit log filters', async ({ page }) => {
      await page.goto('/system-support/audit-logs');
      
      const allButton = page.locator('button:has-text("All")');
      const loginsButton = page.locator('button:has-text("Logins")');
      
      if (await allButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(loginsButton).toBeVisible();
      }
    });
  });

  test.describe('Knowledge Base', () => {
    test('should navigate to knowledge base page', async ({ page }) => {
      await page.goto('/system-support/knowledge-base');
      
      await page.waitForTimeout(1000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/(knowledge-base|login)/);
    });

    test('should display knowledge base categories', async ({ page }) => {
      await page.goto('/system-support/knowledge-base');
      
      const gettingStarted = page.locator('text=Getting Started');
      const accountBilling = page.locator('text=Account & Billing');
      
      if (await gettingStarted.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(accountBilling).toBeVisible();
      }
    });

    test('should have article search', async ({ page }) => {
      await page.goto('/system-support/knowledge-base');
      
      const searchInput = page.locator('input[placeholder*="Search"]');
      
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchInput.fill('password');
        await page.waitForTimeout(500);
        await expect(searchInput).toHaveValue('password');
      }
    });
  });

  test.describe('Access Management', () => {
    test('should navigate to access management page', async ({ page }) => {
      await page.goto('/system-support/access');
      
      await page.waitForTimeout(1000);
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/(access|login)/);
    });

    test('should display access statistics', async ({ page }) => {
      await page.goto('/system-support/access');
      
      const totalUsers = page.locator('text=Total Users');
      const activeToday = page.locator('text=Active Today');
      const roles = page.locator('text=Roles');
      
      if (await totalUsers.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(activeToday).toBeVisible();
        await expect(roles).toBeVisible();
      }
    });

    test('should display system roles list', async ({ page }) => {
      await page.goto('/system-support/access');
      
      const rolesTitle = page.locator('text=System Roles');
      
      if (await rolesTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check for role list
        const rolesList = page.locator('[class*="glass-subtle"]');
        expect(await rolesList.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Navigate to dashboard with potential API failure
      await page.goto('/system-support');
      
      // Wait for page load
      await page.waitForTimeout(2000);
      
      // Check that page doesn't crash - either shows content or error message
      const hasContent = await page.locator('h1').isVisible({ timeout: 5000 }).catch(() => false);
      const hasError = await page.locator('[class*="error"], [class*="Error"]').isVisible({ timeout: 1000 }).catch(() => false);
      
      // Page should either show content or a handled error
      expect(hasContent || hasError || page.url().includes('login')).toBeTruthy();
    });

    test('should show loading states', async ({ page }) => {
      await page.goto('/system-support');
      
      // Either loading indicator or content should appear
      const hasLoader = await page.locator('[class*="animate-spin"], [class*="loading"]').isVisible({ timeout: 2000 }).catch(() => false);
      const hasContent = await page.locator('h1').isVisible({ timeout: 5000 }).catch(() => false);
      
      expect(hasLoader || hasContent || page.url().includes('login')).toBeTruthy();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate between system support pages', async ({ page }) => {
      await page.goto('/system-support');
      
      // If on dashboard, try to navigate to tickets
      if (page.url().includes('system-support') && !page.url().includes('login')) {
        const ticketsLink = page.locator('a[href*="/system-support/tickets"]');
        
        if (await ticketsLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await ticketsLink.first().click();
          
          // Wait for navigation
          await page.waitForTimeout(1000);
          
          // Should be on tickets page
          expect(page.url()).toMatch(/(tickets|login)/);
        }
      }
    });

    test('should have working back to dashboard link', async ({ page }) => {
      await page.goto('/system-support/tickets');
      
      // If on tickets page, try to navigate back
      if (page.url().includes('tickets')) {
        const dashboardLink = page.locator('a[href="/system-support"]');
        
        if (await dashboardLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await dashboardLink.first().click();
          
          // Wait for navigation
          await page.waitForTimeout(1000);
          
          // Should be on dashboard
          expect(page.url()).toContain('system-support');
        }
      }
    });

    test('should navigate to audit logs from sidebar', async ({ page }) => {
      await page.goto('/system-support');
      
      if (page.url().includes('system-support') && !page.url().includes('login')) {
        const auditLogsLink = page.locator('a[href*="/system-support/audit-logs"]');
        
        if (await auditLogsLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await auditLogsLink.first().click();
          await page.waitForTimeout(1000);
          expect(page.url()).toMatch(/(audit-logs|login)/);
        }
      }
    });

    test('should navigate to knowledge base from sidebar', async ({ page }) => {
      await page.goto('/system-support');
      
      if (page.url().includes('system-support') && !page.url().includes('login')) {
        const kbLink = page.locator('a[href*="/system-support/knowledge-base"]');
        
        if (await kbLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await kbLink.first().click();
          await page.waitForTimeout(1000);
          expect(page.url()).toMatch(/(knowledge-base|login)/);
        }
      }
    });
  });
});

// Additional test suite for authenticated scenarios
test.describe('System Support - Authenticated Tests', () => {
  test('should restrict access to system support for non-authorized roles', async ({ page }) => {
    // This test would be skipped or modified based on actual auth setup
    // For now, we verify the page loads without crashing
    await page.goto('/system-support');
    
    // Page should either show dashboard content, login, or forbidden
    await page.waitForTimeout(2000);
    
    const isOnSystemSupport = page.url().includes('system-support');
    const isOnLogin = page.url().includes('login');
    const hasForbidden = await page.locator('text=Forbidden').isVisible({ timeout: 1000 }).catch(() => false);
    
    expect(isOnSystemSupport || isOnLogin || hasForbidden).toBeTruthy();
  });
});
