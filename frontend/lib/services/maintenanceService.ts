/**
 * Maintenance Tech Service
 * Handles API calls for maintenance tech functionality
 */

import { apiClient } from '../api';

// Types
export interface MaintenanceStats {
  activeWorkOrders: number;
  completedToday: number;
  preventiveScheduled: number;
  urgentIssues: number;
}

export interface WorkOrder {
  id: number;
  title: string;
  location: string;
  priority: string;
  assignedTo: string;
  status: string;
  dueDate: string;
}

export interface PreventiveMaintenance {
  id: number;
  equipmentName: string;
  scheduledDate: string;
  frequency: string;
  lastService: string;
  status: string;
}

export interface MaintenanceInventory {
  id: number;
  itemName: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: string;
}

// Service class
class MaintenanceService {
  private readonly BASE_PATH = '/maintenance';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: MaintenanceStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get work orders
   */
  async getWorkOrders(): Promise<{ data: WorkOrder[] }> {
    return apiClient.get(`${this.BASE_PATH}/work-orders`);
  }

  /**
   * Get preventive maintenance schedule
   */
  async getPreventiveMaintenance(): Promise<{ data: PreventiveMaintenance[] }> {
    return apiClient.get(`${this.BASE_PATH}/preventive`);
  }

  /**
   * Get maintenance inventory
   */
  async getInventory(): Promise<{ data: MaintenanceInventory[] }> {
    return apiClient.get(`${this.BASE_PATH}/inventory`);
  }
}

// Export singleton instance
export const maintenanceService = new MaintenanceService();
export default maintenanceService;
