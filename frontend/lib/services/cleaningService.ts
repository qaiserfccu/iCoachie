/**
 * Cleaning Staff Service
 * Handles API calls for cleaning staff functionality
 */

import { apiClient } from '../api';

// Types
export interface CleaningStats {
  scheduledToday: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface CleaningSchedule {
  id: number;
  area: string;
  assignedTo: string;
  scheduledTime: string;
  status: string;
}

export interface CleaningSupply {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  status: string;
}

export interface QualityInspection {
  id: number;
  area: string;
  inspector: string;
  date: string;
  score: number;
  status: string;
}

// Service class
class CleaningService {
  private readonly BASE_PATH = '/cleaning';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: CleaningStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get cleaning schedules
   */
  async getSchedules(): Promise<{ data: CleaningSchedule[] }> {
    return apiClient.get(`${this.BASE_PATH}/schedules`);
  }

  /**
   * Get supplies inventory
   */
  async getSupplies(): Promise<{ data: CleaningSupply[] }> {
    return apiClient.get(`${this.BASE_PATH}/supplies`);
  }

  /**
   * Get quality inspections
   */
  async getInspections(): Promise<{ data: QualityInspection[] }> {
    return apiClient.get(`${this.BASE_PATH}/inspections`);
  }
}

// Export singleton instance
export const cleaningService = new CleaningService();
export default cleaningService;
