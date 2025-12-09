/**
 * Security Staff Service
 * Handles API calls for security staff functionality
 */

import { apiClient } from '../api';

// Types
export interface SecurityStats {
  activeIncidents: number;
  patrolsToday: number;
  visitorsScreened: number;
  accessViolations: number;
}

export interface SecurityIncident {
  id: number;
  type: string;
  location: string;
  reportedBy: string;
  time: string;
  status: string;
  severity: string;
}

export interface AccessControlLog {
  id: number;
  userName: string;
  area: string;
  action: string;
  time: string;
  status: string;
}

export interface PatrolLog {
  id: number;
  officer: string;
  route: string;
  startTime: string;
  endTime: string | null;
  status: string;
}

// Service class
class SecurityService {
  private readonly BASE_PATH = '/security';

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{ stats: SecurityStats }> {
    return apiClient.get(`${this.BASE_PATH}/dashboard`);
  }

  /**
   * Get incident reports
   */
  async getIncidents(): Promise<{ data: SecurityIncident[] }> {
    return apiClient.get(`${this.BASE_PATH}/incidents`);
  }

  /**
   * Get access control logs
   */
  async getAccessControlLogs(): Promise<{ data: AccessControlLog[] }> {
    return apiClient.get(`${this.BASE_PATH}/access-control`);
  }

  /**
   * Get patrol logs
   */
  async getPatrolLogs(): Promise<{ data: PatrolLog[] }> {
    return apiClient.get(`${this.BASE_PATH}/patrols`);
  }
}

// Export singleton instance
export const securityService = new SecurityService();
export default securityService;
