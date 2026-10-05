/**
 * Groundskeeper Service
 * Handles API calls for groundskeeper functionality
 */

import { apiClient } from '../api';

// Types
export interface GroundskeeperStats {
  tasksToday: number;
  completedToday: number;
  irrigationActive: number;
  maintenanceAlerts: number;
}

export interface DailyTask {
  id: number;
  taskName: string;
  area: string;
  scheduledTime: string;
  assignedTo: string;
  status: string;
}

export interface TurfManagement {
  id: number;
  fieldName: string;
  grassType: string;
  condition: string;
  lastMowed: string;
  nextMowing: string;
}

export interface IrrigationSystem {
  id: number;
  zoneName: string;
  status: string;
  scheduledTime: string;
  duration: string;
  lastRun: string;
  nextRun: string;
}

export interface PestControl {
  id: number;
  area: string;
  pestType: string;
  treatmentDate: string;
  product: string;
  appliedBy: string;
  followUpDate: string;
}

// Service class
class GroundskeeperService {
  private readonly BASE_PATH = '/groundskeeper';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: GroundskeeperStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get daily tasks
   */
  async getDailyTasks(): Promise<{ data: DailyTask[] }> {
    return apiClient.get(`${this.BASE_PATH}/daily-tasks`);
  }

  /**
   * Get turf management data
   */
  async getTurfManagement(): Promise<{ data: TurfManagement[] }> {
    return apiClient.get(`${this.BASE_PATH}/turf`);
  }

  /**
   * Get irrigation systems status
   */
  async getIrrigationSystems(): Promise<{ data: IrrigationSystem[] }> {
    return apiClient.get(`${this.BASE_PATH}/irrigation`);
  }

  /**
   * Get pest control records
   */
  async getPestControl(): Promise<{ data: PestControl[] }> {
    return apiClient.get(`${this.BASE_PATH}/pest-control`);
  }
}

// Export singleton instance
export const groundskeeperService = new GroundskeeperService();
export default groundskeeperService;
