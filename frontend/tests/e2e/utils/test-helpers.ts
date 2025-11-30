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
    
    // Wait for the page to load and auth check to complete
    await this.page.waitForSelector('input[id="fullName"]', { timeout: 10000 });
    
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
    
    // Accept terms
    await this.page.check('input[id="terms"]');
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
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