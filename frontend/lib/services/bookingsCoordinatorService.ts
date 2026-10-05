/**
 * Bookings Coordinator Service
 * Handles API calls for bookings coordinator functionality
 */

import { apiClient } from '../api';

// Types
export interface BookingsCoordinatorStats {
  totalBookings: number;
  pendingApproval: number;
  confirmedToday: number;
  revenue: number;
}

export interface BookingCalendarEvent {
  id: number;
  date: string;
  time: string;
  venueName: string;
  clientName: string;
  type: string;
  status: string;
}

export interface Reservation {
  id: number;
  reservationNumber: string;
  clientName: string;
  venue: string;
  date: string;
  time: string;
  status: string;
  amount: number;
}

export interface VenueAvailability {
  venueName: string;
  date: string;
  availableSlots: string[];
}

export interface VenuePricing {
  venueName: string;
  baseRate: number;
  peakRate: number;
  currency: string;
  unit: string;
}

// Service class
class BookingsCoordinatorService {
  private readonly BASE_PATH = '/bookings-coordinator';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: BookingsCoordinatorStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get booking calendar data
   */
  async getCalendar(): Promise<{ data: BookingCalendarEvent[] }> {
    return apiClient.get(`${this.BASE_PATH}/calendar`);
  }

  /**
   * Get all reservations
   */
  async getReservations(): Promise<{ data: Reservation[] }> {
    return apiClient.get(`${this.BASE_PATH}/reservations`);
  }

  /**
   * Get venue availability
   */
  async getAvailability(): Promise<{ data: VenueAvailability[] }> {
    return apiClient.get(`${this.BASE_PATH}/availability`);
  }

  /**
   * Get pricing information
   */
  async getPricing(): Promise<{ data: VenuePricing[] }> {
    return apiClient.get(`${this.BASE_PATH}/pricing`);
  }
}

// Export singleton instance
export const bookingsCoordinatorService = new BookingsCoordinatorService();
export default bookingsCoordinatorService;
