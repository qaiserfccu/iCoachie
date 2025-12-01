// tests/e2e/utils/test-helpers.ts
import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  // Authentication helpers
  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('**/dashboard');
  }

  async logout() {
    await this.page.click('button:has-text("Logout")');
    await this.page.waitForURL('/login');
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    clubId?: string;
  }) {
    await this.page.goto('/register');
    
    // Listen for console messages and network requests
    const errors: string[] = [];
    const warnings: string[] = [];
    const networkErrors: string[] = [];
    
    this.page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        errors.push(text);
      } else if (msg.type() === 'warning') {
        warnings.push(text);
      }
      console.log(`Console ${msg.type()}: ${text}`);
    });
    
    this.page.on('response', response => {
      if (response.status() === 404) {
        networkErrors.push(`404: ${response.url()}`);
      } else if (!response.ok()) {
        networkErrors.push(`${response.status()}: ${response.url()}`);
      }
    });
    
    this.page.on('requestfailed', request => {
      networkErrors.push(`FAILED: ${request.url()}`);
    });
    
    // Wait for the page to load and auth check to complete
    console.log('Waiting for fullName input...');
    await this.page.waitForSelector('input[id="fullName"]', { timeout: 15000 });
    console.log('fullName input found');
    
    // Wait for all form elements to be visible
    console.log('Waiting for email input...');
    await this.page.waitForSelector('input[id="email"]', { timeout: 5000 });
    console.log('Email input found');
    
    console.log('Waiting for password input...');
    await this.page.waitForSelector('input[id="password"]', { timeout: 5000 });
    console.log('Password input found');
    
    console.log('Waiting for terms checkbox...');
    // Try different selectors for the terms checkbox
    let termsFound = false;
    try {
      await this.page.waitForSelector('input[id="terms"]', { timeout: 2000 });
      console.log('Terms checkbox found with input[id="terms"]');
      termsFound = true;
    } catch (e) {
      console.log('input[id="terms"] not found, trying other selectors...');
      try {
        await this.page.waitForSelector('input[type="checkbox"]', { timeout: 2000 });
        console.log('Terms checkbox found with input[type="checkbox"]');
        termsFound = true;
      } catch (e2) {
        console.log('input[type="checkbox"] not found either');
        // Check what elements are actually in the form
        const formHtml = await this.page.locator('form').innerHTML();
        console.log('Form HTML:', formHtml.substring(0, 1000));
        
        // Look for checkbox-related elements
        const checkboxElements = await this.page.locator('input[type="checkbox"], [role="checkbox"], .checkbox').all();
        console.log(`Found ${checkboxElements.length} checkbox-related elements:`);
        for (let i = 0; i < checkboxElements.length; i++) {
          const outerHTML = await checkboxElements[i].evaluate(el => el.outerHTML);
          console.log(`  Checkbox ${i}: ${outerHTML}`);
        }
        throw e2;
      }
    }
    
    if (!termsFound) {
      throw new Error('Terms checkbox not found');
    }
    
    // Check for console errors
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }
    if (warnings.length > 0) {
      console.log('Console warnings:', warnings);
    }
    if (networkErrors.length > 0) {
      console.log('Network errors:', networkErrors);
    }
    
    // Fill full name
    await this.page.fill('input[id="fullName"]', userData.name);
    
    // Fill email
    await this.page.fill('input[id="email"]', userData.email);
    
    // Fill password
    await this.page.fill('input[id="password"]', userData.password);
    
    // Select user type based on role
    const roleButtonMap = {
      'CLUB_ADMIN': 'club',
      'COACH': 'coach', 
      'FREELANCER': 'freelancer',
      'PARENT': 'parent'
    };
    
    const buttonId = roleButtonMap[userData.role as keyof typeof roleButtonMap] || 'parent';
    await this.page.click(`button:has-text("${buttonId === 'club' ? 'Club' : buttonId === 'coach' ? 'Coach' : buttonId === 'freelancer' ? 'Freelancer' : 'Parent'}")`);
    
    // Accept terms - click the Shadcn Checkbox root element
    console.log('Looking for terms checkbox...');
    try {
      // Try to find the Checkbox root element by id
      await this.page.waitForSelector('[data-slot="checkbox"][id="terms"]', { state: 'visible', timeout: 5000 });
      console.log('Found Checkbox root element with id="terms"');
      await this.page.click('[data-slot="checkbox"][id="terms"]');
      console.log('Clicked Checkbox root element');
      
      // Verify it's checked
      const isChecked = await this.page.isChecked('[data-slot="checkbox"][id="terms"]');
      console.log('Checkbox is checked after click:', isChecked);
    } catch (e) {
      console.log('Failed to find Checkbox root element, trying input[type="checkbox"]');
      try {
        // Get all checkboxes and inspect them
        const checkboxes = await this.page.$$('input[type="checkbox"]');
        console.log('Found', checkboxes.length, 'input checkboxes on page');
        if (checkboxes.length > 0) {
          console.log('Inspecting first input checkbox...');
          const boundingBox = await checkboxes[0].boundingBox();
          console.log('Input checkbox bounding box:', boundingBox);
          const isVisible = await checkboxes[0].isVisible();
          console.log('Input checkbox visible:', isVisible);
          const isEnabled = await checkboxes[0].isEnabled();
          console.log('Input checkbox enabled:', isEnabled);
          
          if (isVisible && isEnabled && boundingBox) {
            await checkboxes[0].click({ force: true });
            console.log('Clicked input checkbox with force');
            
            // Verify the checkbox is now checked
            const isChecked = await checkboxes[0].isChecked();
            console.log('Input checkbox is checked after click:', isChecked);
          } else {
            console.log('Input checkbox not clickable due to visibility/enabled state');
          }
        } else {
          console.log('No input checkboxes found');
        }
      } catch (e2) {
        console.log('Failed to click checkbox, error:', e2.message);
      }
    }
    
    // Submit form
    console.log('Submitting registration form...');
    
    // Check for JavaScript errors before submission
    const jsErrors = [];
    this.page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Check if submit button is visible and enabled
    const submitButton = this.page.locator('button[type="submit"]');
    const isSubmitVisible = await submitButton.isVisible();
    const isSubmitEnabled = await submitButton.isEnabled();
    console.log('Submit button visible:', isSubmitVisible, 'enabled:', isSubmitEnabled);
    
    // Check form validity
    const form = this.page.locator('form');
    const isFormValid = await form.evaluate(formEl => (formEl as HTMLFormElement).checkValidity());
    console.log('Form is valid:', isFormValid);
    
    if (!isFormValid) {
      const validationMessage = await form.evaluate(formEl => (formEl as HTMLFormElement).validationMessage);
      console.log('Form validation message:', validationMessage);
    }
    
    if (!isSubmitVisible || !isSubmitEnabled) {
      throw new Error('Submit button is not visible or enabled');
    }
    
    // Capture network requests
    const requests = [];
    const responses = [];
    this.page.on('request', request => {
      if (request.url().includes('/api/') || request.url().includes('/auth/')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
      }
    });
    this.page.on('response', response => {
      if (response.url().includes('/api/') || response.url().includes('/auth/')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          ok: response.ok()
        });
      }
    });
    
    await this.page.click('button[type="submit"]');
    console.log('Form submitted, waiting for response...');
    
    // Wait a bit for any potential errors or navigation
    await this.page.waitForTimeout(3000);
    
    console.log('JavaScript errors:', jsErrors);
    console.log('API requests:', requests);
    console.log('API responses:', responses);
    
    // Check if we're still on the register page (indicates failure)
    const currentUrl = this.page.url();
    console.log('Current URL after submit:', currentUrl);
    
    if (currentUrl.includes('/register')) {
      console.log('Still on register page, checking for errors...');
      // Look for error messages
      const errorMessages = await this.page.locator('[data-testid="error"], .error, .text-red-700').allTextContents();
      console.log('Error messages found:', errorMessages);
      
      // Check network requests for API failures
      const responses = [];
      this.page.on('response', response => {
        if (response.url().includes('/api/') || response.url().includes('/auth/')) {
          responses.push({
            url: response.url(),
            status: response.status(),
            ok: response.ok()
          });
        }
      });
      
      await this.page.waitForTimeout(1000); // Wait for any pending requests
      console.log('API responses:', responses);
      
      throw new Error(`Registration failed. Still on register page. Errors: ${errorMessages.join(', ')}`);
    }
    
    // Wait for redirect to dashboard
    console.log('Waiting for dashboard redirect...');
    await this.page.waitForURL('**/dashboard', { timeout: 15000 });
  }

  // Navigation helpers
  async navigateToSection(section: string) {
    await this.page.click(`[data-testid="nav-${section}"]`);
  }

  async waitForLoading() {
    await this.page.waitForSelector('[data-testid="loading"]', { state: 'hidden' });
  }

  // Form helpers
  async fillForm(fields: Record<string, string>) {
    for (const [selector, value] of Object.entries(fields)) {
      await this.page.fill(selector, value);
    }
  }

  async submitForm() {
    await this.page.click('button[type="submit"]');
  }

  // Table helpers
  async getTableRows(tableSelector: string) {
    return this.page.locator(`${tableSelector} tbody tr`);
  }

  async clickTableAction(tableSelector: string, rowIndex: number, action: string) {
    const row = this.page.locator(`${tableSelector} tbody tr`).nth(rowIndex);
    await row.locator(`[data-testid="action-${action}"]`).click();
  }

  // Modal helpers
  async waitForModal(modalSelector: string = '[role="dialog"]') {
    await this.page.waitForSelector(modalSelector, { state: 'visible' });
  }

  async closeModal() {
    await this.page.click('[data-testid="modal-close"]');
  }

  // Toast/Notification helpers
  async waitForToast(message?: string) {
    const toast = this.page.locator('[data-testid="toast"]');
    await toast.waitFor({ state: 'visible' });
    if (message) {
      await expect(toast).toContainText(message);
    }
    return toast;
  }

  // Dashboard helpers
  async verifyDashboardStats(expectedStats: Record<string, string>) {
    for (const [stat, value] of Object.entries(expectedStats)) {
      await expect(this.page.locator(`[data-testid="stat-${stat}"]`)).toContainText(value);
    }
  }

  // Messaging helpers
  async sendMessage(message: string) {
    await this.page.fill('[data-testid="message-input"]', message);
    await this.page.click('[data-testid="send-message"]');
  }

  async verifyMessageInChat(message: string) {
    await expect(this.page.locator('[data-testid="chat-messages"]')).toContainText(message);
  }

  // Payment helpers
  async processPayment(cardDetails: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  }) {
    // Fill Stripe card element
    const cardFrame = this.page.frameLocator('[title*="Stripe"]').first();
    await cardFrame.locator('input[name="cardnumber"]').fill(cardDetails.number);
    await cardFrame.locator('input[name="exp-date"]').fill(cardDetails.expiry);
    await cardFrame.locator('input[name="cvc"]').fill(cardDetails.cvc);
    await cardFrame.locator('input[name="name"]').fill(cardDetails.name);

    await this.page.click('[data-testid="pay-button"]');
  }

  // File upload helpers
  async uploadFile(fileInput: string, filePath: string) {
    await this.page.setInputFiles(fileInput, filePath);
  }

  // Search and filter helpers
  async search(searchTerm: string) {
    await this.page.fill('[data-testid="search-input"]', searchTerm);
    await this.page.click('[data-testid="search-button"]');
  }

  async applyFilter(filterType: string, value: string) {
    await this.page.selectOption(`[data-testid="filter-${filterType}"]`, value);
  }

  // Calendar/Schedule helpers
  async selectDate(date: string) {
    await this.page.click(`[data-testid="calendar-date"][data-date="${date}"]`);
  }

  async createSession(sessionData: {
    title: string;
    date: string;
    time: string;
    duration: string;
    maxParticipants?: string;
  }) {
    await this.page.click('[data-testid="create-session"]');
    await this.fillForm({
      '[name="title"]': sessionData.title,
      '[name="date"]': sessionData.date,
      '[name="time"]': sessionData.time,
      '[name="duration"]': sessionData.duration,
      '[name="maxParticipants"]': sessionData.maxParticipants || '',
    });
    await this.submitForm();
  }
}

// Test data generators
export const generateTestData = {
  user: (role: string = 'PARENT', overrides = {}) => ({
    name: `Test ${role} ${Date.now()}`,
    email: `test${role.toLowerCase()}${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role,
    ...overrides,
  }),

  club: (overrides = {}) => ({
    name: `Test Club ${Date.now()}`,
    description: 'A test sports club',
    location: '123 Test Street, Test City',
    ...overrides,
  }),

  student: (overrides = {}) => ({
    name: `Student ${Date.now()}`,
    dateOfBirth: '2010-01-01',
    grade: '5th Grade',
    emergencyContact: 'Parent Name',
    emergencyPhone: '+1234567890',
    medicalInfo: 'No known allergies',
    ...overrides,
  }),

  session: (overrides = {}) => ({
    title: `Training Session ${Date.now()}`,
    description: 'Regular training session',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '10:00',
    duration: '90',
    maxParticipants: '20',
    ...overrides,
  }),

  evaluation: (overrides = {}) => ({
    skills: 8,
    attitude: 9,
    effort: 8,
    comments: 'Great improvement this week!',
    ...overrides,
  }),
};