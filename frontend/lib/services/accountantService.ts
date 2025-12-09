/**
 * Accountant Service
 * Handles API calls for accountant functionality
 */

import { apiClient } from '../api';

// Types
export interface AccountantStats {
  totalRevenue: number;
  pendingInvoices: number;
  overduePayments: number;
  monthlyExpenses: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface PaymentTransaction {
  id: number;
  transactionId: string;
  payer: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

export interface FinancialReport {
  id: number;
  reportName: string;
  period: string;
  generatedDate: string;
  type: string;
}

// Service class
class AccountantService {
  private readonly BASE_PATH = '/accountant';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: AccountantStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get invoices
   */
  async getInvoices(params: { status?: string } = {}): Promise<{ data: Invoice[] }> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    
    return apiClient.get(`${this.BASE_PATH}/invoices?${queryParams.toString()}`);
  }

  /**
   * Get payment transactions
   */
  async getPayments(): Promise<{ data: PaymentTransaction[] }> {
    return apiClient.get(`${this.BASE_PATH}/payments`);
  }

  /**
   * Get financial reports
   */
  async getReports(): Promise<{ data: FinancialReport[] }> {
    return apiClient.get(`${this.BASE_PATH}/reports`);
  }
}

// Export singleton instance
export const accountantService = new AccountantService();
export default accountantService;
