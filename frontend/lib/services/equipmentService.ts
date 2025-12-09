/**
 * Equipment Manager Service
 * Handles API calls for equipment management functionality
 */

import { apiClient } from '../api';

// Types
export interface EquipmentStats {
  totalItems: number;
  checkedOut: number;
  inMaintenance: number;
  lowStock: number;
}

export interface EquipmentInventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  available: number;
  status: string;
}

export interface EquipmentCheckout {
  id: number;
  itemName: string;
  userName: string;
  checkedOut: string;
  dueBack: string;
  status: string;
}

export interface EquipmentMaintenance {
  id: number;
  itemName: string;
  scheduledDate: string;
  type: string;
  status: string;
}

export interface ProcurementRequest {
  id: number;
  item: string;
  requestedBy: string;
  requestDate: string;
  status: string;
  estimatedCost: string;
}

export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Service class
class EquipmentService {
  private readonly BASE_PATH = '/equipment';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: EquipmentStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get equipment inventory
   */
  async getInventory(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
  } = {}): Promise<{
    data: EquipmentInventoryItem[];
    pageInfo: PageInfo;
  }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);

    return apiClient.get(`${this.BASE_PATH}/inventory?${queryParams.toString()}`);
  }

  /**
   * Get equipment checkouts
   */
  async getCheckouts(): Promise<{ data: EquipmentCheckout[] }> {
    return apiClient.get(`${this.BASE_PATH}/checkouts`);
  }

  /**
   * Get maintenance schedules
   */
  async getMaintenanceSchedules(): Promise<{ data: EquipmentMaintenance[] }> {
    return apiClient.get(`${this.BASE_PATH}/maintenance`);
  }

  /**
   * Get procurement requests
   */
  async getProcurementRequests(): Promise<{ data: ProcurementRequest[] }> {
    return apiClient.get(`${this.BASE_PATH}/procurement`);
  }
}

// Export singleton instance
export const equipmentService = new EquipmentService();
export default equipmentService;
