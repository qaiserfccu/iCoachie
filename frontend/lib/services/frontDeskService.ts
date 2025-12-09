/**
 * Front Desk Service
 * Handles API calls for front desk functionality
 */

import { apiClient } from '../api';

// Types
export interface FrontDeskStats {
  checkInsToday: number;
  expectedArrivals: number;
  inquiriesToday: number;
  activeBookings: number;
}

export interface CheckIn {
  id: number;
  guestName: string;
  checkInTime?: string;
  expectedTime?: string;
  purpose: string;
  status: string;
}

export interface Inquiry {
  id: number;
  inquirerName: string;
  contactEmail: string;
  subject: string;
  date: string;
  status: string;
}

export interface FrontDeskSchedule {
  id: number;
  date: string;
  timeSlot: string;
  staffMember: string;
  status: string;
}

// Service class
class FrontDeskService {
  private readonly BASE_PATH = '/front-desk';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: FrontDeskStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get check-ins
   */
  async getCheckIns(): Promise<{ data: CheckIn[] }> {
    return apiClient.get(`${this.BASE_PATH}/check-ins`);
  }

  /**
   * Get inquiries
   */
  async getInquiries(): Promise<{ data: Inquiry[] }> {
    return apiClient.get(`${this.BASE_PATH}/inquiries`);
  }

  /**
   * Get schedule
   */
  async getSchedule(): Promise<{ data: FrontDeskSchedule[] }> {
    return apiClient.get(`${this.BASE_PATH}/schedule`);
  }
}

// Export singleton instance
export const frontDeskService = new FrontDeskService();
export default frontDeskService;
