// tests/e2e/payments.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers, generateTestData } from './utils/test-helpers';

test.describe('Payments and Billing', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Club Admin Payment Management', () => {
    test('should allow club admin to view payment history', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Verify payment history
      await expect(page.locator('[data-testid="payment-history"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();
    });

    test('should allow setting up subscription plans', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to billing
      await helpers.navigateToSection('billing');

      // Create subscription plan
      await page.click('[data-testid="create-plan"]');
      await helpers.fillForm({
        '[name="name"]': 'Monthly Training',
        '[name="description"]': 'Monthly training sessions',
        '[name="price"]': '50.00',
        '[name="billingCycle"]': 'monthly',
        '[name="sessionsIncluded"]': '4',
      });
      await helpers.submitForm();

      // Verify plan created
      await expect(page.locator('[data-testid="plans-list"]')).toContainText('Monthly Training');
    });

    test('should allow processing refunds', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Process refund
      await page.click('[data-testid="payment-row"]:first-child [data-testid="process-refund"]');
      await page.fill('[name="refundAmount"]', '25.00');
      await page.fill('[name="refundReason"]', 'Customer requested cancellation');
      await helpers.submitForm();

      // Verify refund processed
      await helpers.waitForToast('Refund processed successfully');
    });
  });

  test.describe('Parent Payment Processing', () => {
    test('should allow parent to purchase session packages', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Select package
      await page.click('[data-testid="package-card"]:first-child');
      await page.click('[data-testid="purchase-package"]');

      // Process payment
      const cardDetails = {
        number: '4242424242424242',
        expiry: '12/25',
        cvc: '123',
        name: 'Test User',
      };
      await helpers.processPayment(cardDetails);

      // Verify payment successful
      await helpers.waitForToast('Payment successful');
      await expect(page.locator('[data-testid="payment-confirmation"]')).toBeVisible();
    });

    test('should allow parent to set up recurring payments', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Set up recurring payment
      await page.click('[data-testid="setup-recurring"]');
      await page.selectOption('[name="plan"]', 'monthly-training');
      await page.click('[data-testid="setup-payment-method"]');

      const cardDetails = {
        number: '4242424242424242',
        expiry: '12/25',
        cvc: '123',
        name: 'Test User',
      };
      await helpers.processPayment(cardDetails);

      // Verify recurring payment set up
      await helpers.waitForToast('Recurring payment set up successfully');
    });

    test('should show payment history and receipts', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // View payment history
      await expect(page.locator('[data-testid="payment-history"]')).toBeVisible();

      // Download receipt
      await page.click('[data-testid="payment-row"]:first-child [data-testid="download-receipt"]');

      // Verify download initiated
      // Note: Actual file download verification would require additional setup
    });

    test('should handle payment failures gracefully', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Attempt payment with invalid card
      await page.click('[data-testid="package-card"]:first-child');
      await page.click('[data-testid="purchase-package"]');

      const invalidCardDetails = {
        number: '4000000000000002', // Stripe test card that fails
        expiry: '12/25',
        cvc: '123',
        name: 'Test User',
      };
      await helpers.processPayment(invalidCardDetails);

      // Verify payment failed
      await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('card was declined');
    });
  });

  test.describe('Freelancer Earnings', () => {
    test('should allow freelancer to view earnings', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to earnings
      await helpers.navigateToSection('earnings');

      // Verify earnings dashboard
      await expect(page.locator('[data-testid="total-earnings"]')).toBeVisible();
      await expect(page.locator('[data-testid="pending-payments"]')).toBeVisible();
      await expect(page.locator('[data-testid="earnings-history"]')).toBeVisible();
    });

    test('should allow freelancer to set up payout method', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to earnings
      await helpers.navigateToSection('earnings');

      // Set up payout method
      await page.click('[data-testid="setup-payout"]');
      await page.selectOption('[name="payoutMethod"]', 'bank-transfer');
      await helpers.fillForm({
        '[name="accountNumber"]': '123456789',
        '[name="routingNumber"]': '021000021',
        '[name="accountHolderName"]': 'Test Freelancer',
      });
      await helpers.submitForm();

      // Verify payout method set up
      await helpers.waitForToast('Payout method set up successfully');
    });

    test('should show detailed earnings breakdown', async ({ page }) => {
      const freelancerData = generateTestData.user('FREELANCER');
      await helpers.register(freelancerData);

      // Navigate to earnings
      await helpers.navigateToSection('earnings');

      // View earnings breakdown
      await page.click('[data-testid="earnings-breakdown"]');
      await expect(page.locator('[data-testid="session-earnings"]')).toBeVisible();
      await expect(page.locator('[data-testid="platform-fees"]')).toBeVisible();
      await expect(page.locator('[data-testid="net-earnings"]')).toBeVisible();
    });
  });

  test.describe('Payment Security and Compliance', () => {
    test('should validate payment form security', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Check that payment form is secure (HTTPS, proper validation)
      await expect(page.url()).toMatch(/^https:\/\//);

      // Check for PCI compliance indicators
      const cardFrame = page.frameLocator('[title*="Stripe"]').first();
      await expect(cardFrame.locator('input[name="cardnumber"]')).toBeVisible();
    });

    test('should handle payment timeouts', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Simulate slow payment processing
      await page.route('**/payment-intent', async route => {
        await new Promise(resolve => setTimeout(resolve, 35000)); // Simulate timeout
        await route.fulfill({ status: 200, body: '{}' });
      });

      await page.click('[data-testid="package-card"]:first-child');
      await page.click('[data-testid="purchase-package"]');

      const cardDetails = {
        number: '4242424242424242',
        expiry: '12/25',
        cvc: '123',
        name: 'Test User',
      };
      await helpers.processPayment(cardDetails);

      // Should handle timeout gracefully
      await expect(page.locator('[data-testid="timeout-message"]')).toBeVisible();
    });

    test('should prevent double payments', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Attempt double-click on payment button
      await page.click('[data-testid="package-card"]:first-child');
      await page.click('[data-testid="purchase-package"]');

      // Click pay button twice quickly
      await Promise.all([
        page.click('[data-testid="pay-button"]'),
        page.click('[data-testid="pay-button"]'),
      ]);

      // Should prevent double payment
      await expect(page.locator('[data-testid="payment-processing"]')).toBeVisible();
      // Only one payment should be processed
    });
  });

  test.describe('Invoice and Receipt Management', () => {
    test('should generate and send invoices', async ({ page }) => {
      const adminData = generateTestData.user('CLUB_ADMIN');
      await helpers.register(adminData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Generate invoice
      await page.click('[data-testid="payment-row"]:first-child [data-testid="generate-invoice"]');
      await page.fill('[name="invoiceNotes"]', 'Monthly training sessions');
      await helpers.submitForm();

      // Verify invoice generated
      await helpers.waitForToast('Invoice generated and sent');
    });

    test('should allow downloading receipts', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Download receipt
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="payment-row"]:first-child [data-testid="download-receipt"]');
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/receipt.*\.pdf/);
    });

    test('should show tax calculations', async ({ page }) => {
      const parentData = generateTestData.user('PARENT');
      await helpers.register(parentData);

      // Navigate to payments
      await helpers.navigateToSection('payments');

      // Check tax calculation
      await page.click('[data-testid="package-card"]:first-child');
      await expect(page.locator('[data-testid="subtotal"]')).toBeVisible();
      await expect(page.locator('[data-testid="tax-amount"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-amount"]')).toBeVisible();
    });
  });
});